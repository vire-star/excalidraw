import mongoose from 'mongoose';

const drawingSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  key: { type: String, required: true, unique: true, index: true },
  
  // ✅ INLINE Mongoose sub-schemas banao
  elements: [{
    id: { type: String, required: true },
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
    backgroundColor: { type: String },
    strokeWidth: { type: Number, default: 2, min: 1, max: 50 },
    strokeStyle: { type: String, enum: ['solid', 'dashed'], default: 'solid' },
    roughness: { type: Number, default: 1, min: 0, max: 2 },
    opacity: { type: Number, default: 1, min: 0, max: 1 },
    fillStyle: { type: String, enum: ['solid', 'hachure'], default: 'solid' },
    text: { type: String },
    points: [Number],
    seed: { type: Number }
  }],
  
  appState: {
    zoom: { value: { type: Number, default: 1 } },
    scrollX: { type: Number, default: 0 },
    scrollY: { type: Number, default: 0 },
    currentItemStrokeColor: { type: String, default: '#1e1e1e' },
    currentItemBackgroundColor: { type: String, default: '#ffffff' },
    currentItemRoughness: { type: Number, default: 1 },
    selectedElementIds: [String],
    viewBackgroundColor: { type: String, default: '#ffffff' }
  },
  
  version: { type: Number, default: 0 },
  collaborators: [{
    socketId: { type: String, required: true },
    userId: { type: String },
    username: { type: String, required: true, maxlength: 30 },
    color: { type: String, required: true },
    cursor: { x: Number, y: Number }
  }],
  isPublic: { type: Boolean, default: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// ✅ CORRECT INDEXING
drawingSchema.index({ ownerId: 1 });
drawingSchema.index({ 'elements.id': 1 });

export const Drawing = mongoose.model("Drawing", drawingSchema);
