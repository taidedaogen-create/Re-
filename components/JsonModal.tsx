/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { X, FileJson, Upload, Copy, Check } from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: string;
  isImport?: boolean;
  onImport?: (json: string) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({ isOpen, onClose, data = '', isImport = false, onImport }) => {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
      if (isOpen) {
          setImportText('');
          setError('');
          setIsCopied(false);
      }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImportClick = () => {
      if (!importText.trim()) {
          setError('JSONデータを貼り付けてください。');
          return;
      }
      try {
          JSON.parse(importText); // Simple validation
          if (onImport) {
              onImport(importText);
              onClose();
          }
      } catch (e) {
          setError('JSONの形式が正しくありません。');
      }
  };

  const handleCopy = async () => {
      if (!data) return;
      try {
          await navigator.clipboard.writeText(data);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
          console.error('Failed to copy:', err);
      }
  };

  const mainColor = isImport ? 'emerald' : 'indigo';
  const mainColorClass = isImport ? 'text-emerald-700' : 'text-indigo-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 backdrop-blur-sm p-4 font-sans">
      <div className="bg-[#fdfbf7] paper-texture rounded-lg shadow-2xl w-full max-w-2xl flex flex-col h-[70vh] border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashed border-stone-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md bg-white border border-stone-200 ${mainColorClass}`}>
                {isImport ? <Upload size={20} /> : <FileJson size={20} />}
            </div>
            <div>
                <h2 className="text-xl font-bold text-stone-800 font-serif">
                    {isImport ? '設計図をインポート' : '設計図を書き出し'}
                </h2>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">JSON DATA</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col relative bg-stone-50/50">
          <textarea 
            readOnly={!isImport}
            value={isImport ? importText : data}
            onChange={isImport ? (e) => setImportText(e.target.value) : undefined}
            placeholder={isImport ? "ここにJSONデータを貼り付けてください..." : ""}
            className={`
                w-full h-full resize-none bg-white border border-stone-300 rounded-md p-4 
                font-mono text-xs text-stone-600 focus:outline-none focus:ring-2 transition-all
                ${isImport ? 'focus:ring-emerald-100 focus:border-emerald-400' : 'focus:ring-indigo-100 focus:border-indigo-400'}
            `}
          />
          
          {isImport && error && (
              <div className="absolute bottom-8 left-8 right-8 bg-rose-50 text-rose-700 px-4 py-3 rounded-md text-sm font-medium shadow-sm border border-rose-200 animate-in slide-in-from-bottom-2 flex items-center gap-2">
                  <X size={16} /> {error}
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 flex justify-end gap-3 bg-white/50 rounded-b-lg">
          {isImport ? (
              <>
                <button 
                    onClick={onClose}
                    className="px-5 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-md transition-colors text-sm"
                >
                    キャンセル
                </button>
                <button 
                    onClick={handleImportClick}
                    className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                >
                    読み込む
                </button>
              </>
          ) : (
              <>
                <button
                    onClick={handleCopy}
                    className={`
                        flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-md transition-all shadow-sm
                        ${isCopied 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'}
                    `}
                >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    {isCopied ? 'コピーしました' : 'コピーする'}
                </button>
                <button 
                    onClick={onClose}
                    className="px-5 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-md transition-colors text-sm"
                >
                    閉じる
                </button>
              </>
          )}
        </div>

      </div>
    </div>
  );
};