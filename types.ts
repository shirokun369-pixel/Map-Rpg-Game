
export enum TileType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  FLOOR_STONE = 'FLOOR_STONE',
  FLOOR_WOOD = 'FLOOR_WOOD',
  WATER = 'WATER',
  GRASS = 'GRASS',
  LAVA = 'LAVA',
  DOOR = 'DOOR',
  CHEST = 'CHEST',
  STAIRS = 'STAIRS',
  PORTAL = 'PORTAL',
  CUSTOM = 'CUSTOM'
}

export interface Tile {
  type: TileType;
  targetSceneId?: string; // Para conexões entre mapas
  customBlockId?: string; // Referência ao bloco customizado criado pelo usuário
}

export type Grid = Tile[][];

export enum Tool {
  PENCIL = 'PENCIL',
  ERASER = 'ERASER',
  FILL = 'FILL',
  TOKEN = 'TOKEN'
}

export interface Token {
  id: string;
  name: string;
  image: string; // base64 or url
  x: number;
  y: number;
}

export interface CustomBlock {
  id: string;
  name: string;
  image: string;
}

export interface MapScene {
  id: string;
  name: string;
  grid: Grid;
  tokens: Token[];
  backgroundImage?: string; // Imagem de fundo opcional (base64)
}

export interface MapMetadata {
  name: string;
  description: string;
  suggestedEncounters: string[];
}
