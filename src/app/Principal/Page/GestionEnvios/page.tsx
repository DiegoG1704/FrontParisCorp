'use client'

import { Button } from 'primereact/button';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useState,useRef } from 'react'
import DialogEstado1 from './Components/DialogEstado1';
import DialogEstado2 from './Components/DialogEstado2';
import Link from 'next/link';
import { useAppContext } from '@/app/Provider/AppContext';
import { Toast } from 'primereact/toast';

export default function Page() {
  const {pedidos,setSelectPedidos,ListaPedidos} = useAppContext()
  const[visible,setVisible]=useState(false)
  const[select,setSelect]=useState([])
  const[visible2,setVisible2]=useState(false)
  const [search, setSearch] = useState("");
  const toast = useRef<Toast>(null);

  const handleRefresh = async () => {
    try {
      await ListaPedidos();

      toast.current?.show({
        severity: 'success',
        summary: 'Lista actualizada',
        detail: 'Los pedidos fueron actualizados correctamente',
        life: 3000
      });

    } catch (error) {
      console.log(error);
      
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar la lista',
        life: 3000
      });
    }
  };

    const pedidosFiltrados = pedidos.filter((pedido:any) => {
      const text = search.toLowerCase();

      const estadoTexto =
        pedido.estado === "1"
          ? "en local"
          : pedido.estado === "2"
          ? "en camino"
          : pedido.estado === "3"
          ? "finalizado"
          : "";

      return (
        pedido.fecha?.toLowerCase().includes(text) ||
        estadoTexto.includes(text)
      );
    });
    const Productos = (rowData: any) => (
      <Link href={`/Principal/Page/GestionEnvios/Detalles?id=${rowData.id}`}>
        <Button
          icon="pi pi-inbox"
          label="Ver Detalles"
          className="bg-blue-100 border-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200 px-3 py-2 text-sm"
          tooltip="Ver detalles del pedido"
          tooltipOptions={{ position: 'top' }}
          onClick={()=>setSelectPedidos(rowData)}
        />
      </Link>
    );      

    const tipoVenta = (rowData: any) => {
      let bgColor = '';
      let textColor = '';
      let text = '';
      switch (rowData.tipoVenta) {
        case "1":
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          text = 'Pedido'
          break;
        case "3":
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
          text = 'Preventa'
          break;
        default:
          bgColor = 'bg-gray-100';
          textColor = 'text-gray-800';
          text = 'No Encontrado'
          break;
        }
          return (
          <Button
            // icon="pi pi-truck"
            label={text}
            className={`${bgColor} ${textColor} border-transparent rounded-md transition duration-200 px-3 py-2 text-sm`}
          />
        );
      
    }
    const Estado = (rowData: any) => {
      const handleClick = () => {
        if (rowData.estado === "2") {
          setVisible2(true);
          setSelect(rowData);
        } else if (rowData.estado === "1") {
          setVisible(true);
          setSelect(rowData);
        }
      };
    
      let bgColor = '';
      let textColor = '';
      let text = '';
      let disabled = false;
    
      switch (rowData.estado) {
        case "3":
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          text = 'Finalizado'
          disabled = true;
          break;
        case "2":
          bgColor = 'bg-yellow-100';
          textColor = 'text-yellow-800';
          text = 'En Camino'
          break;
        case "1":
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
          text = 'En Local'
          break;
        case "4":
          bgColor = 'bg-red-100';
          textColor = 'text-red-800';
          text = 'Anulado'
          disabled = true;
          break;
        default:
          bgColor = 'bg-gray-100';
          textColor = 'text-gray-800';
          text = 'No Encontrado'
          break;
      }
    
      return (
        <Button
          icon="pi pi-truck"
          label={text}
          className={`${bgColor} ${textColor} border-transparent rounded-md transition duration-200 px-3 py-2 text-sm`}
          tooltip={disabled ? 'Pedido finalizado' : 'Cambiar estado del pedido'}
          tooltipOptions={{ position: 'top' }}
          onClick={handleClick}
          disabled={disabled}
        />
      );
    };
    
    
  return (
    <div className="flex flex-col p-10 bg-gray-50 min-h-screen">
      <Toast ref={toast} />
      <strong className="text-[40px] text-[#4F9CD7]">Gestión de Envios</strong>
      <span className="text-[20px] text-black pt-2">
        En este módulo se gestionara los pedidos enviados
      </span>
      <div className="flex flex-col lg:flex-row mt-10 justify-between gap-4">
        <InputText 
          placeholder="Buscar..." 
          className="h-12 w-full lg:w-[30rem]" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button 
          icon='pi pi-refresh'
          className="mr-2 bg-transparent border-transparent text-[#BACD00]"
          tooltip="Actualizar lista"
          tooltipOptions={{ position: 'top' }}
          onClick={handleRefresh}
        />
      </div>
      <div className="card mt-6">
        <DataTable
          value={pedidosFiltrados}
          tableStyle={{ minWidth: '50rem' }}
          className="custom-datatable"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column
            header="Code"
            body={(rowData, options) => options.rowIndex + 1}
          />
          <Column field="fecha" header="Fecha de Compra" />
          <Column body={tipoVenta} header="Tipo de Venta" />
          <Column body={Estado} header="Estado"></Column>
          <Column body={Productos} header="Productos"></Column>
        </DataTable>
      </div>
      <DialogEstado1 Open={visible} Close={()=>setVisible(false)} Datos={select}/>
      <DialogEstado2 Open={visible2} Close={()=>setVisible2(false)} Datos={select}/>
    </div>
  )
}
