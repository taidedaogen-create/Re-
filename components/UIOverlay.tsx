/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useRef } from 'react';
import { AppState, SavedModel } from '../types';
import { Box, Code2, Wand2, HandFist, FolderOpen, ChevronUp, FileJson, History, Play, Pause, Info, Wrench, Loader2, Apple, Heart, Bird, TreeDeciduous, Home, CarFront, Rocket, Bot } from 'lucide-react';

type PresetType = 'Apple' | 'Duck' | 'Heart' | 'Tree' | 'House' | 'Car' | 'Rocket' | 'Robot';

interface UIOverlayProps {
  voxelCount: number;
  appState: AppState;
  currentBaseModel: string;
  customBuilds: SavedModel[];
  customRebuilds: SavedModel[];
  isAutoRotate: boolean;
  isInfoVisible: boolean;
  isGenerating: boolean;
  onDismantle: () => void;
  onRebuild: (type: PresetType) => void;
  onNewScene: (type: PresetType) => void;
  onSelectCustomBuild: (model: SavedModel) => void;
  onSelectCustomRebuild: (model: SavedModel) => void;
  onPromptCreate: () => void;
  onPromptMorph: () => void;
  onShowJson: () => void;
  onImportJson: () => void;
  onToggleRotation: () => void;
  onToggleInfo: () => void;
}

const LOADING_MESSAGES = [
    "紙を折っています...",
    "構造をデザイン中...",
    "色を選んでいます...",
    "バランスを確認中...",
    "最後の仕上げ...",
    "もう少しです..."
];

