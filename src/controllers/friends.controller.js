const User = require('../models/user.schema');
const httpStatus = require('http-status-codes');

const follow = async (req, res) => {
    try {

        await User.updateOne({ _id: req.body._id, 'followers.follower': { $ne: req.user._id } }, {
            $push: {
                followers: {
                    follower: req.user._id
                },
                notifications: { 
                    senderId: req.user._id,
                    message: `${req.user.username} is now following you!`
                 }
            }
        });

        await User.updateOne({ _id: req.user._id, 'following.userFollowed': { $ne: req.body._id } }, {
            $push: {
                following: {
                    userFollowed: req.body._id
                }
            }
        });

        return res.json({ ok: true, message: 'Operation Successfully executed!' });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: true, error: 'Internal Server Error' });
    }
};

const unfollowUser = async (req, res) => {
    await User.updateOne({ _id: req.user._id }, {
        $pull: {
            following: {
                userFollowed: req.body._id
            }
        }
    });

    await User.updateOne({_id:req.body._id} , {
        $pull: {
            followers: {
                follower: req.user._id
            }
        }
    })

    return res.json({ok:true, message: 'Unfollowed'});
};

module.exports = { follow, unfollowUser };