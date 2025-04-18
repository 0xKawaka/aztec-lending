import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './contexts/WalletContext.tsx'

const PXE_URL = import.meta.env.VITE_PXE_URL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider pxeUrl={PXE_URL}>
      <App />
    </WalletProvider>
  </StrictMode>,
)
