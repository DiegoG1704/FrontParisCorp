"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAppContext } from "@/app/Provider/AppContext";
import axiosInstance from "@/app/Herramientas/axiosToken";
import { Toast } from "primereact/toast";

interface Datos {
  campo: string;
  valor: string;
}
interface Props {
  Open: boolean;
  Close: () => void;
  Datos:Datos;
}

export default function DialogCampos({ Open, Close,Datos }: Props) {
  const {usuario,me} = useAppContext()
  const user = usuario?.datosUsuario;
  const toast = useRef(null);
  const [valor, setValor] = useState("");

  useEffect(() => {
    setValor(Datos?.valor || "");
  }, [Datos]);
  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-user-edit bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Editar Campo
      </p>
    </div>
  );

  const handleSubmit = async () => {
    try {
        await axiosInstance.put(`EditCampo/${user.id}`, {
        campo: Datos.campo,
        valor: valor,
        });

        toast.current.show({
        severity: "success",
        summary: "Guardado",
        detail: "Campo actualizado correctamente",
        life: 3000,
        });

        me(); // refresca datos
        Close();

    } catch (error) {
        console.log("ERROR", error);

        toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el campo",
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
                <p className="text-ml text-gray-500">Agregar campo {Datos?.campo}</p>
                <InputText 
                  className="w-full" 
                  value={valor} 
                  onChange={(e)=>setValor(e.target.value)}
                />
            </div>
            {/* Botones */}
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