import * as bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import * as jose from 'jose';
import { TextEncoder } from 'util';
import { Connection } from '@solana/web3.js';
import { walletOwnsNft } from './solana';

const LOCAL_RSA256_KEY = `-----BEGIN PRIVATE KEY-----
  MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIvQwHYqe82zpxy2B
  ZsHemhNqDwOYeedkLZra0QwCoQKhRANCAATLcz/VQUn1K9e4klghuktB7s0KRENK
  LIBMwXTxjcXrdf2aCpyH422OCy/fIJLO852LzPdbYWuD9a22JzIEKSWm
  -----END PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEy3M/1UFJ9SvXuJJYIbpLQe7NCkRD
SiyATMF08Y3F63X9mgqch+Ntjgsv3yCSzvOdi8z3W2Frg/WtticyBCklpg==
-----END PUBLIC KEY-----`;

export async function verifyToken(token: string | undefined): Promise<boolean | null> {
  if (!token) {
    return false;
  }

  const jwt = token.split('Bearer ')[1];

  const alg = 'ES256';
  const loadedPublicKey = await jose.importSPKI(publicKey, alg);

  try {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, loadedPublicKey, {
      issuer: 'urn:libertysquare:notion',
      audience: 'urn:libertysquare:nft-owner'
    });
    console.log(protectedHeader)
    console.log(payload)

    return true;

  } catch (e: any) {
    console.log('e: ', e.message);
    return false;
  }
}

export async function solanaAuthorize(
  signedMessage: any,
  walletId: string,
  connection: Connection
): Promise<string | boolean> {
  var enc = new TextEncoder();
  let walletIsVerified = nacl.sign.detached.verify(
    enc.encode("Please sign this message to login."),
    bs58.decode(signedMessage.signature),
    bs58.decode(signedMessage.walletAddress)
  );

  if (walletIsVerified) {
    try {
      const isWalletOwnNft = await walletOwnsNft(connection, walletId);

      if (isWalletOwnNft) {
        const alg = 'ES256';
        const signKey = await jose.importPKCS8(LOCAL_RSA256_KEY, alg);

        return await new jose.SignJWT({ 'urn:libertysquare:has-access-alpha': true })
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setIssuer('urn:libertysquare:notion')
          .setAudience('urn:libertysquare:nft-owner')
          .setExpirationTime('24h')
          .sign(signKey);
      }
    } catch (e: any) {
      console.log('e: ', e.message);
    }
  }
  return false;
}
