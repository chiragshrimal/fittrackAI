import express from 'express';
import { sendTrainerRequest ,checkTrainee} from '../controllers/trainerRequest.contoller.js';
import verifyJWT from '../middlewares/authTrainer.middleware.js';
// import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Trainer can send requests to users without a trainer
router.post("/search-trainee",verifyJWT,checkTrainee);
router.post('/send',verifyJWT,sendTrainerRequest);

export default router;