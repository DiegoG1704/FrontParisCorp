'use client'

import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
  Datos: any
}

export default function DialogEdit({ Close, Open, Datos }: Props) {
  const {roles,ListaPersonal}= useAppContext();
  console.log('datos',Datos);
  const opciones = [
    { id: 1, nombre: 'Activo' },
    { id: 2, nombre: 'Suspendido' },
    { id: 3, nombre: 'Despedido' }
  ]
  
  const [datos, setDatos] = useState({
    idRol: ''
  })

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">Editar datos del Personal</p>
    </div>
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos(prev => ({ ...prev, [name]: value }))
  }

  const handleDropChange = (e: DropdownChangeEvent) => {
    setDatos(prev => ({ ...prev, idRol: e.value.id }))
  }

  useEffect(() => {
    if (Datos) {
        setDatos({
        dni: Datos.dni?.toString() || '',
        nombres: Datos.nombres || '',
        telefono: Datos.telefono || '',
        idRol: roles.find((r:{id:string,nombre:string}) => r.nombre === Datos.rol)?.id || '',
        })
    }
    }, [Datos, roles])

  const handleGuardar = async() => {
    try {
    //   const result = await axiosInstance.post('postPersonal',datos)
      setDatos({
        dni: '',
        nombres: '',
        telefono: '',
        idRol: '',
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
        {/* DATOS PERSONALES */}
        {/* <div className="flex flex-col p-6 space-y-4">
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
        </div> */}
        <div className="flex flex-col p-6 space-y-4">
          <div>
            <label className="text-[#4F9CD7] font-medium">Estado</label>
            <Dropdown
              placeholder="Seleccione Rol..."
              optionLabel="nombre"
              options={opciones}
              value={opciones.find((opt:{id:number,nombre:string}) => opt.id === datos.idRol)}
              onChange={handleDropChange}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={Close} label="Cancelar" className="p-button-text" />
          <Button onClick={handleGuardar} label="Editar" className='bg-[#BACD00] border-[#BACD00] text-white' />
        </div>
    </Dialog>
  )
}
