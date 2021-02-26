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
        { expiresIn: "1h" }, (error, token) => {
            if (error) rej(error)
            res(token)
        }))

const generateRefreshToken = payload =>
    new Promise((res, rej) => 
        jwt.sign(payload, process.env.REFRESH_JWT_SECRET,
        { expiresIn: "1w" }, (error, token) => {
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

const refreshToken = async oldRefreshToken => {
    const decoded = await verifyRefreshToken(oldRefreshToken)
    const user = await user.findOne({ _id: decoded._id })
    
    if (!user) {
        throw new Error("no user found")
    }

    const currentRefreshToken = user.refreshTokens.find(
        t=>t.token ===oldRefreshToken)

    if (!currentRefreshToken) { throw new Error("enter refresh token") }

    const newAccessToken = await generateAccessToken({ _id: user._id })
    const newRefreshToken = await generateRefreshToken({ _id: user._id })

    const newRefreshTokens = user.refreshTokens.filter(
        t => t.token != oldRefreshToken).concat({ token: newRefreshToken })
    
    user.refreshTokens = [...newRefreshTokens]
    await user.save()
    return {token:newAccessToken, refreshToken:newRefreshToken}
}

module.exports = {authenticate, verifyAccessToken, refreshToken}

