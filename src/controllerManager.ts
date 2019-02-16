export default class ControllerManager {
  app: any;

  constructor(app: any) {
    this.app = app;
  }

  addControllers(controllers) {
    controllers.forEach(controller => {
      this.addController(controller)
    });
  }

  addController(controller) {
    this.app[controller.method](controller.path, controller.handle);
  }

  addMiddleware(middleware, path = '') {
    this.app.use(path, middleware.handle);
  }
}
