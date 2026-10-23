import { useEffect, useState } from "react";
import { obtenerTurnosPorFecha } from "../../service/turnosService.js";
import "./VistaSemana.css";

const formatearFecha = (fecha) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

const obtenerLunes = (fecha) => {
  const lunes = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );

  const diaSemana = lunes.getDay();
  const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;

  lunes.setDate(lunes.getDate() + diferencia);

  return lunes;
};

const nombresDias = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const formatearHora = (fechaHora) => {
  if (!fechaHora) return "--:--";

  return new Date(fechaHora).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function VistaSemana({
  profesionales = [],
  profesionalSeleccionado = "todos",
  estadoSeleccionado = "todos",
  actualizarTurnos = 0,
  onEditarTurno,
  onCerrar,
}) {
  const [fechaInicio, setFechaInicio] = useState(() =>
    obtenerLunes(new Date()),
  );

  const [turnosPorDia, setTurnosPorDia] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    const cargarSemana = async () => {
      setCargando(true);
      setError("");

      try {
        const fechas = Array.from({ length: 7 }, (_, indice) => {
          const fecha = new Date(fechaInicio);
          fecha.setDate(fechaInicio.getDate() + indice);
          return fecha;
        });

        const resultados = await Promise.all(
          fechas.map((fecha) => obtenerTurnosPorFecha(formatearFecha(fecha))),
        );

        if (!cancelado) {
          setTurnosPorDia(
            fechas.map((fecha, indice) => ({
              fecha,
              turnos: resultados[indice],
            })),
          );
        }
      } catch (error) {
        console.error("Error al cargar la semana:", error);

        if (!cancelado) {
          setError("No se pudieron cargar los turnos de la semana.");
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    cargarSemana();

    return () => {
      cancelado = true;
    };
  }, [fechaInicio, actualizarTurnos]);

  const cambiarSemana = (cantidad) => {
    setFechaInicio((fechaActual) => {
      const nuevaFecha = new Date(fechaActual);
      nuevaFecha.setDate(nuevaFecha.getDate() + cantidad * 7);
      return nuevaFecha;
    });
  };

  const volverASemanaActual = () => {
    setFechaInicio(obtenerLunes(new Date()));
  };

  const fechaFinal = new Date(fechaInicio);
  fechaFinal.setDate(fechaFinal.getDate() + 6);

  const periodo = `${fechaInicio.toLocaleDateString("es-AR")} - ${fechaFinal.toLocaleDateString("es-AR")}`;

  return (
    <section className="vista-semana">
      <div className="vista-semana__encabezado">
        <div>
          <h2>Agenda semanal</h2>
          <p>{periodo}</p>
        </div>
      </div>

      <div className="vista-semana__navegacion">
        <button type="button" onClick={() => cambiarSemana(-1)}>
          ← Semana anterior
        </button>

        <button type="button" onClick={volverASemanaActual}>
          Semana actual
        </button>

        <button type="button" onClick={() => cambiarSemana(1)}>
          Semana siguiente →
        </button>
      </div>

      {cargando && (
        <p className="vista-semana__mensaje">Cargando turnos de la semana...</p>
      )}

      {!cargando && error && <p className="vista-semana__error">{error}</p>}

      {!cargando && !error && (
        <div className="vista-semana__dias">
          {turnosPorDia.map(({ fecha, turnos }, indice) => {
            const turnosFiltrados = turnos
              .filter((turno) => {
                const coincideProfesional =
                  profesionalSeleccionado === "todos" ||
                  (profesionalSeleccionado === "sin_asignar"
                    ? turno.profesional_id == null
                    : String(turno.profesional_id) === profesionalSeleccionado);

                const coincideEstado =
                  estadoSeleccionado === "todos" ||
                  turno.estado === estadoSeleccionado;

                return coincideProfesional && coincideEstado;
              })
              .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

            const esHoy = formatearFecha(fecha) === formatearFecha(new Date());

            return (
              <article
                className={`vista-semana__dia ${esHoy ? "vista-semana__dia--hoy" : ""}`}
                key={formatearFecha(fecha)}
              >
                <header className="vista-semana__dia-titulo">
                  <strong>{nombresDias[indice]}</strong>
                  <span>
                    {fecha.toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </header>

                {turnosFiltrados.length === 0 ? (
                  <p className="vista-semana__vacio">Sin turnos</p>
                ) : (
                  <div className="vista-semana__lista">
                    {turnosFiltrados.map((turno) => (
                      <div className="vista-semana__turno" key={turno.id}>
                        <strong>{formatearHora(turno.fecha_hora)}</strong>

                        <span>{turno.nombre_contacto}</span>

                        <small>{turno.motivo}</small>

                        <small>
                          {turno.profesional_nombre ||
                            (turno.profesional_id
                              ? "Profesional sin nombre"
                              : "Sin asignar")}
                        </small>

                        <span
                          className={`vista-semana__estado vista-semana__estado--${turno.estado || "pendiente"}`}
                        >
                          {turno.estado || "pendiente"}
                        </span>

                        {turno.estado !== "cancelado" &&
                          turno.estado !== "completado" && (
                            <button
                              type="button"
                              className="vista-semana__boton-editar"
                              onClick={() => onEditarTurno?.(turno)}
                            >
                              Editar
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
