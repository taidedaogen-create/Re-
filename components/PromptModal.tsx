/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, Wand2, Hammer } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  mode: 'create' | 'morph';
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, mode, onClose, onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onSubmit(prompt);
      setPrompt('');
      onClose();
    } catch (err) {
      console.error(err);
      setError('魔法に失敗しました。もう一度試してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const isCreate = mode === 'create';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 backdrop-blur-sm p-4 font-sans">
      <div className="bg-[#fdfbf7] paper-texture rounded-lg shadow-2xl w-full max-w-lg flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Decorative Strip */}
        <div className={`h-2 w-full ${isCreate ? 'bg-sky-700' : 'bg-amber-600'}`}></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md border ${isCreate ? 'bg-sky-50 border-sky-100 text-sky-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                {isCreate ? <Wand2 size={20} /> : <Hammer size={20} />}
            </div>
            <div>
                <h2 className="text-xl font-bold text-stone-800 font-serif">
                    {isCreate ? '新しい作品をつくる' : '作り変える'}
                </h2>
                <p className="text-xs font-bold text-stone-400 tracking-wider">POWERED BY GEMINI 3</p>
            </div>
          </div>
          <button 
            onClick={!isLoading ? onClose : undefined}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-stone-600 font-medium mb-4 text-sm leading-relaxed">
            {isCreate 
                ? "どのようなボクセルアートを作成しますか？ 具体的なイメージを入力してください。" 
                : "現在のブロックを使って、何に作り変えますか？"}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isCreate 
                    ? "例: 中世のお城、巨大ロボット、フルーツ盛り合わせ..." 
                    : "例: 車に変形させて、ピラミッドにして..."}
                  disabled={isLoading}
                  className={`
                    w-full h-32 resize-none bg-white border border-stone-300 rounded-md p-4 
                    text-stone-700 focus:outline-none focus:ring-2 transition-all placeholder:text-stone-300
                    leading-relaxed
                    ${isCreate ? 'focus:ring-sky-100 focus:border-sky-400' : 'focus:ring-amber-100 focus:border-amber-400'}
                  `}
                  autoFocus
                  style={{ backgroundImage: 'linear-gradient(transparent, transparent 27px, #f0f0f0 28px)', backgroundSize: '100% 28px', lineHeight: '28px' }}
                />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium flex items-center gap-2">
                <X size={16} /> {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-stone-100 border-dashed">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-md transition-colors text-sm"
                >
                    キャンセル
                </button>
                <button 
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className={`
                    flex items-center gap-2 px-6 py-2 rounded-md font-bold text-white text-sm transition-all shadow-sm
                    ${isLoading 
                        ? 'bg-stone-300 cursor-wait' 
                        : isCreate 
                            ? 'bg-sky-700 hover:bg-sky-800 hover:shadow-md' 
                            : 'bg-amber-600 hover:bg-amber-700 hover:shadow-md'}
                    `}
                >
                    {isLoading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        生成中...
                    </>
                    ) : (
                    <>
                        <Sparkles size={16} />
                        {isCreate ? '作成する' : '変形する'}
                    </>
                    )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};