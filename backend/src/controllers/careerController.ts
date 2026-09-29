import { Request, Response } from 'express';
import { JobApplication } from '../models/JobApplication';
import { asyncHandler } from '../middleware/asyncHandler';
import { io } from '../server';
import { logger } from '../utils/logger';

// POST /api/job-applications - Submit Career Application
export const submitJobApplication = asyncHandler(async (req: Request, res: Response) => {
  const { applicantName, email, phone, positionApplied, experienceYears, resumeUrl, coverLetter } = req.body;

  const application = await JobApplication.create({
    applicantName,
    email,
    phone,
    positionApplied,
    experienceYears: Number(experienceYears),
    resumeUrl,
    coverLetter: coverLetter || '',
    status: 'Received',
  });

  logger.info(`[Job Application Received] Applicant: ${applicantName} | Position: ${positionApplied}`);

  try {
    io.emit('new_job_application', {
      id: application._id,
      applicantName: application.applicantName,
      positionApplied: application.positionApplied,
      createdAt: (application as any).createdAt,
    });
  } catch (err) {
    logger.error('[Socket.IO Emit Error]', err);
  }

  res.status(201).json({
    success: true,
    message: 'Job application submitted successfully. HR will contact shortlisted candidates.',
    data: { id: application._id },
  });
});
