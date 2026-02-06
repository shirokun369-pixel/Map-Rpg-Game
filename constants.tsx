
import React from 'react';
import { TileType } from './types';

export const TILE_CONFIG: Record<TileType, { color: string; label: string; icon: string }> = {
  [TileType.EMPTY]: { color: 'bg-zinc-800', label: 'Vazio', icon: '·' },
  [TileType.WALL]: { color: 'bg-zinc-600', label: 'Parede', icon: '■' },
  [TileType.FLOOR_STONE]: { color: 'bg-slate-400', label: 'Chão Pedra', icon: '░' },
  [TileType.FLOOR_WOOD]: { color: 'bg-amber-800', label: 'Chão Madeira', icon: '=' },
  [TileType.WATER]: { color: 'bg-blue-600', label: 'Água', icon: '≈' },
  [TileType.GRASS]: { color: 'bg-emerald-600', label: 'Grama', icon: 'v' },
  [TileType.LAVA]: { color: 'bg-orange-600', label: 'Lava', icon: '♨' },
  [TileType.DOOR]: { color: 'bg-yellow-900', label: 'Porta', icon: '∏' },
  [TileType.CHEST]: { color: 'bg-amber-500', label: 'Baú', icon: '✉' },
  [TileType.STAIRS]: { color: 'bg-zinc-300', label: 'Escada', icon: '彡' },
  [TileType.PORTAL]: { color: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]', label: 'Portal', icon: '⦿' },
  [TileType.CUSTOM]: { color: 'bg-zinc-700', label: 'Customizado', icon: 'C' },
};

export const GRID_WIDTH = 48;
export const GRID_HEIGHT = 24;
