import express from 'express';
const authRoutes = express.Router();
import { register, login} from '../controller/authController.mjs';

authRoutes.post('/register', register);

authRoutes.post('/login', login);


export default authRoutes;
