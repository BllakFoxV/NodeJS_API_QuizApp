import jwt from 'jsonwebtoken';
import config from '../config/config.mjs';
import db from '../db/connection.mjs';
import User from '../models/User.mjs';
import { ERROR_CODES } from '../constants/errorCode.mjs';

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ error: 'Token has expired' });
    }
    const user_id = decoded.id;
    const user = await User.findById(user_id);
    if(!user) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const isActive = async (req, res, next) => {
  console.log(req.user)
    if(req.user.is_active) {
        next();
    } else {
        res.status(401).json({ error: 'You are not active', error_code: ERROR_CODES.USER_NOT_ACTIVE });
    }
}

const isAdmin = async (req, res, next) => {
    if(req.user.is_admin) {
        next();
    } else {
        res.status(401).json({ error: 'You are not authorized to access this resource' });
    }
}
export { verifyToken, isActive, isAdmin };
