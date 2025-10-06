import Link from 'next/link';

export default function InstructionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <Link
          href="/"
          className="inline-block mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-indigo-900 mb-6">
          Game Instructions
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              Objective
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Complete 3 circuit challenges within 9 minutes total (3 minutes per circuit).
              Build functional circuits by placing and connecting components on the board.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              How to Play
            </h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <strong>Choose Difficulty:</strong> At the start of each circuit, select either
                  Easy or Hard mode. Hard mode features more complex circuits with additional components.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <strong>Place Components:</strong> Drag components from the toolbox on the right
                  and drop them onto the circuit board. The battery is already placed for you.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <strong>Rotate Components:</strong> Double-click any component or select it and
                  click the "Rotate Selected" button to change its orientation.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <strong>Connect Components:</strong> Click "Connect Mode", then click two
                  components in sequence to create a connection between them.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </span>
                <div>
                  <strong>Complete Circuit:</strong> Click the "Done" button when finished, or
                  the circuit will auto-complete after 3 minutes.
                </div>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              Available Components
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Battery', desc: 'Power source (pre-placed)' },
                { name: 'Wire', desc: 'Conducts electricity' },
                { name: 'LED', desc: 'Light emitting diode' },
                { name: 'Resistor', desc: 'Limits current flow' },
                { name: 'Switch', desc: 'Opens/closes circuit' },
                { name: 'Motor', desc: 'Converts electricity to motion' },
                { name: 'Buzzer', desc: 'Makes sound' },
                { name: 'Fan', desc: 'Creates airflow' },
                { name: 'Lamp', desc: 'Light bulb' },
              ].map((component) => (
                <div
                  key={component.name}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-300"
                >
                  <h3 className="font-bold text-gray-800 mb-1">{component.name}</h3>
                  <p className="text-sm text-gray-600">{component.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              Tips & Tricks
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>Plan your circuit before placing components to save time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>Use the grid pattern on the board to align components neatly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>Double-click to quickly rotate components without selecting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>Watch the timer - red means less than 30 seconds remaining!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                <span>Your progress is automatically saved to the database</span>
              </li>
            </ul>
          </section>

          <section className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-900 mb-3">
              Important Notes
            </h2>
            <ul className="space-y-2 text-yellow-900">
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span>The battery is always pre-placed at the start of each circuit</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span>All component placements, connections, and orientations are tracked</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span>Circuit validation happens after clicking "Done" or when time expires</span>
              </li>
            </ul>
          </section>

          <div className="pt-4">
            <Link
              href="/game"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-center text-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Start Playing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

