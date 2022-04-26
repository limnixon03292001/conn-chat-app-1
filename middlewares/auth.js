const jwt  = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const auth = asyncHandler(async (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if(!token){
        return res.status(401).json({err: "No token found!, not authorized."})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken
        next();
    } catch (error) {
        res.status(401).json({err: "Invalid token!"});
    }
})

module.exports = auth;