export const UIOverlay: React.FC<UIOverlayProps> = ({
  voxelCount,
  appState,
  currentBaseModel,
  customBuilds,
  customRebuilds,
  isAutoRotate,
  isInfoVisible,
  isGenerating,
  onDismantle,
  onRebuild,
  onNewScene,
  onSelectCustomBuild,
  onSelectCustomRebuild,
  onPromptCreate,
  onPromptMorph,
  onShowJson,
  onImportJson,
  onToggleRotation,
  onToggleInfo
}) => {
  const isStable = appState === AppState.STABLE;
  const isDismantling = appState === AppState.DISMANTLING;
  
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (isGenerating) {
        const interval = setInterval(() => {
            setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    } else {
        setLoadingMsgIndex(0);
    }
  }, [isGenerating]);
  
  const isPresetActive = (name: string) => 
      ['Apple', 'Duck', 'Heart', 'Tree', 'House', 'Car', 'Rocket', 'Robot'].includes(name);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none font-sans">
      
      {/* --- Top Bar (Stats & Tools) --- */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
        
        {/* Left Side: Menus & Stats */}
        <div className="pointer-events-auto flex flex-col gap-3">
            <DropdownMenu 
                icon={<FolderOpen size={18} />}
                label="作品リスト"
            >
                <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">新規作成</div>
                <DropdownItem onClick={() => onNewScene('Apple')} icon={<Apple size={16}/>} label="りんご (リセット)" />
                <DropdownItem onClick={onPromptCreate} icon={<Wand2 size={16}/>} label="言葉から作る" highlight />
                <div className="h-px bg-stone-100 my-1 border-t border-dashed border-stone-200" />
                
                {customBuilds.length > 0 && (
                    <>
                        <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">あなたの作品</div>
                        {customBuilds.map((model, idx) => (
                            <DropdownItem 
                                key={`build-${idx}`} 
                                onClick={() => onSelectCustomBuild(model)} 
                                icon={<History size={16}/>} 
                                label={model.name} 
                                truncate
                            />
                        ))}
                        <div className="h-px bg-stone-100 my-1 border-t border-dashed border-stone-200" />
                    </>
                )}

                <DropdownItem onClick={onImportJson} icon={<FileJson size={16}/>} label="JSONインポート" />
            </DropdownMenu>

            {/* Stat Card */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[#fdfbf7] paper-texture shadow-paper rounded-lg border border-stone-200 text-stone-600 font-bold w-fit">
                <div className="bg-stone-100 p-1.5 rounded-md text-stone-500">
                    <Box size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-stone-400 tracking-wider">ブロック数</span>
                    <span className="text-lg text-stone-800 font-extrabold font-mono">{voxelCount}</span>
                </div>
            </div>
        </div>

        {/* Right Side: Utilities */}
        <div className="pointer-events-auto flex gap-2">
            <PaperButton
                onClick={onToggleInfo}
                active={isInfoVisible}
                icon={<Info size={18} />}
                label="使い方"
                compact
            />
            <PaperButton
                onClick={onToggleRotation}
                active={isAutoRotate}
                icon={isAutoRotate ? <Pause size={18} /> : <Play size={18} />}
                label={isAutoRotate ? "停止" : "回転"}
                compact
            />
            <PaperButton
                onClick={onShowJson}
                icon={<Code2 size={18} />}
                label="共有"
            />
        </div>
      </div>

      {/* --- Loading Indicator (Paper Tag Style) --- */}
      {isGenerating && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in duration-300">
              <div className="bg-[#fdfbf7] paper-texture border border-stone-200 px-8 py-8 rounded-sm shadow-paper-lg flex flex-col items-center gap-4 min-w-[300px] transform rotate-1">
                  <div className="relative">
                      <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-30"></div>
                      <Loader2 size={40} className="text-indigo-800 animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-stone-800 font-serif tracking-widest">生成中</h3>
                      <p className="text-stone-500 text-sm font-medium">
                          {LOADING_MESSAGES[loadingMsgIndex]}
                      </p>
                  </div>
                  {/* Decorative tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-indigo-100/50 backdrop-blur-sm transform -rotate-1 shadow-sm"></div>
              </div>
          </div>
      )}

      {/* --- Bottom Control Center --- */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center items-end pointer-events-none px-4">
        
        <div className="pointer-events-auto transition-all duration-500 ease-in-out transform">
            
            {/* STATE 1: STABLE -> DISMANTLE */}
            {isStable && (
                 <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 pb-2">
                     <StampButton 
                        onClick={onDismantle} 
                        label="ゼロにする" 
                     />
                 </div>
            )}

            {/* STATE 2: DISMANTLED -> REBUILD */}
            {isDismantling && !isGenerating && (
                <div className="flex items-end gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300 pb-2">
                     <DropdownMenu 
                        icon={<Wrench size={20} />}
                        label="イチにする"
                        direction="up"
                        big
                     >
                        <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">プリセット</div>
                        
                        {isPresetActive(currentBaseModel) && (
                            <div className="grid grid-cols-2 gap-1 w-full max-w-sm">
                                <DropdownItem onClick={() => onRebuild('Apple')} icon={<Apple size={18}/>} label="りんご" />
                                <DropdownItem onClick={() => onRebuild('Duck')} icon={<Bird size={18}/>} label="アヒル" />
                                <DropdownItem onClick={() => onRebuild('Heart')} icon={<Heart size={18}/>} label="ハート" />
                                <DropdownItem onClick={() => onRebuild('Tree')} icon={<TreeDeciduous size={18}/>} label="木" />
                                <DropdownItem onClick={() => onRebuild('House')} icon={<Home size={18}/>} label="お家" />
                                <DropdownItem onClick={() => onRebuild('Car')} icon={<CarFront size={18}/>} label="くるま" />
                                <DropdownItem onClick={() => onRebuild('Rocket')} icon={<Rocket size={18}/>} label="ロケット" />
                                <DropdownItem onClick={() => onRebuild('Robot')} icon={<Bot size={18}/>} label="ロボット" />
                            </div>
                        )}
                        {!isPresetActive(currentBaseModel) && (
                            <div className="px-3 py-1 text-xs text-stone-400">現在のモデルにはプリセットがありません</div>
                        )}
                        
                        <div className="h-px bg-stone-100 my-1 border-t border-dashed border-stone-200" />

                        {customRebuilds.length > 0 && (
                            <>
                                <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">履歴から</div>
                                {customRebuilds.map((model, idx) => (
                                    <DropdownItem 
                                        key={`rebuild-${idx}`} 
                                        onClick={() => onSelectCustomRebuild(model)} 
                                        icon={<History size={18}/>} 
                                        label={model.name}
                                        truncate 
                                    />
                                ))}
                                <div className="h-px bg-stone-100 my-1 border-t border-dashed border-stone-200" />
                            </>
                        )}

                        <DropdownItem onClick={onPromptMorph} icon={<Wand2 size={18}/>} label="言葉から作る" highlight />
                     </DropdownMenu>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

// --- Components ---

interface PaperButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  compact?: boolean;
}

const PaperButton: React.FC<PaperButtonProps> = ({ onClick, disabled, active, icon, label, compact }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all duration-200
        border shadow-sm btn-press
        ${compact ? 'p-2.5' : 'px-4 py-2.5'}
        ${disabled 
          ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed shadow-none' 
          : active 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-inner' 
            : 'bg-[#fdfbf7] paper-texture text-stone-600 border-stone-200 hover:border-stone-300 hover:shadow-md hover:-translate-y-0.5'}
      `}
    >
      {icon}
      {!compact && <span>{label}</span>}
    </button>
  );
};

const StampButton: React.FC<{onClick: () => void, label: string}> = ({ onClick, label }) => {
    return (
        <button 
            onClick={onClick}
            className="group relative flex flex-col items-center justify-center w-24 h-24 rounded-full bg-red-800 text-[#fdfbf7] shadow-lg hover:shadow-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95 border-4 border-red-900/30"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239B2C2C' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
            }}
        >
            <div className="border-2 border-white/20 rounded-full p-4 w-20 h-20 flex items-center justify-center flex-col gap-1">
                <HandFist size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-black tracking-widest leading-none text-center whitespace-nowrap scale-90">{label}</span>
            </div>
        </button>
    )
}

// --- Dropdown Components ---

interface DropdownProps {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
    direction?: 'up' | 'down';
    big?: boolean;
}

const DropdownMenu: React.FC<DropdownProps> = ({ icon, label, children, direction = 'down', big }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 font-bold text-stone-700 bg-[#fdfbf7] paper-texture border border-stone-300 shadow-paper rounded-lg transition-all hover:border-stone-400 hover:shadow-md btn-press
                    ${big ? 'px-6 py-3 text-lg' : 'px-4 py-2.5 text-sm'}
                    ${isOpen ? 'border-indigo-300 ring-2 ring-indigo-100' : ''}
                `}
            >
                {icon}
                {label}
                <ChevronUp size={16} className={`text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${direction === 'down' ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`
                    absolute left-0 ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} 
                    min-w-[240px] max-h-[60vh] overflow-y-auto bg-[#fdfbf7] paper-texture rounded-lg shadow-xl border border-stone-200 p-2 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200 z-50
                `}>
                    {children}
                </div>
            )}
        </div>
    )
}

const DropdownItem: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, highlight?: boolean, truncate?: boolean }> = ({ onClick, icon, label, highlight, truncate }) => {
    return (
        <button 
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold transition-colors text-left
                ${highlight 
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'}
            `}
        >
            <div className="shrink-0 opacity-70">{icon}</div>
            <span className={truncate ? "truncate w-full" : ""}>{label}</span>
        </button>
    )
}