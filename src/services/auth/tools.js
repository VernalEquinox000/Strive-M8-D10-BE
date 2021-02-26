const jwt = require("jsonwebtoken")
const user = require("../users/schema")

const authenticate = async user => {
    try {
        const newAccessToken = await generateAccessToken({ _id: user._id })
        //console.log(newAccessToken)
        const newRefreshToken = await generateRefreshToken({ _id: user._id })
        //console.log(newRefreshToken)
        user.refreshTokens = user.refreshTokens.concat({ token: newRefreshToken })
        await user.save()
        
        return { token: newAccessToken, refreshToken: newRefreshToken }
        
    } catch (error) {
        console.log(error)

        throw new Error(error)
    }
}

const generateAccessToken = payload =>
    new Promise((res, rej) => 
        jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: "15m" }, (error, token) => {
            if (error) rej(error)
            res(token)
        }))

const generateRefreshToken = payload =>
    new Promise((res, rej) => 
        jwt.sign(payload, process.env.REFRESH_JWT_SECRET,
        { expiresIn: "1h" }, (error, token) => {
            if (error) rej(error)
            res(token)
        }))
    
const verifyAccessToken = token => 
    new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) rej(error)
            res(decoded)
        })
    })

const verifyRefreshToken = token => 
    new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (error, decoded) => {
            if (error) rej(error)
            res(decoded)
        })
    })


module.exports = {authenticate, verifyAccessToken}

