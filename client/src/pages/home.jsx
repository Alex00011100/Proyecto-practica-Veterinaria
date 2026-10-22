import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import {CartesianGrid,Legend,Line,LineChart,Tooltip,XAxis,YAxis} from 'recharts'
import AlertaStockFlotante from '../components/AlertaStockFlotante.jsx'
import api from "../../config/api.js"

const formatearFecha = (fecha) => {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0")
  ].join("-");
};
  
const obtenerFechaActual = () => {
  const fecha = new Date();

  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0")
  ].join("-");
};


function generarGrafico(data, periodo) {
  console.log(data, periodo)
  if(!Array.isArray(data?.reporte)){
    return <p>Cargando datos...</p>
  }
  const datosGraficos = data.reporte.map(item => ({
    hora: new Date(item.fecha).toLocaleTimeString("es-AR",{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
    }),
    efectivo: Number(item.efectivo),
    tarjeta: Number(item.tarjeta),
    transferencia: Number(item.transferencia),
    total: Number(item.efectivo) + Number(item.tarjeta) + Number(item.transferencia)
  }))
  
  

  return (
    <>
    <h2>Ventas del {periodo}</h2>
    <LineChart width={600} height={300} responsive={true} data={datosGraficos}>
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
  )
}


export default function Home() {
  const [stock, setStock] = useState([])
  const [ventasDiarias, setVentasDiarias] = useState([])
  const [ventasSemanales, setVentasSemanales] = useState([])
  const [ventasMensuales, setVentasMensuales] = useState([])
  const [fechaInicio, setFechaInicio] = useState(obtenerFechaActual)
  const [fechaFin, setFechaFin] = useState(obtenerFechaActual)
  const [fechaElegida, setFechaElegida] = useState('dia')
  /*useEffect(() => {
    const checkStock = async () => {
    try {
      const response = await api.get('/products')
      setStock([]) // Limpiar el stock antes de verificar nuevamente
      for (let i=0; i < response.data.length; i++) {
        // Verificar si el stock actual es menor a 30 de momento, luego ira stock_minimo
        if(response.data[i].stock_actual < 30) {
          setStock(prevStock => [...prevStock, response.data[i]])
        }
      }
    } catch (error) {
      console.error('Error al verificar stock:', error)
    }
    }
    
  
  checkStock()

  const intervalo = setInterval(checkStock,30000)

  return () => clearInterval(intervalo)
  }, [])
*/
  /*const cambiarEstadoFecha = (nuevaFecha) => {
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
    const inicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1
    );

    setFechaInicio(formatearFecha(inicio));
    setFechaFin(obtenerFechaActual());
  }
};

useEffect(() => {
  const fetchVentas = async () => {
    try {
      let url = "";

      if (fechaElegida === "dia") {
        url = "/ventas/reporte/dia";
      }

      if (fechaElegida === "semana") {
        url = "/ventas/reporte/semana";
      }

      if (fechaElegida === "mes") {
        url = "/ventas/reporte/mes";
      }

      const params = fechaElegida === "dia"
        ? { fecha: fechaInicio }
        : { fecha_inicio: fechaInicio, fecha_fin: fechaFin };

      const response = await api.get(url, {
        params
      });

      if (fechaElegida === "dia") {
        setVentasDiarias(response.data);
      }

      if (fechaElegida === "semana") {
        setVentasSemanales(response.data);
        console.log(response.data);
      }

      if (fechaElegida === "mes") {
        setVentasMensuales(response.data);
        console.log(response.data);
      }

    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  if (fechaInicio && fechaFin && fechaInicio <= fechaFin) {
    fetchVentas();
  }

}, [fechaInicio, fechaFin, fechaElegida]);
*/
  return (
    <section className="page-shell">
      <h1>Bienvenido a la Veterinaria</h1>
      <p>Usa el menú para navegar entre Productos, Ventas, Clientes, Mascotas e Historias Clínicas.</p>
      {stock.length > 0 && (
        <div>
          <h2>Productos con stock bajo:</h2>
          <ul>
            {stock.map((item, index) => (
              <li key={index}>{item.nombre} - Stock actual: {item.stock_actual}</li>
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
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
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
  )
}
