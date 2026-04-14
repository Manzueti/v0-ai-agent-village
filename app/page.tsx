import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen grass-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-amber-900/90 border-4 border-yellow-800 rounded-xl p-10 shadow-2xl max-w-xl w-full">
        <div className="text-6xl mb-4">🏰</div>
        <h1
          className="text-4xl font-black text-yellow-300 tracking-widest mb-4"
          style={{ textShadow: '2px 2px 0 #000, 4px 4px 0 #78350f' }}
        >
          WELCOME CHIEF
        </h1>
        <p className="text-yellow-100/90 mb-8 leading-relaxed text-sm">
          Your AI agents are waiting for orders. Enter the village to manage your
          workforce, upgrade capabilities, and automate your empire.
        </p>
        <Link href="/agent-management">
          <button
            className="px-8 py-4 bg-gradient-to-b from-green-500 to-green-700 rounded-lg font-black text-xl border-b-4 border-green-900 hover:from-green-400 hover:to-green-600 active:border-b-0 active:translate-y-1 shadow-lg text-white tracking-widest transition-all"
            style={{ textShadow: '1px 1px 0 #000' }}
          >
            ENTER VILLAGE
          </button>
        </Link>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { emoji: '🧠', label: '6 Agents' },
            { emoji: '⚡', label: 'Live Metrics' },
            { emoji: '🛡️', label: 'Full Control' },
          ].map((item) => (
            <div key={item.label} className="bg-amber-800/60 border-2 border-amber-700 rounded-lg p-3">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-yellow-200 text-xs font-bold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
