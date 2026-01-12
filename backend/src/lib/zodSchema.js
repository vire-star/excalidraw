import { z } from 'zod';

export const ElementSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['rectangle', 'ellipse', 'arrow', 'line', 'freedraw', 'text']),
  x: z.number().min(-50000).max(50000),
  y: z.number().min(-50000).max(50000),
  width: z.number().min(1).max(10000),
  height: z.number().min(1).max(10000),
  angle: z.number().min(0).max(360).default(0),
  strokeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  strokeWidth: z.number().min(1).max(50).default(2),
  strokeStyle: z.enum(['solid', 'dashed']).default('solid'),
  roughness: z.number().min(0).max(2).default(1),
  opacity: z.number().min(0).max(1).step(0.01).default(1),
  fillStyle: z.enum(['solid', 'hachure']).default('solid'),
  text: z.string().optional(),
  points: z.array(z.tuple([z.number(), z.number()])).optional(),
  seed: z.number().optional()
});

export const AppStateSchema = z.object({
  zoom: z.object({ value: z.number().min(0.1).max(5) }),
  scrollX: z.number().min(-50000).max(50000),
  scrollY: z.number().min(-50000).max(50000),
  currentItemStrokeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  currentItemBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  currentItemRoughness: z.number().min(0).max(2),
  selectedElementIds: z.array(z.string()),
  viewBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
});

export const CollaboratorSchema = z.object({
  socketId: z.string(),
  userId: z.string().optional(),
  username: z.string().min(1).max(30),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  cursor: z.object({ x: z.number(), y: z.number() }).optional()
});

export const DrawingSchema = z.object({
  title: z.string().min(1).max(100),
  key: z.string().min(6).max(20),
  elements: z.array(ElementSchema),
  appState: AppStateSchema,
  version: z.number().nonnegative(),
  collaborators: z.array(CollaboratorSchema).optional(),
  isPublic: z.boolean(),
  ownerId: z.string()
});
export const CreateDrawingSchema = z.object({
  title: z.string().min(1).max(100),        // ✅ REQUIRED
  elements: z.array(ElementSchema).optional(),  // ✅ OPTIONAL
  appState: AppStateSchema.optional(),         // ✅ OPTIONAL  
  isPublic: z.boolean().optional()            // ✅ OPTIONAL
});


export const UpdateDrawingSchema = z.object({
  elements: z.array(ElementSchema),
  appState: AppStateSchema,
  version: z.number()
});


export const UserSchema = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(6)
});
export const LoginSchema = z.object({
  
  email: z.string().email(),
  password: z.string().min(6)
});
