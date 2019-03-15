import * as express from 'express';
import * as mongoose from 'mongoose';

export abstract class ApiModelFactory<T extends mongoose.Document> {
    static collectionName: string;
    public static generateApiRouter<U extends mongoose.Document>(
        model: mongoose.Model<U>
    ): express.Router {
        const router = express.Router();
        this.registerAddListener(router, model);
        this.registerGetAllListener(router, model);
        this.registerGetOneByIdListener(router, model);
        this.registerUpdateListener(router, model);
        this.registerDeleteListener(router, model);
        return router;
    }

    private static registerGetAllListener<U extends mongoose.Document>(
        router: express.Router,
        model: mongoose.Model<U>
    ) {
        console.log(`registering ${this.collectionName} getAll listener`);
        router.get(`/`, (req, res) => {
            model.find().then((results: U[]) => {
                res.json(results);
            });
        });
    }
    private static registerGetOneByIdListener<U extends mongoose.Document>(
        router: express.Router,
        model: mongoose.Model<U>
    ) {
        console.log(`registering ${this.collectionName} getOneById listener`);
        router.get(`/:id`, (req, res) => {
            console.log(
                `getting ${this.collectionName} by id = `,
                req.params.id
            );
            model.findById(req.params.id).then(
                result => {
                    if (result) {
                        res.json(result);
                    } else {
                        res.sendStatus(404).json({
                            message: `${
                                this.collectionName
                            } not found with id ${req.params.id}`,
                        });
                    }
                },
                err => {
                    res.sendStatus(500).json({ error: err });
                }
            );
        });
    }
    private static registerUpdateListener<U extends mongoose.Document>(
        router: express.Router,
        model: mongoose.Model<U>
    ) {
        console.log(`registering ${this.collectionName} update listener`);
        router.put(`/:id`, (req, res) => {
            if (req.params.id) {
                model
                    .findByIdAndUpdate(req.params.id, req.body)
                    .then(
                        success => res.status(200).json(success),
                        error => res.status(500).json({ error: error })
                    );
            } else {
                res.status(400).json({ message: `missing '_id' property` });
            }
        });
    }
    private static registerAddListener<U extends mongoose.Document>(
        router: express.Router,
        model: mongoose.Model<U>
    ) {
        console.log(`registering ${this.collectionName} add listener`);
        router.post(`/`, (req, res) => {
            console.log('adding a new item', req.body);
            const object: U = new model(req.body);
            object.save().then(
                result => {
                    console.log('success', result);
                    res.status(201).json(result);
                },
                error => {
                    console.log(error);
                    res.status(500).send({
                        type: 'error',
                        message: 'an Error occured !',
                        error: error,
                    });
                }
            );
        });
    }
    private static registerDeleteListener<U extends mongoose.Document>(
        router: express.Router,
        model: mongoose.Model<U>
    ) {
        console.log(`registering ${this.collectionName} delete listener`);
        router.delete(`/:id`, (req, res) => {
            model.findByIdAndDelete(req.params.id).then(
                sucess => {
                    console.log(sucess);
                    res.json(sucess);
                },
                error => {
                    res.status(500).json({ error: error });
                }
            );
        });
    }
}
