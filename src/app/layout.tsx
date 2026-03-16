import type { Metadata } from "next";
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
              <div className="mx-auto max-w-4xl flex flex-col items-center justify-center gap-1 sm:flex-row sm:justify-between">
                <span>© {new Date().getFullYear()} MD Soluções. Todos os direitos reservados.</span>
                <span className="opacity-80">Sistema desenvolvido por MD Soluções.</span>
              </div>
            </footer>
          </ConfigShell>
        </CartProvider>
      </body>
    </html>
  );
}
