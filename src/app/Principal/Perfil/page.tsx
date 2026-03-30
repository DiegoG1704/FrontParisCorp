"use client";

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import userImage from '../../Imagen/producto.jpg';
import logo from '../../Imagen/logoWhite.png';
import { Divider } from "primereact/divider";
import { useAppContext } from "@/app/Provider/AppContext";
import Image from "next/image";
import DialogCampos from "./components/DialogCampos";
import DialogCorreo from "./components/DialogCorreo";
import { useRouter } from "next/navigation";

export default function Page() {
  const { usuario } = useAppContext();
  const [visibleCampos, setVisibleCampos] = useState(false);
  const [visibleCorreo, setVisibleCorreo] = useState(false);
  const [campoSeleccionado, setCampoSeleccionado] = useState<any>(null);
  const [seccionActiva, setSeccionActiva] = useState<"personal" | "negocio">("personal");

  const user = usuario?.datosUsuario;
  const isDark = user?.estadoModo !== "1";

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('idUsuario');
    router.push('/');
  };

  const abrirDialogCampo = (campo: string) => {
    setCampoSeleccionado({ campo });
    setVisibleCampos(true);
  };

  return (
    <div
      className={`flex flex-col p-10 min-h-screen gap-8 transition-colors duration-300 ${
        isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#4F9CD7]">Perfil</h1>
        <p className={`text-lg mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Administra tu perfil y datos
        </p>
      </div>

      {/* Perfil principal */}
      <div className="bg-[#4F9CD7] rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
        
        {/* Avatar */}
        <div className="relative">
          <Image
            src={userImage}
            alt="user"
            width={170}
            height={170}
            className="rounded-[10px] border-white shadow-md object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left text-white">
          <p className="text-3xl md:text-4xl font-bold tracking-tight">
            {user?.nombres}
          </p>

          {user?.correo ? (
            <p className="text-sm md:text-base opacity-90 mt-1">
              {user.correo}
            </p>
          ) : (
            <p className="text-sm italic opacity-70 mt-1">
              sin correo
            </p>
          )}

          <div className="mt-3">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {user?.rol}
            </span>
          </div>
        </div>
        <div className="relative">
          <Image
            src={logo}
            alt="user"
            className="w-full h-[180px] object-cover"
          />
        </div>
      </div>

      <div className="flex gap-2 p-1 rounded-xl w-fit">
        <Button
          label="Información personal"
          onClick={() => setSeccionActiva("personal")}
          className={`px-5 py-2 rounded-lg text-md font-semibold transition-all duration-200 border-none
            ${
              seccionActiva === "personal"
                ? `${isDark ? "bg-[#1E293B] text-[#4F9CD7] shadow-md" : "bg-white text-[#4F9CD7] shadow-md"}`
                : `${isDark ? "bg-[#0F172A] text-gray-400 hover:bg-[#1E293B]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
            }`}
        />

        <Button
          label="Información del negocio"
          onClick={() => setSeccionActiva("negocio")}
          className={`px-5 py-2 rounded-lg text-md font-semibold transition-all duration-200 border-none
            ${
              seccionActiva === "negocio"
                ? `${isDark ? "bg-[#1E293B] text-[#4F9CD7] shadow-md" : "bg-white text-[#4F9CD7] shadow-md"}`
                : `${isDark ? "bg-[#0F172A] text-gray-400 hover:bg-[#1E293B]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
            }`}
        />
      </div>

      {/* Información personal */}
      {seccionActiva === "personal" && (
        <Card
          title="Información personal"
          className={`shadow-md ${
            isDark ? "bg-[#1E293B] text-white" : "bg-white text-black"
          }`}
        >
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            
            <div>
              <p className="text-sm text-gray-500">Nombre completo</p>
              <div className="flex items-center gap-2">
                <p>{user?.nombres}</p>
                <Button 
                  icon='pi pi-pencil' 
                  className="bg-transparent border-transparent text-[#4F9CD7]"
                  onClick={() => abrirDialogCampo("nombres")}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Correo</p>
              <div className="flex items-center gap-2">
                {user?.correo ? (
                  <>
                    <p>{user?.correo}</p>
                    <Button 
                      icon='pi pi-pencil' 
                      className="bg-transparent border-transparent text-[#4F9CD7]"
                      onClick={() => abrirDialogCampo("correo")}
                    />
                  </>
                ) : (
                  <Button 
                    label="Agregar Correo"
                    className="text-[#4F9CD7] bg-transparent border-[#4F9CD7]"
                    onClick={() => setVisibleCorreo(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <div className="flex items-center gap-2">
                <p>{user?.telefono}</p>
                <Button 
                  icon='pi pi-pencil' 
                  className="bg-transparent border-transparent text-[#4F9CD7]"
                  onClick={() => abrirDialogCampo("telefono")}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Documento</p>
              <div className="flex items-center gap-2">
                <p>DNI: {user?.dni}</p>
                <Button 
                  icon='pi pi-pencil' 
                  className="bg-transparent border-transparent text-[#4F9CD7]"
                  onClick={() => abrirDialogCampo("dni")}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      
      {/* Información de negocio */}
      {seccionActiva === "negocio" && (
        <Card
          title="Información de negocio"
          className={`shadow-md ${
            isDark ? "bg-[#1E293B] text-white" : "bg-white text-black"
          }`}
        >
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            
            <div>
              <p className="text-sm text-gray-500">Nombre Negocio</p>
              <div className="flex items-center gap-2">
                <p>{user?.nombres}</p>
                <Button 
                  icon='pi pi-pencil' 
                  className="bg-transparent border-transparent text-[#4F9CD7]"
                  onClick={() => abrirDialogCampo("nombres")}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">RUC</p>
              <div className="flex items-center gap-2">
                {user?.correo ? (
                  <>
                    <p>{user?.correo}</p>
                    <Button 
                      icon='pi pi-pencil' 
                      className="bg-transparent border-transparent text-[#4F9CD7]"
                      onClick={() => abrirDialogCampo("correo")}
                    />
                  </>
                ) : (
                  <Button 
                    label="Agregar Correo"
                    className="text-[#4F9CD7] bg-transparent border-[#4F9CD7]"
                    onClick={() => setVisibleCorreo(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Direccion</p>
              <div className="flex items-center gap-2">
                <p>{user?.telefono}</p>
                <Button 
                  icon='pi pi-pencil' 
                  className="bg-transparent border-transparent text-[#4F9CD7]"
                  onClick={() => abrirDialogCampo("telefono")}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Numero de Contacto</p>
              <div className="flex items-center gap-2">
                <p>DNI: {user?.dni}</p>
                <Button 
                  icon='pi pi-pencil' 
                  className="bg-transparent border-transparent text-[#4F9CD7]"
                  onClick={() => abrirDialogCampo("dni")}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
      <Divider />

      <div
        className={`flex items-center justify-end p-4 rounded-md shadow ${
          isDark
            ? "bg-transpared text-white border-red-700"
            : "bg-transpared text-gray-800 "
        }`}
      >
        <Button
          label="Cerrar Sesión"
          onClick={handleLogout}
          className={`px-4 py-2 rounded-md border-transparent font-semibold transition-colors duration-200 ${
            isDark
              ? "bg-red-600 text-white hover:bg-red-500"
              : "bg-[#BACD00] text-white hover:bg-[#aab800]"
          }`}
        />
      </div>

      <DialogCampos Open={visibleCampos} Close={() => setVisibleCampos(false)} Datos={campoSeleccionado} />
      <DialogCorreo Open={visibleCorreo} Close={() => setVisibleCorreo(false)} />
    </div>
  );
}