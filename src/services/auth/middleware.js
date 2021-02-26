const jwt = require("jsonwebtoken")
const userModel = require("../users/schema")
const { verifyAccessToken } = require("./tools")

const authorize = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = await verifyAccessToken(token)
        const user = await userModel.findOne({ _id: decoded._id })
        //console.log(decoded._id)

        if (!user) {
            throw new Error("Error!")
        }
        req.token = token
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        
    }
}

const authorize_city = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = await verifyAccessToken(token)
        const user = await userModel.findOne({ _id: decoded._id }, {
        cities: 1,
        _id: 0,
        })
        //console.log(decoded._id)

        if (!user) {
            throw new Error("Error!")
        }
        req.token = token
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        
    }
}

const authorize_city_post = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = await verifyAccessToken(token)
        const user = await userModel.findOne({ _id: decoded._id }, {
        cities: 1,
        _id: 0,
        })
        //console.log(decoded._id)

        

        if (!user) {
            throw new Error("Error!")
        }
        req.token = token
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        
    }
}

module.exports = {authorize, authorize_city}