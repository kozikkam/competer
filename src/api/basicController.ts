export default class BasicController {
  method: string;
  path: string;

  constructor(method, path) {
    this.method = method;
    this.path = path;
  }

  get validation() {
    return {};
  }

  validate(req, res, next, validator) {
    const validate = validator.compile(this.validation);
    const valid = validate(req.body);

    if (!valid) {
      throw new Error(validate.errors[0].message);
    }

    this.handle(req, res, next);
  }

  handle(req, res, next) {
    return;
  }
}