import jwt from "jsonwebtoken";

export function adminAuth(req, res, next) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "Admin authentication is required." });
    try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).json({ message: "Your admin session is invalid or has expired." });
    }
}
