'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RedirectPage() {
  const params = useParams();
  const id = (params as { id: string }).id;

  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; original: string }[]>([]);

  useEffect(() => {
    document.title = 'SnapLink - Smart URL Shortener';
  }, []);

  useEffect(() => {
    if (!id) return;

    const resolveUrl = async () => {
      try {
        console.log("📡 Fetching:", `http://localhost:18080/resolve?id=${id}`);
        const res = await fetch(`http://localhost:18080/resolve?id=${id}`);
        if (!res.ok) {
          throw new Error(`Short ID not found. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("📥 Response from backend:", data);

        if (data.original_url) {
          setHistory((prev) => [...prev, { id, original: data.original_url }]);
          console.log("🌐 Redirecting to:", data.original_url);
          window.location.replace(data.original_url);
        } else {
          setError("❌ No URL found.");
        }
      } catch (err: any) {
        console.error("❌ Redirect failed:", err);
        setError(err.message);
      }
    };

    resolveUrl();
  }, [id]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <motion.div
        className="bg-gray-900 text-white p-8 rounded-2xl shadow-2xl max-w-xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-4 text-center text-purple-300">🔗 SnapLink</h1>
        <p className="text-center text-lg">
          {error ? `❌ ${error}` : '⏳ Redirecting...'}
        </p>
      </motion.div>

      <div className="bg-gray-800 text-white p-6 mt-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-3 text-purple-400">📜 Redirect History</h2>
        <ul className="text-sm space-y-2">
          {history.map((entry, index) => (
            <li key={index} className="flex justify-between">
              <span className="font-medium">/{entry.id}</span>
              <a
                href={entry.original}
                target="_blank"
                className="text-blue-400 underline truncate max-w-[70%] text-right"
              >
                {entry.original}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}