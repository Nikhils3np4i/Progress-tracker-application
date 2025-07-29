const jwt = require('jsonwebtoken')
const { user_JWT_Secret } = require('./config');

function userAuthMiddleware(req, res, next) {
    const token = req.cookies.token;

    try {

        const response = jwt.verify(token, user_JWT_Secret);
        if (response) {
            req.userId = response.id;
            next()
        } else {
            res.status(403).send({
                message: "Unauthorized"
            })
        }
    }catch(e){
        console.log("error while middleware authentication " + e)
        res.status(500).send({message:"Invalid or expired token"})
    }
}

module.exports = {
    userAuthMiddleware
}