import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
    // console.log("User middleware called");
    // next();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
        console.log("Decoded : " + JSON.stringify(decoded));
        req.userId = decoded.userId;
       

    next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token or expired token" });
        console.log("Invalid token or expired token:" + error);
    }
}

export default userMiddleware;