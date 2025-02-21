"use client";

import Head from 'next/head';

export default function Terms() {
    return (
        <>
            <Head>
                <title>Terms and Conditions - Neurowell</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/NEUROWELL.png" type="image/x-icon" />
            </Head>
            <div className="container">
                <header className="header">
                    <h1>Terms and Conditions</h1>
                    <div className="last-updated">Last Updated: February 8, 2025</div>
                </header>

                <section className="section">
                    <h2>1. Introduction</h2>
                    <p>Welcome to Neurowell. By accessing or using our mental health chatbot and related services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.</p>
                </section>

                <section className="section">
                    <h2>2. Service Description</h2>
                    <p>Neurowell provides an AI-powered mental health support chatbot designed to offer emotional support and guidance. Our service is not a replacement for professional mental health treatment or emergency services.</p>
                    <div className="important">
                        <strong>Important Notice:</strong> If you're experiencing a mental health emergency or having thoughts of self-harm, please contact emergency services immediately or call your local mental health crisis hotline.
                    </div>
                </section>

                <section className="section">
                    <h2>3. User Responsibilities</h2>
                    <ul>
                        <li>You must be at least 18 years old to use our services</li>
                        <li>You agree to provide accurate information during interactions</li>
                        <li>You understand that the AI chatbot provides support but not professional medical advice</li>
                        <li>You will not misuse or attempt to exploit the service</li>
                    </ul>
                </section>

                <section className="section">
                    <h2>4. Privacy and Data Protection</h2>
                    <p>We take your privacy seriously. All conversations are encrypted and handled in accordance with our Privacy Policy. While we maintain high security standards, no digital service can guarantee 100% security.</p>
                </section>

                <section className="section">
                    <h2>5. Limitations of Liability</h2>
                    <p>Neurowell provides support tools but does not guarantee specific outcomes. We are not liable for:</p>
                    <ul>
                        <li>Decisions made based on chatbot interactions</li>
                        <li>Service interruptions or technical issues</li>
                        <li>Accuracy of all responses or recommendations</li>
                        <li>Any consequential damages or losses</li>
                    </ul>
                </section>

                <section className="section">
                    <h2>6. Modifications to Service</h2>
                    <p>We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will provide notice of significant changes when possible.</p>
                </section>

                <section className="section">
                    <h2>7. Termination</h2>
                    <p>We reserve the right to terminate or suspend access to our services immediately, without prior notice, for any violation of these Terms or for any other reason we deem appropriate.</p>
                </section>

                <footer className="footer">
                    <p>&copy; 2025 Neurowell. All rights reserved.</p>
                    <p>For questions about these terms, please contact: <a href="mailto:support@neurowell.com">support@neurowell.com</a></p>
                </footer>

                <style jsx>{`
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #ffffff;
            background-color: #111111;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .header {
            text-align: center;
            padding: 40px 0;
            background-color: #1a1a1a;
            border-radius: 8px;
            margin-bottom: 40px;
            border: 1px solid rgba(255, 51, 51, 0.1);
          }
          h1, h2 {
            color: #ff3333;
            margin: 0;
          }
          h1 {
            font-size: 2.5em;
          }
          h2 {
            margin-top: 40px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(255, 51, 51, 0.2);
          }
          .last-updated {
            color: #ffffff;
            font-size: 0.9em;
            margin-top: 10px;
            opacity: 0.7;
          }
          .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #1a1a1a;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(255, 51, 51, 0.1);
            border: 1px solid rgba(255, 51, 51, 0.1);
            text-align: center;
          }
          ul {
            padding-left: 20px;
            text-align: left;
          }
          li {
            margin-bottom: 10px;
          }
          .important {
            background-color: rgba(255, 51, 51, 0.1);
            padding: 15px;
            border-left: 4px solid #ff3333;
            margin: 20px 0;
          }
          footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            opacity: 0.7;
            border-top: 1px solid rgba(255, 51, 51, 0.2);
          }
          a {
            color: #ff3333;
            text-decoration: none;
            transition: opacity 0.3s ease;
          }
          a:hover {
            opacity: 0.8;
          }
        `}</style>
            </div>
        </>
    );
}
