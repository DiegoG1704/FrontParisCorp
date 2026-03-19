import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react'

interface Props {
    Open: boolean;
    Close: () => void;
    Prendas:any;
  }

interface Option {
name: string;
id: string;
}

interface Prenda {
  nombre: string;
  cantidad: string;
}
export default function DialogAgregar({ Close, Open, Prendas }: Props) {
    const [products,setProducts]=useState([
    {
        code:'1',name:'Diego'
    },
    {
        code:'2',name:'Diego'
    },
    ])

    const [prenda, setPrenda] = useState<Prenda>({
        nombre:'',
        cantidad:'',
      });
    const opciones: Option[] = [
        { name: 'Rojo', id: '1' },
        { name: 'Rojo', id: '2' },
        { name: 'Rojo', id: '3' },
        { name: 'Rojo', id: '4' }
      ];
    const Titulo = () => (
        <div className="flex items-center gap-3">
          <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl"></i>
          <p className="text-[#BACD00] text-[1.5rem] font-semibold">
            Agregar prenda
          </p>
        </div>
      );
  return (
    <Dialog visible={Open} onHide={Close} header={Titulo}>
        <strong>En esta modulo podras asignar las prenda a tu proveedor de servicio de confección</strong>
        <div className='pt-[20px] flex flex-col'>
            <label className="text-[#4F9CD7] font-medium">Prenda</label>
            <div className='flex'>
                <Dropdown
                    placeholder="Prendas..."
                    optionLabel="nombre"
                    options={Prendas}
                    value={Prendas.find((opt:any) => opt.id === prenda.nombre)}
                    onChange={(e) => setPrenda(prev => ({ ...prev, nombre: e.value.id }))}
                    className="w-[200px] h-[42px] mt-1"
                />
                <Button
                    label="Agregar"
                    className="w-[200px] h-[42px] ml-2 mt-1 bg-[#BACD00] border-[#BACD00] text-white"
                />
            </div>
        </div>
        <DataTable
            value={products}
            className="mt-6"
            paginator rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: '40rem' }}
        >
            <Column field="code" header="ID" />
            <Column field="name" header="Prenda" />
            <Column field="category" header="Total a Producir" />
            <Column field="quantity" header="Cantida Asignada" />
        </DataTable>
        <div className="flex justify-end py-4">
            <Button 
                label='Cerrar'
                onClick={Close}
                className="m-2 bg-red-100 border-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-200"
            />
            <Button label='Guardar' className="m-2 bg-yellow-100 border-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition duration-200"/>
        </div>
    </Dialog>
  )
}
