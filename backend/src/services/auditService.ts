import { AuditLog } from '../models/AuditLog';
import { logger } from '../utils/logger';

export const auditService = {
  logAction: async (params: {
    userId?: string;
    userName: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
  }): Promise<void> => {
    try {
      await AuditLog.create({
        userId: params.userId,
        userName: params.userName,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details,
        ipAddress: params.ipAddress,
      });
      logger.info(`[AuditLog] User '${params.userName}' executed '${params.action}' on ${params.entityType}`);
    } catch (err) {
      logger.error('[AuditLog Error] Failed to write audit log entry:', err);
    }
  },
};
