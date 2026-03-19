'use client'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
  tallas: any
  setTallas: React.Dispatch<React.SetStateAction<any>>
}


export default function DialogTallas({ Close, Open,tallas,setTallas }: Props) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTallas((prev:any)=> ({ ...prev, [name]: value }));
  };

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Lista de Tallas
      </p>
    </div>
  ); 
  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[20rem]">
      <div className="flex flex-col gap-4 mt-2 bg-white p-5 rounded-lg shadow-sm">
        <div className='flex justify-between items-center'>
          <label htmlFor="tallaS" className="block text-[1rem] font-medium mb-1">Talla S</label>
          <InputText
            id="tallaS"
            name="1"
            onChange={handleInputChange}
            value={tallas[1]}
            className="w-16"
          />
        </div>

        <div className='flex justify-between items-center'>
          <label htmlFor="tallaM" className="block text-[1rem] font-medium mb-1">Talla M</label>
          <InputText
            id="tallaM"
            name="2"
            onChange={handleInputChange}
            value={tallas[2]}
            className="w-16"
          />
        </div>

        <div className='flex justify-between items-center'>
          <label htmlFor="tallaL" className="block text-[1rem] font-medium mb-1">Talla L</label>
          <InputText
            id="tallaL"
            name="3"
            onChange={handleInputChange}
            value={tallas[3]}
            className="w-16"
          />
        </div>

        <div className='flex justify-between items-center'>
          <label htmlFor="tallaXL" className="block text-[1rem] font-medium mb-1">Talla XL</label>
          <InputText
            id="tallaXL"
            name="4"
            onChange={handleInputChange}
            value={tallas[4]}
            className="w-16"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
            label="Guardar"
            className="w-[120px] h-[42px] bg-[#BACD00] border-[#BACD00] text-white"
            onClick={Close}
        />
    </div>
    </Dialog>
  );
}
