'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import userImage from '../Imagen/producto.jpg';
import { Button } from 'primereact/button';
import { useAppContext } from '../Provider/AppContext';
import { Divider } from 'primereact/divider';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { usuario } = useAppContext();
  const user = usuario?.datosUsuario;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('idUsuario');
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end p-8 relative">
      {/* Notificación */}
      <div className="bg-white flex items-center justify-center rounded-lg mr-6">
        <Button className="bg-transparent border-transparent">
          <i className="pi pi-bell text-[2rem] text-[#4F9CD7]"></i>
        </Button>
      </div>

      {/* Usuario */}
      <div className="bg-white flex items-center justify-center rounded-lg relative">
        <div className="flex flex-col pr-[4.5rem] pl-[1rem]">
          <strong className="text-[#4F9CD7] text-[1.2rem]">{user?.nombres}</strong>
          <span className="text-[#B6B6B6] text-[1rem] capitalize">{user?.rol}</span>
        </div>
        <Button
          className="bg-transparent border-transparent"
          onClick={() => setShowMenu(prev => !prev)}
        >
          <Image src={userImage} alt="user" width={55} height={55} className="rounded-full" />
        </Button>

        {/* Menú personalizado */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-full right-0 mt-3 w-120 bg-white shadow-xl rounded-xl p-6 z-50 transition-all duration-200"
          >
            {/* Encabezado del menú */}
            <div className="flex flex-col items-center mb-5">
              <Image
                src={userImage}
                alt="user"
                width={120}
                height={120}
                className="rounded-full border-4 border-[#4F9CD7]"
              />
              <p className="font-semibold text-[#4F9CD7] p-0 text-[1.5rem] text-center">{user?.nombres || 'Usuario'}</p>
              <span className="mt-1 px-3 py-1 bg-[#E1F0FA] text-[#4F9CD7] text-sm rounded-full text-center capitalize">
                {user?.rol || 'Rol'}
              </span>
            </div>

            <Divider className="my-4" />

            {/* Opciones de menú */}
            <div className="flex justify-between gap-3">
              <Button
                className="flex-1 text-sm text-[#4F9CD7] hover:bg-[#F0F8FF] justify-center"
                icon="pi pi-cog"
                label="Configuraciones"
                outlined
              />
              <Button
                className="flex-1 p-2 text-sm text-[#d13030] hover:bg-[#fff5f5] justify-center"
                icon="pi pi-sign-out"
                label="Cerrar Sesión"
                onClick={handleLogout}
                outlined
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;
