// Toolbar.tsx - 🔥 WORKING VERSION
import { useDrawingStore } from '../Store/DrawingStore';
import { cn } from '@/lib/utils';

const tools = [
  { id: 'rectangle' as const, icon: '⬜', label: 'Rectangle' },
  { id: 'ellipse' as const, icon: '⭕', label: 'Ellipse' },
  { id: 'line' as const, icon: '↘️', label: 'Line' },
];

const Toolbar = () => {
  const { 
    selectedTool, 
    setSelectedTool, 
    appState, 
    updateAppState, // 🔥 YE ADD KIA
    clearElements 
  } = useDrawingStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-4 flex gap-3 z-50 border border-white/50">
      {/* Tools */}
      <div className="flex gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={cn(
              'p-3 rounded-xl transition-all hover:scale-105',
              selectedTool === tool.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
            )}
            title={tool.label}
          >
            <span className="text-2xl">{tool.icon}</span>
          </button>
        ))}
      </div>

      {/* Colors */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border">
        <label className="text-sm font-medium">Color:</label>
        <input
          type="color"
          value={appState.currentItemStrokeColor}
          onChange={(e) => updateAppState({ currentItemStrokeColor: e.target.value })}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button 
          onClick={() => updateAppState({ scale: 1, offsetX: 0, offsetY: 0 })}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
        >
          Reset View
        </button>
      </div>

      {/* Clear */}
      <button 
        onClick={clearElements}
        className="ml-auto px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
      >
        Clear All
      </button>
    </div>
  );
};


export default Toolbar