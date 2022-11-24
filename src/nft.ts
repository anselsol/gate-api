import { PublicKey, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { programs } from '@metaplex/js';

const {
  metadata: { Metadata },
} = programs;

async function getTokensByOwner(owner: PublicKey, connection: Connection) {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  return tokens.value
    .filter(token => {
      const amount = token.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map(token => {
      return { pubkey: token.pubkey, mint: token.account.data.parsed.info.mint };
    });
}

export const getNFTMetadata = async (mint: PublicKey, connection: Connection) => {
  try {
    const metadataPDA = await Metadata.getPDA(mint);
    const onchainMetadata = (await Metadata.load(connection, metadataPDA)).data;

    return {
      mint: new PublicKey(mint),
      onchainMetadata,
    };
  } catch (e) {
    console.log(`failed to pull metadata for token ${mint}`);
  }
};

interface NFTMetadata {
  mint: PublicKey;
  onchainMetadata: programs.metadata.MetadataData;
}

export const getNFTMetadataForMany = async (tokens: any, connection: Connection) => {
  const promises: NFTMetadata[] = [];

  tokens.forEach(async (t: any) => {
    const nftMetadata = await getNFTMetadata(t.mint, connection);
    promises.push(nftMetadata!);
  });

  const nfts = (await Promise.all(promises)).filter(n => !!n);

  return nfts;
};

export const getNFTsByOwner = async (owner: PublicKey, connection: Connection) => {
  return await getTokensByOwner(owner, connection);
};
