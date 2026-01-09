import { Request, Response } from 'express';
import prisma from '../utils/prisma';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const { userId: profileId } = req.params; // The profile we are exploring
        const { content } = req.body;
        const authorId = req.user?.userId;

        if (!authorId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (authorId === profileId) {
            return res.status(400).json({ message: 'Cannot comment on your own profile' });
        }

        // Check if profile exists
        const profile = await prisma.user.findUnique({ where: { id: profileId } });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId,
                profileId,
                status: 'PENDING',
            },
        });

        res.status(201).json({ message: 'Comment added and pending approval', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

export const getProfileComments = async (req: Request, res: Response) => {
    try {
        const { userId: profileId } = req.params;

        const comments = await prisma.comment.findMany({
            where: {
                profileId,
                status: 'APPROVED',
            },
            include: {
                author: {
                    select: { username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

export const getPendingComments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        const comments = await prisma.comment.findMany({
            where: {
                profileId: userId,
                status: 'PENDING',
            },
            include: {
                author: {
                    select: { username: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending comments', error });
    }
};

export const moderateComment = async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const { status } = req.body; // APPROVED or REJECTED
        const userId = req.user?.userId;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.profileId !== userId) {
            return res.status(403).json({ message: 'Not authorized to moderate this comment' });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { status },
        });

        res.json({ message: `Comment ${status.toLowerCase()}`, comment: updatedComment });
    } catch (error) {
        res.status(500).json({ message: 'Error moderating comment', error });
    }
};
