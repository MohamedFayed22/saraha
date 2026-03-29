export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    for (const key of Object.keys(schema)) {
      const result = schema[key].validate(req[key], { abortEarly: false });
      if (result.error) {
        errors.push(...result.error.details);
      }
    }
    if (errors.length) {
      return res.status(400).json({ message: "validation error", errors });
    }
    next();
  };
};
