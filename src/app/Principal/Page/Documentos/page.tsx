"use client";

import { useAppContext } from '@/app/Provider/AppContext';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import React, { useState } from 'react';
import DialogSelect from './Components/DialogSelect';

export default function Page() {
  const { user } = useAppContext();
  const isDark = user?.estadoModo !== "1";
  const[visible,setVisible]=useState(false)
  const[select,setSelect]=useState(null)

  const Acciones = (rowData: any) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-send"
        className="bg-blue-100 border-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition duration-200"
        tooltip="Contacto"
        tooltipOptions={{ position: 'top' }}
        onClick={()=>{
          setSelect(rowData);
          setVisible(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
        tooltip="Eliminar"
        tooltipOptions={{ position: 'top' }}
        // onClick={() => {
        //   setVisibleDelete(true)
        //   setSelect(rowData)
        // }}
      />
    </div>
  )

  return (
    <div
      className={`flex flex-col p-10 min-h-screen gap-8 transition-colors duration-300 ${
        isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#4F9CD7]">
          Documentos y Certificados
        </h1>
        <p className={`text-lg mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Administra tus certificados y documentos generados
        </p>
      </div>
      <div className='flex justify-end'>
        <Button 
          icon='pi pi-refresh'
          className={`mr-2 bg-transparent border-transparent ${isDark ? "text-[#4F9CD7]":"text-[#BACD00]" }`}
          tooltip="Actualizar lista"
          tooltipOptions={{ position: 'top' }}
        />
        <Link href={'/Principal/Page/Documentos/CrearDocumento'} className="no-underline">
          <Button
            icon="pi pi-plus"
            className={`text-white transition ${isDark ? "bg-[#4F9CD7] border-[#4F9CD7]":"bg-[#BACD00] border-[#BACD00]" }`}
            label="Crear documentos"
          />
        </Link>
        
      </div>
      <div className="card my-10">
        <DataTable
            tableStyle={{ minWidth: '60rem' }}
            className="custom-datatable"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            value={[{},{}]}
        >
          <Column field="id" header="ID" />
          <Column field="id" header="Nombre" />
          <Column field="id" header="Tipo" />
          <Column field="id" header="Vista Previa" />
          <Column body={Acciones} header="Acciones" />
        </DataTable>
      </div>
      <DialogSelect Open={visible} Close={()=>setVisible(false)} Datos={select}/>
    </div>
  );
}