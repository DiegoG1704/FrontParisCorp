"use client";

import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAppContext } from "@/app/Provider/AppContext";
import axiosInstance from "@/app/Herramientas/axiosToken";
import { Toast } from "primereact/toast";

interface Props {
  Open: boolean;
  Close: () => void;
}

export default function DialogCorreo({ Open, Close }: Props) {
  const { usuario, me } = useAppContext();
  const user = usuario?.datosUsuario;
  const [valor, setValor] = useState("");
  const toast = useRef<any>(null);

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-user-edit bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Agregar correo
      </p>
    </div>
  );

  // ✅ función para validar email
  const validarCorreo = (correo: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleSubmit = async () => {
    // 🔴 Validación: campo vacío
    if (!valor.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Campo requerido",
        detail: "El correo no puede estar vacío",
        life: 3000,
      });
      return;
    }

    // 🔴 Validación: formato incorrecto
    if (!validarCorreo(valor)) {
      toast.current.show({
        severity: "warn",
        summary: "Correo inválido",
        detail: "Ingrese un correo electrónico válido",
        life: 3000,
      });
      return;
    }

    try {
      await axiosInstance.put(`AgregarCorreo/${user.id}`, {
        correo: valor,
      });

      toast.current.show({
        severity: "success",
        summary: "Guardado",
        detail: "Correo actualizado correctamente",
        life: 3000,
      });

      setValor(""); // limpia input
      me(); // refresca datos
      Close();
    } catch (error) {
      console.log("ERROR", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el correo",
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
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <p className="text-ml text-gray-500">Agregar Correo</p>
            <InputText
              placeholder="Ingresar Correo..."
              className="w-full"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
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