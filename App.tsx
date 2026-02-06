
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TileType, Grid, Tool, Token, MapScene, Tile, CustomBlock } from './types.ts';
import { TILE_CONFIG, GRID_WIDTH, GRID_HEIGHT } from './constants.tsx';

// Icons
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const EraserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21Z"/><path d="m22 21H7"/><path d="m5 11 9 9"/></svg>;
const FillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 11-8-8-7 7 8 8Z"/><path d="m5 15 3 3"/><path d="M19 11c0 2.2-1.8 4-4 4-2.2 0-4-1.8-4-4"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const ArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>;

const createEmptyGrid = () => Array.from({ length: GRID_HEIGHT }, () => 
  Array.from({ length: GRID_WIDTH }, () => ({ type: TileType.EMPTY }))
);

const App: React.FC = () => {
  // Scene Management State
  const [scenes, setScenes] = useState<MapScene[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_project_scenes');
      return saved ? JSON.parse(saved) : [{ id: 'scene-1', name: 'Mapa Principal', grid: createEmptyGrid(), tokens: [] }];
    } catch (e) {
      return [{ id: 'scene-1', name: 'Mapa Principal', grid: createEmptyGrid(), tokens: [] }];
    }
  });
  
  const [activeSceneId, setActiveSceneId] = useState<string>(() => {
    return localStorage.getItem('rpg_active_scene_id') || 'scene-1';
  });

  const [renamingSceneId, setRenamingSceneId] = useState<string | null>(null);
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  const [portalMenu, setPortalMenu] = useState<{ x: number, y: number, row: number, col: number } | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0];

  const [movingToken, setMovingToken] = useState<Token | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileType>(TileType.WALL);
  const [activeTool, setActiveTool] = useState<Tool>(Tool.PENCIL);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZenMode, setIsZenMode] = useState(false);
  
  // Custom Blocks State
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_custom_blocks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [selectedCustomBlockId, setSelectedCustomBlockId] = useState<string | null>(null);
  const [newBlockName, setNewBlockName] = useState('');
  const blockFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const [tokenLibrary, setTokenLibrary] = useState<{name: string, image: string}[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_token_library');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [selectedLibraryToken, setSelectedLibraryToken] = useState<number | null>(null);
  const [newTokenName, setNewTokenName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Persistence logic - saves every change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rpg_project_scenes', JSON.stringify(scenes));
      localStorage.setItem('rpg_active_scene_id', activeSceneId);
      localStorage.setItem('rpg_custom_blocks', JSON.stringify(customBlocks));
      localStorage.setItem('rpg_token_library', JSON.stringify(tokenLibrary));
    } catch (e) {
      console.error("Storage quota exceeded", e);
    }
  }, [scenes, activeSceneId, customBlocks, tokenLibrary]);

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsMouseDown(false);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleClickOutside = () => setPortalMenu(null);

    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (renamingSceneId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingSceneId]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.min(Math.max(0.3, prev + delta), 3));
    }
  };

  const addNewScene = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newScene: MapScene = { id: newId, name: `Nova Cena ${scenes.length + 1}`, grid: createEmptyGrid(), tokens: [] };
    setScenes(prev => [...prev, newScene]);
    setActiveSceneId(newId);
    setRenamingSceneId(newId);
  };

  const confirmDeleteScene = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (scenes.length <= 1) return;
    setSceneToDelete(id);
  };

  const executeDeleteScene = () => {
    if (!sceneToDelete) return;
    const indexToDelete = scenes.findIndex(s => s.id === sceneToDelete);
    const newScenes = scenes.filter(s => s.id !== sceneToDelete);
    setScenes(newScenes);
    if (activeSceneId === sceneToDelete) {
      const nextActiveIdx = Math.max(0, indexToDelete - 1);
      setActiveSceneId(newScenes[nextActiveIdx]?.id || newScenes[0].id);
    }
    setSceneToDelete(null);
  };

  const startRenaming = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingSceneId(id);
  };

  const handleRenameSave = (id: string, newName: string) => {
    if (newName.trim()) {
      setScenes(prev => prev.map(s => s.id === id ? { ...s, name: newName.trim() } : s));
    }
    setRenamingSceneId(null);
  };

  const moveScene = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newScenes = [...scenes];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= scenes.length) return;
    [newScenes[index], newScenes[target]] = [newScenes[target], newScenes[index]];
    setScenes(newScenes);
  };

  const updateActiveScene = useCallback((updates: Partial<MapScene>) => {
    setScenes(prev => prev.map(s => s.id === activeSceneId ? { ...s, ...updates } : s));
  }, [activeSceneId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setTokenLibrary(prev => [...prev, { name: newTokenName || 'Personagem', image: base64 }]);
        setNewTokenName('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newBlock: CustomBlock = {
          id: Math.random().toString(36).substr(2, 9),
          name: newBlockName || 'Bloco Custom',
          image: base64
        };
        setCustomBlocks(prev => [...prev, newBlock]);
        setNewBlockName('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateActiveScene({ backgroundImage: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const floodFill = useCallback((startRow: number, startCol: number, targetType: TileType, replacementType: TileType, customId?: string) => {
    if (targetType === replacementType && (!customId || activeScene.grid[startRow][startCol].customBlockId === customId)) return;
    const newGrid = [...activeScene.grid.map(row => [...row])];
    const stack: [number, number][] = [[startRow, startCol]];
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      if (r < 0 || r >= GRID_HEIGHT || c < 0 || c >= GRID_WIDTH || newGrid[r][c].type !== targetType) continue;
      newGrid[r][c] = { ...newGrid[r][c], type: replacementType, customBlockId: customId };
      stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
    updateActiveScene({ grid: newGrid });
  }, [activeScene.grid, updateActiveScene]);

  const handleTileAction = (row: number, col: number, isInitialClick: boolean = false) => {
    if (isInitialClick) setIsMouseDown(true);
    const tile = activeScene.grid[row][col];
    const customBlock = tile.type === TileType.CUSTOM ? customBlocks.find(b => b.id === tile.customBlockId) : null;
    const isCustomPortal = customBlock?.name.toLowerCase().includes('portal');

    if (isInitialClick && (tile.type === TileType.PORTAL || isCustomPortal) && tile.targetSceneId) {
      setActiveSceneId(tile.targetSceneId);
      return;
    }

    if (activeTool === Tool.TOKEN) {
      if (!isInitialClick) return; 
      const tokenAtPos = activeScene.tokens.find(t => t.x === col && t.y === row);
      
      if (movingToken) {
        const updatedToken = { ...movingToken, x: col, y: row };
        const newTokens = [...activeScene.tokens.filter(t => t.id !== movingToken.id && !(t.x === col && t.y === row)), updatedToken];
        updateActiveScene({ tokens: newTokens });
        setMovingToken(null);
      } else if (tokenAtPos) {
        setMovingToken(tokenAtPos);
        const newTokens = activeScene.tokens.filter(t => t.id !== tokenAtPos.id);
        updateActiveScene({ tokens: newTokens });
      } else if (selectedLibraryToken !== null && tokenLibrary[selectedLibraryToken]) {
        const libToken = tokenLibrary[selectedLibraryToken];
        const newToken: Token = {
          id: Math.random().toString(36).substr(2, 9),
          name: libToken.name,
          image: libToken.image,
          x: col,
          y: row
        };
        const newTokens = [...activeScene.tokens.filter(t => !(t.x === col && t.y === row)), newToken];
        updateActiveScene({ tokens: newTokens });
      }
    } else if (activeTool === Tool.FILL) {
      if (!isInitialClick) return;
      if (selectedCustomBlockId) {
        floodFill(row, col, tile.type, TileType.CUSTOM, selectedCustomBlockId);
      } else {
        floodFill(row, col, tile.type, selectedTile);
      }
    } else if (activeTool === Tool.ERASER) {
      if (tile.type === TileType.EMPTY && !activeScene.tokens.find(t => t.x === col && t.y === row)) return;
      const newTokens = activeScene.tokens.filter(t => !(t.x === col && t.y === row));
      const newGrid = [...activeScene.grid.map(r => [...r])];
      newGrid[row][col] = { type: TileType.EMPTY };
      updateActiveScene({ tokens: newTokens, grid: newGrid });
    } else {
      const newGrid = [...activeScene.grid.map(r => [...r])];
      if (selectedCustomBlockId) {
        if (tile.type === TileType.CUSTOM && tile.customBlockId === selectedCustomBlockId) return;
        newGrid[row][col] = { type: TileType.CUSTOM, customBlockId: selectedCustomBlockId };
      } else {
        if (tile.type === selectedTile) return;
        newGrid[row][col] = { type: selectedTile };
      }
      updateActiveScene({ grid: newGrid });
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMouseDown && (activeTool === Tool.PENCIL || activeTool === Tool.ERASER)) {
      handleTileAction(row, col, false);
    }
  };

  const handlePortalRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    const tile = activeScene.grid[row][col];
    const customBlock = tile.type === TileType.CUSTOM ? customBlocks.find(b => b.id === tile.customBlockId) : null;
    const isCustomPortal = customBlock?.name.toLowerCase().includes('portal');

    if (tile.type === TileType.PORTAL || isCustomPortal) {
      setPortalMenu({ x: e.clientX, y: e.clientY, row, col });
    }
  };

  const linkPortal = (targetId: string) => {
    if (!portalMenu) return;
    const { row, col } = portalMenu;
    const newGrid = [...activeScene.grid.map(r => [...r])];
    newGrid[row][col] = { ...newGrid[row][col], targetSceneId: targetId };
    updateActiveScene({ grid: newGrid });
    setPortalMenu(null);
  };

  const startDeleteCustomBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlockToDelete(id);
  };

  const executeDeleteCustomBlock = () => {
    if (!blockToDelete) return;
    setCustomBlocks(prev => prev.filter(b => b.id !== blockToDelete));
    if (selectedCustomBlockId === blockToDelete) setSelectedCustomBlockId(null);
    setBlockToDelete(null);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
      
      {/* Zen Toggle Button */}
      <button 
        onClick={() => setIsZenMode(!isZenMode)}
        className="fixed bottom-6 right-6 z-[250] w-12 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border border-emerald-400/30"
        title={isZenMode ? "Mostrar Interface" : "Modo Zen"}
      >
        {isZenMode ? <EyeIcon /> : <EyeOffIcon />}
      </button>

      {/* Portal Menu */}
      {portalMenu && (
        <div 
          className="fixed z-[300] bg-zinc-900 border border-zinc-700 p-2 rounded-xl shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
          style={{ left: portalMenu.x, top: portalMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 border-b border-zinc-800 mb-2 flex items-center gap-2">
            <LinkIcon /> Vincular Portal
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {scenes.filter(s => s.id !== activeSceneId).map(scene => (
              <button key={scene.id} onClick={() => linkPortal(scene.id)} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-emerald-600 hover:text-white rounded-lg transition-colors flex items-center justify-between group">
                <span>{scene.name}</span>
                <span className="opacity-0 group-hover:opacity-100 text-[9px] bg-white/20 px-1.5 py-0.5 rounded uppercase">Vincular</span>
              </button>
            ))}
            <button onClick={() => linkPortal('')} className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border-t border-zinc-800 mt-1">Remover Vínculo</button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {sceneToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertIcon /></div>
            <h3 className="text-xl font-bold text-center mb-2">Excluir Mapa?</h3>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={executeDeleteScene} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">Sim, Excluir</button>
              <button onClick={() => setSceneToDelete(null)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all active:scale-95">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {blockToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertIcon /></div>
            <h3 className="text-xl font-bold text-center mb-2">Excluir Bloco?</h3>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={executeDeleteCustomBlock} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">Apagar Bloco</button>
              <button onClick={() => setBlockToDelete(null)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all active:scale-95">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {movingToken && (
        <div className="fixed pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2" style={{ left: mousePos.x, top: mousePos.y }}>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-2xl overflow-hidden ring-4 ring-zinc-950/80 scale-125 opacity-90 flex flex-col items-center">
            <img src={movingToken.image} alt={movingToken.name} className="w-full h-full object-cover" />
            <div className="absolute -bottom-6 bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded border border-emerald-500 whitespace-nowrap shadow-xl font-bold uppercase">{movingToken.name}</div>
          </div>
        </div>
      )}

      {!isZenMode && (
        <aside className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full shadow-2xl z-20 overflow-hidden animate-in slide-in-from-left duration-300">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter text-white"><span className="text-emerald-500">RPG</span>MAP</h1>
            <div className="text-[10px] bg-zinc-800 px-2 py-1 rounded font-bold text-zinc-400 uppercase">v1.4</div>
          </div>

          <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-700">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cenas</h2>
                <button onClick={addNewScene} className="p-1.5 bg-zinc-800 hover:bg-emerald-600 rounded-lg transition-all text-zinc-400 hover:text-white"><PlusIcon /></button>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {scenes.map((scene, idx) => (
                  <div key={scene.id} onClick={() => setActiveSceneId(scene.id)} className={`group flex items-center justify-between gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${activeSceneId === scene.id ? 'bg-emerald-600 text-white' : 'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
                    {renamingSceneId === scene.id ? (
                      <input ref={renameInputRef} type="text" defaultValue={scene.name} onBlur={(e) => handleRenameSave(scene.id, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSave(scene.id, e.currentTarget.value); if (e.key === 'Escape') setRenamingSceneId(null); }} className="text-xs font-bold bg-white/20 text-white rounded px-1.5 py-0.5 outline-none flex-1 min-w-0" onClick={(e) => e.stopPropagation()} />
                    ) : (
                      <span className="text-xs font-bold truncate flex-1">{scene.name}</span>
                    )}
                    <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${activeSceneId === scene.id ? 'opacity-100' : ''}`}>
                      <button onClick={(e) => moveScene(idx, 'up', e)} className="p-1 hover:bg-black/20 rounded"><ArrowUpIcon /></button>
                      <button onClick={(e) => startRenaming(scene.id, e)} className="p-1 hover:bg-black/20 rounded"><PencilIcon /></button>
                      <button onClick={(e) => confirmDeleteScene(scene.id, e)} className="p-1 hover:bg-red-600/50 rounded"><TrashIcon /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
               <div className="flex justify-between items-center mb-4"><h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fundo</h2><ImageIcon /></div>
               <button onClick={() => bgFileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/40 rounded-xl transition-all flex flex-col items-center gap-2 text-zinc-500"><PlusIcon /><span className="text-[10px] font-bold uppercase">Subir Foto Fundo</span></button>
               <input ref={bgFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
            </section>

            <section>
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Ferramentas</h2>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => setActiveTool(Tool.PENCIL)} className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTool === Tool.PENCIL ? 'bg-emerald-600 shadow-lg text-white' : 'bg-zinc-800 text-zinc-400'}`}><PencilIcon /><span className="text-[9px] font-bold">Lápis</span></button>
                <button onClick={() => setActiveTool(Tool.ERASER)} className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTool === Tool.ERASER ? 'bg-emerald-600 shadow-lg text-white' : 'bg-zinc-800 text-zinc-400'}`}><EraserIcon /><span className="text-[9px] font-bold">Apagar</span></button>
                <button onClick={() => setActiveTool(Tool.FILL)} className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTool === Tool.FILL ? 'bg-emerald-600 shadow-lg text-white' : 'bg-zinc-800 text-zinc-400'}`}><FillIcon /><span className="text-[9px] font-bold">Balde</span></button>
                <button onClick={() => setActiveTool(Tool.TOKEN)} className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTool === Tool.TOKEN ? 'bg-emerald-600 shadow-lg text-white' : 'bg-zinc-800 text-zinc-400'}`}><UserIcon /><span className="text-[9px] font-bold">Token</span></button>
              </div>
            </section>

            <section className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Blocos Custom</h2>
              <div className="flex gap-2 mb-4">
                  <input type="text" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value)} placeholder="Nome" className="flex-1 bg-zinc-800 text-xs px-3 py-2 rounded-lg border border-zinc-700 focus:border-emerald-500 outline-none" />
                  <button onClick={() => blockFileInputRef.current?.click()} className="p-2.5 bg-zinc-700 hover:bg-emerald-600 rounded-lg transition-colors"><PlusIcon /></button>
                  <input ref={blockFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBlockUpload} />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {customBlocks.map(block => (
                    <button key={block.id} onClick={() => { setSelectedCustomBlockId(block.id); setActiveTool(Tool.PENCIL); setSelectedLibraryToken(null); }} className={`relative group p-2 rounded-xl border-2 transition-all ${selectedCustomBlockId === block.id ? 'border-emerald-500 bg-zinc-800' : 'border-zinc-800 bg-zinc-900/40'}`}>
                      <img src={block.image} className="w-10 h-10 object-cover rounded mx-auto" />
                      <div onClick={(e) => startDeleteCustomBlock(block.id, e)} className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></div>
                    </button>
                  ))}
              </div>
            </section>

            <section className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Personagens</h2>
              <div className="flex gap-2 mb-4">
                  <input type="text" value={newTokenName} onChange={(e) => setNewTokenName(e.target.value)} placeholder="Nome" className="flex-1 bg-zinc-800 text-xs px-3 py-2 rounded-lg border border-zinc-700 focus:border-emerald-500 outline-none" />
                  <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-zinc-700 hover:bg-emerald-600 rounded-lg transition-colors"><PlusIcon /></button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {tokenLibrary.map((token, idx) => (
                    <button key={idx} onClick={() => { setSelectedLibraryToken(idx); setActiveTool(Tool.TOKEN); setSelectedCustomBlockId(null); }} className={`p-2 rounded-xl border-2 transition-all ${selectedLibraryToken === idx ? 'border-emerald-500 bg-zinc-800' : 'border-zinc-800 bg-zinc-900/40'}`}>
                      <img src={token.image} className="w-10 h-10 object-cover rounded-full mx-auto" />
                      <div className="text-[8px] mt-1 truncate font-bold">{token.name}</div>
                    </button>
                  ))}
              </div>
            </section>

            <section className="mt-auto pt-4 flex flex-col gap-2 pb-12">
              <button onClick={() => setShowGrid(!showGrid)} className={`w-full py-2 text-[10px] font-bold rounded-lg uppercase tracking-widest border transition-colors ${showGrid ? 'bg-zinc-800 border-zinc-700' : 'bg-emerald-600/20 border-emerald-600 text-emerald-400'}`}>Grade: {showGrid ? "Ativada" : "Desativada"}</button>
            </section>
          </div>
        </aside>
      )}

      <main 
        className="flex-1 relative bg-zinc-950 p-12 overflow-auto scrollbar-thin flex scroll-smooth"
        onWheel={handleWheel}
      >
        {!isZenMode && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-800 text-[11px] font-black text-zinc-300 uppercase tracking-[0.1em] flex items-center gap-6 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Zoom: {Math.round(zoomLevel * 100)}%</span>
            <span className="text-zinc-700 font-normal">|</span>
            <span className="text-zinc-500">Ctrl + Scroll para aproximar</span>
          </div>
        )}

        <div 
          className="relative shadow-2xl m-auto transition-all duration-200 ease-out origin-center bg-zinc-900" 
          style={{ 
            width: `${GRID_WIDTH * 36}px`, 
            height: `${GRID_HEIGHT * 36}px`,
            borderTop: showGrid ? '1px solid rgba(255,255,255,0.12)' : 'none',
            borderLeft: showGrid ? '1px solid rgba(255,255,255,0.12)' : 'none',
            borderRadius: showGrid ? '12px' : '0px',
            transform: `scale(${zoomLevel})`,
            boxSizing: 'content-box',
            overflow: 'hidden'
          }}
        >
          {activeScene.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <img src={activeScene.backgroundImage} className="w-full h-full object-cover opacity-80" />
            </div>
          )}
          <div 
            className={`grid relative z-10 transition-all duration-300 ${activeTool === Tool.TOKEN ? 'cursor-default' : 'cursor-crosshair'} ${activeScene.backgroundImage ? 'bg-transparent' : 'bg-zinc-900'}`} 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_WIDTH}, 36px)`,
              gridTemplateRows: `repeat(${GRID_HEIGHT}, 36px)`,
              width: `${GRID_WIDTH * 36}px`,
              height: `${GRID_HEIGHT * 36}px`
            }}
          >
            {activeScene.grid.map((row, rIdx) => row.map((tile, cIdx) => {
              const tokenAtTile = activeScene.tokens.find(t => t.x === cIdx && t.y === rIdx);
              const customBlock = tile.type === TileType.CUSTOM ? customBlocks.find(b => b.id === tile.customBlockId) : null;
              const tileColor = (tile.type === TileType.EMPTY && activeScene.backgroundImage) ? 'bg-transparent' : TILE_CONFIG[tile.type].color;
              const hasLink = tile.targetSceneId && (tile.type === TileType.PORTAL || customBlock?.name.toLowerCase().includes('portal'));

              return (
                <div 
                  key={`${activeSceneId}-${rIdx}-${cIdx}`} 
                  onMouseDown={() => handleTileAction(rIdx, cIdx, true)} 
                  onMouseEnter={() => handleMouseEnter(rIdx, cIdx)} 
                  onContextMenu={(e) => handlePortalRightClick(e, rIdx, cIdx)} 
                  className={`w-[36px] h-[36px] flex items-center justify-center relative group/cell hover:brightness-110 transition-all box-border ${customBlock ? 'bg-zinc-800' : tileColor}`}
                  style={{
                    borderRight: showGrid ? '1px solid rgba(255,255,255,0.12)' : 'none',
                    borderBottom: showGrid ? '1px solid rgba(255,255,255,0.12)' : 'none'
                  }}
                >
                  {customBlock && !tokenAtTile && <img src={customBlock.image} className="w-full h-full object-cover" />}
                  
                  {/* Ícones indicadores: Só mostramos se a grade estiver ATIVA */}
                  {showGrid && TILE_CONFIG[tile.type].icon !== '·' && !tokenAtTile && !customBlock && (
                    <span className="text-zinc-500/50 text-[10px] font-bold select-none">{TILE_CONFIG[tile.type].icon}</span>
                  )}
                  
                  {hasLink && !tokenAtTile && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="bg-emerald-500/40 w-2.5 h-2.5 rounded-full animate-pulse ring-4 ring-emerald-500/10" />
                    </div>
                  )}

                  {tokenAtTile && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center group pointer-events-none">
                      <div className="w-8 h-8 rounded-full border-2 border-white shadow-xl overflow-hidden pointer-events-auto transform transition-transform group-hover:scale-125">
                        <img src={tokenAtTile.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-10 bg-zinc-950 border border-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-2xl z-[100] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest pointer-events-none">
                        {tokenAtTile.name}
                      </div>
                    </div>
                  )}
                  {movingToken && !tokenAtTile && activeTool === Tool.TOKEN && <div className="absolute inset-0 bg-emerald-500/20 animate-pulse border border-emerald-500/30" />}
                </div>
              );
            }))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
