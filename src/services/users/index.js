const express = require("express");

const usersModel = require("./schema")
const { authenticate } = require("../auth/tools")
const {authorize, authorize_city } = require("../auth/middleware")

const usersRouter = express.Router();

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

usersRouter.get("/me", authorize, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})

usersRouter.get("/:me/favoriteCities", authorize_city, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.post("/:me/favoriteCities", authorize, async (req, res, next) => {
    try {
        const userCities = req.use.findOneAndUpdate(
      {
        $push: {
          cities: {
            ...req.body,
          },
        },
      }
    );
    res.status(201).send(userCities);

        
    } catch (error) {
        console.log(error)
        next(error)
    }
})


module.exports = usersRouter