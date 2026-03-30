import axiosInstance from '@/app/Herramientas/axiosToken';
import { useAppContext } from '@/app/Provider/AppContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';

interface Datos {
  id: number,
  nombre: string
}

interface Props {
  Open: boolean;
  Close: () => void;
  Datos: Datos;
}

export default function DialogEstado2({ Close, Open, Datos }: Props) {
  const { ListaPedidos } = useAppContext();
  const toast = useRef<Toast>(null);

  const handleSudmit = async () => {
    try {
      await axiosInstance.put(`/CambiarEstadoPedido/${Datos.id}/3`);
      ListaPedidos();

      toast.current?.show({
        severity: 'success',
        summary: 'Estado actualizado',
        detail: 'El pedido fue marcado como finalizado',
        life: 3000
      });

    } catch (error) {
      console.log('error', error);

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el estado del pedido',
        life: 3000
      });
    }
  };

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-xl font-semibold">
        Cambio de estado – En Camino
      </p>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        onHide={Close}
        visible={Open}
        header={Titulo}
        style={{ width: '30rem' }}
        className="rounded-md"
        modal
      >
        <div className="p-4 space-y-6">
          <p className="text-gray-700 text-lg font-medium">
            ¿Confirmas que los productos del cliente{" "}
            <span className="font-bold text-[#BACD00]">{Datos.nombre}</span> llegaron a su destino?
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-outlined p-button-secondary"
              onClick={Close}
            />
            <Button
              label="Sí, Confirmo"
              icon="pi pi-check"
              className="bg-[#BACD00] border-[#BACD00] text-white hover:bg-[#aebf00]"
              onClick={() => {
                handleSudmit();
                Close();
              }}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}