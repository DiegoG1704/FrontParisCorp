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

export default function DialogMaterial({ Close, Open }: Props) {
  const [material,setMaterial]= useState('')
  const {Listamaterial}=useAppContext();

  const handleSubmit = async()=>{
    console.log('Color',material);
    const nombre = material
    try {
      await axiosInstance.post('PostMaterial',{nombre})
      console.log('exito');
      setMaterial('')
      Listamaterial();
      Close();
    } catch (error) {
      console.log('Error',error);
    }
  }
  
  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Agregar Material
      </p>
    </div>
  )

  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[25rem]">
        <div className='flex flex-col'>
            <label className="text-[#4F9CD7] font-medium">Nombre de Material</label>
            <InputText
                name="modelo"
                placeholder="Nombre..."
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
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
