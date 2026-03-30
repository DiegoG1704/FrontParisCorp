'use client'

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useRef, useState } from 'react';

interface Props {
    Open: boolean;
    Close: () => void;
    Datos: any;
}

export default function DialogDetalles({ Close, Open, Datos }: Props) {
    const [cvNombre, setCvNombre] = useState('');
    const [dniNombre, setDniNombre] = useState('');

    const inputCVRef = useRef<HTMLInputElement>(null);
    const inputDNIRef = useRef<HTMLInputElement>(null);

    const Titulo = () => (
        <div className="flex items-center gap-3">
            <i className="pi pi-user bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
            <p className="text-[#BACD00] text-[1.5rem] font-semibold">Detalles de Personal</p>
        </div>
    );

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFileName: (name: string) => void
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

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
                <h3 className="text-[1.2rem] text-[#4F9CD7] font-semibold flex items-center gap-2">
                    <i className="pi pi-user" /> Datos Personales
                </h3>

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-[#4F9CD7] font-medium">DNI</label>
                        <InputText className="mt-1" value={Datos.dni} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Nombre Completo</label>
                        <InputText className="mt-1" value={Datos.nombres} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Rol</label>
                        <InputText className="mt-1" value={Datos.rol} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Fecha de Ingreso</label>
                        <InputText className="mt-1" value={Datos.fecha} readOnly />
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <label className="text-[#4F9CD7] font-medium">Subir mi CV</label>
                    <div className="flex items-center gap-2">
                        <InputText
                            className="cursor-pointer flex-1"
                            value={cvNombre}
                            placeholder="Seleccionar archivo..."
                            onClick={() => inputCVRef.current?.click()}
                            readOnly
                        />
                        <input
                            ref={inputCVRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, setCvNombre)}
                        />
                        <Button
                            icon="pi pi-upload"
                            className="p-button-sm text-green-700 bg-transparent border-transparent"
                            tooltip="Seleccionar archivo"
                            onClick={() => inputCVRef.current?.click()}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[#4F9CD7] font-medium">Subir copia de DNI</label>
                    <div className="flex items-center gap-2">
                        <InputText
                            className="cursor-pointer flex-1"
                            value={dniNombre}
                            placeholder="Seleccionar archivo..."
                            onClick={() => inputDNIRef.current?.click()}
                            readOnly
                        />
                        <input
                            ref={inputDNIRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => handleFileChange(e, setDniNombre)}
                        />
                        <Button
                            icon="pi pi-upload"
                            className="p-button-sm text-green-700 bg-transparent border-transparent"
                            tooltip="Seleccionar archivo"
                            onClick={() => inputDNIRef.current?.click()}
                        />
                    </div>
                </div>

                <h3 className="text-[1.2rem] text-[#4F9CD7] font-semibold flex items-center gap-2 pt-5">
                    <i className="pi pi-key" /> Credenciales
                </h3>

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Usuario</label>
                        <InputText className="mt-1" value={Datos.usuario} readOnly />
                    </div>
                    <div>
                        <label className="text-[#4F9CD7] font-medium">Contraseña</label>
                        <InputText className="mt-1" value={Datos.contraseña} readOnly />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
