import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    const formattedUrl = formatUrl(url);
    if (!isValidUrl(formattedUrl)) {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/predict', { url: formattedUrl });
      setResult(response.data);
    } catch (error) {
      setError('An error occurred while scanning the URL. Please try again.');
    }
    setLoading(false);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  };

  const renderResultDetails = () => {
    if (typeof result.details === 'object') {
      return <pre>{JSON.stringify(result.details, null, 2)}</pre>;
    }
    return result.details;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Phishing Link Scanner</h1>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button onClick={handleScan} disabled={loading}>
          {loading ? (
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          ) : (
            'Scan URL'
          )}
        </button>
        <div className="message-container">
          {error && <div className="error">{error}</div>}
          {result && (
            <div className={`result ${result.phishing ? 'danger' : 'safe'}`}>
              {result.phishing ? 'Warning: This URL is a potential phishing site.' : 'This URL is safe.'}
              <p>{renderResultDetails()}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
