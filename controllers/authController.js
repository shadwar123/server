const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require("../utils/responseWrapper");


const signupController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
           // return res.status(400).send("All fields are required");
           return res.send(error(400, "All fields are shadwar"));
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send(error(409, "User is already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });
        // return res.status(201).json({
        //     user,
        // });
        return res.send(
            success(201, 'user created successfully')
        );

    } catch (error) {
        return res.send(error(500, e.message));
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send(error(400, "All fields are required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.send(error(404, "User is not registered"));
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            // return res.status(403).send("Incorrect password");
            return res.send(error(403, "Incorrect password"));
        }

        const accessToken = generateAccessToken({
            _id: user._id
        })
        const refreshToken = generateRefreshToken({
            _id: user._id
        });

        res.cookie('jwt', refreshToken, {
                        httpOnly:true,
                        secure:true
        })

        return res.send(success(200, { accessToken }));

    } catch (error) {
        return res.send(error(500, e.message));
    }
}
// This api will validity of refresh token and generate a new access token
    const refreshAccessTokenController = async (req,res) => {
        const cookies = req.cookies;
        if (!cookies.jwt) {
            // return res.status(401).send("Refresh token in cookie is required");
            return res.send(error(401, "Refresh token in cookie is required"));
        }
    
        const refreshToken = cookies.jwt;
    
        console.log('refressh', refreshToken);
    
        try{
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_PRIVATE_KEY
                
            );
            console.log("my token refreshin");
            const _id = decoded._id;
            const accessToken = generateAccessToken({_id});

            return res.send(success(201, { accessToken }));

        } catch (error){
            console.log(error);
            return res.send(error(401, "Invalid refresh token"));
        }
    }

//internal function
const generateAccessToken = (data) => {

    try{
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: '15m'
        });
        console.log("access token generating");
    
        return token;
    } catch (error){
        return res.send(error(500, e.message));
    }

}

const generateRefreshToken = (data) => {

    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: '1y'
        });

        return token;
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController
}