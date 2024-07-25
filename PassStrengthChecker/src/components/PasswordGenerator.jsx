import React, { useState, useCallback, useEffect, useRef } from 'react';

const PasswordGenerator = ({ onSwitchToChecker }) => {
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [length, setLength] = useState(12);
    const [numbersAllowed, setNumbersAllowed] = useState(true);
    const [charactersAllowed, setCharactersAllowed] = useState(true);
    const passwordRef = useRef(null);

    const generatePassword = useCallback(() => {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        if (numbersAllowed) str += '0123456789';
        if (charactersAllowed) str += '~`!@#$%^&*(){}[]?';
        for (let i = 0; i < length; i++) {
            const char = Math.floor(Math.random() * str.length);
            pass += str.charAt(char);
        }
        setGeneratedPassword(pass);
    }, [length, numbersAllowed, charactersAllowed]);

    const copyPasswordToClipboard = useCallback(() => {
        passwordRef.current?.select();
        window.navigator.clipboard.writeText(generatedPassword);
    }, [generatedPassword]);

    useEffect(() => {
        generatePassword();
    }, [length, numbersAllowed, charactersAllowed, generatePassword]);

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
            <h2 className="text-2xl font-bold mb-4">Random Password Generator</h2>
            <input
                type="text"
                value={generatedPassword}
                placeholder="Generated Password"
                ref={passwordRef}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                readOnly
            />
            <button
                onClick={copyPasswordToClipboard}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
                Copy to Clipboard
            </button>
            <div className="mt-4 flex flex-col space-y-4">
                <input
                    type="range"
                    min={8}
                    max={20}
                    className="cursor-pointer"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                />
                <label className="text-black font-bold">Length: {length}</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={numbersAllowed}
                            onChange={() => setNumbersAllowed(!numbersAllowed)}
                            className="h-4 w-5"
                        />
                        <span className="ml-2 text-black font-bold">Numbers</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={charactersAllowed}
                            onChange={() => setCharactersAllowed(!charactersAllowed)}
                            className="h-4 w-5"
                        />
                        <span className="ml-2 text-black font-bold">Characters</span>
                    </label>
                </div>
            </div>
            <button
                onClick={onSwitchToChecker}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Go to Password Strength Checker
            </button>
        </div>
    );
};

export default PasswordGenerator;
