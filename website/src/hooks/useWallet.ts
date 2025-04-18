import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { AztecAddress, AccountWallet } from '@aztec/aztec.js';

/**
 * Hook to access the connected wallet
 * @returns The wallet instance, available wallets, a function to switch wallets, and loading state
 */
export function useWallet(): { 
  wallet: AccountWallet | undefined; 
  address: AztecAddress | undefined;
  isLoading: boolean 
} {
  const { wallet, address, isLoading } = useContext(WalletContext);
  return { wallet, address, isLoading };
} 