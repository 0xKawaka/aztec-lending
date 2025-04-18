import { Contract, createPXEClient, loadContractArtifact, waitForPXE } from '@aztec/aztec.js';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { PriceFeedContract } from '@aztec/noir-contracts.js/PriceFeed';
import { TokenContract } from '@aztec/noir-contracts.js/Token';
// import { LendingContract } from '../../contracts/src/artifacts/Lending.ts';
import { LendingContract } from './contracts/Lending.ts';
import { writeFileSync } from 'fs';


const { PXE_URL = 'http://localhost:8080' } = process.env;

async function main() {
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);

  const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
  const ownerAddress = ownerWallet.getAddress();
  
  const collatToken = await TokenContract.deploy(ownerWallet, ownerAddress, 'Collateral', 'COL', 9)
    .send()
    .deployed();
  const borrowedToken = await TokenContract.deploy(ownerWallet, ownerAddress, 'Borrow', 'BOR', 9)
    .send()
    .deployed();

  const priceFeed = await PriceFeedContract.deploy(ownerWallet)
    .send()
    .deployed();

  const lending = await LendingContract.deploy(ownerWallet)
  .send()
  .deployed();

  console.log(`Collateral Token deployed at ${collatToken.address.toString()}`);
  console.log(`Borrow Token deployed at ${borrowedToken.address.toString()}`);
  console.log(`PriceFeed deployed at ${priceFeed.address.toString()}`);
  console.log(`Lending deployed at ${lending.address.toString()}`);

  const addresses = { collatToken: collatToken.address.toString(), borrowedToken: borrowedToken.address.toString(), priceFeed: priceFeed.address.toString(), lending: lending.address.toString() };
  writeFileSync('contracts.json', JSON.stringify(addresses, null, 2));
  writeFileSync('../website/src/blockchain/dev-contracts.json', JSON.stringify(addresses, null, 2));
  const allAssets = {
    [collatToken.address.toString()]: { name: 'Collateral', ticker: 'COL', decimals: 9 },
    [borrowedToken.address.toString()]: { name: 'Borrow', ticker: 'BOR', decimals: 9 },
  }
  writeFileSync('../website/src/blockchain/dev-all-assets.json', JSON.stringify(allAssets, null, 2));
  const collateralAssets = [collatToken.address.toString()]
  writeFileSync('../website/src/blockchain/dev-collateral-assets.json', JSON.stringify(collateralAssets, null, 2));
  const borrowedAssets = [borrowedToken.address.toString()]
  writeFileSync('../website/src/blockchain/dev-borrowable-assets.json', JSON.stringify(borrowedAssets, null, 2));


  await collatToken.methods.set_minter(ownerAddress, true).send().wait();
  await borrowedToken.methods.set_minter(lending.address, true).send().wait();
  await collatToken.methods.mint_to_public(ownerAddress, 1000n * 10n ** 9n).send().wait(); 

  await priceFeed.methods.set_price(0n, 3n * 10n ** 9n).send().wait();

  await lending.methods.init(priceFeed.address, 5000, collatToken.address, borrowedToken.address).send().wait();
  console.log(`Lending initialized`);

}

main();
