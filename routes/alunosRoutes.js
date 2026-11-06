import { Router } from 'express';
import alunosController from '../controllers/alunosController.js';

const router = Router();

router.get('/', alunosController.listar);
router.get('/:id', alunosController.buscarPorId);
router.post('/', alunosController.criar);
router.put('/:id', alunosController.atualizar);
router.patch('/:id', alunosController.atualizar);
router.delete('/:id', alunosController.excluir);

export default router;
