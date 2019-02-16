import BasicController from './basicController';

export default class ControllerManager {
  app: any;
  validator: any;

  constructor(app: any, validator: any) {
    this.app = app;
    this.validator = validator;
  }

  addControllers(controllers) {
    controllers.forEach(controller => {
      this.addController(controller)
    });
  }

  addController(controller) {
    const method = controller.method.toLowerCase();

    if (!(controller instanceof BasicController)) {
      throw Error('Attempted to add controller not of BasicController type!');
    }

    this.app[method](
      controller.path,
      async (req, res, next) => {
        try {
          await controller.validate(req, res, next, this.validator);
        } catch (error) {
          next(error);
        }
      },
    );
  }

  addMiddleware(middleware, path = '') {
    this.app.use(path, middleware.handle);
  }
}
