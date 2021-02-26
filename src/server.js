const express = require("express")
const cors = require("cors")
const listEndPoints = require("express-list-endpoints")
const mongoose = require("mongoose")

const usersRouter = require("./services/users")

const {
    badRequestHandler,
    unauthorizedHandler,
    forbiddenHandler,
    notFoundHandler,
    genericErrorHandler,
} = require("./errorHandlers")

const server = express()

server.use(cors())

const port = process.env.PORT || 5000

server.use(express.json())

server.use("/users", usersRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndPoints(server))

mongoose.set("debug", true)

mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(server.listen(port, () => {
    console.log("running on port", port)
    }))
.catch(error => console.log(error))