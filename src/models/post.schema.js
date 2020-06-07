const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    username: { type:String, required:true, default: '' },
    post: { type:String, default:'', required:false },
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
    ],
    image: { type:String, required:false }
}, {timestamps:true});

module.exports = model('Post', postSchema);

