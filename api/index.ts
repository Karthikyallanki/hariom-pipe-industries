import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}
