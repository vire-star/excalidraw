import mongoose from 'mongoose';

const appStateSchema = new mongoose.Schema({
  zoom: { value: { type: Number, default: 1 } },
  scrollX: { type: Number, default: 0 },
  scrollY: { type: Number, default: 0 },
  currentItemStrokeColor: { type: String, default: '#1e1e1e' },
  currentItemBackgroundColor: { type: String, default: '#ffffff' },
  currentItemRoughness: { type: Number, default: 1 },
  selectedElementIds: [String],
  viewBackgroundColor: { type: String, default: '#ffffff' }
});


export const AppState = mongoose.model("AppState", appStateSchema)