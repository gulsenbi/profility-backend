import { Router } from 'express';
import { createComment, getProfileComments, getPendingComments, moderateComment } from '../controllers/commentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */

/**
 * @swagger
 * /profiles/{userId}/comments:
 *   post:
 *     summary: Add a comment to a profile
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Cannot comment on own profile
 *       401:
 *         description: Unauthorized
 */
router.post('/profiles/:userId/comments', authenticateToken, createComment);

/**
 * @swagger
 * /profiles/{userId}/comments:
 *   get:
 *     summary: Get approved comments for a profile
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID
 *     responses:
 *       200:
 *         description: List of approved comments
 */
router.get('/profiles/:userId/comments', getProfileComments);

/**
 * @swagger
 * /my-profile/comments/pending:
 *   get:
 *     summary: Get pending comments for the logged-in user
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending comments
 */
router.get('/my-profile/comments/pending', authenticateToken, getPendingComments);

/**
 * @swagger
 * /comments/{commentId}/moderate:
 *   patch:
 *     summary: Approve or reject a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Comment status updated
 *       403:
 *         description: Not authorized
 */
router.patch('/comments/:commentId/moderate', authenticateToken, moderateComment);

export default router;
