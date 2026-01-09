import { Router } from 'express';
import { getProfile } from '../controllers/profileController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: User profile endpoints
 */

/**
 * @swagger
 * /profiles/{userId}:
 *   get:
 *     summary: Get a user's profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 */
router.get('/:userId', getProfile);

export default router;
