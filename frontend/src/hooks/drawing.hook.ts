import { createDrawingApi, getDrawingApi, updateDrawingApi } from '@/Api/drawing.api'
import { useMutation, useQuery } from '@tanstack/react-query'


export const useCreateDrawing=()=>{
    return useMutation({
        mutationFn:createDrawingApi,
        onSuccess:(data)=>{
            console.log(data)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}



export const useGetDrawings=(id:string)=>{
    return useQuery({
        queryKey:['getDrawing',id],
        queryFn:()=>getDrawingApi(id)
    })
}

// drawing.hook.ts - 🔥 ID SUPPORT
export const useUpdateDrawing = (id?: string) => {
  return useMutation({
    mutationFn: (payload: { elements: Element[]; appState: any; version: number }) => {
      if (!id) throw new Error('Drawing ID required');
      return updateDrawingApi(payload, id); // 🔥 Pass ID
    },
    onSuccess: (data) => console.log('✅ Saved!', data),
    onError: (err) => console.log('❌ Save failed', err)
  });
};
