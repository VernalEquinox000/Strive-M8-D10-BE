const express = require("express");
const axios = require("axios").default
const usersModel = require("./schema")
const { authenticate, refreshToken} = require("../auth/tools")
const {authorize, authorize_city, adminOnly} = require("../auth/middleware")

const usersRouter = express.Router();


//-----------GET ROUTE
usersRouter.get("/me/weather", authorize, async (req, res, next) => {
    

    try {
        if (req.query && req.query.city) {
            let options = {
                method: "GET",
                url: `${process.env.API_URL}?q=${req.query.city},${req.query.state},${req.query.code}&appid=${process.env.API_KEY}`
                //`${process.env.API_URL}?q=${city},${state},${code}&appid=${process.env.API_KEY}`
            }
            axios.request(options)
                .then(function (response) {
                    console.log(response.data)
                    res.send(response.data)
                })
                .catch(function (error) {
                    console.error(error)
                })
        } else {
            let cities = req.user.cities
            let options = {
                method: "GET",
                url: `${process.env.API_URL}?q=${cities[0].name}&appid=${process.env.API_KEY}`
                //`${process.env.API_URL}?q=${city},${state},${code}&appid=${process.env.API_KEY}`
            }
            //console.log(req.user.cities[0].name)
            axios.request(options)
                .then(function (response) {
                    
                    //console.log("HHHHEREEE",response.data)
                    res.send(response.data)
                    //responses.push(response.data)
                    //console.log(responses)
                })

                
                .catch(function (error) {
                    console.error(error)
                })
        }
         } catch (error) {
      console.log(error);
 }
    
    /* axios
				.request(options)
				.then(function (response) {
					console.log(response.data)
					res.send(response.data)
				})
				.catch(function (error) {
					console.error(error)
				}) */
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