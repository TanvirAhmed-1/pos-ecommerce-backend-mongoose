import { TErrorSources, TGenericErrorResponse } from "../interfaces/errors";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Regex ব্যবহার করে এরর মেসেজ থেকে ডুপ্লিকেট ভ্যালুটি খুঁজে বের করা
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
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

export default handleDuplicateError;
