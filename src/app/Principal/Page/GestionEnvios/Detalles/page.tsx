'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axiosInstance from '@/app/Herramientas/axiosToken'
import { Button } from 'primereact/button'
import Link from 'next/link'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { useAppContext } from '@/app/Provider/AppContext'

export default function Page() {
  const {ListaPedidos}=useAppContext()
  const [pedido, setPedido] = useState<any>(null)
  const [visible, setVisible] = useState(false)
  const [observacion, setObservacion] = useState('')
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const anularPedido = async () => {
    try {
      await axiosInstance.post(`/PostObservacion/${pedido.id}`, {
        descripcion: observacion
      })

      setVisible(false)
      setObservacion('')
      ListaPedidos()

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!id) return

    const ListaPedidosId = async () => {
      try {
        const response = await axiosInstance.get(`getPedidos/${id}`)
        setPedido(response.data)
      } catch (error) {
        console.error('error', error)
      }
    }

    ListaPedidosId()
  }, [id])

  if (!pedido) return <div className="p-10">Cargando pedido...</div>

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-10 py-6 bg-gray-50 min-h-screen">

      {/* Título */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4F9CD7]">
          Detalles del Pedido
        </h1>
        <p className="text-sm sm:text-base text-black mt-2">
          Aquí podrá ver los detalles del pedido
        </p>
      </div>

      <div className="flex mb-2 justify-start">
        <Link href="/Principal/Page/GestionEnvios" passHref legacyBehavior>
          <Button label='Retroceder' icon='pi pi-arrow-left' className='bg-white text-[#4F9CD7] border-[#4F9CD7]'/>
        </Link>
      </div>

      <div className="flex mb-2 justify-end">
        <Button
          label='Anular Pedido'
          icon="pi pi-times"
          className='bg-white text-[#e62e2e] border-[#e62e2e]'
          onClick={() => setVisible(true)}
        />
      </div>

      {/* Card */}
      <div className="bg-white shadow-md rounded-lg w-full">

        {/* Información del cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 p-4 sm:p-6">

          <div className="flex flex-col w-full">
            <label className="text-[#4F9CD7] font-medium text-sm sm:text-base">
              Nombre de Cliente
            </label>
            <InputText
              value={pedido.nombre || ''}
              disabled
              className="w-full mt-1"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[#4F9CD7] font-medium text-sm sm:text-base">
              Dirección
            </label>
            <InputText
              value={pedido.direccionCliente || ''}
              disabled
              className="w-full mt-1"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[#4F9CD7] font-medium text-sm sm:text-base">
              Teléfono
            </label>
            <InputText
              value={pedido.telefonoCliente || ''}
              disabled
              className="w-full mt-1"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[#4F9CD7] font-medium text-sm sm:text-base">
              Fecha de compra
            </label>
            <InputText
              value={pedido.fecha || ''}
              disabled
              className="w-full mt-1"
            />
          </div>

        </div>

        {/* Tabla productos */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          {pedido.prendas && (
            <DataTable
              value={pedido.prendas}
              responsiveLayout="scroll"
              className="text-sm"
            >
              <Column
                header="Code"
                body={(rowData, options) => options.rowIndex + 1}
              />
              <Column field="nombre" header="Nombre" />
              <Column field="talla" header="Talla" />
              <Column field="cantidad" header="Cantidad" />
            </DataTable>
          )}
        </div>

        <div className="flex m-10 justify-end">
          <h1 className='text-black'>PRECIO TOTAL:</h1>
          <h1 className='text-black ml-5'>{pedido.total}</h1>
        </div>

      </div>
      <Dialog
        header="Anular Pedido"
        visible={visible}
        style={{ width: '400px' }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setVisible(false)}
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              className="bg-red-500 border-red-500"
              onClick={anularPedido}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <label className="text-black">Ingrese motivo de anulacion de pedido</label>
          <InputTextarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows={4}
            className="w-full"
            placeholder="Ingrese el motivo de la anulación"
          />
        </div>
      </Dialog>
    </div>
  )
}