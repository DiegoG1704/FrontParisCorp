import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import React, { useRef } from 'react'

interface Props {
  Open: boolean
  Close: () => void
  Datos: any
}

export default function DialogDelete({ Open, Close, Datos }: Props) {
  const { ListaTaller } = useAppContext()
  const toast = useRef<Toast>(null)

  const handleSudmit = async () => {
    try {
      await axiosInstance.delete(`/DeleteTaller/${Datos?.id}`)

      toast.current?.show({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'El cliente fue eliminado correctamente',
        life: 3000
      })

      ListaTaller()
      Close()

    } catch (error) {
      console.log('Error', error)

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el cliente',
        life: 3000
      })
    }
  }

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Eliminar Taller
      </p>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />

      <Dialog header={<Titulo />} onHide={Close} visible={Open} className="w-[25rem]">
        <p>¿Seguro que deseas eliminar el Taller {Datos?.nombre_taller}?</p>

        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={Close} label="Cancelar" className="p-button-text" />
          <Button onClick={handleSudmit} label="Eliminar" severity="danger" />
        </div>
      </Dialog>
    </>
  )
}