
import { GoogleGenAI, Type } from "@google/genai";
import { Grid, MapMetadata, TileType } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMapWithAI = async (grid: Grid): Promise<MapMetadata> => {
  // Create a textual representation of the map for the prompt
  const mapSummary = grid.map(row => 
    row.map(tile => tile.type.substring(0, 2)).join('|')
  ).join('\n');

  const tileCounts: Record<string, number> = {};
  grid.flat().forEach(tile => {
    tileCounts[tile.type] = (tileCounts[tile.type] || 0) + 1;
  });

  const prompt = `
    Analyze this 2D RPG map layout and tile distribution to generate a creative description and encounter ideas.
    
    Tile Stats:
    ${Object.entries(tileCounts).map(([type, count]) => `${type}: ${count}`).join(', ')}

    Map Layout (shorthand):
    ${mapSummary}

    Act as a professional Dungeon Master. Based on the presence of these tiles, generate a logical name for this location, a sensory-rich description, and 3 specific RPG encounter ideas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedEncounters: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "description", "suggestedEncounters"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Analysis failed", error);
    return {
      name: "Unknown Dungeon",
      description: "A mysterious area that defies immediate description.",
      suggestedEncounters: ["A lone skeleton wanders here.", "The sound of dripping water echoes."]
    };
  }
};
