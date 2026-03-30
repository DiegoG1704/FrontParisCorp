'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React from 'react'
import DialogProductos from './Components/DialogProductos'
import { useAppContext } from '@/app/Provider/AppContext'

interface Talla {
  id: string;
  talla: string;
}

interface Producto {
  id: string;
  nombre: string;
  color: string;
  genero: string;
  tallas: Talla[];
}

interface Modelo {
  code: string;
  name: string;
  precioMN: string;
  precioMY: string;
  material: string;
  productos: Producto[];
}

export default function Page() {
  const{modelo,visible,setVisible,setSelectProd, usuario}=useAppContext();
  const user = usuario?.datosUsuario;
  const isDark = user?.estadoModo !== "1";
  const Acciones = () => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="bg-yellow-100 border-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition duration-200"
        tooltip="Editar"
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-trash"
        className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
        tooltip="Eliminar"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  const Tallas = (rowdata:any) => (
    <div className="flex">
      <Button
        icon="pi pi-objects-column"
        className="bg-purple-200 border-purple-200 text-purple-700 rounded-md hover:bg-purple-400 transition duration-200"
        tooltip="ver Productos"
        tooltipOptions={{ position: 'top' }}
        onClick={()=>{setVisible(true);setSelectProd(rowdata)}}
      />
    </div>
  );

  return (
    <div className={`flex flex-col p-10 ${isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"}`}>
      <strong className={`text-[40px] ${isDark ? "text-[#4F9CD7]" : "text-black"}`}>Lista de Productos Registrados</strong>
      <span className={`text-[20px] pt-4 ${isDark ? "text-gray-300" : "text-black"}`}>En este módulo usted podrá ver la lista de producción</span>

      <div className="flex flex-col lg:flex-row mt-10 justify-between gap-4">
        <InputText placeholder="Buscar..." className={`h-12 w-[30rem] ${isDark ? "bg-[#1E293B] text-white border-gray-600" : "bg-white text-black"}`} />

        <div className="flex gap-2">
          <Button icon="pi pi-file-excel" label="Exportar Excel" className={`bg-transparent border-transparent ${isDark ? "text-[#4F9CD7] bg-[#1E293B] border-[#4F9CD7]" : "text-[#4F9CD7] bg-white border-[#4F9CD7]"}`}/>
          
          <Link href="/Principal/Page/Productos/CrearProductos" passHref legacyBehavior>
            <Button icon="pi pi-plus" className="bg-[#BACD00] text-white border-[#BACD00]">
              Agregar Productos
            </Button>
          </Link>
        </div>
      </div>

      <div className="card mt-6">
        <DataTable
          value={modelo}
          tableStyle={{ minWidth: '50rem' }}
          className="custom-datatable"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column body={(_, { rowIndex }) => rowIndex + 1} header="Nº" />
          <Column field="nombre" header="Modelo" />
          <Column field="precioU" header="Precio Unitario Min"></Column>
          <Column field="precioM" header="Precio Mayor Min"></Column>
          <Column field="material" header="Material"></Column>
          <Column body={(rowdata)=>Tallas(rowdata)} header="Detalles" />
          <Column body={Acciones} header="Acciones" />
        </DataTable>
      </div>
      <DialogProductos Open={visible} Close={()=>setVisible(false)}/>
    </div>
  );
}
