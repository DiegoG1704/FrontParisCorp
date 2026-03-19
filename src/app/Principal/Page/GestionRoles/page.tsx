'use client'

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import DialogCrearRol from './Components/DialogCrearRol';
import DialogEditarRol from './Components/DialogEditarRol';
import DialogDeleteRol from './Components/DialogDelete';
import { useAppContext } from '@/app/Provider/AppContext';

export default function Page() {
  const { roles } = useAppContext();
  const [visible, setVisible] = useState(false);
  const [visibleEditar, setVisibleEditar] = useState(false);
  const [visibleDelet, setVisibleDelet] = useState(false);
  const [select, setSelect] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro

  const Tallas = (rowdata: any) => (
    <div className="flex flex-wrap gap-2">
      {rowdata.vistas.map((vista: any) => (
        <span
          key={vista.id}
          className="text-[#12C447] bg-[#e6fbe9] border border-[#12C447] px-3 py-1 text-sm rounded-full"
        >
          {vista.nombre}
        </span>
      ))}
    </div>
  );

  const Acciones = (row: any) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="bg-yellow-100 border-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition duration-200"
        tooltip="Editar rol"
        tooltipOptions={{ position: 'top' }}
        onClick={() => { setVisibleEditar(true); setSelect(row); }}
      />
      <Button
        icon="pi pi-trash"
        className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
        tooltip="Eliminar rol"
        tooltipOptions={{ position: 'top' }}
        onClick={() => { setVisibleDelet(true); setSelect(row); }}
      />
    </div>
  );

  // ✅ Filtrar roles según el input
  const filteredRoles = roles.filter((rol: any) =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-10 bg-gray-50 min-h-screen">
      <strong className="text-[40px] text-[#4F9CD7]">Gestión de Roles</strong>
      <span className="text-[20px] text-black pt-2">
        En este módulo se gestionará los roles de los empleados
      </span>

      <div className="flex flex-col lg:flex-row mt-10 justify-between gap-4">
        <InputText
          placeholder="Buscar por nombre de rol..."
          className="h-12 w-full lg:w-[30rem]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon="pi pi-plus"
          className="bg-[#BACD00] text-white border-[#BACD00]"
          label='Crear Rol'
          onClick={() => setVisible(true)}
        />
      </div>

      <div className="card my-10">
        <DataTable
          value={filteredRoles} // Usamos la lista filtrada
          tableStyle={{ minWidth: '50rem' }}
          className="custom-datatable"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="id" header="ID" />
          <Column field="nombre" header="Nombre de Rol" />
          <Column body={(rowdata) => Tallas(rowdata)} header="Detalles" />
          <Column body={Acciones} header="Acciones" />
        </DataTable>
      </div>

      <DialogCrearRol Open={visible} Close={() => setVisible(false)} />
      <DialogEditarRol Open={visibleEditar} Close={() => setVisibleEditar(false)} Datos={select} />
      <DialogDeleteRol Open={visibleDelet} Close={() => setVisibleDelet(false)} Datos={select} />
    </div>
  );
}