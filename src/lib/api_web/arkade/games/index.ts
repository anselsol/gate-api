import { prisma } from "@config";
import type { Request, Response } from "express";

export async function createGame(req: Request, res: Response) {
  const users = await prisma.user.findMany();
  return res.send(JSON.stringify(users));
}

export async function updateGame(req: Request, res: Response) {
  return {}
}