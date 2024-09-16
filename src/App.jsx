import React from 'react';
import { ThemeProvider } from './Airdrop';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { Airdrop } from './Airdrop';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  return (
    <ThemeProvider>
    <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/WjzFiD5ZVXf1CAbKM1lHlAUhWUveRWWQ"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="app-container">
            <header className="app-header">
              <div className="logo">
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
              <div className="wallet-buttons">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
            </header>
            <main className="app-main">
              <div className="welcome-message">
                Welcome to SolanaXDrip - Your Solana Faucet!
              </div>
              <Airdrop />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
    </ThemeProvider>
  );
}

// Styles
const styles = `
body {
  background-color: #121212;
  color: #e0e0e0;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.logo {
  width: 300px;
  height: 100px;
}

.wallet-buttons {
  display: flex;
  gap: 1rem;
}

.app-main {
  background: linear-gradient(145deg, #1e1e1e, #2d2d2d);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.welcome-message {
  font-size: 1.2rem;
  color: #bb86fc;
  text-align: center;
  margin-bottom: 2rem;
}

/* Override some wallet adapter button styles */
.wallet-adapter-button {
  height: auto;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.wallet-adapter-button-trigger {
  background-color: #bb86fc;
  color: #000;
}

.wallet-adapter-button-trigger:hover {
  background-color: #9965e5;
}

.wallet-adapter-button-disconnect {
  background-color: #cf6679;
  color: #000;
}

.wallet-adapter-button-disconnect:hover {
  background-color: #b4505f;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: center;
  }

  .logo {
    margin-bottom: 1rem;
  }

  .wallet-buttons {
    flex-direction: column;
    width: 100%;
  }

  .wallet-adapter-button {
    width: 100%;
  }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default App;