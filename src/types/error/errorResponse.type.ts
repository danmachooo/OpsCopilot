import { ZodIssue } from "zod/v3";

export interface PrismaErrorDetail {
  code: string;
  target?: string[];
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}
