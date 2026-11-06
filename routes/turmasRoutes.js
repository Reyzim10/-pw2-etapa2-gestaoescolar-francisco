import { Router } from 'express';
import turmasController from '../controllers/turmasController.js';

const router = Router();

router.get('/', turmasController.listar);
router.get('/:id', turmasController.buscarPorId);
router.post('/', turmasController.criar);
router.put('/:id', turmasController.atualizar);
router.patch('/:id', turmasController.atualizar);
router.delete('/:id', turmasController.excluir);

export default router;
