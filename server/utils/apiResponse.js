export const createApiResponse = (statusCode, data, message = "Success") => ({
  statusCode,
  success: statusCode < 400,
  message,
  data
});
