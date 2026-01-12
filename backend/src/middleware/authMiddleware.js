import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const auth = (req, res, next) => {
  try {
   const token  = req.cookies.token
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
   
    req.id = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
