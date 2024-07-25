import React, { useState } from 'react';
import PasswordStrengthChecker from './components/PasswordStrengthChecker';
import PasswordGenerator from './components/PasswordGenerator';
import './App.css';

const App = () => {
    const [currentView, setCurrentView] = useState('checker');

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            {currentView === 'checker' ? (
                <PasswordStrengthChecker onSwitchToGenerator={() => setCurrentView('generator')} />
            ) : (
                <PasswordGenerator onSwitchToChecker={() => setCurrentView('checker')} />
            )}
        </div>
    );
};

export default App;
