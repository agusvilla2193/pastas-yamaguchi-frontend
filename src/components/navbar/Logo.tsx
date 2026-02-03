import React from 'react';
import Link from 'next/link';

export const Logo: React.FC = () => (
    <Link href="/" className="group text-xl font-black italic tracking-tighter transition-all duration-300">
        <span className="text-white group-hover:text-red-600">YAMAGUCHI</span>
        <span className="text-red-600 group-hover:text-white ml-1">PASTAS</span>
    </Link>
);
