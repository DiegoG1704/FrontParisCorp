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

export default function DialogPassword({ Open, Close }: Props) {
  const { usuario, me } = useAppContext();
  const user = usuario?.datosUsuario;
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const toast = useRef<any>(null);

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-key bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Cambiar Password
      </p>
    </div>
  );

  const handleSubmit = async () => {
    if (!password || !passwordNew) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Debe ingresar la contraseña actual y la nueva",
        life: 3000,
      });
      return;
    }

    try {
      const response = await axiosInstance.put(`CambioPassword/${user.id}`, {
        password,
        passwordNew,
      });

      toast.current.show({
        severity: "success",
        summary: "Guardado",
        detail: response.data.message || "Contraseña actualizada correctamente",
        life: 3000,
      });

      me(); // refresca datos
      Close();
      setPassword("");
      setPasswordNew("");
    } catch (error: any) {
      console.log("ERROR", error);

      // Intentamos mostrar el mensaje del backend
      const mensaje =
        error?.response?.data?.message ||
        "No se pudo actualizar la contraseña";

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: mensaje,
        life: 4000,
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
            <p className="text-ml text-gray-500">Introduce contraseña actual</p>
            <InputText
              type="password"
              placeholder="Ingresar contraseña actual"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <p className="text-ml text-gray-500">Introduce contraseña nueva</p>
            <InputText
              type="password"
              placeholder="Ingresar nueva contraseña"
              className="w-full"
              value={passwordNew}
              onChange={(e) => setPasswordNew(e.target.value)}
            />
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
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