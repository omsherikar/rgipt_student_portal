import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const transporter = nodemailer.createTransport(provider.server);
        const logoUrl = "https://your-domain.com/rgipt-logo.png"; // Update to your deployed logo URL
        const mailOptions = {
          to: identifier,
          from: provider.from,
          subject: `Sign in to RGIPT Student Portal`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px 0;">
              <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(37,99,235,0.08); padding: 32px 24px 24px 24px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src='${logoUrl}' alt='RGIPT Logo' width='64' height='64' style='margin-bottom: 8px;'/>
                  <h2 style="color: #2563eb; margin: 0; font-size: 1.5rem; font-weight: 700;">RGIPT Student Portal</h2>
                </div>
                <p style="font-size: 1.1rem; color: #22223b; text-align: center; margin-bottom: 32px;">Hello,<br/>Click the button below to sign in to your RGIPT account.</p>
                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${url}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; font-size: 1.1rem; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 8px rgba(37,99,235,0.10); transition: background 0.2s;">Sign in to RGIPT</a>
                </div>
                <p style="font-size: 0.95rem; color: #6b7280; text-align: center; margin-bottom: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #2563eb; font-size: 0.95rem; text-align: center; margin: 8px 0 0 0;">${url}</p>
                <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;"/>
                <p style="font-size: 0.85rem; color: #9ca3af; text-align: center;">This link is valid for 24 hours and can only be used once.<br/>If you did not request this email, you can safely ignore it.</p>
              </div>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/signin?verify=1",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user?.email?.endsWith("@rgipt.ac.in")) {
        return true;
      }
      return false;
    },
    async session({ session, user }) {
      console.log("NextAuth session callback - session:", session);
      console.log("NextAuth session callback - user:", user);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 