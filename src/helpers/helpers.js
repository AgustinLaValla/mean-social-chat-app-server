const User = require('../models/user.schema');

const firstUpper = (username) => {
    username = username.toLowerCase();
    const nameSplitted = username.split(' ');
    let nameCapitalized = '';
    nameSplitted.forEach((word, idx) => {
        nameCapitalized = (idx < nameSplitted.length - 1) ? nameCapitalized += word.charAt(0).toUpperCase() + word.slice(1) + ' '
            : nameCapitalized += word.charAt(0).toUpperCase() + word.slice(1)
    });
    return nameCapitalized;
};


const updateChatList = async (req, msgId) => {
    await User.updateOne({ _id: req.user._id }, {
        $pull: {
            chatList: {
                receiverId: req.params.receiverId
            }
        }
    });

    await User.updateOne({ _id: req.params.receiverId }, {
        $pull: {
            chatList: {
                receiverId: req.user._id
            }
        }
    });

    await User.updateOne({ _id: req.user._id }, {
        $push: {
            chatList: {
                $each: [
                    {
                        receiverId: req.params.receiverId,
                        msgId: msgId
                    }
                ],
                $position: 0
            }
        }
    });

    await User.updateOne({ _id: req.params.receiverId }, {
        $push: {
            chatList: {
                $each: [
                    {
                        receiverId: req.user._id,
                        msgId: msgId
                    }
                ]
            }
        }
    });

};
module.exports = { firstUpper, updateChatList }; 