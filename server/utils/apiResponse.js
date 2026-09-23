export const successResponse = (
  res,
  { statusCode = 200, message = "Success", data = null } = {}
) => {
  res.status(statusCode).json({ status: "success", message, data });
};

export const errorResponse = (
  res,
  { statusCode = 500, message = "Internal server error", data = null, ...rest } = {}
) => {
  res.status(statusCode).json({ status: "fail", message, data, ...rest });
};