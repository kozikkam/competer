import express from 'express';

export default interface BasicController {
  path: string;
  method: string;

  handle(req: express.Request, res: express.Response, next: Function): void;
}