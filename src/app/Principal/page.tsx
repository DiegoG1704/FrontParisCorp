'use client'

import React, { useRef, useState } from 'react';
import { useAppContext } from '../Provider/AppContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './styles/styles.css'
import Link from 'next/link';
import DialogDetalles from '../Components/DialogDetalles';; // 👈 importa el tipo correcto
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useProduccionContext } from '../Provider/AppContextProducc';

export default function Page() {
  const [visible,setVisible]=useState(false)
  const {produccion,setSelectPrenda} = useAppContext();
  const {Produccion}=useProduccionContext();

 // Devuelve el nombre del estado con estilo de color
  const getNombreEstado = (id: string | number) => {
    const estadoMap: { [key: number]: { nombre: string; color: string; icon: string } } = {
      1: { nombre: 'Sin Iniciar', color: 'bg-gray-500', icon: 'pi pi-clock' },
      2: { nombre: 'En Proceso', color: 'bg-blue-500', icon: 'pi pi-spinner' },
      3: { nombre: 'Pausado', color: 'bg-yellow-500', icon: 'pi pi-pause' },
      4: { nombre: 'Suspendido', color: 'bg-red-500', icon: 'pi pi-check' },
      5: { nombre: 'Finalizado', color: 'bg-green-500', icon: 'pi pi-check' },
    };

    const estadoId = parseInt(id as string);
    const estado = estadoMap[estadoId];

    return (
      <span
        className={`inline-flex items-center gap-2 ${estado?.color || 'bg-black'} text-white px-3 
        py-1 rounded-full shadow-sm text-[1rem] font-medium`}
      >
        <i className={estado?.icon || 'pi pi-question'}></i>
        {estado?.nombre || 'Desconocido'}
      </span>
    );
  };

  // Devuelve el nombre del área con estilo de color
  const getNombreArea = (id: string | number) => {
    const areaMap: { [key: number]: { nombre: string; color: string; icon: string } } = {
      1: { nombre: 'Sin Iniciar', color: 'bg-gray-400', icon: 'pi pi-clock' },
      2: { nombre: 'Corte', color: 'bg-purple-500', icon: 'pi pi-scissors' },
      3: { nombre: 'Confección', color: 'bg-orange-500', icon: 'pi pi-pencil' },
      4: { nombre: 'Acabados', color: 'bg-blue-400', icon: 'pi pi-palette' },
      5: { nombre: 'Finalizado', color: 'bg-green-600', icon: 'pi pi-check-circle' },
    };

    const areaId = parseInt(id as string);
    const area = areaMap[areaId];

    return (
      <span
        className={`inline-flex items-center gap-2 ${area?.color || 'bg-black'} text-white px-3 
        py-1 rounded-full shadow-sm text-[1rem] font-medium`}
      >
        <i className={area?.icon || 'pi pi-question'}></i>
        {area?.nombre || 'Desconocido'}
      </span>
    );
  };


  const Detalles = (rowData:any)=>{
    return(
      <Button 
      icon='pi pi-clipboard'
      className='bg-white border-[#27D733] text-[#27D733] rounded-[30px]'
      onClick={()=>{setVisible(true),setSelectPrenda(rowData)}}
      />
    )
  }

  const toast = useRef<Toast>(null);

  const acceptIniciar = async (rowData: any) => {
    await Produccion(2, 2);
    toast.current?.show({ severity: 'success', summary: 'Producción Iniciada', detail: `Lote Iniciado`, life: 3000 });
  };

  const acceptPausar = async (rowData: any) => {
    await Produccion(rowData.area, 3);
    toast.current?.show({ severity: 'success', summary: 'Producción Pausada', detail: `Lote Pausado`, life: 3000 });
  };

  const acceptSuspendido = async (rowData: any) => {
    await Produccion(rowData.area, 4);
    toast.current?.show({ severity: 'success', summary: 'Producción Suspendida', detail: `Lote Suspendido`, life: 3000 });
  };

  const acceptReiniciar = async (rowData: any) => {
    await Produccion(rowData.area, 2);
    toast.current?.show({ severity: 'success', summary: 'Producción Reiniciada', detail: `Lote Reanudado`, life: 3000 });
  };


  const reject = () => {
      toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const confirmPlay = (rowData: any) => {
    confirmDialog({
      message: '¿Desea Iniciar la Producción de este Lote?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptIniciar(rowData),
      reject,
    });
  };

  const confirmStop = (rowData: any) => {
    confirmDialog({
      message: '¿Desea Pausar la Producción de este Lote?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptPausar(rowData),
      reject
    });
  };

  const confirmDelete = (rowData: any) => {
    confirmDialog({
      message: '¿Desea Suspender la Producción de este Lote?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptSuspendido(rowData),
      reject
    });
  };

  const confirmReiniciar = (rowData: any) => {
    confirmDialog({
      message: '¿Desea Reiniciar la Producción de este Lote?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptReiniciar(rowData),
      reject
    });
  };

  const Acciones = (rowData: any) => {
    const estado = parseInt(rowData.estado);

      return (
        <div className="flex gap-2">
          {estado === 1 && (
            <Button
              onClick={()=>{confirmPlay(rowData),setSelectPrenda(rowData)}}
              icon="pi pi-play"
              className="bg-white border-green-500 text-green-500 rounded-full"
              tooltip="Iniciar Producción"
              tooltipOptions={{ position: 'top' }}
            />
          )}
          {estado === 2 && (
            <>
              <Button
                onClick={()=>{confirmStop(rowData),setSelectPrenda(rowData)}}
                icon="pi pi-pause"
                className="bg-white border-yellow-500 text-yellow-500 rounded-full"
                tooltip="Pausar Producción"
                tooltipOptions={{ position: 'top' }}
              />
              <Button
                onClick={()=>{confirmDelete(rowData),setSelectPrenda(rowData)}}
                icon="pi pi-times"
                className="bg-white border-red-500 text-red-500 rounded-full"
                tooltip="Suspender Producción"
                tooltipOptions={{ position: 'top' }}
              />
            </>
          )}
          {estado === 3 && (
            <>
              <Button
                onClick={()=>{confirmReiniciar(rowData),setSelectPrenda(rowData)}}
                icon="pi pi-play"
                className="bg-white border-green-500 text-green-500 rounded-full"
                tooltip="Reanudar Producción"
                tooltipOptions={{ position: 'top' }}
              />
              <Button
                onClick={()=>{confirmDelete(rowData),setSelectPrenda(rowData)}}
                icon="pi pi-times"
                className="bg-white border-red-500 text-red-500 rounded-full"
                tooltip="Suspender Producción"
                tooltipOptions={{ position: 'top' }}
              />
            </>
          )}
        </div>
      );
    };

  return (
    <div className="flex flex-col p-10">
      <Toast ref={toast} />
      <ConfirmDialog />
      <strong className='text-[40px] text-black'>Lista de Produccion</strong>
      <span className='text-[20px] text-black pt-4'>En este módulo usted podrá ver la lista de produccion </span>
      <div className='flex mt-20 justify-between'>
        <InputText placeholder='Buscar...' className='h-12 w-[30rem]'/>
        <div className='flex'>
          <Button icon='pi pi-file-excel' label='Exportar Excel' className='text-[#4F9CD7] bg-[white] border-[#4F9CD7] mr-2'/>
          <Button icon='pi pi-plus' className='bg-[#BACD00] text-[white] border-[#BACD00]'>
            <Link href={'/Principal/Page/CrearProduccion'} className='text-white duration-200 no-underline'><span>Iniciar Produccion</span></Link>
          </Button>
        </div>
      </div>
      <div className="card mt-6">
        <DataTable
          value={produccion}
          tableStyle={{ minWidth: '50rem' }}
          className="tabla-punteada"
          paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="codigoProduccion" header="Codigo" />
          <Column field="nombreModelo" header="Modelo" />
          <Column field="cantidad" header="Cantidad Proyectada" />
          <Column field="fecha" header="Fecha de Inicio" />
          <Column header="Área" body={(rowData) => getNombreArea(rowData.area)} />
          <Column header="Estado" body={(rowData) => getNombreEstado(rowData.estado)} />
          <Column field="quantity" header="Fecha Fin" />
          <Column body={(rowData)=>Detalles(rowData)} header="Detalle" />
          <Column body={(rowData) => Acciones(rowData)} header="Acciones" />
        </DataTable>
      </div>
      <DialogDetalles Open={visible} Close={()=>setVisible(false)}/>
    </div>
  );
}
