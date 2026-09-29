import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLogModel extends Document {
  userId?: Types.ObjectId;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}

const AuditLogSchema = new Schema<IAuditLogModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLogModel>('AuditLog', AuditLogSchema);
