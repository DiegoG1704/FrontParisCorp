'use client'

import { Dialog } from 'primereact/dialog';
import React from 'react'
import DetallesContent from './CardDetalles';
import { InputText } from 'primereact/inputtext';


interface Props {
    Open: boolean;
    Close: () => void;
}
export default function DialogDetalles({ Close, Open}: Props) {
    const Titulo = () => (
        <div className="flex items-center gap-3">
          <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl"></i>
          <p className="text-[#BACD00] text-[1.5rem] font-semibold">
            Detalles de Prendas de Produccion
          </p>
        </div>
      );
  return (
    <Dialog visible={Open} onHide={Close} header={Titulo} style={{ width: '88%' }}>
      <span>En esta modulo podras vizualizar informacion acerca de las prendas en producción</span>
      <div className="flex justify-end py-4">
          <InputText placeholder='Buscar...' className='w-[30%]'/>
      </div>
      <div className='p-4'>
        <DetallesContent/>
      </div>
    </Dialog>
  )
}
