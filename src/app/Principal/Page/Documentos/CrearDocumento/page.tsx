"use client";

import { useAppContext } from '@/app/Provider/AppContext'
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react'

export default function CrearDocumento() {
    const {user}=useAppContext();
    const isDark = user?.estadoModo !== "1";
    console.log(user);

    const options =[
      {name:'certificado', id:1},
      {name:'documento', id:1}
    ]
    
  return (
    <div
      className={`flex flex-col p-10 min-h-screen gap-8 transition-colors duration-300 ${
        isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#4F9CD7]">
          Crear Documentos
        </h1>
        <p className={`text-lg mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Crea tus certificados y documentos
        </p>
      </div>
      <div>
        <Link href={'/Principal/Page/Documentos'} className="no-underline">
          <Button
            icon="pi pi-arrow-left"
            className={`text-white transition ${isDark ? "bg-[#4F9CD7] border-[#4F9CD7]":"bg-[#BACD00] border-[#BACD00]" }`}
            label="Regresar"
            // onClick={() => setVisible(true)}
          />
        </Link>
      </div>

      <div className='flex flex-col'>
        <div className='flex'>
            <div className='p-2'>
              <label className="text-[#4F9CD7] font-medium">Nombre</label>
              <InputText
                  name="nombres"
                  // value={datos.nombres}
                  // onChange={handleInputChange}
                  placeholder="Ingrese el nombre completo..."
                  className="mt-2 w-full"
              />
          </div>
          <div className='p-2 flex flex-col'>
              <label className="text-[#4F9CD7] font-medium mb-2">tipo</label>
              <Dropdown
                  options={options}
                  optionLabel='name'
                  placeholder='selecciona el tipo'
              />
          </div>
        </div>
        
        <div className='p-2'>
            <label className="text-[#4F9CD7] font-medium">Descripcion</label>
            <InputTextarea
                // value={datos.nombres}
                // onChange={handleInputChange}
                placeholder="Ingrese la descripcion del documento.."
                className="mt-2 w-full"
            />
        </div>
      </div>
      <label className="text-[#4F9CD7] font-medium">Vista Previa</label>
    </div>
  )
}
