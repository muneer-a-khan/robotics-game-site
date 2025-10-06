'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  circuitNumber: number;
  difficulty: string;
  timeTaken: number;
  isCorrect: boolean;
  createdAt: string;
}

export default function LeaderboardPage() {
  const [sessions, setSessions] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <Link
            href="/"
            className="inline-block mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
            🏆 Leaderboard
          </h1>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading leaderboard...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold">{error}</p>
              <p className="text-red-600 text-sm mt-2">
                Make sure your Supabase connection is configured correctly.
              </p>
            </div>
          )}

          {!loading && !error && sessions.length === 0 && (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-700 text-lg font-semibold mb-2">
                No games played yet!
              </p>
              <p className="text-gray-600 mb-6">
                Be the first to complete a circuit challenge.
              </p>
              <Link
                href="/game"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start Playing
              </Link>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-6 py-4 text-left rounded-tl-lg">Rank</th>
                    <th className="px-6 py-4 text-left">Circuit</th>
                    <th className="px-6 py-4 text-left">Difficulty</th>
                    <th className="px-6 py-4 text-left">Time</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left rounded-tr-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr
                      key={session.id}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-indigo-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          <span className="font-semibold text-gray-700">
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        Circuit {session.circuitNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            session.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {session.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-gray-700">
                        {formatTime(session.timeTaken)}
                      </td>
                      <td className="px-6 py-4">
                        {session.isCorrect ? (
                          <span className="text-green-600 font-semibold">✓ Correct</span>
                        ) : (
                          <span className="text-red-600 font-semibold">✗ Incorrect</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/game"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Play Game
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

