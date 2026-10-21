import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Personalização de produtos promocionais",
  description:
    "Camisetas, caixas, sacolas e etiquetas personalizadas, com visualização 3D e frete calculado na hora.",
};

/** Define a estrutura HTML e o idioma padrão para todas as páginas. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
