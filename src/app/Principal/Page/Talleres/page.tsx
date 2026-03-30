'use client'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'
import DialogAgregar from './Components/DialogAgregar'
import DialogDetalles from './Components/DialogDetalles'
import { useAppContext } from '@/app/Provider/AppContext'
import DialogDelete from './Components/DialogDelete'
import DialogEdit from './Components/DialogEdit'
import { Toast } from 'primereact/toast'

export default function Page() {
    const {taller,ListaTaller,usuario}=useAppContext();
    const[visibleAgregar,setVisibleAgregar]=useState(false)
    const[visibleDetalles,setVisibleDetalles]=useState(false)
    const[visibleDelete,setVisibleDelete]=useState(false)
    const[visibleEdit,setVisibleEdit]=useState(false)
    const[select,setSelect]=useState([])
    const toast = useRef<Toast>(null);
    const user = usuario?.datosUsuario;
    const isDark = user?.estadoModo !== "1";
    const handleRefresh = async () => {
        try {
          await ListaTaller();
    
          toast.current?.show({
            severity: 'success',
            summary: 'Lista actualizada',
            detail: 'La lista de talleres fueron actualizados correctamente',
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

    const Acciones = (rowData:any) => (
        <div className="flex gap-2">
            <Button
              icon="pi pi-pencil"
              className="bg-yellow-100 border-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition duration-200"
              tooltip="Editar"
              tooltipOptions={{ position: 'top' }}
              onClick={()=>{
                setVisibleEdit(true)
                setSelect(rowData)
              }}
            />
            <Button
              icon="pi pi-trash"
              className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
              tooltip="Eliminar"
              tooltipOptions={{ position: 'top' }}
              onClick={()=>{
                setVisibleDelete(true)
                setSelect(rowData)
              }}
            />
        </div>
    );

    const Detalles = (rowData: any) => (
        <div className="flex gap-2">
          <Button
            icon="pi pi-id-card"
            // className="bg-green-100 border-green-100 text-green-700 rounded-md hover:bg-green-200 transition duration-200"
            className="bg-blue-100 border-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200"
            tooltip="Ver detalles del usuario"
            tooltipOptions={{ position: 'top' }}
            label="Ver Detalles"
            onClick={()=>{
              setVisibleDetalles(true)
              setSelect(rowData)
            }}
          />
    </div>
    )

    const Estado = (rowData: any) => {
        const estadoMap: { [key: number]: { label: string; bg: string; text: string } } = {
        1: { label: 'Activo', bg: 'bg-green-100', text: 'text-green-800' },
        2: { label: 'Descanzo', bg: 'bg-yellow-100', text: 'text-yellow-800' },
        3: { label: 'Retirado', bg: 'bg-blue-100', text: 'text-blue-800' },
        };

        const estado = estadoMap[rowData.estado] || {
        label: 'Desconocido',
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        };

        return (
        <span className={`${estado.bg} ${estado.text} border-transparent rounded-md transition duration-200 px-3 py-2`}>
            {estado.label}
        </span>
        );
    };
  return (
    <div className={`flex flex-col p-10 min-h-screen ${isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"}`}>
      <Toast ref={toast} />
      
      <h1 className={`text-[40px] font-bold text-[#4F9CD7]`}>Talleres de Confeccion</h1>
      <p className={`text-[20px] pt-4 ${isDark ? "text-gray-300" : "text-black"}`}>
        En este módulo se gestionan los talleres registrados.
      </p>

      <div className="flex flex-col lg:flex-row mt-10 justify-between gap-4">
        <InputText 
          placeholder="Buscar por nombre o DNI..." 
          className={`h-12 w-[30rem] rounded-md px-3 ${isDark ? "bg-[#1E293B] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`} 
        />
        <div className="flex gap-2">
          <Button 
            icon='pi pi-refresh'
            className={`bg-transparent border-transparent ${isDark ? "text-[#BACD00]" : "text-[#BACD00]"}`}
            tooltip="Actualizar lista"
            tooltipOptions={{ position: 'top' }}
            onClick={handleRefresh}
          />
          <Button
            icon="pi pi-plus"
            className={`bg-[#BACD00] text-white border-[#BACD00] hover:bg-[#aab800] transition`}
            label="Registrar Taller"
            onClick={()=>setVisibleAgregar(true)}
          />
        </div>
      </div>

      <div className={`card my-10 ${isDark ? "bg-[#1E293B] border-gray-700" : ""}`}>
        <DataTable
          value={taller}
          tableStyle={{ minWidth: '60rem' }}
          className={`custom-datatable ${isDark ? "bg-[#1E293B] text-white" : ""}`}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="id" header="ID" />
          <Column field="nombre_taller" header="Nombre" />
          <Column field="telefono" header="Telefono" />
          <Column body={Estado} header="Estado" />
          <Column body={Detalles} header="Detalles" /> 
          <Column body={Acciones} header="Acciones" />
        </DataTable>
      </div>

      {/* Dialogs */}
      <DialogAgregar Open={visibleAgregar} Close={()=>setVisibleAgregar(false)} />
      <DialogDetalles Open={visibleDetalles} Close={()=>setVisibleDetalles(false)} Datos={select} />
      <DialogDelete Open={visibleDelete} Close={()=>setVisibleDelete(false)} Datos={select} />
      <DialogEdit Open={visibleEdit} Close={()=>setVisibleEdit(false)} Datos={select} />
    </div>
  )
}
