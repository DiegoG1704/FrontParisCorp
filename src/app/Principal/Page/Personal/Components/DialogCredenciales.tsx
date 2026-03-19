'use client'

import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React from 'react'

interface Props {
    Open: boolean
    Close: () => void
    Datos:any
  }

export default function DialogCredenciales({ Close, Open, Datos }: Props) {
    const Titulo = () => (
        <div className="flex items-center gap-3">
          <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
          <p className="text-[#BACD00] text-[1.5rem] font-semibold">Credenciales</p>
        </div>
      )
  return (
    <Dialog
        onHide={Close}
        visible={Open}
        header={Titulo}
        style={{ width: '400px' }}
        className="p-fluid"
    >
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col">
                <label className="text-[#4F9CD7] font-medium">Nombre de Usuario</label>
                <InputText className="mt-2 mb-6" value={Datos.usuario} />
            </div>
            <div className="flex flex-col">
                <label className="text-[#4F9CD7] font-medium">Password</label>
                <InputText type='password' className="mt-2 mb-6" value={Datos.contraseña}/>
            </div>
        </div>
    </Dialog>
  )
}
