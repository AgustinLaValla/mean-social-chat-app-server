
const addPost = (req, res) => {
    console.log(req.body);
    console.log(req.user);
    res.end();
};

module.exports = { addPost };