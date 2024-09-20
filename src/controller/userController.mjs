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

export const updateUserScore = async (req, res) => {
    const { score, result_id } = req.body;
    console.log('request body',req.body);
    const result = await QuizResult.findById(result_id);
    if(result && await result.updateScore(score)){
        res.status(200).json({message: 'Score updated'});
    }else{
        res.status(400).json({message: 'Failed to update score'});
    }

}

export const updatePassword = async (req, res) => {
    const { old_password, new_password } = req.body;
    const user = await User.findById(req.user.id);
    if(user && await user.updatePassword(old_password, new_password)){
        res.status(200).json({message: 'Password updated'});
    }else{
        res.status(400).json({message: 'Failed to update password'});
    }
}