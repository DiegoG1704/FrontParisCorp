'use client'

import { Dialog } from 'primereact/dialog'
import React from 'react'

interface Props {
  Open: boolean
  Close: () => void
  Datos: any
}

export default function DialogProductos({ Close, Open, Datos }: Props) {
  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Lista de Tallas
      </p>
    </div>
  )


  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[20rem]">
      {Datos?.tallas?.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {Datos.tallas.map((talla: any) => (
            <div
              key={talla.id}
              className="flex justify-between items-center border border-gray-200 rounded-md px-4 py-2 bg-gray-50"
            >
              <span className="text-[#12C447] bg-[#e6fbe9] border border-[#12C447] px-3 py-1 text-sm rounded-full">
                {talla.nombre}
              </span>
              <strong className="text-gray-700">{talla.cantidad}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No hay tallas disponibles</p>
      )}
    </Dialog>
  )
}
