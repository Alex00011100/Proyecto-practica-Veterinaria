import express from 'express';
import turnosController from '../controllers/turnos.controller.js';

const router = express.Router();

router.post('/asignar', turnosController.asignarTurno);

router.patch('/modificar/:id', turnosController.modificarTurno);
router.patch('/cancelar/:id', turnosController.cancelarTurno);
router.patch('/completar/:id', turnosController.turnoCompletado);

export default router;