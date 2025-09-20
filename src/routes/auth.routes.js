import express from 'express';
const router = express.Router();
import {register, login, getMe, logout} from '../controllers/auth.controller.js'
import { auth } from '../middlewares/auth.middleware.js';

router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, getMe)
router.post('/logout', auth, logout)

export default router;