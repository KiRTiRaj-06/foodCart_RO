// backend/middleware/validate.js
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors
            stripUnknown: true // Remove unexpected keys
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(", ");
            return res.status(400).json({ success: false, message: errorMessage });
        }
        
        // Overwrite req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

module.exports = { validate };
