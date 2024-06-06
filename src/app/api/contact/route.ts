// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function handleCors(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return NextResponse.json(null, { status: 204 });
  }

  return response;
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request);
  if (request.method === "OPTIONS") return corsResponse;

  const { fName, sName, email, message } = await request.json();

  // Create a Nodemailer transporter using your cPanel email account
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "New Contact Us Message",
      text: `
        Name: ${fName} ${sName}
        Email: ${email}
        Message: ${message}
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Error sending email" }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}
