// components/ModalContent.tsx
import Image from 'next/image';  // Importa StaticImageData
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import imgProduct from '../../../../Imagen/cadena-de-suministro (1).png'

// Cambiar el tipo de imagen a StaticImageData
interface Prenda {
  code: string;
  nombre: string;
  talla:string;
  cantidad:string;
  cantidadExt:string;
}

interface Props {
  prendas: Prenda[];
  onEliminar: (code: string) => void;
}

export default function ModalContent({ prendas, onEliminar }: Props) {
  // const calcularCantidadTotal = (producto: Prenda): number => {
  //   const cantidades = [producto.S, producto.M, producto.L, producto.XL];
  //   return cantidades.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  // };

  return (
    <div className="flex flex-wrap gap-10 justify-start">
      {prendas.map((prenda) => (
        <div
          key={prenda.code}
          className="bg-white p-5 rounded-lg shadow-sm w-[345px] flex flex-col justify-between"
        >
          <div className="flex items-center gap-4 mb-3">
            <Image
              src={imgProduct}
              alt="Prenda"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <p className="text-xl font-semibold text-[#4F9CD7]">{prenda.nombre}</p>
              <p className="text-sm text-gray-500">Código: A00{prenda.code}</p>
            </div>
          </div>

          <Divider className="my-3" />
          <div className="text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Talla</span><strong>{prenda.talla}</strong></div>
            <div className="flex justify-between"><span>cantidad</span><strong>{prenda.cantidad} u.</strong></div>
            <div className="flex justify-between"><span>cantidad Extra</span><strong>{prenda.cantidadExt} u.</strong></div>
            <div className="flex justify-between text-[#4F9CD7] font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <strong>{Number(prenda.cantidad)+Number(prenda.cantidadExt)} u.</strong>
            </div>
          </div>
          {/* <div className="text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Talla S</span><strong>{prenda.S} u.</strong></div>
            <div className="flex justify-between"><span>Talla M</span><strong>{prenda.M} u.</strong></div>
            <div className="flex justify-between"><span>Talla L</span><strong>{prenda.L} u.</strong></div>
            <div className="flex justify-between"><span>Talla XL</span><strong>{prenda.XL} u.</strong></div>
            <div className="flex justify-between text-[#4F9CD7] font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <strong>{calcularCantidadTotal(prenda)} u.</strong>
            </div>
          </div> */}

          <Divider className="my-3" />

          <div className="flex justify-end gap-2">
            <Button
              icon="pi pi-trash"
              className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
              tooltip="Eliminar"
              onClick={() => onEliminar(prenda.code)} // ✅ Eliminar prenda
            />
          </div>
        </div>
      ))}
    </div>
  );
}
