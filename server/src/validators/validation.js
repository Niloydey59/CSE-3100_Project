const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/responseController");

const runValidation = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return errorResponse(422, errors.array()[0].msg, res);
      //console.log(errors.array()[0].msg);
      return errorResponse(res, {
        status: 422,
        message: errors.array()[0].msg,
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { runValidation };
