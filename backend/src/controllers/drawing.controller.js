// import { Drawing } from "../models/Drawing.js";
import { Drawing } from "../models/drawing.model.js";
import { User } from "../models/user.model.js";
import { nanoid } from 'nanoid';

export const createDrawing = async (req, res) => {
    try {
        const { title, elements, appState, isPublic } = req.validatedData;
        
        // Generate unique key
        const key = nanoid(8);
        
        const drawing = await Drawing.create({
            title,
            key,
            elements: elements || [],
            appState: appState || {
                zoom: { value: 1 },
                scrollX: 0,
                scrollY: 0,
                currentItemStrokeColor: '#1e1e1e',
                currentItemBackgroundColor: '#ffffff',
                currentItemRoughness: 1,
                selectedElementIds: [],
                viewBackgroundColor: '#ffffff'
            },
            version: 0,
            isPublic: isPublic || false,
            ownerId: req.id  // From auth middleware
        });

        return res.status(201).json({
            message: `${title} drawing created successfully`,
            drawing: {
                id: drawing._id,
                key: drawing.key,
                title: drawing.title,
                elements: drawing.elements,
                appState: drawing.appState
            }
        });
    } catch (error) {
        console.log(`error from createDrawing: ${error}`);
        return res.status(400).json({
            message: "Failed to create drawing"
        });
    }
};

export const getDrawing = async (req, res) => {
    try {
        const drawingId = req.params.id;
        const userId = req.id;

        const drawing = await Drawing.findOne({
            $or: [
                { _id:drawingId, isPublic: true },
                {  _id:drawingId, ownerId: userId }
            ]
        }).select('-collaborators'); // Don't send socket data in REST

        if (!drawing) {
            return res.status(404).json({
                message: "Drawing not found or access denied"
            });
        }

        return res.status(200).json({
            message: "Drawing fetched successfully",
            drawing
        });
    } catch (error) {
        console.log(`error from getDrawing: ${error}`);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateDrawing = async (req, res) => {
    try {
        const key  = req.params.id;
        const { elements, appState, version } = req.validatedData;
        const userId = req.id;

        const drawing = await Drawing.findOneAndUpdate(
            { key, ownerId: userId },
            {
                elements,
                appState,
                version,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!drawing) {
            return res.status(404).json({
                message: "Drawing not found"
            });
        }

        return res.status(200).json({
            message: "Drawing updated successfully",
            drawing: {
                key: drawing.key,
                elements: drawing.elements,
                appState: drawing.appState,
                version: drawing.version
            }
        });
    } catch (error) {
        console.log(`error from updateDrawing: ${error}`);
        return res.status(400).json({
            message: "Failed to update drawing"
        });
    }
};

export const getUserDrawings = async (req, res) => {
    try {
        const userId = req.id;

        const drawings = await Drawing.find({ ownerId: userId })
            .sort({ updatedAt: -1 })
            .select('title key isPublic createdAt updatedAt')
            .limit(20);

        return res.status(200).json({
            message: "User drawings fetched successfully",
            drawings
        });
    } catch (error) {
        console.log(`error from getUserDrawings: ${error}`);
        return res.status(500).json({
            message: "Failed to fetch drawings"
        });
    }
};



// drawing.controller.js mein add karo
export const deleteDrawing = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const drawing = await Drawing.findOneAndDelete({
            _id: id,
            ownerId: userId  // Only owner can delete
        });

        if (!drawing) {
            return res.status(404).json({
                message: "Drawing not found or unauthorized"
            });
        }

        return res.status(200).json({
            message: "Drawing deleted successfully"
        });
    } catch (error) {
        console.log(`error from deleteDrawing: ${error}`);
        return res.status(500).json({
            message: "Failed to delete drawing"
        });
    }
};


export const toggleDrawingVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const drawing = await Drawing.findOne({ _id: id, ownerId: userId });
        
        if (!drawing) {
            return res.status(404).json({
                message: "Drawing not found"
            });
        }

        drawing.isPublic = !drawing.isPublic;
        await drawing.save();

        return res.status(200).json({
            message: `Drawing is now ${drawing.isPublic ? 'public' : 'private'}`,
            isPublic: drawing.isPublic
        });
    } catch (error) {
        console.log(`error from toggleVisibility: ${error}`);
        return res.status(500).json({
            message: "Failed to update visibility"
        });
    }
};


export const searchDrawings = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.id;

        const drawings = await Drawing.find({
            ownerId: userId,
            title: { $regex: query, $options: 'i' }
        }).select('title key isPublic createdAt updatedAt');

        return res.status(200).json({
            message: "Search results",
            drawings
        });
    } catch (error) {
        return res.status(500).json({
            message: "Search failed"
        });
    }
};
