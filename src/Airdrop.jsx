import React, { useState, useEffect, createContext, useContext } from 'react';
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import './Airdrop.css';

// Create a theme context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function Airdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [isReady, setIsReady] = useState(false);
    const [amount, setAmount] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownMessage, setCooldownMessage] = useState('');
    const [cooldownTime, setCooldownTime] = useState(null);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const FOUR_HOUR_WINDOW = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const ONE_MINUTE = 60 * 1000; // 1 minute in milliseconds
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds

    useEffect(() => {
        console.log("Wallet state:", wallet);
        setIsReady(true);
        checkRateLimit(); // Check rate limit state on load

        // Setup an interval to update the cooldown timer every second
        const timerInterval = setInterval(() => {
            updateCooldownTimer();
        }, 1000);

        return () => clearInterval(timerInterval); // Clean up the interval on component unmount
    }, [wallet]);

    const getRateLimitData = () => {
        const data = localStorage.getItem('airdropRateLimit');
        return data ? JSON.parse(data) : { requestCount: 0, lastRequestTime: 0, windowStartTime: Date.now() };
    };

    const setRateLimitData = (data) => {
        localStorage.setItem('airdropRateLimit', JSON.stringify(data));
    };

    const resetRateLimit = () => {
        setRateLimitData({ requestCount: 0, lastRequestTime: 0, windowStartTime: Date.now() });
        setIsCooldown(false);
        setCooldownMessage('');
        setCooldownTime(null); // Reset timer
    };

    const checkRateLimit = () => {
        const data = getRateLimitData();
        const currentTime = Date.now();

        // Reset the window if 4 hours have passed
        if (currentTime - data.windowStartTime > FOUR_HOUR_WINDOW) {
            resetRateLimit();
            return;
        }

        const timeSinceLastRequest = currentTime - data.lastRequestTime;

        // Apply cooldown logic based on the number of requests
        if (data.requestCount >= 5 && timeSinceLastRequest < FIVE_MINUTES) {
            setIsCooldown(true);
            const remainingTime = FIVE_MINUTES - timeSinceLastRequest;
            setCooldownMessage(`Please wait ${Math.ceil(remainingTime / 1000)} seconds for the next airdrop.`);
            setCooldownTime(remainingTime); // Set countdown timer
        } else if (data.requestCount >= 3 && timeSinceLastRequest < ONE_MINUTE) {
            setIsCooldown(true);
            const remainingTime = ONE_MINUTE - timeSinceLastRequest;
            setCooldownMessage(`Please wait ${Math.ceil(remainingTime / 1000)} seconds for the next airdrop.`);
            setCooldownTime(remainingTime); // Set countdown timer
        } else {
            setIsCooldown(false);
            setCooldownMessage('');
            setCooldownTime(null); // No cooldown, no timer
        }
    };

    const updateCooldownTimer = () => {
        if (cooldownTime !== null && cooldownTime > 0) {
            setCooldownTime(prevTime => prevTime - 1000); // Decrease time by 1 second
        } else if (cooldownTime <= 0) {
            setCooldownTime(null); // Stop the timer when cooldown period is over
            setIsCooldown(false);  // Reset cooldown state
            setCooldownMessage(''); // Clear cooldown message
            checkRateLimit(); // Recheck the rate limit once the timer hits 0
        }
    };

    async function sendAirdropToUser() {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        if (isCooldown) {
            alert(cooldownMessage);
            return;
        }

        const data = getRateLimitData();
        const currentTime = Date.now();

        try {
            // Process the airdrop
            await connection.requestAirdrop(wallet.publicKey, parseFloat(amount) * LAMPORTS_PER_SOL);
            alert(`Airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
            setAmount('');

            // Update the rate limit data
            data.requestCount += 1;
            data.lastRequestTime = currentTime;

            // Update localStorage with the new data
            setRateLimitData(data);
            checkRateLimit();
        } catch (error) {
            console.error("Airdrop error:", error);
            alert("Error sending airdrop. See console for details.");
        }
    }

    const formatTime = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!isReady) {
        return <div className={`loading ${isDarkMode ? 'dark' : 'light'}`}>Loading...</div>;
    }

    return (
        <div className={`airdrop-container ${isDarkMode ? 'dark' : 'light'}`}>
            <h2 className="title">Solana Airdrop</h2>
            <button onClick={toggleTheme} className="theme-toggle">
                {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            {wallet.publicKey ? (
                <div className="wallet-connected">
                    <p className="wallet-address">
                        Wallet connected: 
                        <span className="address">{wallet.publicKey.toString()}</span>
                    </p>
                    <div className="airdrop-form">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount in SOL"
                            className="amount-input"
                            disabled={isCooldown}
                        />
                        <button onClick={sendAirdropToUser} className="airdrop-button" disabled={isCooldown}>
                            {isCooldown ? cooldownMessage : `Send Airdrop`}
                        </button>
                    </div>
                    {isCooldown && cooldownTime !== null && (
                        <div className="cooldown-timer">
                            <p>Cooldown: {formatTime(cooldownTime)} remaining</p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="connect-prompt">Please connect your wallet to use this feature.</p>
            )}
        </div>
    );
}
