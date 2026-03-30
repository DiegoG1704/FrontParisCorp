'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../Imagen/logoEllafit.png';
import logo1 from '../Imagen/logoWhite.png';
import userImage from '../Imagen/producto.jpg';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { useAppContext } from '../Provider/AppContext';

interface Ruta {
  ruta: string;
  icono: string;
  nombre: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const rutasPorPagina = 4;
  const { usuario } = useAppContext();
  const user = usuario?.datosUsuario;

  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const opcionesExtras = [
    { ruta: '/Principal/Configuraciones', icono: 'pi pi-cog', nombre: 'Configuraciones' },
    { ruta: '/Principal/Perfil', icono: 'pi pi-user', nombre: 'Perfil' },
  ];

  const scrollRutas = (direccion: 'arriba' | 'abajo') => {
    const nuevoStart =
      direccion === 'arriba'
        ? Math.max(0, startIndex - 1)
        : Math.min((usuario?.rutas?.length || 0) - rutasPorPagina, startIndex + 1);
    setStartIndex(nuevoStart);
  };

  const LinkSidebar = ({ ruta, icono, nombre, idx }: Ruta & { idx: number }) => (
    <div
      onClick={() => setRutaSeleccionada(idx)}
      className={`flex items-center text-white space-x-3 p-2 rounded-lg text-[1.2rem] cursor-pointer transition duration-200 no-underline ${
        pathname === ruta
          ? 'bg-[#BACD00]'
          : rutaSeleccionada === idx
          ? 'bg-[#88ab00]'
          : 'hover:bg-[#1E3A5F]' // 👈 hover azul moderno
      }`}
    >
      <i className={`${icono} text-[1.2rem]`}></i>
      <Link href={ruta} className="no-underline text-white">
        <span>{nombre}</span>
      </Link>
    </div>
  );

  const rutasVisibles = Array.isArray(usuario?.rutas)
    ? usuario.rutas.slice(startIndex, startIndex + rutasPorPagina)
    : [];

  const tieneScroll = (usuario?.rutas?.length || 0) > rutasPorPagina;

  return (
    <div
      className={`w-full md:w-64 ${
        user?.estadoModo === "1"
          ? "bg-[#4F9CD7]" // ☀️ modo claro
          : "bg-[#0B1F3A]" // 🌙 modo oscuro azul elegante
      } text-white p-4 h-screen flex flex-col`}
    >
      {/* Logo */}
      <Image
        src={user?.estadoModo === "1" ? logo : logo1}
        alt="Logo Ellafit"
        className="mx-auto mb-2"
      />

      <Divider />

      <div className="flex-1 overflow-hidden flex flex-col items-center">
        {/* Botón subir */}
        {tieneScroll && (
          <Button
            className="bg-transparent border-transparent p-0"
            onClick={() => scrollRutas('arriba')}
            disabled={startIndex === 0}
          >
            <i className="pi pi-angle-up text-[2rem] text-[#7FB3FF]"></i>
          </Button>
        )}

        {/* Rutas */}
        <ul className="flex flex-col space-y-2 w-full px-2">
          {rutasVisibles.map((item: any, idx: any) => (
            <li key={startIndex + idx}>
              <LinkSidebar {...item} idx={startIndex + idx} />
            </li>
          ))}
        </ul>

        {/* Botón bajar */}
        {tieneScroll && (
          <Button
            className="bg-transparent border-transparent p-0"
            onClick={() => scrollRutas('abajo')}
            disabled={startIndex + rutasPorPagina >= (usuario?.rutas?.length || 0)}
          >
            <i className="pi pi-angle-down text-[2rem] text-[#7FB3FF]"></i>
          </Button>
        )}

        <Divider />

        {/* Opciones extra */}
        <ul className="w-full px-2">
          {opcionesExtras.map((item, idx) => (
            <li key={idx}>
              <LinkSidebar {...item} idx={-1} />
            </li>
          ))}
        </ul>
      </div>

      {/* Usuario */}
      <div
        className={`mt-4 flex flex-col items-center justify-center rounded-lg p-3 ${
          user?.estadoModo === "1"
            ? "bg-[#afcade]"
            : "bg-[#123A63]" // 👈 azul más claro para contraste
        }`}
      >
        <Image
          src={userImage}
          alt="user"
          width={55}
          height={55}
          className="rounded-full mb-2"
        />
        <span className="font-medium">{user?.nombres}</span>

        {user?.correo ? (
          <span className="text-sm">{user?.correo}</span>
        ) : (
          <span className="text-sm italic opacity-70 mt-1">
            sin correo
          </span>
        )}
      </div>
    </div>
  );
};

export default Sidebar;