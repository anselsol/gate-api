import type { Request, Response } from 'express';

import { solanaAuthorize, verifyToken } from '@api/solana/solana-verify';
import { globalSolCon } from '@config';

export async function login(req: Request, res: Response) {
  const { signature, walletAddress } = req.body;

  try {
    let solanaLoginRes = await solanaAuthorize(signature, walletAddress, globalSolCon);

    if (!solanaLoginRes) {
      return res.status(404).send({ "error": 404 });
    }

    res.send({
      "token": solanaLoginRes
    });
  } catch (e) {
    console.log('e: ', e);
    res.status(500).send({
      "error": "Cannot verify wallet"
    });
  }
}

export async function openLogin(req: Request, res: Response) {
  const { signature, walletAddress } = req.body;

  try {
    let isOpenLogin = true;
    let solanaLoginRes = await solanaAuthorize(signature, walletAddress, globalSolCon, isOpenLogin);

    if (!solanaLoginRes) {
      return res.status(404).send({ "error": 404 });
    }

    res.send({
      "token": solanaLoginRes
    });
  } catch (e) {
    console.log('e: ', e);
    res.status(500).send({
      "error": "Cannot verify wallet"
    });
  }
}

export async function checkWallet(req: Request, res: Response) {
  try {
    let tokenIsValid = await verifyToken(req.header('Authorization'));

    if (!tokenIsValid) {
      return res.status(401).send({ "error": 401 });
    }

    res.send({ "isLoggedIn": true });
  } catch (e) {
    res.status(401).send({ "error": 401 });
  }
}