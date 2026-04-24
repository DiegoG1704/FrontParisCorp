"use client";

import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { Divider } from "primereact/divider";
import { useAppContext } from "@/app/Provider/AppContext";
import axiosInstance from "@/app/Herramientas/axiosToken";
import { Button } from "primereact/button";
import DialogPassword from "./Components/DialogCambio";

export default function Page() {
  const { usuario, config, ListaConfiguraciones, me } = useAppContext();
  const user = usuario?.datosUsuario;
  const isDark = user?.estadoModo !== "1";

  const[visible,setVisible]=useState(false)

  const handleToggle = async (id: number, checked: boolean) => {
    const newEstado = checked ? "1" : "2";

    try {
      await axiosInstance.put(`putEstadoConfig/${id}`, { estado: Number(newEstado) });
      ListaConfiguraciones();
      me();
    } catch (error) {
      console.error("Error actualizando:", error);
    }
  };

  return (
    <div
      className={`flex flex-col p-10 min-h-screen gap-8 transition-colors duration-300 ${
        isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#4F9CD7]">
          Configuraciones
        </h1>
        <p
          className={`text-lg mt-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Administra tu perfil y preferencias del sistema
        </p>
      </div>

      {/* Preferencias */}
      <Card
        title="Preferencias"
        className={`shadow-md ${
          isDark
            ? "bg-[#1E293B] text-white" // 👈 card oscuro
            : "bg-white text-black"
        }`}
      >
        <div className="flex flex-col gap-5">
          
          <div className="flex items-center justify-between">
            <span>Cambio de Contraseña</span>
            <Button 
              label="Cambiar"
              className={`${
                isDark
                  ? "bg-[#4F9CD7] border-[#4F9CD7]" // 👈 card oscuro
                  : "bg-[#BACD00] text-white border-[#BACD00]"
              }`}
              onClick={()=>setVisible(true)}
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <span>Formato de documento</span>
            <Button 
              label="Ver"
              className={`${
                isDark
                  ? "bg-[#4F9CD7] border-[#4F9CD7]" // 👈 card oscuro
                  : "bg-[#BACD00] text-white border-[#BACD00]"
              }`}
            />
          </div>

          <Divider />

          {config.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between">
              <span>{c.configuracion}</span>
              <InputSwitch 
                checked={Number(c.estado) === 1} 
                onChange={(e) => handleToggle(c.id, e.value)}
              />
            </div>
          ))}
        </div>
      </Card>
      <DialogPassword Open={visible} Close={()=>setVisible(false)}/>
    </div>
  );
}