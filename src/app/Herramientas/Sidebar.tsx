'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../Imagen/logoEllafit.png';
import user from '../Imagen/producto.jpg';
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
  const {usuario}=useAppContext();

  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const opcionesExtras = [
    { ruta: '/Dashboard/Configuraciones', icono: 'pi pi-question-circle', nombre: 'Ayuda' },
    { ruta: '/Principales/Page/Configuraciones', icono: 'pi pi-cog', nombre: 'Configuracion' },
  ];


  const scrollRutas = (direccion: 'arriba' | 'abajo') => {
    const nuevoStart =
      direccion === 'arriba'
        ? Math.max(0, startIndex - 1)
        : Math.min(usuario?.rutas.length - rutasPorPagina, startIndex + 1);
    setStartIndex(nuevoStart);
  };

  const LinkSidebar = ({ ruta, icono, nombre, idx }: Ruta & { idx: number }) => (
    <div
      onClick={() => setRutaSeleccionada(idx)}
      className={`flex items-center text-white space-x-3 p-2 rounded-lg text-[1.2rem] cursor-pointer transition duration-200 no-underline ${
        pathname === ruta ? 'bg-[#BACD00]' : rutaSeleccionada === idx ? 'bg-[#88ab00]' : ''
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

  const tieneScroll = usuario?.rutas.length > rutasPorPagina;
  return (
    <div className="w-full md:w-64 bg-[#4F9CD7] text-white p-4 h-screen flex flex-col">
      <Image src={logo} alt="Logo Ellafit" className="mx-auto mb-2" />
      <Divider />
      <div className="flex-1 overflow-hidden flex flex-col items-center">
        {tieneScroll && (
          <Button
            className="bg-transparent border-transparent p-0"
            onClick={() => scrollRutas('arriba')}
            disabled={startIndex === 0}
          >
            <i className="pi pi-angle-up text-[2rem] text-[#1818d6]"></i>
          </Button>
        )}
        <ul className="flex flex-col space-y-2 w-full px-2">
          {rutasVisibles.map((item:any, idx:any) => (
            <li key={startIndex + idx}>
              <LinkSidebar {...item} idx={startIndex + idx} />
            </li>
          ))}
        </ul>
        {tieneScroll && (
          <Button
            className="bg-transparent border-transparent p-0"
            onClick={() => scrollRutas('abajo')}
            disabled={startIndex + rutasPorPagina >= usuario?.rutas.length}
          >
            <i className="pi pi-angle-down text-[2rem] text-[#1818d6]"></i>
          </Button>
        )}

        <Divider />
        <ul className="w-full px-2">
          {opcionesExtras.map((item, idx) => (
            <li key={idx}>
              <LinkSidebar {...item} idx={-1} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 bg-[#afcade] flex flex-col items-center justify-center rounded-lg p-3">
        <Image src={user} alt="user" width={55} height={55} className="rounded-full mb-2" />
        <span className="font-medium">Diego Guevara</span>
        <span className="text-sm">dgst1704@gmail.com</span>
      </div>
    </div>
  );
};

export default Sidebar;
