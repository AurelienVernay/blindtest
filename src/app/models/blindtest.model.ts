import { Theme } from './theme.model';

export class Blindtest {
    constructor(
        public id: number,
        public title: string,
        public author: string,
        public themes: Theme[],
        public gloubi?: Theme
    ) {}

    public static isValid(blindtest: Blindtest): boolean {
        return (
            blindtest.themes.every(theme => Theme.isValid(theme)) &&
            (!blindtest.gloubi || Theme.isValid(blindtest.gloubi))
        );
    }
}
