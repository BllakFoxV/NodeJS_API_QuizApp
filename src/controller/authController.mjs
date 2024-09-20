import { ERROR_CODES } from '../constants/errorCode.mjs';
import User from '../models/User.mjs';
import { generateToken } from '../utils/processor.mjs';

export const register = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required', error_code: ERROR_CODES.INVALID_CREDENTIALS });
    }
    
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Tài Khoản Đã Tồn Tại', error_code: ERROR_CODES.USER_ALREADY_EXISTS });
        }
        const user = new User(fullname, email);
        await user.setPassword(password);
        await user.save();
        res.status(201).json({ message: 'Thành Công'});
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: 'Email already exists', error_code: ERROR_CODES.USER_ALREADY_EXISTS });

        }
        res.status(500).json({ message: 'Server error', error_code: ERROR_CODES.SERVER_ERROR });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required', error_code: ERROR_CODES.INVALID_CREDENTIALS });
    }
    const user = await User.findByEmail(email);
    if (!user || !(await user.verifyPassword(password))) {
        return res.status(400).json({ message: 'Email Hoặc Mật Khẩu Không Đúng, Vui Lòng Kiểm Tra Lại', error_code: ERROR_CODES.INVALID_CREDENTIALS });
    }
    const token = await generateToken({ id: user.id});
    res.status(200).json({ message: 'Thành Công', token});
}

export const authAdmin = async (req, res) => {
    if(req.user.is_admin) {
        res.status(200).json({ message: 'Thành Công', is_admin: true, fullname: req.user.fullname });
    } else {
        res.status(401).json({ message: 'You are not admin', is_admin: false ,fullname: ''});
    }
}
