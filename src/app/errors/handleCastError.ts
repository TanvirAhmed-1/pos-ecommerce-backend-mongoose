import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/errors';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: `${err.value} is not a valid ID!`,
    },
  ];

  return {
    statusCode: 400,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;