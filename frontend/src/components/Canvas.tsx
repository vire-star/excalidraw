// Canvas.tsx - 🔥 LOAD + SAVE BOTH WORKING
import { useGetDrawings, useUpdateDrawing } from "@/hooks/drawing.hook";
import { useRef, useLayoutEffect, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

type Element = {
  id: string;
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  fillStyle: string;
};

const Canvas = () => {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { data: drawing, isLoading } = useGetDrawings(id!);
  const { mutate, isPending } = useUpdateDrawing(id);
  
  console.log(drawing?.drawing?.elements)
  const [appState, setAppState] = useState({ 
    viewBackgroundColor: '#ffffff',
    currentItemStrokeColor: '#000000' 
  });
  const [version, setVersion] = useState(1);
  const [elements, setElements] = useState<Element[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // 🔥 LOAD DRAWING FROM API
  useEffect(() => {
    if (drawing?.drawing?.elements ) {
    //   console.log('📥 LOADED:', drawing.elements.length, 'elements');
      setElements(drawing?.drawing?.elements as Element[]);
    //   setVersion(drawing.version || 1);
    } else {
      console.log('📭 Empty drawing - starting fresh');
      setElements([]);
      setVersion(1);
    }
  }, [drawing]); // 🔥 Runs when drawing data changes

  // 🔥 COMPLETE ELEMENT with defaults
  const createElement = (x: number, y: number): Element => ({
    id: crypto.randomUUID(),
    type: "rectangle",
    x,
    y,
    width: 0,
    height: 0,
    angle: 0,
    strokeColor: "#1e1e1e",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 1,
    fillStyle: "solid"
  });

  // 🔥 SAVE - Debounced
  useEffect(() => {
    if (elements.length === 0 || !id) return;

    const timeoutId = setTimeout(() => {
      console.log('💾 Saving...', { elements: elements.length, appState, version });
      mutate({ 
        elements,
        appState,
        version 
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [elements, appState, version, id, mutate]);

  // 🔥 Mouse Down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const element = createElement(x, y);
    setElements((prev) => [...prev, element]);
    setIsDrawing(true);
  }, []);

  // 🔥 Mouse Move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements((prev) => {
      const lastIndex = prev.length - 1;
      if (lastIndex < 0) return prev;

      const updatedElements = [...prev];
      const lastEl = { ...updatedElements[lastIndex] };
      lastEl.width = Math.abs(x - lastEl.x);
      lastEl.height = Math.abs(y - lastEl.y);
      updatedElements[lastIndex] = lastEl;

      return updatedElements;
    });
  }, [isDrawing]);

  // 🔥 Mouse Up
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // 🔥 RENDER
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    elements.forEach((el) => {
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = el.strokeWidth;
      ctx.globalAlpha = el.opacity;
      
      ctx.strokeRect(el.x, el.y, el.width, el.height);
    });
    
    ctx.globalAlpha = 1;
  }, [elements]);

  // 🔥 Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-500">Loading drawing...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-white overflow-hidden">
      {isPending && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            Saving... ({elements.length} elements)
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 cursor-crosshair"
      />
    </div>
  );
};

export default Canvas;
