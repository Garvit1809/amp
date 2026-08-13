// Trigger Netlify rebuild to load the new environment variables
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, phone, email, need } = await request.json();

    // Validate inputs
    if (!name || !phone || !email || !need) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER || 'support@assistmyphd.com';
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpPass) {
      console.warn('SMTP_PASS is not defined in environment variables.');
    }

    // Configure Hostinger SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // true for port 465 (SSL), false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email template sent to the owner
    const ownerMailOptions = {
      from: `"AMP Lead Alert" <${smtpUser}>`,
      to: smtpUser,
      subject: `New Lead Received: ${name} (${need})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: 0 auto; background-color: #fcfcfc;">
          <h2 style="color: #2F2878; margin-top: 0;">New Consultation Request</h2>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 15px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555; width: 150px;">Name:</td>
              <td style="padding: 8px 0; color: #111111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Phone Number:</td>
              <td style="padding: 8px 0; color: #111111;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Email Address:</td>
              <td style="padding: 8px 0; color: #111111;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Service Needed:</td>
              <td style="padding: 8px 0; color: #111111;">${need}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 15px 0;" />
          <p style="font-size: 12px; color: #888888; text-align: center; margin-bottom: 0;">This email was sent automatically from the Assist My PhD lead form.</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(ownerMailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
