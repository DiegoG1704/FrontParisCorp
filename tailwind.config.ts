import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Puedes agregar colores estáticos aquí o usar clases de Tailwind para aplicar los valores directamente
        background: 'var(--background)',  // Utiliza las variables en los estilos
        foreground: 'var(--foreground)',  // Utiliza las variables en los estilos
      },
    },
  },
  plugins: [],
} satisfies Config;
