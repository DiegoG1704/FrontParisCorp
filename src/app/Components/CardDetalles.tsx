'use client'

import Image from 'next/image';  // Importa StaticImageData
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import DialogPrendasDetalles from './DialogPrendasDetalles';
import { useState } from 'react';
import imgenProd from '../Imagen/cadena-de-suministro (1).png'
import { useAppContext } from '../Provider/AppContext';

export default function DetallesContent() {
  const [visible, setVisible] = useState(false);
  const {prendaDetalle,setSelectDetallePrenda}=useAppContext();

  return (
    <div className="flex flex-wrap gap-5 justify-start">
      {prendaDetalle.map((taller:any) => (
        <div key={taller.nombreTaller} className="w-full p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[#4F9CD7] mb-4">Taller Encargado:{taller.nombreTaller}</h2>
          <div className="flex flex-wrap gap-10 justify-start">
            {taller.prendas.map((prenda:any) => {
              return (
                <div
                  key={prenda.idDetalle}
                  className="bg-white p-5 rounded-lg shadow-sm w-[345px] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Image
                      src={imgenProd}  // Imagen de ejemplo
                      alt="Prenda"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-xl font-semibold text-[#4F9CD7]">{prenda.nombrePrenda}</p>
                      <p className="text-sm text-gray-500">Código: {prenda.id}</p>
                    </div>
                  </div>

                  <Divider className="my-3" />

                  <div className="text-gray-700 space-y-2">
                    <div className="text-gray-700 space-y-2">
                    <div className="flex justify-between"><span>Talla</span><strong>{prenda.talla}</strong></div>
                    <div className="flex justify-between"><span>cant. Inicial</span><strong>{prenda.cantidad} u.</strong></div>
                    <div className="flex justify-between"><span>cant. Extra</span><strong>{prenda.cantidadExt} u.</strong></div>
                    <div className="flex justify-between text-[#4F9CD7] font-semibold border-t pt-2 mt-2">
                      <span>Total</span>
                      <strong>{prenda.cantidadTotal} u.</strong>
                    </div>
                   </div>
                  </div>

                  <Divider className="my-3" />

                  <div className="flex justify-end gap-2">
                    <Button
                      icon="pi pi-clipboard"
                      className="bg-[#BFF1DF] border-white text-[#16805A] rounded-[10px]"
                      label="Detalles"
                      onClick={() => {
                        setVisible(true);
                        setSelectDetallePrenda({
                          idPrenda: prenda.id,
                          nombrePrenda: prenda.nombrePrenda,
                          idProduccion:prenda.idProduccion,
                          idDetallePrenda:prenda.idDetallePrenda
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <DialogPrendasDetalles Open={visible} Close={() => setVisible(false)} />
    </div>
  );
}
