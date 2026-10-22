import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AlertaStockFlotante from "../components/AlertaStockFlotante.jsx";
import api from "../../config/api.js";
import AgendaTurnos from "../components/turnos/AgendaTurnos.jsx";
import { obtenerTurnosPorFecha } from "../service/turnosService.js";

const formatearFecha = (fecha) => {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
};

const obtenerFechaActual = () => {
  const fecha = new Date();

  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
};

function generarGrafico(data, periodo) {
  console.log(data, periodo);
  if (!Array.isArray(data?.reporte)) {
    return <p>Cargando datos...</p>;
  }
  const datosGraficos = data.reporte.map((item) => ({
    hora: new Date(item.fecha).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    efectivo: Number(item.efectivo),
    tarjeta: Number(item.tarjeta),
    transferencia: Number(item.transferencia),
    total:
      Number(item.efectivo) + Number(item.tarjeta) + Number(item.transferencia),
  }));

  return (
    <>
      <h2>Ventas del {periodo}</h2>
      <LineChart
        width={600}
        height={300}
        responsive={true}
        data={datosGraficos}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hora" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="efectivo" stroke="#82ca9d" />
        <Line type="monotone" dataKey="tarjeta" stroke="#8884d8" />
        <Line type="monotone" dataKey="transferencia" stroke="#ffc658" />
        <Line type="monotone" dataKey="total" stroke="#ff7300" />
      </LineChart>
    </>
  );
}

export default function Home() {
  const [stock, setStock] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(obtenerFechaActual);
  const [fechaFin, setFechaFin] = useState(obtenerFechaActual);
  const [fechaElegida, setFechaElegida] = useState("dia");

  const [turnos, setTurnos] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [cargandoTurnos, setCargandoTurnos] = useState(true);
  const [errorTurnos, setErrorTurnos] = useState("");
  const [fechaAgenda, setFechaAgenda] = useState(obtenerFechaActual);

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        setCargandoTurnos(true);
        setErrorTurnos("");

        const turnosObtenidos = await obtenerTurnosPorFecha(fechaAgenda);

        setTurnos(turnosObtenidos);
      } catch (error) {
        console.error("Error al cargar los turnos:", error);

        setErrorTurnos("No se pudieron cargar los turnos del día.");
      } finally {
        setCargandoTurnos(false);
      }
    };

    cargarTurnos();
  }, [fechaAgenda]);

  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/lista", {
          withCredentials: true,
        });

        const usuarios = response.data.usuarios ?? [];

        const usuariosActivos = usuarios.filter(
          (usuario) => usuario.activo === true || usuario.activo === "true",
        );

        setProfesionales(usuariosActivos);
      } catch (error) {
        console.error("Error al cargar los profesionales:", error);
      }
    };

    cargarProfesionales();
  }, []);

  const cambiarEstadoFecha = (nuevaFecha) => {
    setFechaElegida(nuevaFecha);

    const hoy = new Date();

    if (nuevaFecha === "dia") {
      setFechaInicio(obtenerFechaActual());
      setFechaFin(obtenerFechaActual());
    }

    if (nuevaFecha === "semana") {
      const inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - 6);

      setFechaInicio(formatearFecha(inicio));
      setFechaFin(obtenerFechaActual());
    }

    if (nuevaFecha === "mes") {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      setFechaInicio(formatearFecha(inicio));
      setFechaFin(obtenerFechaActual());
    }
  };

  

  return (
    <section className="page-shell">
      <h1>Bienvenido a la Veterinaria</h1>
      <p>
        Usa el menú para navegar entre Productos, Ventas, Clientes, Mascotas e
        Historias Clínicas.
      </p>

      <AgendaTurnos
        turnos={turnos}
        profesionales={profesionales}
        cargando={cargandoTurnos}
        error={errorTurnos}
      />

      {stock.length > 0 && (
        <div>
          <h2>Productos con stock bajo:</h2>
          <ul>
            {stock.map((item, index) => (
              <li key={index}>
                {item.nombre} - Stock actual: {item.stock_actual}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/*<div>
        <button onClick={() => cambiarEstadoFecha('dia')}>Día</button>
        <button onClick={() => cambiarEstadoFecha('semana')}>Semana</button>
        <button onClick={() => cambiarEstadoFecha('mes')}>Mes</button>
        <label>
          Fecha Inicio
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        {/*{fechaElegida !== "dia" && <label> Fecha fin<input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} /></label>}*/}
     {/*fechaElegida === 'dia' && (
        <div>
          {generarGrafico(ventasDiarias, "dia")}
        </div>
     )}
     {fechaElegida === 'semana' && (
        <div>
          {generarGrafico(ventasSemanales, "semana")}
        </div>
     )}
     {fechaElegida === 'mes' && (
        <div>
          {generarGrafico(ventasMensuales, "mes")}
        </div>
     )}
     </div>*/}
     <AlertaStockFlotante />
    </section>
  );
}
