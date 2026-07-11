export function errorHandler(error, req, res, next) {
    console.error(error);
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || "value";
        return res.status(409).json({ message: `A participant with this ${field} already exists.` });
    }
    return res.status(error.name === "ValidationError" ? 400 : 500).json({
        message: error.name === "ValidationError" ? error.message : "Something went wrong. Please try again."
    });
}
