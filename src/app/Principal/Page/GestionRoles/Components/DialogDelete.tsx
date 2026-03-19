'use client'

import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
  Datos: any
}

export default function DialogDeleteRol({ Close, Open, Datos }: Props) {
  const { ListaRoles } = useAppContext()
  const toast = useRef<any>(null)

  const handleSudmit = async()=>{
    try {
        await axiosInstance.delete(`DeleteRol/${Datos.id}`)
        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Rol eliminado correctamente',
            life: 3000,
        });
        Close();
        ListaRoles();
    } catch (error) {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail:'No se pudo eliminar el rol',
            life: 4000,
        });
        console.error(error);
    }
  }

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">Eliminar Rol</p>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        onHide={Close}
        visible={Open}
        header={Titulo}
        className="p-fluid w-[25rem]"
      >
        <p>¿Seguro que deseas eliminar el rol {Datos.nombre}?</p>
        
        <div className="flex justify-end gap-3 mt-5">
            <Button onClick={Close} label="Cancelar" className="p-button-text" />
            <Button onClick={handleSudmit} label="Eliminar" severity="danger" />
        </div>
      </Dialog>
    </>
  )
}