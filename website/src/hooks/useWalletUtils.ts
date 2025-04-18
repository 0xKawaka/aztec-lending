import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { AztecAddress, AccountWallet } from '@aztec/aztec.js';

/**
 * Combined hook that provides all wallet utilities
 * @returns All wallet functionality in one place
 */
export function useWalletUtils(): {
  wallet: AccountWallet | undefined;
  address: AztecAddress | undefined;
  availableWallets: AccountWallet[];
  switchWallet: (walletIndex: number) => void;
  isLoading: boolean;
} {
  const { wallet, address, availableWallets, switchWallet, isLoading } = useContext(WalletContext);
  return { wallet, address, availableWallets, switchWallet, isLoading };
} 