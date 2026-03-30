"use client"; // Marcar como componente cliente
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./globals.css";
import { AppProvider } from "./Provider/AppContext";
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="antialiased">
        <AppProvider>
            {/* Contenido principal, solo será desplazable */}
            <main>
              {children}
            </main>
        </AppProvider>
      </body>
    </html>);
}
