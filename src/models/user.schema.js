const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: [true, 'Username is required'] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // img: { type: String, required: false },,
    posts: [
        {
            postId: { type:Schema.Types.ObjectId, ref: 'Post' },
            post: { type:String},
            created: { type:Date, default: Date.now() }
        }
    ],
    following: [
        { userFollowed: { type:Schema.Types.ObjectId, ref: 'User' }}
    ],
    followers: [
        { follower: { type:Schema.Types.ObjectId, ref: 'User' } }
    ]
}, { timestamps: true });

module.exports = model('User', userSchema);
