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
import {
  obtenerTurnosPorFecha,
  completarTurno,
  cancelarTurno,
} from "../service/turnosService.js";
import Modal from "../components/Modal.jsx";
import FormularioTurno from "../components/turnos/FormularioTurnos.jsx";
import VistaSemana from "../components/turnos/VistaSemana.jsx";
import VistaMes from "../components/turnos/VistaMes.jsx";

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

const desplazarFecha = (fecha, cantidadDias) => {
  const [anio, mes, dia] = fecha.split("-").map(Number);

  const nuevaFecha = new Date(anio, mes - 1, dia);
  nuevaFecha.setDate(nuevaFecha.getDate() + cantidadDias);

  return formatearFecha(nuevaFecha);
};

/*
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
}*/

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

  const [modalNuevoTurnoAbierto, setModalNuevoTurnoAbierto] = useState(false);
  const [actualizarturnos, setActualizarTurnos] = useState(0);
  const [profesionalSeleccionado, setProfesionalSeleccionado] =
    useState("todos");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");

  const [modalSemanaAbierto, setModalSemanaAbierto] = useState(false);
  const [turnoEditar, setTurnoEditar] = useState(null);
  const [modalMesAbierto, setModalMesAbierto] = useState(false);

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
  }, [fechaAgenda, actualizarturnos]);

  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        const response = await api.get("users/lista", {
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

  const manejarCompletarTurno = async (turno) => {
    const confirmar = window.confirm(
      `¿Querés marcar como completado el turno de ${turno.nombre_contacto}?`,
    );

    if (!confirmar) return;

    try {
      await completarTurno(turno.id);

      setActualizarTurnos((actual) => actual + 1);
    } catch (error) {
      console.error("Error al completar el turno:", error);
      alert(error.response?.data?.message || "No se pudo completar el turno.");
    }
  };

  const manejarCancelarTurno = async (turno) => {
    const confirmar = window.confirm(
      `¿Querés cancelar el turno de ${turno.nombre_contacto}?`,
    );

    if (!confirmar) return;

    try {
      await cancelarTurno(turno.id);

      setActualizarTurnos((actual) => actual + 1);
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
      alert(error.response?.data?.message || "No se pudo cancelar el turno.");
    }
  };

  return (
    <section className="page-shell">
      <h1>Bienvenido a la Veterinaria</h1>

      <AgendaTurnos
        turnos={turnos}
        profesionales={profesionales}
        cargando={cargandoTurnos}
        error={errorTurnos}
        profesionalSeleccionado={profesionalSeleccionado}
        setProfesionalSeleccionado={setProfesionalSeleccionado}
        estadoSeleccionado={estadoSeleccionado}
        setEstadoSeleccionado={setEstadoSeleccionado}
        fechaAgenda={fechaAgenda}
        onCambiarDia={(cantidad) => {
          setFechaAgenda((fechaActual) =>
            desplazarFecha(fechaActual, cantidad),
          );
        }}
        onVolverHoy={() => setFechaAgenda(obtenerFechaActual())}
        onNuevoTurno={() => {
          setTurnoEditar(null);
          setModalNuevoTurnoAbierto(true);
        }}
        onEditarTurno={(turno) => {
          setTurnoEditar(turno);
          setModalNuevoTurnoAbierto(true);
        }}
        onCompletarTurno={manejarCompletarTurno}
        onCancelarTurno={manejarCancelarTurno}
        onVerSemana={() => setModalSemanaAbierto(true)}
        onVerMes={() => setModalMesAbierto(true)}
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

      <Modal
        isOpen={modalNuevoTurnoAbierto}
        onClose={() => {
          setModalNuevoTurnoAbierto(false);
          setTurnoEditar(null);
        }}
      >
        <FormularioTurno
          profesionales={profesionales}
          turnoEditar={turnoEditar}
          onClose={() => {
            setModalNuevoTurnoAbierto(false);
            setTurnoEditar(null);
          }}
          onGuardado={async () => {
            setActualizarTurnos((anterior) => anterior + 1);
          }}
        />
      </Modal>

      <Modal
        isOpen={modalSemanaAbierto}
        onClose={() => setModalSemanaAbierto(false)}
      >
        <VistaSemana
          profesionales={profesionales}
          profesionalSeleccionado={profesionalSeleccionado}
          estadoSeleccionado={estadoSeleccionado}
          actualizarTurnos={actualizarturnos}
          onEditarTurno={(turno) => {
            setTurnoEditar(turno);
            setModalSemanaAbierto(false);
            setModalNuevoTurnoAbierto(true);
          }}
          onCerrar={() => setModalSemanaAbierto(false)}
        />
      </Modal>

      <Modal isOpen={modalMesAbierto} onClose={() => setModalMesAbierto(false)}>
        <VistaMes
          profesionalSeleccionado={profesionalSeleccionado}
          estadoSeleccionado={estadoSeleccionado}
          actualizarTurnos={actualizarturnos}
          onCerrar={() => setModalMesAbierto(false)}
          onEditarTurno={(turno) => {
            setTurnoEditar(turno);
            setModalMesAbierto(false);
            setModalNuevoTurnoAbierto(true);
          }}
        />
      </Modal>
    </section>
  );
}
