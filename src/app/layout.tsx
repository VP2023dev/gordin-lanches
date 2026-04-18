import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ConfigShell } from "@/components/ConfigShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gordinho Lanches - Cardápio Online",
  description: "Cardápio digital do Gordinho Lanches. Peça pelo WhatsApp!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ConfigShell>
            {children}
            <footer className="mt-10 border-t border-[var(--border-strong)] bg-[var(--card-bg)]/90 px-4 py-4 text-center text-xs text-[var(--muted)]">
              <div className="mx-auto max-w-4xl flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
                <span>© {new Date().getFullYear()} MD Soluções. Todos os direitos reservados.</span>
                <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                  <Link href="/sobre" className="font-medium text-[var(--foreground-soft)] underline-offset-2 hover:text-[var(--accent)] hover:underline">
                    Sobre / Contato
                  </Link>
                  <span className="hidden opacity-40 sm:inline">·</span>
                  <span className="opacity-80">Sistema desenvolvido por MD Soluções.</span>
                </span>
              </div>
            </footer>
          </ConfigShell>
        </CartProvider>
      </body>
    </html>
  );
}
