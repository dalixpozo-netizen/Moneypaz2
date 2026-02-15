import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Cargamos la fuente Inter para un aspecto moderno y legible
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moneypaz 2.0 - Asistente Financiero",
  description: "Gestión inteligente de gastos con alertas recurrentes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {/* Este 'children' es donde se mostrarán todas nuestras páginas */}
        {children}
      </body>
    </html>
  );
}
