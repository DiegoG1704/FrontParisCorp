'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import userImage from '../Imagen/producto.jpg';
import { Button } from 'primereact/button';
import { useAppContext } from '../Provider/AppContext';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import DialogNotificaciones from '../Components/DialogNotificaciones';
import axiosInstance from './axiosToken';
import DialogEnviar from '../Components/DialogEnviar';
import DialogRemitente from '../Components/DialogEnv';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [visible,setVisible]=useState(false)
  const [visibleRem,setVisibleRem]=useState(false)
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { usuario,notif,ListaNotificiaciones } = useAppContext();
  const user = usuario?.datosUsuario;
  const isDark = user?.estadoModo !== "1"; // Modo oscuro

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('idUsuario');
    router.push('/');
  };

  const marcarLeido = async(id:number)=>{
    try {
      await axiosInstance.put(`putLeido/${id}`)
      console.log('exito');
      ListaNotificiaciones();
    } catch (error) {
      console.log('Error',error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        notifRef.current && !notifRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex justify-end p-8 relative ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-black'}`}>
      
      {/* Notificación */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} flex items-center justify-center rounded-lg mr-6`}>
        <div className="relative">
          <Button
            className="bg-transparent border-transparent"
            onClick={() => setShowNotifications(prev => !prev)}
          >
            <i className={`pi pi-bell text-[2rem] text-[#4F9CD7]`}></i>
          </Button>

          {notif?.filter((n: any) => n.estado === "1").length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
              {notif.filter((n: any) => n.estado === "1").length}
            </span>
          )}
        </div>
      </div>

      {/* Usuario */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} flex items-center justify-center rounded-lg relative`}>
        <div className="flex flex-col pr-[4.5rem] pl-[1rem]">
          <strong className={`${isDark ? 'text-[#4F9CD7]' : 'text-[#4F9CD7]'} text-[1.2rem]`}>
            {user?.nombres?.length > 15 
              ? user.nombres.slice(0, 15) + '...' 
              : user?.nombres}
          </strong>
          <span className={`${isDark ? 'text-gray-300' : 'text-[#B6B6B6]'} text-[1rem] capitalize`}>{user?.rol}</span>
        </div>

        <Button
          className="bg-transparent border-transparent"
          onClick={() => setShowMenu(prev => !prev)}
        >
          <Image src={user?.fotoPerfil ? `http://localhost:4000/uploads/${user.fotoPerfil}` : userImage} alt="user" width={55} height={55} className="rounded-full" />
        </Button>

        {/* Menú personalizado */}
        {showMenu && (
          <div
            ref={menuRef}
            className={`absolute top-full right-0 mt-3 w-120 shadow-xl rounded-xl p-6 z-50 transition-all duration-200
              ${isDark ? 'bg-[#1E293B] text-white' : 'bg-white text-black'}`}
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
              <p className={`font-semibold text-[1.5rem] text-center ${isDark ? 'text-[#4F9CD7]' : 'text-[#4F9CD7]'}`}>
                {user?.nombres || 'Usuario'}
              </p>
              <span className={`mt-1 px-3 py-1 rounded-full text-sm text-center capitalize ${isDark ? 'bg-[#0F2A4A] text-[#4F9CD7]' : 'bg-[#E1F0FA] text-[#4F9CD7]'}`}>
                {user?.rol || 'Rol'}
              </span>
            </div>

            <Divider className="my-4" />

            {/* Opciones de menú */}
            <div className="flex justify-between gap-3">
              <Link href={'/Principal/Perfil'} className="no-underline">
                <Button
                  className={`flex-1 text-sm justify-center ${isDark ? 'text-[#4F9CD7] hover:bg-[#0F2A4A]' : 'text-[#4F9CD7] hover:bg-[#F0F8FF]'}`}
                  icon="pi pi-cog"
                  label="Perfil"
                  outlined
                />
              </Link>
              
              <Button
                className={`flex-1 p-2 text-sm justify-center ${isDark ? 'text-[#f87171] hover:bg-[#3B1F2A]' : 'text-[#d13030] hover:bg-[#fff5f5]'}`}
                icon="pi pi-sign-out"
                label="Log Out"
                onClick={handleLogout}
                outlined
              />
            </div>
          </div>
        )}

        {showNotifications && (
          <div
            ref={notifRef}
            className={`absolute top-full right-[22rem] mt-3 w-80 shadow-xl rounded-xl p-4 z-50
              ${isDark ? 'bg-[#1E293B] text-white' : 'bg-white text-black'}`}
          >
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-3 text-[#4F9CD7]">Notificaciones</h3>
              <Button 
                className="bg-transparent border-transparent font-semibold mb-3 text-[#4F9CD7]" 
                icon ='pi pi-plus'
                onClick={()=>setVisible(true)}
              />
            </div>
            

            <div className="flex flex-col gap-2 max-h-65 overflow-y-auto">
              {notif && notif.length > 0 ? (
                notif.map((n: any) => {
                  const fecha = new Date(n.fechaEnvio).toLocaleString();

                  return (
                    <div
                      key={n.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-all
                        ${n.estado === "1"
                          ? isDark
                            ? 'bg-[#0F172A]'
                            : 'bg-gray-100'
                          : ''
                        }
                        hover:bg-gray-200 dark:hover:bg-[#0F172A]
                      `}
                    >
                      <div className="flex flex-col">
                        <div className='flex justify-between'>
                          <div
                            onClick={() => {
                              setSelectedNotif(n);
                              setShowDialog(true);
                              marcarLeido(n.id);
                            }}  
                            className="flex flex-col"
                          >
                            <span className="font-semibold text-lg">
                              {n.titulo}
                            </span>

                            <span className="text-sm opacity-80">
                              {n.mensaje}
                            </span>
                          </div>
                          <Button 
                            className='bg-transparent border-transparent' 
                            icon='pi pi-send'
                            tooltip='Responder'
                            onClick={()=>{
                              setSelectedNotif(n);
                              setVisibleRem(true);
                              marcarLeido(n.id);
                            }}
                          />
                        </div>
                        

                        <span className=" flex text-[10px] mt-1 opacity-60 justify-end">
                          {fecha}
                        </span>
                        
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm opacity-70">
                  No hay notificaciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <DialogNotificaciones Open={showDialog} Close={()=>setShowDialog(false)} Datos={selectedNotif}/>
      <DialogEnviar Open={visible} Close={()=>setVisible(false)}/>
      <DialogRemitente Open={visibleRem} Close={()=>setVisibleRem(false)} Datos={selectedNotif}/>
    </div>
  );
};

export default Navbar;
