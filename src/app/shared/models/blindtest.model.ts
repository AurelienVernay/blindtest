import { Theme } from './theme.model';

export class Blindtest {
    constructor(
        public _id: string,
        public title: string,
        public author: string,
        public themes: Theme[],
        public gloubi?: Theme
    ) {}
    public get id() {
        return this._id;
    }
    public static isValid(blindtest: Blindtest): boolean {
        return (
            blindtest.themes.every(theme => Theme.isValid(theme)) &&
            (!blindtest.gloubi || Theme.isValid(blindtest.gloubi))
        );
    }
}
