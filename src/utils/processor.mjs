import bcrypt from 'bcrypt';
import config from '../config/config.mjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password, salt) => {
    const phase1 = password + config.SECRET_KEY;
    const hashedPassword = await bcrypt.hash(phase1, salt);
    return hashedPassword;
}

export const checkPassword = async (password, hashedPassword) => {
    const phase1 = password + config.SECRET_KEY;
    const isMatch = await bcrypt.compare(phase1, hashedPassword);
    return isMatch;
}

export const generateSalt = async () => {
    const salt = await bcrypt.genSalt(10);
    return salt;
}

export const generateToken = async (payload) => {
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    return token;
}

export const verifyToken = async (token) => {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
}

export default {
    hashPassword,
    checkPassword,
    generateSalt,
    generateToken,
    verifyToken
}
