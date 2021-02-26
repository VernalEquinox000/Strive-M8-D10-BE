const { Schema, model } = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new Schema({

        username: {
            type: String,
        required: true,
        unique: true,
        },
        password: {
            type: String,
            required: true
        },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
            type: String,
            enum: ["user", "admin"]
    },
    cities: [{ name: { type: String } }],
    refreshTokens: [{token: {type:String} }]
},
    {timestamps: true}
)

userSchema.pre("save", async function (next) {
    const user = this // 
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.__v
    return userObj
}

userSchema.statics.findByCredentials = async function (email, password) {
    //console.log(email,password)
    const user = await this.findOne({ email })
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) return user
        else return ("password not valid")
    }
    else return ("user not found!")
    }

    module.exports = model ("User", userSchema)