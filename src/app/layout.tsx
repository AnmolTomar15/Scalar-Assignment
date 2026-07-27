import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "MinuteAI — Meeting Notes & Transcription Platform",
  description: "AI-powered workspace that transcribes meetings, labels speakers, and extracts summaries & action items.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 flex min-h-screen antialiased">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
