import express, { Router } from 'express';
import * as userController from './../controllers/userController';
import * as authController from './../controllers/authController';
import cors from 'cors';

const router: Router = express.Router();

router.use(cors({ origin: '*' }));

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(authController.protect, userController.createUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

export default router;
