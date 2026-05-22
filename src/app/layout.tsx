import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MentorFlow — Mentoria Inteligente",
  description:
    "Conecte-se com mentores incríveis usando inteligência artificial. Encontre o mentor ideal para seus objetivos profissionais.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={300}>
              {children}
            </TooltipProvider>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
