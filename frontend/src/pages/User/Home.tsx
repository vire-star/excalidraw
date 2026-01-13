// Home.tsx - 🔥 NO MORE 429 ERRORS
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDrawings } from '@/hooks/drawing.hook';
import { useDrawingStore } from '@/Store/DrawingStore';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';

const Home = () => {
  const { id } = useParams<{ id: string }>();
  
  // 🔥 ONLY RUN ONCE - enabled: !!id
  const { data: drawing, isLoading } = useGetDrawings(id!);
  console.log(drawing)
  
 
  

 

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-100">
      <Toolbar />
      <Canvas />
    </div>
  );
};

export default Home;
