/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

interface WelcomeScreenProps {
  visible: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ visible }) => {
  return (
    <div className={`
        absolute top-32 left-0 w-full pointer-events-none flex justify-center z-10 select-none
        transition-all duration-700 ease-in-out transform font-sans
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}>
      <div className="text-center flex flex-col items-center gap-6 bg-[#fdfbf7]/90 paper-texture backdrop-blur-sm px-14 py-12 rounded-sm shadow-paper-lg border border-stone-200 max-w-lg mx-4 relative">
        {/* Tape decorative element */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-100/60 backdrop-blur-md rotate-1 shadow-sm"></div>

        <div>
            <h1 className="text-4xl font-black text-stone-800 tracking-widest mb-3 font-serif">
                Re:イチ
            </h1>
            <div className="inline-block px-3 py-1 bg-stone-100 rounded text-xs font-bold text-stone-500 tracking-widest border border-stone-200">
                POWERED BY GEMINI 3
            </div>
        </div>
        
        <div className="space-y-4 w-full">
            <FeatureRow text="言葉からボクセルアートを生成" delay="0" />
            <FeatureRow text="壊して、別の形に作り直す" delay="100" />
            <FeatureRow text="作品を保存して共有" delay="200" />
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ text, delay }: { text: string, delay: string }) => (
    <div 
        className="flex items-center justify-center gap-3 text-stone-600 font-medium py-2 border-b border-stone-100 last:border-0"
        style={{ animationDelay: `${delay}ms` }}
    >
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
        {text}
    </div>
);