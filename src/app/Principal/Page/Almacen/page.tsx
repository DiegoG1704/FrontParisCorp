'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { useAppContext } from '@/app/Provider/AppContext';
import { Button } from 'primereact/button';
import DialogProductos from './Components/DialogProductos';

export default function page() {
    const {prenda}=useAppContext();
    const [selectedTallas, setSelectedTallas] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);

    const DetallesButton = (rowdata: any) => (
      <Button
        onClick={() => {setSelectedTallas(rowdata),setVisible(true)}}
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
    <div className="flex flex-col p-10">
      <strong className="text-[40px] text-black">Almacen</strong>
      <span className="text-[20px] text-black pt-4">En este módulo usted podrá ver los productos almacenados</span>
      <div className="flex flex-col lg:flex-row mt-10">
        <InputText placeholder="Buscar..." className="h-12 w-full lg:w-[30rem]" />
      </div>
      <div className="card my-10">
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
