import { Router } from 'express'
import cargarEstudio from '../controllers/estudios.controller.js'
import upload from '../middlewares/uploadFile.js'

const router = Router()

router.post('/cargar', upload.single('archivo'), cargarEstudio)

export default router