import Joi from "joi";

const register = Joi.object({
  name: Joi.string().min(8).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-z0-9]{8,20}$")), //length:8-20,
});

const login = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-z0-9]{8,20}$")), //length:8-20,
});

export default { register, login };
