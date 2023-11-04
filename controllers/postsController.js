const { error, success } = require("../utils/responseWrapper");

const getAllPostsController = async (req,res) => {
    console.log(req._id);
    return res.send(success(200,'These are  all posts'));
}

module.exports = {
    getAllPostsController
}