'use client'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'
import DialogCredenciales from './Components/DialogCredenciales'
import DialogAgregar from './Components/DialogAgregar'
import DialogDetalles from './Components/DialogDetalles'
import { useAppContext } from '@/app/Provider/AppContext'
import DialogDelete from './Components/DialogDelete'
import DialogEdit from './Components/DialogEdit'
import { Toast } from 'primereact/toast'

export default function Page() {
  const {personal, ListaPersonal}=useAppContext();
  const[visible,setVisible]=useState(false)
  const[visibleEdit,setVisibleEdit]=useState(false)
  const[visibleDetalles,setVisibleDetalles]=useState(false)
  const[visibleAgregar,setVisibleAgregar]=useState(false)
  const[visibleDelete,setVisibleDelete]=useState(false)
  const[select,setSelect]=useState([])
  // estado del buscador
  const [busqueda, setBusqueda] = useState('')
  const toast = useRef<Toast>(null);
  
    const handleRefresh = async () => {
      try {
        await ListaPersonal();
  
        toast.current?.show({
          severity: 'success',
          summary: 'Lista actualizada',
          detail: 'La lista del personal fueron actualizados correctamente',
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

  // clientes filtrados
  const personasFiltrados = personal?.filter((cliente: any) =>
    cliente.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.dni.toString().includes(busqueda)
  )

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

  const Acciones = (rowData:any) => (
        <div className="flex gap-2">
          <Button
            icon="pi pi-info-circle"
            className="bg-blue-100 border-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition duration-200"
            tooltip="Cambiar de Estado"
            tooltipOptions={{ position: 'top' }}
            onClick={()=>{
              setVisibleDelete(true)
              setSelect(rowData)
            }}
            />
        </div>
    );

    const Rol =(row:any)=>(
        <span
        className="bg-yellow-100 border-yellow-100 p-3 text-yellow-700 rounded-md hover:bg-yellow-200 transition duration-200" 
        >
            {row.rol}
        </span>
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
    <div className="flex flex-col p-10 bg-gray-50 min-h-screen">
      <Toast ref={toast} />
      <h1 className="text-[40px] text-[#4F9CD7] font-bold">Gestión de Personal</h1>
      <p className="text-[18px] text-gray-700 mt-2">
        En este módulo se gestionan los empleados registrados en el sistema.
      </p>

      <div className="flex flex-col lg:flex-row mt-10 justify-between gap-4">
        <InputText 
          placeholder="Buscar por nombre o DNI..." 
          className="h-12 w-full lg:w-[30rem]" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div>
          <Button 
            icon='pi pi-refresh'
            className="mr-2 bg-transparent border-transparent text-[#BACD00]"
            tooltip="Actualizar lista"
            tooltipOptions={{ position: 'top' }}
            onClick={handleRefresh}
          />
          <Button
            icon="pi pi-plus"
            className="bg-[#BACD00] text-white border-[#BACD00] hover:bg-[#aab800] transition"
            label="Registrar Personal"
            onClick={()=>setVisibleAgregar(true)}
          />
        </div>
        
      </div>
      <div className="card my-10">
        <DataTable
          value={personasFiltrados}
          tableStyle={{ minWidth: '60rem' }}
          className="custom-datatable"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="id" header="ID" />
          <Column field="dni" header="Documento" />
          <Column field="nombres" header="Nombre Completo" />
          <Column body={Rol} header="Rol" />
          <Column body={Estado} header="Estado" />
          {/* <Column body={Credenciales} header="Credenciales" /> */}
          <Column body={Detalles} header="Detalles" />
          <Column body={Acciones} header="Acciones" />
        </DataTable>
      </div>
      <DialogCredenciales Open={visible} Close={()=>setVisible(false)} Datos={select}/>
      <DialogAgregar Open={visibleAgregar} Close={()=>setVisibleAgregar(false)} />
      <DialogDetalles Open={visibleDetalles} Close={()=>setVisibleDetalles(false)} Datos={select}/>
      <DialogDelete Open={visibleDelete} Close={()=>setVisibleDelete(false)} Datos={select}/>
      <DialogEdit Open={visibleEdit} Close={()=>setVisibleEdit(false)} Datos={select}/>
    </div>
  )
}
