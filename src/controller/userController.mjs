import User from '../models/User.mjs';
import QuizResult from '../models/QuizResult.mjs';

export const getUserInfo = async (req, res) => {
    const user = await User.findById(req.user.id);
    const user_data = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        is_active: user.is_active,
    };
    const history = await QuizResult.findByUserId(req.user.id);
    const last_result = history[history.length - 1];
    const last_score = last_result ? last_result.score : 0;
    res.status(200).json({user: user_data, history, last_score });
};
