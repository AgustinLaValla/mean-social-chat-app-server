const cloudinary = require('cloudinary').v2
const User = require('../models/user.schema');
const httpStatus = require('http-status-codes');
const { config }  = require('dotenv');

config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadImage = async (req, res) => {
    const { file } = req.body;
    const result = await cloudinary.uploader.upload(file);

    try {
        await User.updateOne({ _id: req.user._id }, {
            $push: {
                images: {
                    imgId: result.public_id,
                    imgVersion: result.version
                }
            }
        });
        return res.json({ ok: true, message: 'Image Successfully uploaded' });
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal Server Error' });
    };
};

const updateProfilePic = async (req, res) => {
    const { imgId, imgVersion } = req.body;
    try {
        const userExist = await User.findOne({ _id: req.user._id });
        if(!userExist) return res.json({ok:true, message:'User Not Found'});

        await User.update({_id:req.user._id}, {
            $set: { picVersion: imgVersion},
            $set: { picId: imgId }
        });

        return res.json({ok:true, message:'Image Setted'});

    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ok:false, message:'Internal Server Error'});
    }
};

const deleteImage = async (req, res) =>  { 
    const { publicId } = req.params;
    const { image } = req.body;
    
    await cloudinary.uploader.destroy(publicId);

    try {
        await User.updateOne({ _id: req.user._id }, {
            $pull: {
                images: {
                    imgId:image.imgId
                }
            },
        });

        await User.update({_id:req.user._id}, {
            $set: { picVersion: '1591573111'},
            $set: { picId: 'avatar_tmoqrv.png' }
        }).where('picId').equals(image.imgId);
        
        return res.json({ ok: true, message: 'Image Successfully deleted' });
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal Server Error' });
    };
};

module.exports = { uploadImage, updateProfilePic, deleteImage };