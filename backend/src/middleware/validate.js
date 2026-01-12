import { ElementSchema, CreateDrawingSchema, UpdateDrawingSchema, UserSchema } from '../lib/zodSchema.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: parsed.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    
    req.validatedData = parsed.data;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: `Validation error`
    });
  }
};
