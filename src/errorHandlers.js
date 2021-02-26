const badRequestHandler = (error, req, res, next) => {
    if (error.httpStatusCode === 400) {
        res.status(400).send(error.message)
    } next(error) 
}

const unauthorizedHandler = (error, req, res, next) => {
    if (error.httpStatusCode === 401) {
        res.status(401).send(error.message)
    } next(error) 
}

const forbiddenHandler = (error, req, res, next) => {
    if (error.httpStatusCode === 403) {
        res.status(403).send(error.message)
    } next(error) 
}

const notFoundHandler = (error, req, res, next) => {
    if (error.httpStatusCode === 404) {
        res.status(404).send(error.message)
    } next(error) 
}

const genericErrorHandler = (error, req, res, next) => {
if (!res.headersSent) {
    res.status(error.httpStatusCode || 500).send(error.message)
  }
    } 

module.exports = {
    badRequestHandler,
    unauthorizedHandler,
    forbiddenHandler,
    notFoundHandler,
    genericErrorHandler
}