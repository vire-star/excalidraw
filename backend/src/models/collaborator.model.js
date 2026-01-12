import mongoose from 'mongoose';

const collaboratorSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  userId: String,
  username: { type: String, required: true, maxlength: 30 },
  color: { type: String, required: true },
  cursor: { x: Number, y: Number }
});


export const Collaborator = mongoose.model("Collaborator", collaboratorSchema)