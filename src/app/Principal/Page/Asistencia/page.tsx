'use client'

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef, useState } from "react";
import { useAppContext } from "@/app/Provider/AppContext";
import axiosInstance from "@/app/Herramientas/axiosToken";
import { Toast } from "primereact/toast";

export default function Page() {
  const {usuario,asistencia,asistenciaPers,ListaAsistencia,ListaAsistenciaId,dashAsist,ListaAsistenciaDash} = useAppContext()
  const user = usuario?.datosUsuario;
  const isDark = user?.estadoModo !== "1";
  const toast = useRef<any>(null);
  const [fecha, setFecha] = useState<Date | null>(new Date());

  const handleSudmit = async () => {
    try {
      await axiosInstance.post(`PostAsistencia/${user.id}`);
      
      ListaAsistencia();
      ListaAsistenciaId();
      ListaAsistenciaDash();

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Asistencia registrada correctamente',
        life: 3000
      });

    } catch (error) {
      console.log('error', error);

      toast.current.show({
        severity: 'warn',
        summary: 'Aviso',
        detail: error.response.data.message,
        life: 3000
      });
    }
  };

  const estadoTemplate = (rowData: any) => {
    const colores: any = {
      1: "bg-green-100 text-green-700",
      2: "bg-yellow-100 text-yellow-700",
      3: "bg-red-100 text-red-700",
      4: "bg-blue-100 text-blue-700"
    };

    const nombre: any = {
      1: "Asistió",
      2: "Tardanza",
      3: "Falta",
      4: "Permiso"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colores[rowData.Estado]}`}>
          {nombre[rowData.Estado]}
        </span>
      );
    };

    const horaTemplate = (rowData:any) => {
      return new Date(`1970-01-01T${rowData.horaIngreso}`)
        .toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    };

    const parseFecha = (fechaStr: string) => {
      const [dia, mes, anio] = fechaStr.split('-');
      return new Date(Number(anio), Number(mes) - 1, Number(dia));
    };

    const asistenciaFiltrada = asistencia.filter((a: any) => {
      if (!fecha) return true;

      const fechaData = parseFecha(a.fecha);

      return (
        fechaData.toDateString() === fecha.toDateString()
      );
    });

  return (
    <div className={`flex flex-col p-8 gap-6 min-h-screen ${isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"}`}>
      <Toast ref={toast} />

      {/* HEADER */}
      <div>
        <h1 className={`text-[38px] font-bold ${isDark ? "text-white" : "text-[#4F9CD7]"}`}>
          Asistencia
        </h1>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Control y gestión de asistencia del personal
        </p>
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: "Presentes", value: dashAsist.presentes, color: "green" },
          { label: "Tardanzas", value: dashAsist.tardanzas, color: "yellow" },
          { label: "Faltas", value: dashAsist.faltas, color: "red" },
          { label: "Permisos", value: dashAsist.permisos, color: "blue" },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-lg p-5 shadow ${
              isDark ? "bg-[#1E293B]" : "bg-white"
            }`}
          >
            <p className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>{item.label}</p>
            <h2 className={`text-3xl font-bold text-${item.color}-600`}>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* ACCIONES */}
      <div className="flex gap-4">
        <Button
          label="Registrar Entrada"
          icon="pi pi-sign-in"
          className="bg-green-600 border-green-600"
          onClick={handleSudmit}
        />
      </div>

      {/* FILTROS */}
      {(user?.idRol === 1 || user?.idRol === 7) && (
        <div
          className={`flex gap-4 p-4 rounded-lg shadow ${
            isDark ? "bg-[#1E293B]" : "bg-white"
          }`}
        >
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              placeholder="Buscar empleado"
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
            />
          </span>

          <Calendar
            value={fecha}
            onChange={(e) => setFecha(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
            className={`${isDark ? "bg-[#0F172A] text-white border-gray-600" : ""}`}
          />
        </div>
      )}

      {/* TABLA ASISTENCIA */}
      {(user?.idRol === 1 || user?.idRol === 7) && (
        <div className={`rounded-lg p-4 shadow ${isDark ? "bg-[#1E293B]" : "bg-white"}`}>
          <DataTable
            value={asistenciaFiltrada}
            paginator
            rows={10}
            responsiveLayout="scroll"
            className={`${isDark ? "text-white" : ""}`}
          >
            <Column field="nombres" header="Empleado" />
            <Column field="rol" header="Cargo" />
            <Column field="fecha" header="Fecha" />
            <Column field="horaIngreso" body={horaTemplate} header="Hora Ingreso" />
            <Column field="horas" header="Horas trabajadas" />
            <Column field="Estado" header="Estado" body={estadoTemplate} />
          </DataTable>
        </div>
      )}

      {/* TABLA HISTORIAL PERSONAL */}
      <div className={`rounded-lg p-4 shadow ${isDark ? "bg-[#1E293B]" : "bg-white"}`}>
        <h3 className={`${isDark ? "text-white" : "text-black"}`}>Historial de Asistencias</h3>
        <DataTable
          value={asistenciaPers}
          paginator
          rows={10}
          responsiveLayout="scroll"
          className={`${isDark ? "text-white" : ""}`}
        >
          <Column field="nombres" header="Empleado" />
          <Column field="rol" header="Cargo" />
          <Column field="fecha" header="Fecha" />
          <Column field="horaIngreso" body={horaTemplate} header="Hora Ingreso" />
          <Column field="salida" header="Estado" body={estadoTemplate} />
          <Column field="estado" header="Obs." />
        </DataTable>
      </div>
    </div>
  );
}