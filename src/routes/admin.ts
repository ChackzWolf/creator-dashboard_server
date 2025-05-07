import express from 'express';
import { AdminController } from '../controllers/adminController';
import { AdminService } from '../services/adminService';
import { AdminRepository } from '../repositories/admin.repository';
import { JWT } from '../utils/jwt.utils';
const router = express.Router();

const adminRepo = new AdminRepository()
const jwt = new JWT()
const adminService = new AdminService(adminRepo, jwt)
const adminContructor = new AdminController(adminService)

router.post('/login',adminContructor.login.bind(adminContructor));
router.get('/profile', adminContructor.getProfile.bind(adminContructor))
export default router 