import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getVerificationExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15); // 15 minutes
  return expiry;
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const verificationCode = generateVerificationCode();
  const verificationExpiry = getVerificationExpiry();

  const user = await storage.createUser({
    name,
    email,
    password: hashedPassword,
    verificationCode,
    verificationExpiry,
  });

  return user;
}

export async function verifyUser(email: string, code: string): Promise<boolean> {
  const user = await storage.getUserByEmail(email);
  
  if (!user || !user.verificationCode || !user.verificationExpiry) {
    return false;
  }

  if (user.verificationCode !== code) {
    return false;
  }

  if (new Date() > new Date(user.verificationExpiry)) {
    return false;
  }

  await storage.updateUser(user.id, {
    emailVerified: true,
    verificationCode: null,
    verificationExpiry: null,
  });

  return true;
}

export async function initiatePasswordReset(email: string): Promise<boolean> {
  const user = await storage.getUserByEmail(email);
  
  if (!user) {
    return false;
  }

  const resetCode = generateVerificationCode();
  const resetExpiry = getVerificationExpiry();

  await storage.updateUser(user.id, {
    resetCode,
    resetExpiry,
  });

  return true;
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
  const user = await storage.getUserByEmail(email);
  
  if (!user || !user.resetCode || !user.resetExpiry) {
    return false;
  }

  if (user.resetCode !== code) {
    return false;
  }

  if (new Date() > new Date(user.resetExpiry)) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);

  await storage.updateUser(user.id, {
    password: hashedPassword,
    resetCode: null,
    resetExpiry: null,
  });

  return true;
}
