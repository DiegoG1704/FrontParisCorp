"use client";

import React from 'react'
import { Dialog } from 'primereact/dialog'
import { useAppContext } from '@/app/Provider/AppContext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Props {
    Close: () => void;
    Open: boolean;
    Datos:any;
}

export default function DialogSelect({Close,Open,Datos}:Props) {
    const {personal}=useAppContext();
    
    const Titulo = () => (
        <div className="flex items-center gap-3">
        <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
        <p className="text-[#BACD00] text-[1.5rem] font-semibold">Seleccionar Usuario</p>
        </div>
    )
  return (
    <Dialog
        onHide={Close}
        visible={Open}
        header={Titulo}
        style={{ width: '500px' }}
        className="p-fluid"
    >
        <div className='m-2'>
            <label className="text-[#4F9CD7] font-medium mb-2">Tipo</label>
            <Dropdown
                options={personal}
                optionLabel='nombre_rol'
                placeholder='Selecciona personal'
            />
        </div>
        <div className='m-2'>
            <label className="text-[#4F9CD7] font-medium">Vista Previa</label>
            <div className='bg-[#4F9CD7] h-[20rem] mt-2'>
            </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-5">
            <Button onClick={Close} label="Cancelar" className="p-button-text" />
            <Button label="Enviar" className='bg-[#BACD00] border-[#BACD00] text-white' />
        </div>
    </Dialog>
  )
}
