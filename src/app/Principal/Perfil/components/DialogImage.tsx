"use client";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import userImage from '../../../Imagen/producto.jpg';
import Image from "next/image";
import axiosInstance from "@/app/Herramientas/axiosToken";
import { useAppContext } from "@/app/Provider/AppContext";

interface Props {
  Open: boolean;
  Close: () => void;
}

export default function DialogImage({ Open, Close }: Props) {
  const { usuario,me} = useAppContext();
  const [imagen, setImagen] = useState<File | null>(null);
  const user = usuario?.datosUsuario;
  const [preview, setPreview] = useState<string | StaticImageData | null>(
    user?.fotoPerfil ? `http://localhost:4000/uploads/${user.fotoPerfil}` : userImage
    );
  const [dragActive, setDragActive] = useState(false);
  
  const toast = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔄 Actualiza preview cuando cambian los datos
  useEffect(() => {
    setPreview(user?.fotoPerfil ? `http://localhost:4000/uploads/${user.fotoPerfil}` : userImage);
    }, [user]);

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-image bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Editar Imagen
      </p>
    </div>
  );

  // 📂 Abrir selector al hacer click
  const handleClickImagen = () => {
    fileInputRef.current?.click();
  };

  // 🧠 Procesar imagen (reutilizable)
  const procesarArchivo = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Solo se permiten imágenes",
        life: 3000,
      });
      return;
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  // 📂 Input normal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) procesarArchivo(file);
  };

  // 🖱️ Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) procesarArchivo(file);
  };

const handleSubmit = async () => {
  if (!imagen) {
    toast.current?.show({
      severity: "warn",
      summary: "Atención",
      detail: "Selecciona una imagen",
      life: 3000,
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("perfilUsuario", imagen);

    const response = await axiosInstance.put(
      `CambioFotoPerfil/${user?.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // clave aquí
        },
      }
    );

    setPreview(`/uploads/${response.data.fotoPerfil}`);
    toast.current?.show({
      severity: "success",
      summary: "Listo",
      detail: "Imagen de perfil actualizada",
      life: 3000,
    });
    Close();
    me();
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "No se pudo subir la imagen",
      life: 3000,
    });
  }
};

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        header={Titulo}
        visible={Open}
        onHide={Close}
        className="w-[50vw] md:w-[30rem]"
        modal
      >
        <div className="flex flex-col items-center gap-4 mt-3">
          
          {/* 🖼️ Zona de imagen */}
          <div
            onClick={handleClickImagen}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-full border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden cursor-pointer transition
              ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300"}
            `}
          >
            {preview ? (
                <div className="relative w-full h-full">
                    <Image
                        src={preview}
                        alt="preview"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <i className="pi pi-cloud-upload text-white text-5xl"></i>
                    </div>
                </div>
              
            ) : (
              <p className="text-gray-400 text-center">
                Arrastra una imagen aquí o haz click
              </p>
            )}
          </div>

          {/* 📂 Input oculto */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* 🔘 Botones */}
          <div className="flex justify-end gap-2 w-full">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={Close}
            />

            <Button
              label="Guardar"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}