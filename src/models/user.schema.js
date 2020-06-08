const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: [true, 'Username is required'] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    posts: [
        {
            postId: { type: Schema.Types.ObjectId, ref: 'Post' },
            post: { type: String },
            created: { type: Date, default: Date.now() }
        }
    ],
    following: [
        { userFollowed: { type: Schema.Types.ObjectId, ref: 'User' } }
    ],
    followers: [
        { follower: { type: Schema.Types.ObjectId, ref: 'User' } }
    ],
    notifications: [
        {
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            message: { type: String },
            viewProfile: { type: Boolean, default: false },
            created: { type: Date, default: Date.now() },
            read: { type: Boolean, default: false },
            date: { type: String, default: '' }
        },

    ],
    chatList: [
        {
            receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            msgId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },

        }
    ],
    picVersion: { type: String, default: '1591573111' },
    picId: { type: String, default: 'avatar_tmoqrv.png' },
    images: [
        {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' }
        }
    ],
    city: { type:String, default:'' },
    country: { type:String, default: '' }
}, { timestamps: true });

module.exports = model('User', userSchema);
