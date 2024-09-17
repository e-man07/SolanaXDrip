import React from 'react';
import { ThemeProvider } from './Airdrop';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { Airdrop } from './Airdrop';
import styles from './App.module.css';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function AppContent() {
  return (
    <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/WjzFiD5ZVXf1CAbKM1lHlAUhWUveRWWQ"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className={styles.appContainer}>
            <header className={styles.appHeader}>
              <div className={styles.logo}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor:"#9945FF", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#14F195", stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="100" fill="#1A202C" />
                  <text x="150" y="60" fontFamily="Arial, sans-serif" fontSize="40" fill="url(#grad1)" textAnchor="middle">
                    Solana<tspan fill="#14F195">X</tspan>Drip
                  </text>
                  <path d="M260 70 Q270 60, 280 70 T300 70" stroke="url(#grad1)" strokeWidth="4" fill="none" />
                </svg>
              </div>
              <div className={styles.walletButtons}>
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
            </header>
            <main className={styles.appMain}>
              <div className={styles.welcomeMessage}>
                Welcome to SolanaXDrip - Your Solana Faucet!
              </div>
              <Airdrop />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
