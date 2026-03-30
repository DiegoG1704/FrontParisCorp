"use client";

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; 
import "./globals.css";
import { usePathname } from 'next/navigation';
import Sidebar from './Herramientas/Sidebar';
import Navbar from './Herramientas/Navbar';
import { AppProviderPrincipal } from './Provider/AppProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
const showSidebar = pathname !== "/";

  return (
    <html lang="en">
      <body className="antialiased m-0">
        <AppProviderPrincipal>
          {/* Navbar fijo arriba */}
          {showSidebar && (
            <div className="fixed top-0 left-0 right-0 z-40">
              <Navbar />
            </div>
          )}

          {/* Sidebar fijo a la izquierda */}
          {showSidebar && (
            <div className="fixed left-0 h-[calc(100vh-5rem)] w-64 z-50 bg-white shadow">
              <Sidebar />
            </div>
          )}

          {/* Contenido principal */}
          <main className={`${showSidebar ? "pl-64" : "pl-0"} bg-gray-100 min-h-screen`}>
            {children}
          </main>
        </AppProviderPrincipal>
      </body>
    </html>
  );
}
