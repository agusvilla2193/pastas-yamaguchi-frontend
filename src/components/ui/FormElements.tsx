import React from 'react';

export const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1 mb-2 block">
        {children}
    </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-sm text-white placeholder:text-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300"
    />
);

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-sm text-white placeholder:text-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300 resize-none"
    />
);
