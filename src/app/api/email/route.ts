import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { host, port, sender, username, password } = body;

    let transporter = nodemailer.createTransport({
        host: host ? host : 'smtp.gmail.com',
        port: port ? port : '587',
        secure: port === 465 ? true : false, // true for 465, false for other ports
        auth: {
            user: username ? username : 'safikhalil191@gmail.com',
            pass: password ? password : 'password'
        }
    });

    try {
        await transporter.sendMail({
            to: sender,
            subject: "Welcome to Klickbee CRM!",
            text: "Hello there! Your account is ready.",
            html: "<p>Hello there! 🎉<br>Your account is ready.</p>",
        });
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
