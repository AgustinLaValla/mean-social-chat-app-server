const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    username: { type:String, required:true, default: '' },
    post: { type:String, default:'', required:true },
    comments: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            username: { type:String, required:true, default: '' },
            comment: { type:String, default:'' },
            createdAt: { type:Date, default:Date.now() }            
        }
    ],
    totalLikes: { type:Number, default:0 },
    likes: [
        {
            username:  { type:String, default: '' }
        }
    ]
}, {timestamps:true});

module.exports = model('Post', postSchema);

