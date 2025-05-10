import express from 'express';
import { AdminController } from '../controllers/adminController';
import { AdminService } from '../services/adminService';
import { AdminRepository } from '../repositories/admin.repository';
import { JWT } from '../utils/jwt.utils';
import { ReportService } from '../services/reportService';
import { ReportedPostRepository } from '../repositories/report.repository';
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/user.repository';
const router = express.Router();

const adminRepo = new AdminRepository()
const reportRepo = new ReportedPostRepository()
const userRepo = new UserRepository()
const jwt = new JWT()
const userService = new UserService(userRepo)
const adminService = new AdminService(adminRepo, jwt)
const reportService = new ReportService(reportRepo)
const adminContructor = new AdminController(adminService, reportService, userService)

router.post('/login',adminContructor.login.bind(adminContructor));
router.post('/update-report-status', adminContructor.updateReportStatus.bind(adminContructor))
router.post('/toggle-block-user', adminContructor.toggleBlockUser.bind(adminContructor));
router.get('/profile', adminContructor.getProfile.bind(adminContructor));
router.get('/users', adminContructor.getUserList.bind(adminContructor));



export default router 