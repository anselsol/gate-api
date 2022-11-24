import { PublicKey } from '@solana/web3.js';
import HASHLIST from './constants/hashlist.json';
import { getNFTsByOwner, getNFTMetadata } from './nft';

/**
 * This function fetchs the Metadata of the respective NFT provided from the mint address
 *
 * @param mint - The mint address of the NFT
 * @returns object with the respective metadata and mint address
 */
export const fetchNFTMetadata = async (conn: any, mint: string) => {
  return await getNFTMetadata(new PublicKey(mint), conn);
};

/**
 * This function checks that the NFT that is about to be updated belongs
 * to the wallet making the request for an upgrade.
 *
 *  @param nftAddress - The nft address on the blockchain
 *  @param walletId - The wallet id trying to run the upgrade
 *  @returns boolean indicating the NFT Ownership
 */
export const walletOwnsNft = async (conn: any, walletId: string) => {
  // const NFTList = await getNFTsByOwner(new PublicKey(walletId), conn);

  // if (!NFTList.length) {
  //   return false;
  // }

  const hashlistIds = HASHLIST.map(hash => hash.id);

  return hashlistIds.some((pubkey) => pubkey === walletId);
};