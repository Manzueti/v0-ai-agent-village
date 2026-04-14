'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Shield, Settings, Server, Brain } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Village', href: '/', icon: Home },
    { name: 'Agents', href: '/agent-management', icon: Users },
    { name: 'Infra', href: '/infrastructure', icon: Server },
    { name: 'AI Control', href: '/ai-control', icon: Brain },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <div className="w-20 bg-gradient-to-b from-amber-900 to-amber-950 border-r-4 border-yellow-900 h-screen flex flex-col items-center py-4 gap-4 shadow-xl flex-shrink-0">
      {/* Logo */}
      <div className="w-12 h-12 bg-yellow-500 rounded-full border-4 border-yellow-700 flex items-center justify-center text-2xl mb-6 shadow-lg">
        🏰
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-yellow-600 border-b-4 border-yellow-900 shadow-inner scale-105'
                : 'bg-amber-800 border-b-4 border-amber-950 hover:bg-amber-700'
            }`}
            title={item.name}
          >
            <item.icon
              className={`w-6 h-6 ${isActive ? 'text-white' : 'text-yellow-200'}`}
            />
            <span className="absolute -bottom-6 text-[10px] text-yellow-200 opacity-0 group-hover:opacity-100 font-bold whitespace-nowrap">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
