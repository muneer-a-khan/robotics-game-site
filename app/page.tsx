import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-900 mb-6">
          Snap Circuit Challenge
        </h1>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            How to Play
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">1.</span>
              <span>Complete 3 circuits in 9 minutes (3 minutes per circuit)</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">2.</span>
              <span>Choose easy or hard difficulty for each circuit</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">3.</span>
              <span>Drag components from the toolbox to the board</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">4.</span>
              <span>Connect components by clicking the connect button</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">5.</span>
              <span>Rotate components using the rotate option</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">6.</span>
              <span>Click done or wait for auto-complete after 3 minutes</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            href="/game"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-center text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Start Game
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/instructions"
              className="block w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200"
            >
              Instructions
            </Link>
            <Link
              href="/leaderboard"
              className="block w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Battery is pre-placed on the board</p>
          <p className="mt-1">Track your progress and compete with others!</p>
        </div>
      </div>
    </main>
  );
}
