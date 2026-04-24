'use client'

import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogAgregar({ Close, Open }: Props) {
  const {roles,ListaPersonal}= useAppContext();

  const [datos, setDatos] = useState({
    dni: '',
    nombres: '',
    telefono: '',
    idRol: '',
    usuario: '',
    contraseña: ''
  })

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">Agregar Personal</p>
    </div>
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos(prev => ({ ...prev, [name]: value }))
  }

  const handleDropChange = (e: DropdownChangeEvent) => {
    setDatos(prev => ({ ...prev, idRol: e.value.id }))
  }

  const handleAgregar = async() => {
    try {
      await axiosInstance.post('postPersonal',datos)
      setDatos({
        dni: '',
        nombres: '',
        telefono: '',
        idRol: '',
        usuario: '',
        contraseña: ''
      });
      ListaPersonal();
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
          <label className="text-[#4F9CD7] text-[1.5rem] font-semibold">Datos Personales</label>

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
            <label className="text-[#4F9CD7] font-medium">Nombre Completo</label>
            <InputText
              name="nombres"
              value={datos.nombres}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre completo..."
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-[#4F9CD7] font-medium">Teléfono</label>
            <InputText
              name="telefono"
              value={datos.telefono}
              onChange={handleInputChange}
              placeholder="Ingrese el teléfono..."
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-[#4F9CD7] font-medium">Rol</label>
            <Dropdown
              placeholder="Seleccione Rol..."
              optionLabel="nombre"
              options={roles}
              value={roles.find((opt:{id:string,nombre:string}) => opt.id === datos.idRol)}
              onChange={handleDropChange}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* CREDENCIALES */}
        <div className="flex flex-col p-6 space-y-4 pt-0">
          <label className="text-[#4F9CD7] text-[1.5rem] font-semibold">Credenciales</label>

          <div>
            <label className="text-[#4F9CD7] font-medium">Usuario</label>
            <InputText
              name="usuario"
              value={datos.usuario}
              onChange={handleInputChange}
              placeholder="Ingrese el usuario..."
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-[#4F9CD7] font-medium">Contraseña</label>
            <InputText
              name="contraseña"
              value={datos.contraseña}
              onChange={handleInputChange}
              placeholder="Ingrese la contraseña..."
              type="password"
              className="mt-2 w-full"
            />
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
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
