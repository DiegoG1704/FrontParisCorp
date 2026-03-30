'use client'

import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
}

interface Ruta {
  id: number;
  nombre: string;
  icono: string;
}

export default function DialogCrearRol({ Close, Open }: Props) {
  const { rutas, ListaRoles } = useAppContext();
  const [selectedRutas, setSelectedRutas] = useState<number[]>([])
  const [nombreRol, setNombreRol] = useState<string>('')

  const toggleRuta = (id: number) => {
    setSelectedRutas(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = async() => {
    const data = {
      nombre: nombreRol,
      rutas: selectedRutas.map(id => ({ id }))
    };
    try {
      const result= await axiosInstance.post('postRol',data)
      Close();
      ListaRoles();
      setNombreRol('');
      setSelectedRutas([]);
    } catch (error) {
      console.log(error);
    }
  };

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">Crear Rol</p>
    </div>
  )

  return (
    <Dialog
      onHide={Close}
      visible={Open}
      header={Titulo}
      style={{ width: '600px' }}
      className="p-fluid"
    >
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex flex-col p-6">
          <label className="text-[#4F9CD7] font-medium">Nombre de Rol</label>
          <InputText
            placeholder="Ingrese un nombre para el rol"
            className="mt-2 mb-6"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
          />

          <label className="text-[#4F9CD7] font-medium mb-3">Vistas disponibles</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rutas.map((ruta: Ruta) => (
              <div
                key={ruta.id}
                className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition"
              >
                <Checkbox
                  inputId={`ruta-${ruta.id}`}
                  checked={selectedRutas.includes(ruta.id)}
                  onChange={() => toggleRuta(ruta.id)}
                />
                <i className={`${ruta.icono} text-[#BACD00] text-lg`} />
                <label htmlFor={`ruta-${ruta.id}`} className="text-sm text-black">
                  {ruta.nombre}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className='flex p-6 justify-end'>
          <Button
            label='Crear'
            className="bg-[#BACD00] w-[200px] text-white border-[#BACD00]"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Dialog>
  )
}
