"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    // Regex ব্যবহার করে এরর মেসেজ থেকে ডুপ্লিকেট ভ্যালুটি খুঁজে বের করা
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorSources = [
        {
            path: Object.keys(err.keyValue)[0],
            message: `${extractedMessage} already exists!`,
        },
    ];
    return {
        statusCode: 409,
        message: "Duplicate Entry",
        errorSources,
    };
};
exports.default = handleDuplicateError;
