'use client'

import { Dialog } from 'primereact/dialog'
import Image from 'next/image'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { TabView, TabPanel } from 'primereact/tabview'
import { useAppContext } from '../Provider/AppContext'
import user from '../Imagen/cadena-de-suministro (1).png'
import React from 'react'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogPrendasDetalles({ Close, Open }: Props) {
  const { detallePrenda,detalleInforme } = useAppContext()

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <h2 className="text-[#BACD00] text-2xl font-semibold">Detalles de Conjunto</h2>
    </div>
  )

  const getNombreEstado = (id: string | number) => {
    const estadoMap: { [key: number]: { nombre: string; color: string; icon: string } } = {
      1: { nombre: 'Sin subir', color: 'bg-gray-500', icon: 'pi pi-clock' },
      2: { nombre: 'Subido', color: 'bg-green-500', icon: 'pi pi-check' },
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

  return (
    <Dialog
      visible={Open}
      onHide={Close}
      header={Titulo}
      style={{ width: '90vw' }}
      className="custom-dialog"
      breakpoints={{ '960px': '95vw' }}
    >
      <p className="text-gray-600 mb-6">
        En este módulo usted podrá ver el detalle de sus prendas en producción.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* INFORMACIÓN PRINCIPAL */}
        <div className="bg-white md:w-[30%] p-6 rounded-lg shadow space-y-6">
          {/* Estado */}
          <div className="flex justify-end">
            <span className="inline-flex items-center bg-[#E0F5FD] text-[#16805A] px-3 py-1 text-sm rounded-lg font-medium">
              <i className="pi pi-circle-fill text-green-500 mr-2"></i>Habilitado
            </span>
          </div>

          {/* Info Prenda */}
          <div className="flex items-center gap-4">
            <Image src={user} alt="Prenda" width={80} height={80} className="rounded-lg" />
            <div>
              <h3 className="text-xl font-bold text-[#6BCDF5]">{detallePrenda?.nombrePrenda}</h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Talla:</strong> {detallePrenda?.talla}
              </p>
            </div>
          </div>

          {/* Tallas */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Tallas</h4>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 border border-blue-200 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Image src={user} alt={`Talla`} width={35} height={35} className="rounded-md" />
                  <span className="text-[#6BCDF5] font-medium">Cant. Supuesta Inicial</span>
                </div>
                <strong>{detallePrenda.cantidad}</strong>
              </div>
              <div
                className="flex items-center justify-between p-3 border border-blue-200 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Image src={user} alt={`Talla`} width={35} height={35} className="rounded-md" />
                  <span className="text-[#6BCDF5] font-medium">Cantidad Extra</span>
                </div>
                <strong>{detallePrenda.cantidadExt}</strong>
              </div>
              <div
                className="flex items-center justify-between p-3 border border-blue-200 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Image src={user} alt={`Talla`} width={35} height={35} className="rounded-md" />
                  <span className="text-[#6BCDF5] font-medium">Cant. Supuesta Final</span>
                </div>
                <strong>{detallePrenda.cantidadTotal}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* TABVIEW: Áreas y Mermas */}
        <div className="md:w-[70%] w-full h-full">
          <TabView className="custom-tabs">
            {/* TAB 1: Producción */}
            <TabPanel header="Áreas de Producción" leftIcon="pi pi-briefcase mr-2">
                <h4 className="text-lg font-semibold text-[#BACD00] mb-4">Historial de Producción</h4>
                <DataTable
                  value={detalleInforme} // <- aquí deberías poner el arreglo real
                  paginator
                  rows={5}
                  emptyMessage="No hay registros."
                  responsiveLayout="scroll"
                >
                  <Column field="code" header="Item" />
                  <Column field="cantidad" header="Cantidad" />
                  <Column field="fecha" header="Fecha Registro" />
                  <Column header="Área" body={(rowData) => getNombreArea(rowData.area)} />
                  <Column header="Estado" body={(rowData) => getNombreEstado(rowData.estadoInforme)}/>
                </DataTable>
            </TabPanel>

            {/* TAB 2: Mermas */}
            <TabPanel header="Mermas en Producción" rightIcon="pi pi-times-circle ml-2">
                <h4 className="text-lg font-semibold text-[#BACD00] mb-4">Registro de Mermas</h4>
                <DataTable
                  value={detalleInforme} // <- aquí deberías poner el arreglo real
                  paginator
                  rows={5}
                  emptyMessage="No hay registros de mermas."
                  responsiveLayout="scroll"
                >
                  <Column field="code" header="Item" />
                  <Column field="cantMerma" header="Cantidad" />
                  <Column field="fecha" header="Fecha Registro" />
                  <Column header="Área" body={(rowData) => getNombreArea(rowData.area)} />
                  <Column header="Estado" body={(rowData) => getNombreEstado(rowData.estadoInforme)}/>
                </DataTable>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </Dialog>
  )
}
