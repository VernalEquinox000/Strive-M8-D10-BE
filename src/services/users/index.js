const express = require("express");

const usersModel = require("./schema")
const { authenticate, refreshToken} = require("../auth/tools")
const {authorize, authorize_city, adminOnly} = require("../auth/middleware")

const usersRouter = express.Router();


//-----------GET ROUTE
usersRouter.get("/me/weather", authorize, async (req, res, next) => {
    

 try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}?q=${city},${state},${code}&appid=${process.env.REACT_APP_API_KEY}`
      );
     let data = await response.json();
         } catch (error) {
      console.log(error);
    }
  }
     )


//-----------REGISTER + LOGIN + TOKEN ROUTES
usersRouter.post("/signup", async (req, res, next) => {
    try {
        const newUser = new usersModel(req.body)
        const { _id } = await newUser.save()
        res.status(201).send(_id)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await usersModel.findByCredentials(email, password)
        console.log("user", user)
        const tokens = await authenticate(user)
        res.send(tokens)        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.post("/refreshToken", async (req, res, next) => {
        
    const oldRefreshToken = req.body.refreshToken
    if (!oldRefreshToken) { 
        const err= new Error("Missing Refresh Token")
        err.httpStatusCode = 400
        next(err)
    } else {
        try {
            const theseNewTokens = await refreshToken(oldRefreshToken)
            res.send(theseNewTokens)
        } catch (error) {
            console.log(error)
            const err = new Error
            err.httpStatusCode = 403
            next(err)
        }
    }
})

//---------------------USER ROUTES---------------------
usersRouter.get("/me", authorize, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})

usersRouter.put("/me", authorize, async (req, res, next) => {
    try {
        const keys = Object.keys(req.body)
        keys.forEach(key => (req.user[key] = req.body[key]))
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})


usersRouter.delete("/me", authorize, async (req, res, next) => {
    try {
        await req.user.deleteOne(res.send("User deleted"))
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})

//--------------------ADMINS ONLY ROUTE---------------------
usersRouter.get("/", authorize, adminOnly, async (req, res, next) => {
    try {
        console.log(req.user) 
        const users = await usersModel.find()
        res.send(users)
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})


//---------------------CITIES ROUTES-------------------------
usersRouter.get("/:me/favoriteCities", authorize_city, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.post("/:me/favoriteCities", authorize_city, async (req, res, next) => {
    try {
        const keys = Object.keys(req.body)
        const key = keys.filter(key => key === "cities")
        req.user[key] = req.user[key].concat(req.body[key])
        await req.user.save()
        res.send(req.user.cities)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.put("/:me/favoriteCities", authorize_city, async (req, res, next) => {
    try {
        const keys = Object.keys(req.body)
        const key = keys.filter(key => key === "cities")
        req.user[key] = req.body[key]
        await req.user.save()
        res.send(req.user[key])
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})


usersRouter.delete("/:me/favoriteCities", authorize_city, async (req, res, next) => {
    try {
        await req.user.deleteOne(res.send("City deleted"))
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})


module.exports = usersRouter