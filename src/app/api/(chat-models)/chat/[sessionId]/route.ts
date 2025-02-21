// app/api/chat/[sessionId]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET handler for initial session data
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const { sessionId } = await params;
  const searchParams = req.nextUrl.searchParams;
  const init = searchParams.get("init") === "true";

  // If init=true, return session data without SSE
  if (init) {
    try {
      const session = await db.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!session) {
        return new NextResponse("Session not found", { status: 404 });
      }

      return NextResponse.json(session);
    } catch (error) {
      console.error("[CHAT_SESSION_FETCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

  // Set up SSE for messages
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initial messages load
        const messages = await db.message.findMany({
          where: { chatSessionId: sessionId },
          orderBy: { timestamp: "asc" },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(messages)}\n\n`),
        );

        // Watch for new messages
        const interval = setInterval(async () => {
          try {
            const newMessages = await db.message.findMany({
              where: {
                chatSessionId: sessionId,
                timestamp: {
                  gt: new Date(Date.now() - 1000),
                },
              },
              orderBy: { timestamp: "asc" },
            });

            if (newMessages.length > 0) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(newMessages)}\n\n`),
              );
            }
          } catch (error) {
            console.error("[MESSAGE_POLL_ERROR]", error);
            const errorEvent = `event: error\ndata: Error fetching messages\n\n`;
            controller.enqueue(encoder.encode(errorEvent));
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("[STREAM_START_ERROR]", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } },
) {
  try {
    const { sessionId } = await params;
    const { content, senderId, senderRole } = await req.json();

    const message = await db.message.create({
      data: {
        content,
        senderId,
        senderRole,
        chatSessionId: sessionId,
      },
    });

    // Update message count
    await db.chatSession.update({
      where: { id: sessionId },
      data: { messageCount: { increment: 1 } },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[CHAT_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
