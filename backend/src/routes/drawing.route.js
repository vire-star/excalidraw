import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { CreateDrawingSchema, UpdateDrawingSchema } from "../lib/zodSchema.js";
import { createDrawing, getDrawing, getUserDrawings, updateDrawing } from "../controllers/drawing.controller.js";


const drawingRoute = express.Router()

drawingRoute.post('/createDrawing', auth, validate(CreateDrawingSchema), createDrawing)
drawingRoute.get('/getDrawing/:id', auth ,getDrawing)
drawingRoute.get('/allDrawing', auth ,getUserDrawings)
drawingRoute.put('/updateDrawing/:id', auth, validate(UpdateDrawingSchema), updateDrawing);
export default drawingRoute