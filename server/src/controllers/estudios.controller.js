import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const cargarEstudio = async (req, res) => {
    try {
        const archivo = req.file

        if (!archivo) {
            return res.status(400).send('No se ha subido ningún archivo.')
        }

        // Crear carpeta si no existe
        await fs.mkdir('estudios', { recursive: true })

        // Generar nombre único
        const extension = path.extname(archivo.originalname)
        const nombreArchivo = `${randomUUID()}${extension}`

        const rutaDestino = path.join('estudios', nombreArchivo)

        // Mover archivo
        await fs.rename(archivo.path, rutaDestino)

        return res.status(200).json({
            message: 'Archivo subido correctamente.',
            nombreArchivo
        })

    } catch (error) {
        console.error('Error al subir estudio:', error)

        return res.status(500).send('Error al mover el archivo.')
    }
}

export default cargarEstudio