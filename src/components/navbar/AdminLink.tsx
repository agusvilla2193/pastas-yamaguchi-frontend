import React from 'react';
import Link from 'next/link';

export const AdminLink: React.FC = () => (
    <Link
        href="/admin/orders"
        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/20 bg-red-600/5 hover:bg-red-600 transition-all duration-300"
    >
        <div className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:bg-white animate-pulse" />
        <span className="text-red-500 group-hover:text-white text-[9px] font-black uppercase tracking-[0.2em]">
            Admin
        </span>
    </Link>
);
