//@ts-nocheck
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const dataMapper = {
  "com.google.step_count.delta": {
    name: "steps",
    field: "intVal",
  },
  "com.google.distance.delta": {
    name: "distance",
    field: "fpVal",
  },
  "com.google.calories.expended": {
    name: "calories",
    field: "fpVal",
  },
  "com.google.heart_rate.bpm": {
    name: "heartRate",
    field: "fpVal",
  },
  "com.google.activity.segment": {
    name: "activity",
    field: "intVal",
  },
  "com.google.sleep.segment": {
    name: "sleep",
    field: "intVal",
  },
  "com.google.blood_glucose": {
    name: "bloodGlucose",
    field: "fpVal",
  },
};

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get the user's OAuth token from Clerk
    try {
      const clerk = await clerkClient();
      const token = await clerk.users.getUserOauthAccessToken(
        userId,
        "oauth_google"
      );

      if (!token || !Array.isArray(token.data) || token.data.length === 0) {
        return new NextResponse(
          "Google Fit access not granted. Please connect your Google account with Fitness permissions.",
          { status: 403 }
        );
      }

      const accessToken = token.data[0];

      // Create OAuth2 client with the token
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: accessToken.token,
      });

      const fitness = google.fitness({ version: "v1", auth: oauth2Client });

      // Get last 7 days of step data
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      const response = await fitness.users.dataset.aggregate({
        userId: "me",

        requestBody: {
          aggregateBy: [
            { dataTypeName: "com.google.step_count.delta" },
            { dataTypeName: "com.google.distance.delta" },
            { dataTypeName: "com.google.calories.expended" },
            { dataTypeName: "com.google.heart_rate.bpm" },
            { dataTypeName: "com.google.activity.segment" },
            { dataTypeName: "com.google.sleep.segment" },
            { dataTypeName: "com.google.blood_glucose" }
          ],
          startTimeMillis: sevenDaysAgo.toString(),
          endTimeMillis: now.toString(),
          bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        },
      });
      if (!response.data.bucket) {
        return NextResponse.json({ steps: [] });
      }
      var resp = {};
      response.data.bucket.map((bucket, index) => {
        bucket.dataset?.map((set, index) => {
          set.point?.map((point, index) => {
            if (resp[bucket.startTimeMillis] === undefined) {
              resp[bucket.startTimeMillis] = {};
            }
            const dataType = dataMapper[point.dataTypeName];
            if (dataType) {
              const fieldName = dataType.name;
              const fieldValue = point.value[0][dataType.field];

              if (resp[bucket.startTimeMillis][fieldName] === undefined) {
                resp[bucket.startTimeMillis][fieldName] = fieldValue;
              } else {
                resp[bucket.startTimeMillis][fieldName] += fieldValue;
              }
            }
          });
        });
      });
      return NextResponse.json({ data: resp });
    } catch (tokenError) {
      console.error("Error getting OAuth token:", tokenError);
      return new NextResponse(
        "Failed to get Google Fit access token. Please reconnect your Google account.",
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching Google Fit data:", error);
    return new NextResponse(
      `Error fetching fitness data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
