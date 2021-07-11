import { Router, Request, Response, NextFunction } from "express";
export default class ErrorHandler {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.use(this.notFoundError);
        this.router.use(this.internalServerError);
    }

    private notFoundError(req: Request, res: Response) {
        return res.status(404).json({ msg: 'Not found' });
    }

    private internalServerError(req: Request, res: Response) {
        return res.status(500).json({ msg: 'Internal server error' });
    }

    errorHandler(
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            JSON.parse(err.message)
            if (err.message) {
                let error = JSON.parse(err.message)
                const code = error.code
                delete error.code
                return res.status(code).json(error)
            }
        } catch (e) {
            console.log(err)
            next(err)
        }

        next()
    }

}