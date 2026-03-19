'use client'

import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  Open: boolean
  Close: () => void
  Datos: any
}

export default function DialogDelete({ Open, Close, Datos }: Props) {

  const { ListaPersonal } = useAppContext()
  const toast = useRef<Toast>(null)

  const estados = [
    { label: 'Activo', value: 1 },
    { label: 'Descanso', value: 2 },
    { label: 'Retirado', value: 3 }
  ]

  const [estado, setEstado] = useState<number | null>(null)
  const [observacion, setObservacion] = useState('')

  const resetForm = () => {
    setEstado(null)
    setObservacion('')
  }

  const handleClose = () => {
    resetForm()
    Close()
  }

  useEffect(() => {
    if (Open) {
      resetForm()
    }
  }, [Open])

  const guardarCambio = async () => {

    const CambioEstado = {
      estado,
      descripcion: observacion
    }

    try {

      await axiosInstance.put(`CambiarPersonal/${Datos?.id}`, CambioEstado)

      toast.current?.show({
        severity: 'success',
        summary: 'Correcto',
        detail: 'Estado actualizado correctamente',
        life: 3000
      })

      ListaPersonal()
      handleClose()

    } catch (error) {

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cambiar el estado',
        life: 3000
      })
      console.log('error',error);
      

    }
  }

  const confirmarCambio = () => {

    confirmDialog({
      message: `¿Seguro que deseas cambiar el estado de ${Datos?.nombres}?`,
      header: 'Confirmar cambio',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cambiar',
      rejectLabel: 'Cancelar',
      accept: guardarCambio
    })

  }

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-user-edit bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Cambiar estado del personal
      </p>
    </div>
  )

  useEffect(() => {
    if (Open && Datos) {
      setEstado(Number(Datos.estado))
      setObservacion('')
    }
  }, [Open, Datos])

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Dialog
        header={<Titulo />}
        visible={Open}
        onHide={handleClose}
        className="w-[32rem]"
      >

        <div className="flex flex-col gap-4">

          <div className="text-gray-700">
            Cambiar estado del personal <b>{Datos?.nombres}</b>
          </div>

          <div className="text-sm text-gray-500">
            Estado actual: <b>{Datos?.estado}</b>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Nuevo estado
            </label>

            <Dropdown
              value={estado}
              options={estados}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => setEstado(e.value)}
              placeholder="Seleccionar estado"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Observación
            </label>

            <InputTextarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={3}
              className="w-full"
              placeholder="Escribe el motivo del cambio..."
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <Button
            label="Cancelar"
            onClick={handleClose}
            className="p-button-text"
          />

          <Button
            label="Guardar cambio"
            icon="pi pi-check"
            severity="warning"
            disabled={!observacion}
            onClick={confirmarCambio}
          />

        </div>

      </Dialog>
    </>
  )
}