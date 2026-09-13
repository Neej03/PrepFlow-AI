import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PrepFlow AI | Turn Study Material Into Exam-Ready Knowledge",
  description: "Upload your study material and let PrepFlow AI create concise revision notes and a personalized 5-question practice quiz in seconds.",
  keywords: ["PrepFlow AI", "AI Student Workspace", "Lecture Notes Generator", "AI Practice Quiz", "Exam Preparation AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
