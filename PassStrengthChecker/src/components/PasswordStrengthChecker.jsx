import React, { useState, useCallback } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '@fortawesome/fontawesome-free/css/all.min.css';

const sha1 = (str) => {
    return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex).toUpperCase();
};

const PasswordStrengthChecker = ({ onSwitchToGenerator }) => {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [username, setUsername] = useState('');
    const [breachInfo, setBreachInfo] = useState('');
    const [isCheckingBreach, setIsCheckingBreach] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const checkStrength = useCallback(async () => {
        const feedback = [];
        const suggestions = [];
        let strength = 'Weak';

        if (password.length < 8) {
            feedback.push("Password is too short. Should be at least 8 characters.");
            suggestions.push("Make it at least 8 characters long.");
        } else {
            if (!/[a-z]/.test(password)) {
                feedback.push("Add lowercase letters.");
                suggestions.push("Include lowercase letters (a-z).");
            }
            if (!/[A-Z]/.test(password)) {
                feedback.push("Add uppercase letters.");
                suggestions.push("Include uppercase letters (A-Z).");
            }
            if (!/[0-9]/.test(password)) {
                feedback.push("Add numbers.");
                suggestions.push("Include numbers (0-9).");
            }
            if (!/[^a-zA-Z0-9]/.test(password)) {
                feedback.push("Add special characters.");
                suggestions.push("Include special characters (!@#$%^&*()).");
            }
            if (username && password.toLowerCase().includes(username.toLowerCase())) {
                feedback.push("Password should not contain your username.");
                suggestions.push("Avoid using your username in the password.");
            }
            if (feedback.length === 0) {
                strength = 'Strong';
            } else if (feedback.length <= 2) {
                strength = 'Moderate';
            }
        }

        if (strength !== 'Strong') {
            const strongerPassword = generatePassword(password.length + 4, true, true);
            suggestions.push(`Try this stronger password: ${strongerPassword}`);
        }

        setStrength(strength);
        setFeedback(feedback);
        setSuggestions(suggestions);

        await checkBreach(password);
    }, [password, username]);

    const generatePassword = (length, numbersAllowed, charactersAllowed) => {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        if (numbersAllowed) str += '0123456789';
        if (charactersAllowed) str += '~`!@#$%^&*(){}[]?';
        for (let i = 0; i < length; i++) {
            const char = Math.floor(Math.random() * str.length);
            pass += str.charAt(char);
        }
        return pass;
    };

    const checkBreach = async (password) => {
        setIsCheckingBreach(true);
        setBreachInfo('');

        try {
            const sha1Password = sha1(password);
            const prefix = sha1Password.substring(0, 5);
            const suffix = sha1Password.substring(5);

            const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
            const hashes = response.data.split('\r\n');

            const found = hashes.some(hash => hash.startsWith(suffix));

            if (found) {
                setBreachInfo('This password has been exposed in a data breach.');
            } else {
                setBreachInfo('This password has not been exposed in a data breach.');
            }
        } catch (error) {
            console.error("Error checking password breach:", error);
            setBreachInfo('Unable to check password breach status. Please try again later.');
        } finally {
            setIsCheckingBreach(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
            <h2 className="text-2xl font-bold mb-4">Password Strength Checker</h2>
            <div className="relative">
                <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-2 top-2  p-2  rounded focus:outline-none"
                >
                    <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            </div>
            <button
                onClick={checkStrength}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
                Check Strength
            </button>
            {strength && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Strength: {strength}</h3>
                    {feedback.length > 0 && (
                        <ul className="text-red-500 mt-2">
                            {feedback.map((item, index) => (
                                <li key={index} className="mb-1">• {item}</li>
                            ))}
                        </ul>
                    )}
                    {suggestions.length > 0 && (
                        <ul className="text-green-500 mt-2">
                            {suggestions.map((item, index) => (
                                <li key={index} className="mb-1">• {item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {isCheckingBreach && <p className="text-gray-500 mt-2">Checking for breach...</p>}
            {breachInfo && (
                <p className={`mt-4 ${breachInfo.includes('exposed') ? 'text-red-500' : 'text-green-500'}`}>
                    {breachInfo}
                </p>
            )}
            <button
                onClick={onSwitchToGenerator}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Go to Password Generator
            </button>
        </div>
    );
};

export default PasswordStrengthChecker;
