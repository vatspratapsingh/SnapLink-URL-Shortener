'use client';

import { useState } from 'react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    setError('');
    setShortUrl('');

    // ✅ Frontend URL validation
    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Sending request to backend...");

      const response = await fetch('http://localhost:18080/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ long_url: longUrl }),
      });

      console.log("📥 Response status:", response.status);

      if (response.status === 0) {
        throw new Error('⚠️ No response from backend. Check CORS or server crash.');
      }

      const raw = await response.text();
      console.log("📦 Raw response text:", raw);

      let data = {};
      try {
        data = JSON.parse(raw);
        console.log("✅ Parsed response:", data);
      } catch (jsonError) {
        console.error("❌ JSON parsing error:", jsonError);
        setError('Invalid JSON returned from backend:\n' + raw);
        return;
      }

      if (!response.ok) {
        setError(data.error || `Unexpected error occurred. Raw: ${raw}`);
      } else {
        setShortUrl(data.short_url);

        // ✅ Auto-copy to clipboard
        try {
          await navigator.clipboard.writeText(data.short_url);
          console.log("📋 Short URL copied to clipboard");
        } catch (err) {
          console.warn("⚠️ Could not copy to clipboard:", err);
        }
      }

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(`❌ Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
          html, body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1c1c2b, #6e6597);
            height: 100%;
          }
        `}</style>

      <main style={{
          margin: 0,
          padding: '2rem',
          fontFamily: 'Poppins, sans-serif',
          minHeight: '100vh',
          backgroundColor: '#343148', 
          color: '#EFDADD',           
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          🔗 SnapLink
        </h1>

        <input
          type="text"
          placeholder="Paste your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{
            padding: '0.70rem 1rem',
            width: '300px',
            borderRadius: '8px',
            border: '1px solid #444',
            backgroundColor: '#2e2e2e',
            color: '#fff',
            marginBottom: '1rem',
            fontSize: '1.05rem',
          }}
        />
        <button
          onClick={handleShorten}
          disabled={loading || !longUrl}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#464B65',
            color: 'cyan',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading || !longUrl ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s ease, background-color 0.3s ease',
            transform: loading ? 'scale(0.95)' : 'scale(1)',
            boxShadow: '0 4px 10px rgba(123, 97, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#6a4ee6';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#7B61FF';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>

        {shortUrl && (
          <div style={{
            marginTop: '2rem',
            backgroundColor: '#1e1e1e',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            fontSize: '1.1rem',
            color: '#00ffcc',
            textAlign: 'center'
          }}>
            ✅ Short URL:&nbsp;
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#00c4ff',
                fontWeight: 'bold',
                textDecoration: 'underline',
                wordBreak: 'break-all'
              }}
            >
              {shortUrl}
            </a>
          </div>
        )}

        {error && (
          <p style={{ marginTop: '1rem', color: 'red', fontSize: '1rem' }}>
            ❌ {error}
          </p>
        )}
      </main>
    </>
  );
}