import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AlertaStockFlotante.css";
import api from '../../config/api.js'

const API_URL = 'products';
const CLAVE_SESION = "alertaStock";

const stockDe = (producto) => Number(producto.stock_actual) || 0;
const minimoDe = (producto) => Number(producto.stock_minimo) || 0;
const esCritico = (producto) => stockDe(producto) <= minimoDe(producto);

const leerGuardado = () => {
  try {
    const crudo = sessionStorage.getItem(CLAVE_SESION);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
};

const escribirGuardado = (estado) => {
  try {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(estado));
  } catch {
 
  }
};

const pluralizar = (cantidad, singular, plural) =>
  `${cantidad} ${cantidad === 1 ? singular : plural}`;

const Icono = ({ children }) => (
  <svg
    className="alerta-stock__icono"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconoCaja = () => (
  <Icono>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </Icono>
);

const IconoCirculoCheck = () => (
  <Icono>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </Icono>
);

const IconoCheck = () => (
  <Icono>
    <path d="M20 6 9 17l-5-5" />
  </Icono>
);

const IconoMenos = () => (
  <Icono>
    <path d="M5 12h14" />
  </Icono>
);

const IconoFlecha = () => (
  <svg
    className="alerta-stock__flecha"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export default function AlertaStockFlotante() {

  const [productos, setProductos] = useState(null);
  const [guardado, setGuardado] = useState(leerGuardado);

  useEffect(() => {
    let cancelado = false;

    const cargarProductos = async () => {
      try {
        const response = await api.get(API_URL, { withCredentials: true });

        if (!cancelado && Array.isArray(response.data)) {
          setProductos(response.data);
        }
      } catch (err) {
        console.error("Error al cargar el estado del stock:", err);
      }
    };

    cargarProductos();

    return () => {
      cancelado = true;
    };
  }, []);

  if (productos === null) return null;

  const criticos = productos.filter(esCritico);
  const total = criticos.length;
  const sinStock = criticos.filter((p) => stockDe(p) === 0).length;
  const porAgotarse = total - sinStock;
  const nivel = sinStock > 0 ? "rojo" : porAgotarse > 0 ? "amarillo" : "verde";

  const empeoro =
    guardado !== null &&
    (total > guardado.total || sinStock > guardado.sinStock);

  const minimizada =
    guardado !== null && !empeoro ? guardado.minimizada : nivel === "verde";

  const cambiarMinimizada = (valor) => {
    const estado = { minimizada: valor, total, sinStock };
    setGuardado(estado);
    escribirGuardado(estado);
  };

  let titulo;
  let detalle;

  if (nivel === "rojo") {
    titulo = `Hay que reponer ${pluralizar(total, "producto", "productos")}`;
    detalle =
      porAgotarse === 0
        ? sinStock === 1
          ? "Está sin stock"
          : `Los ${sinStock} están sin stock`
        : `${sinStock} ${sinStock === 1 ? "está" : "están"} sin stock y ${porAgotarse} por agotarse`;
  } else if (nivel === "amarillo") {
    titulo = `${pluralizar(porAgotarse, "producto", "productos")} por agotarse`;
    detalle = "En o por debajo del stock mínimo";
  } else {
    titulo = "Stock al día";
    detalle = "Ningún producto necesita reposición";
  }

  if (minimizada) {
    return (
      <button
        type="button"
        className={`alerta-stock-burbuja alerta-stock--${nivel}${nivel === "verde" ? " alerta-stock-burbuja--solo-icono" : ""}`}
        onClick={() => cambiarMinimizada(false)}
        aria-label={`Mostrar control de stock: ${titulo}`}
        title="Control de stock"
      >
        {nivel === "verde" ? (
          <IconoCheck />
        ) : (
          <>
            <IconoCaja />
            <span>{total}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <aside
      className={`alerta-stock alerta-stock--${nivel}`}
      aria-label="Control de stock"
    >
      <div className="alerta-stock__cabecera">
        {nivel === "verde" ? <IconoCirculoCheck /> : <IconoCaja />}
        <span className="alerta-stock__etiqueta">Control de stock</span>

        <button
          type="button"
          className="alerta-stock__minimizar"
          onClick={() => cambiarMinimizada(true)}
          aria-label="Minimizar control de stock"
          title="Minimizar"
        >
          <IconoMenos />
        </button>
      </div>

      <div className="alerta-stock__titulo">{titulo}</div>
      <div className="alerta-stock__detalle">{detalle}</div>

      <Link to="/alertas" className="alerta-stock__enlace">
        Ver alertas
        <IconoFlecha />
      </Link>
    </aside>
  );
}
