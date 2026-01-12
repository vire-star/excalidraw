import mongoose from 'mongoose';

 const elementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['rectangle', 'ellipse', 'arrow', 'line', 'freedraw', 'text'], 
    required: true 
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true, min: 1 },
  height: { type: Number, required: true, min: 1 },
  angle: { type: Number, default: 0 },
  strokeColor: { type: String, required: true },
  backgroundColor: String,
  strokeWidth: { type: Number, default: 2, min: 1, max: 50 },
  strokeStyle: { type: String, enum: ['solid', 'dashed'], default: 'solid' },
  roughness: { type: Number, default: 1, min: 0, max: 2 },
  opacity: { type: Number, default: 1, min: 0, max: 1 },
  fillStyle: { type: String, enum: ['solid', 'hachure'], default: 'solid' },
  text: String,
  points: [Number],
  seed: Number
});


export const Element = mongoose.model("Element", elementSchema)