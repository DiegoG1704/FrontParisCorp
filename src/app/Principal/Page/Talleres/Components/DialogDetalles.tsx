'use client'

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';

interface Props {
    Open: boolean;
    Close: () => void;
    Datos: any;
}

export default function DialogDetalles({ Close, Open, Datos }: Props) {
    const Titulo = () => (
        <div className="flex items-center gap-3">
            <i className="pi pi-user bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
            <p className="text-[#BACD00] text-[1.5rem] font-semibold">Detalles de Personal</p>
        </div>
    );

    return (
        <Dialog
            onHide={Close}
            visible={Open}
            header={Titulo}
            style={{ width: '500px' }}
            className="p-fluid"
            closable
            draggable={false}
            modal
        >
            <div className="bg-white shadow-md rounded-lg px-6 py-4 space-y-5">
                <label className="text-[#4F9CD7] text-[1.5rem] font-semibold">
                    <i className='pi pi-shop text-[1.4rem]'/> Datos del Taller
                </label>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Nombre</label>
                        <InputText className="mt-1" value={Datos.nombre_taller} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Direccion</label>
                        <InputText className="mt-1" value={Datos.direccion} readOnly />
                    </div>
                </div>
                <h3 className="text-[1.2rem] text-[#4F9CD7] font-semibold flex items-center gap-2">
                    <i className="pi pi-user" /> Datos del Encargado
                </h3>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-[#4F9CD7] font-medium">DNI</label>
                        <InputText className="mt-1" value={Datos.dni} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Nombre Completo</label>
                        <InputText className="mt-1" value={Datos.nombre_encargado} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Telefono</label>
                        <InputText className="mt-1" value={Datos.telefono} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Fecha de Ingreso</label>
                        <InputText className="mt-1" value={Datos.fecha} readOnly />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
