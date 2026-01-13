// DrawingStore.ts - 🔥 ALL STATES INCLUDED
import { create } from 'zustand';

interface Element {
  id: string;
  type: 'rectangle' | 'ellipse' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface AppState {
  currentItemStrokeColor: string;
  viewBackgroundColor: string;
}

interface Store {
  // Elements
  elements: Element[];
  selectedId: string | null;
  selectedTool: 'rectangle' | 'ellipse' | 'line';
  
  // Canvas transform
  scale: number;
  offsetX: number;
  offsetY: number;
  
  // App state
  appState: AppState;
  
  // Actions
  addElement: (element: Element) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedTool: (tool: 'rectangle' | 'ellipse' | 'line') => void;
  setScale: (scale: number) => void;
  setOffsetX: (x: number) => void;
  setOffsetY: (y: number) => void;
  updateAppState: (updates: Partial<AppState>) => void;
  clearElements: () => void;
}

export const useDrawingStore = create<Store>((set) => ({
  // Initial state
  elements: [],
  selectedId: null,
  selectedTool: 'rectangle',
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  appState: {
    currentItemStrokeColor: '#3b82f6',  // 🔥 DEFAULT COLOR
    viewBackgroundColor: '#f8fafc'
  },

  // Actions
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  
  setSelectedId: (id) => set({ selectedId: id }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setScale: (scale) => set({ scale }),
  setOffsetX: (x) => set({ offsetX: x }),
  setOffsetY: (y) => set({ offsetY: y }),
  
  updateAppState: (updates) => set((state) => ({
    appState: { ...state.appState, ...updates }
  })),
  
  clearElements: () => set({ elements: [] })
}));
