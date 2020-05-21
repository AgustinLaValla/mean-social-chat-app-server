const User = require('../models/user.schema');
const httpStatus = require('http-status-codes');

const follow = async (req, res) => {
    try {

        await User.updateOne({ _id: req.body._id, 'followers.follower':{$ne:req.user._id} }, {
            $push: {
                followers: {
                    follower: req.user._id
                }
            }
        });

        await User.updateOne({_id:req.user._id, 'following.userFollowed': {$ne:req.body._id}}, {
            $push: {
                following: {
                    userFollowed: req.body._id
                }
            }
        });

        return res.json({ok:true, message: 'Operation Successfully executed!'})

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: true, error: 'Internal Server Error' });
    }
}

module.exports = { follow };