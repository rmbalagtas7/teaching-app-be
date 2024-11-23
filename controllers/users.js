const jwt = require('jsonwebtoken');
const User = require("../models/users");

exports.getAll = async (req, res) => {
    try {
        console.log(req.query)
        const users = await User.find(req.query)
        res.send({ success: true, users })
    } catch (error) {
        console.log(error)
        res.send({ success: false, error })
    }
}

exports.register = async (req, res) => {
    // check email
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.send({ success: false, error: "Email already taken." });
    }

    try {
        // insert
        req.body.username = req.body.email.split("@")[0]
        const user = new User(req.body);
        const newUser = await user.save();

        res.json({ success: true, user: newUser });
    } catch (error) {
        console.log(error);
        res.send({ success: false, error });
    }
};


exports.auth = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.send({ success: false, message: 'Cannot find a user with that account' })
        }

        const match = await user.comparePassword(req.body.password)
        if (!match) {
            return res.send({ success: false, message: "Invalid Login Credentials" })
        }

        const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        })

        res.send({ success: true, access_token, user })
    } catch (error) {
        console.log(error)
        res.send({ success: false, error })
    }
}