'use client'

import DialogCliente from '@/app/Components/DialogCliente'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useRef, useState } from 'react'
import DialogDelete from './Components/DialogDelete'
import DialogEdit from './Components/DialogEdit'
import { Toast } from 'primereact/toast'

export default function PageClientes() {
  const { clientes, ListaClientes } = useAppContext()

  const [visible, setVisible] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [select, setSelect] = useState<any>(null)

  // estado del buscador
  const [busqueda, setBusqueda] = useState('')
  const toast = useRef<Toast>(null);
    
      const handleRefresh = async () => {
        try {
          await ListaClientes();
    
          toast.current?.show({
            severity: 'success',
            summary: 'Lista actualizada',
            detail: 'La lista de clientes fueron actualizados correctamente',
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
  const clientesFiltrados = clientes?.filter((cliente: any) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.documento.toString().includes(busqueda)
  )

  const Estado = (rowData: any) => {
    const estadoMap: { [key: number]: { label: string } } = {
      1: { label: 'DNI' },
      2: { label: 'Ruc' }
    }

    const estado = estadoMap[rowData.tipodocumento] || {
      label: 'Desconocido'
    }

    return (
      <span className="bg-blue-100 text-blue-800 border-transparent rounded-md transition duration-200 px-3 py-2">
        {estado.label}
      </span>
    )
  }

  const Acciones = (rowData: any) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="bg-yellow-100 border-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition duration-200"
        tooltip="Editar"
        tooltipOptions={{ position: 'top' }}
        onClick={() => {
          setVisibleEdit(true)
          setSelect(rowData)
        }}
      />

      <Button
        icon="pi pi-trash"
        className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
        tooltip="Eliminar"
        tooltipOptions={{ position: 'top' }}
        onClick={() => {
          setVisibleDelete(true)
          setSelect(rowData)
        }}
      />
    </div>
  )

  return (
    <div className="flex flex-col p-10 bg-gray-50 min-h-screen">
      <Toast ref={toast} />
      <h1 className="text-[40px] text-[#4F9CD7] font-bold">
        Gestión de Cliente
      </h1>

      <p className="text-[18px] text-gray-700 mt-2">
        En este módulo se gestionan los clientes registrados en el sistema.
      </p>

      <div className="flex flex-col lg:flex-row mt-10 justify-between gap-4">

        {/* buscador */}
        <span className="p-input-icon-left w-full lg:w-[30rem]">
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar por nombre o DNI..."
            className="h-12 w-full"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </span>
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
            label="Registrar Cliente"
            onClick={() => setVisible(true)}
          />
        </div>
        
      </div>

      <div className="card my-10">
        <DataTable
          value={clientesFiltrados}
          tableStyle={{ minWidth: '60rem' }}
          className="custom-datatable"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >

          <Column field="id" header="ID" />

          <Column body={Estado} header="Tipo documento" />

          <Column field="documento" header="Documento" />

          <Column field="nombre" header="Nombre Completo" />

          <Column field="direccion" header="Direccion" />

          <Column field="telefono" header="Telefono" />

          <Column body={Acciones} header="Acciones" />

        </DataTable>
      </div>

      <DialogCliente
        Open={visible}
        Close={() => setVisible(false)}
      />

      <DialogDelete
        Open={visibleDelete}
        Close={() => setVisibleDelete(false)}
        Datos={select}
      />

      <DialogEdit
        Open={visibleEdit}
        Close={() => setVisibleEdit(false)}
        Datos={select}
      />

    </div>
  )
}