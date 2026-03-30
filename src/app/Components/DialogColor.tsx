'use client'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import axiosInstance from '../Herramientas/axiosToken'
import { useAppContext } from '../Provider/AppContext'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogColor({ Close, Open }: Props) {
  const {Listacolor}=useAppContext();
  const [color,setColor]= useState('')

  const handleSubmit = async()=>{
    console.log('Color',color);
    const nombre = color
    try {
      await axiosInstance.post('PostColor',{nombre})
      console.log('exito');
      setColor('')
      Listacolor();
      Close();
    } catch (error) {
      console.log('Error',error);
    }
  }
  
  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Agregar Color
      </p>
    </div>
  )

  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[25rem]">
        <div className='flex flex-col'>
            <label className="text-[#4F9CD7] font-medium">Nombre de color</label>
            <InputText
                name="modelo"
                placeholder="Nombre..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full mt-1"
            />
        </div>
        <div className='flex justify-end mt-5'>
            <Button 
              label='Agregar' 
              className='bg-[#BACD00] border-[#BACD00] text-white'
              onClick={handleSubmit}
            />
        </div>
    </Dialog>
  )
}
