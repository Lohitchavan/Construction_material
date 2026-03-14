function notFound(_req, res) {
  res.status(404).json({ message: "Not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const statusCode =
    typeof err.statusCode === "number" ? err.statusCode : res.statusCode || 500;
  const message = err.message || "Server error";
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };

