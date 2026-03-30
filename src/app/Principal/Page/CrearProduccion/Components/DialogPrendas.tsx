'use client';

import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import ModalContent from './CardPrendas';
import { usePrendaContext } from '@/app/Provider/PrendasContext';

interface Producto {
  id:string;
  code: string;
  nombre: string;
  talla:string;
  cantidad:string;
  cantidadExt:string;
  tallaId:string;
}

interface Props {
  Open: boolean;
  Close: () => void;
  TallerId: string;
  onAsignar: (tallerId: string, prendas: Producto[]) => void;
}

export default function DialogPrendas({ Open, Close, TallerId, onAsignar }: Props) {
  const [prenda, setPrenda] = useState<Producto | null>(null);
  const [prendasAsignadas, setPrendasAsignadas] = useState<Producto[]>([]);
  const {products,asignacionesPorTaller}=usePrendaContext()
  useEffect(() => {
    // Cargar las prendas ya asignadas a este taller si existen
    setPrendasAsignadas(asignacionesPorTaller[TallerId] || []);
  }, [TallerId, asignacionesPorTaller]);

  const prendasYaAsignadas = Object.entries(asignacionesPorTaller)
    .filter(([id]) => id !== TallerId)
    .flatMap(([_, prendas]) => prendas.map(p => p.code));

  const prendasDisponibles = products.filter(p => !prendasYaAsignadas.includes(p.code));

  const agregarPrenda = () => {
    if (!prenda) return;

    console.log("Prenda seleccionada para asignar:", prenda); // 🔍 Aquí verifica si contiene `id`

    const yaExiste = prendasAsignadas.find(p => p.code === prenda.code);
    if (yaExiste) return;

    const nuevas = [...prendasAsignadas, prenda];
    setPrendasAsignadas(nuevas);
    onAsignar(TallerId, nuevas);
    setPrenda(null);
  };

  const eliminarPrendaAsignada = (code: string) => {
    setPrendasAsignadas(prev => prev.filter(p => p.code !== code));
  };


  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl"></i>
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Prendas Asignadas a Confección
      </p>
    </div>
  );

  return (
    <Dialog
      header={Titulo}
      visible={Open}
      onHide={Close}
      style={{ width: '75rem' }}
      modal
      className="p-fluid"
    >
      <span>En este módulo podrás asignar las prendas a tu proveedor de servicio de confección</span>
      
      <div className="flex flex-col md:flex-row gap-4 py-4 items-end">
        <div className='flex flex-col'>
          <label className="text-[#4F9CD7] font-medium">Prenda</label>
          <Dropdown
            placeholder="Seleccionar prenda..."
            optionLabel="nombre"
            value={prenda}
            options={prendasDisponibles}
            onChange={(e) => setPrenda(e.value)}
            className="w-[250px] mt-1"
            filter
          />
        </div>

        <div>
          <Button
            label="Agregar prenda"
            className="bg-[#BACD00] border-[#BACD00] text-white"
            onClick={agregarPrenda}
          />
        </div>
      </div>

      <div className="p-4">
        <ModalContent prendas={prendasAsignadas} onEliminar={eliminarPrendaAsignada} />
      </div>
    </Dialog>
  );
}
