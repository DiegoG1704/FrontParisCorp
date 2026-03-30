'use client'

import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogAgregar({ Close, Open }: Props) {

  const {ListaTaller}= useAppContext();
  const [datos, setDatos] = useState({
    dni: '',
    nombres: '',
    telefono: '',
    nombre:'',
    direccion:'',
  })

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">Agregar Taller</p>
    </div>
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos(prev => ({ ...prev, [name]: value }))
  }

  const handleAgregar = async() => {
    try {
      const result = await axiosInstance.post('postTaller',datos)
      setDatos({
        dni: '',
        nombres: '',
        telefono: '',
        nombre:'',
        direccion:'',
      });
      ListaTaller();
      Close();
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <Dialog
      onHide={Close}
      visible={Open}
      header={Titulo}
      style={{ width: '500px' }}
      className="p-fluid"
    >
      <div className="bg-white shadow-md rounded-lg">
        {/* DATOS PERSONALES */}
        <div className="flex flex-col p-6 space-y-4">
          <label className="text-[#4F9CD7] text-[1.5rem] font-semibold">
            <i className='pi pi-shop text-[1.4rem]'/> Datos del Taller
          </label>
          <div>
            <label className="text-[#4F9CD7] font-medium">Nombre</label>
            <InputText
              name="nombre"
              value={datos.nombre}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre completo..."
              className="mt-2 w-full"
            />
          </div>
          <div>
            <label className="text-[#4F9CD7] font-medium">Direccion</label>
            <InputText
              name="direccion"
              value={datos.direccion}
              onChange={handleInputChange}
              placeholder="Ingrese el teléfono..."
              className="mt-2 w-full"
            />
          </div>
        </div>

        {/* CREDENCIALES */}
        <div className="flex flex-col p-6 space-y-4 pt-0">
          <label className="text-[#4F9CD7] text-[1.5rem] font-semibold">
            <i className='pi pi-user text-[1.4rem]'/> Datos del Encargado
          </label>
          <div>
            <label className="text-[#4F9CD7] font-medium">DNI</label>
            <div className="flex mt-2 gap-2">
              <InputText
                name="dni"
                value={datos.dni}
                onChange={handleInputChange}
                placeholder="Ingrese DNI..."
                className="flex-1"
              />
              <Button label="Completar" className="h-[3rem] w-[10rem]" />
            </div>
          </div>
          <div>
            <label className="text-[#4F9CD7] font-medium">Nombres</label>
            <InputText
              name="nombres"
              value={datos.nombres}
              onChange={handleInputChange}
              placeholder="Ingrese el nombres..."
              className="mt-2 w-full"
            />
          </div>
          <div>
            <label className="text-[#4F9CD7] font-medium">Telefono</label>
            <InputText
              name="telefono"
              value={datos.telefono}
              onChange={handleInputChange}
              placeholder="Ingrese el teléfono..."
              className="mt-2 w-full"
            />
          </div>
        </div>
        <div className="flex justify-end p-4 pt-0">
          <Button
            className="bg-[#BACD00] text-white border-[#BACD00] hover:bg-[#aab800] transition w-[10rem]"
            label="Agregar"
            onClick={handleAgregar}
          />
        </div>
      </div>
    </Dialog>
  )
}
