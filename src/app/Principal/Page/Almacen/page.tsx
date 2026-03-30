'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { useAppContext } from '@/app/Provider/AppContext';
import { Button } from 'primereact/button';
import DialogProductos from './Components/DialogProductos';

export default function Page() {
    const {prenda,usuario}=useAppContext();
    const [selectedTallas, setSelectedTallas] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);
    const user = usuario?.datosUsuario;
    const isDark = user?.estadoModo !== "1";

    const DetallesButton = (rowdata: any) => (
      <Button
        onClick={() => {setSelectedTallas(rowdata);setVisible(true)}}
        className="text-blue-600 bg-transparent"
      >
        Ver tallas
      </Button>
    );

    

    const tallasTotal = (rowdata: any) => {
      const totalTallas = rowdata?.tallas?.reduce(
        (acc: number, talla: any) => acc + Number(talla.cantidad),
        0
      )
      return(
        <span>
          {totalTallas}
        </span>
    )};

  return (
    <div className={`flex h-full flex-col p-10 ${isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"}`}>
      <strong className={`text-[40px] text-[#4F9CD7]`}>Almacen</strong>
      <span className={`text-[20px] pt-4 ${isDark ? "text-gray-300" : "text-black"}`}>En este módulo usted podrá ver los productos almacenados</span>
      <div className="flex flex-col lg:flex-row mt-10">
        <InputText placeholder="Buscar..." className={`h-12 w-[30rem] ${isDark ? "bg-[#1E293B] text-white border-gray-600" : "bg-white text-black"}`} />
      </div>
      <div className="card my-10 h-full">
            <DataTable
            value={prenda}
            tableStyle={{ minWidth: '50rem' }}
            className="custom-datatable"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            >
            <Column body={(_, { rowIndex }) => rowIndex + 1} header="Nº" />
            <Column field="nombre" header="Nombre" />
            <Column field='StockVen' header="Stock(Vendidos)"></Column>
            <Column body={(rowData)=>tallasTotal(rowData)} header="Stock Total"></Column>
            <Column body={(rowData)=>DetallesButton(rowData)} header="Detalles" />
            </DataTable>
        </div>
        <DialogProductos Open={visible} Close={()=>setVisible(false)} Datos={selectedTallas}/>
    </div>
  )
}
