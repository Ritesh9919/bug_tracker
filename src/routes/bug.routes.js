import express from 'express';
const router = express.Router();
import {createBug, getAllBugs, updateBug} from '../controllers/bug.controller.js'
import { auth } from '../middlewares/auth.middleware.js';

router.post('/', auth, createBug);
router.get('/', auth, getAllBugs);
router.put('/:bugId', auth, updateBug);

export default router;