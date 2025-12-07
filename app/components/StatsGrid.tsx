'use client';

import { useState } from 'react';

interface StatsGridProps {
  users: number;
  totalPosts: number;
  published: number;
  drafts: number;
}

export function StatsGrid({ users, totalPosts, published, drafts }: StatsGridProps) {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const stats = [
    { label: 'Users', value: users, color: 'text-blue-400', id: 'users' },
    { label: 'Total Posts', value: totalPosts, color: 'text-purple-400', id: 'total' },
    { label: 'Published', value: published, color: 'text-emerald-400', id: 'published' },
    { label: 'Drafts', value: drafts, color: 'text-amber-400', id: 'drafts' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:scale-105 hover:border-slate-700 hover:bg-slate-900/80 ${
            hoveredStat === stat.id ? 'shadow-lg' : ''
          }`}
          onMouseEnter={() => setHoveredStat(stat.id)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400 transition-colors group-hover:text-slate-300">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${stat.color} transition-transform group-hover:scale-110`}>
              {stat.value}
            </p>
          </div>
          
          {/* Subtle background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-slate-800/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
        </div>
      ))}
    </div>
  );
}
