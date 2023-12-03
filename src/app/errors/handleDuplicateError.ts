/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: '',
      message: extractedMessage,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: extractedMessage,
    errorSources,
  };
};

export default handleDuplicateError;
