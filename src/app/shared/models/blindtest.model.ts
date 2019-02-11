import { Theme } from './theme.model';

export class Blindtest {
    constructor(
        public _id: string,
        public title: string,
        public author: string,
        public themes: Theme[],
        public gloubi?: Theme,
        public isValid?: boolean
    ) {}
    public get id() {
        return this._id;
    }
}
