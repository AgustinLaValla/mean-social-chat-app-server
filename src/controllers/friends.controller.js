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

    await User.updateOne({ _id: req.body._id }, {
        $pull: {
            followers: {
                follower: req.user._id
            }
        }
    });

    return res.json({ ok: true, message: 'Unfollowed' });
};

const markNotification = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.body.deleteValue) {
            await User.updateOne({ _id: req.user._id }, {
                $set: { 'notifications.$.read': true }
            }).where('notifications._id').equals(id);

            return res.json({ ok: true, message: 'Notification Marked' });
        };

        await User.updateOne({ _id: req.user._id }, {
            $pull: {
                notifications: {
                    _id: id
                }
            }
        }).where('notifications._id').equals(id);

        return res.json({ ok: true, message: 'Notification successfully deleted' });

    } catch (error) {
        return res.json({ ok: false, message: 'Internal Server Error' });
    }

};

const markAllNotifications = async (req, res) => {
    try {
        await User.updateOne({ _id: req.user._id }, {
            $set: { 'notifications.$[elem].read': true },
        },
            { arrayFilters: [{ 'elem.read': false }], multi:true });

        return res.json({ok:true, message:'All notifications marked'});

    } catch (error) {
        console.log(error);
        return res.json({ ok: false, message: 'Internal Server Error' });
    }
};

module.exports = { follow, unfollowUser, markNotification, markAllNotifications };