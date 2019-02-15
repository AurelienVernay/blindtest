import { Theme } from './theme.model';

export interface Blindtest {
    _id: string;
    title: string;
    author: string;
    themes: Theme[];
    gloubi?: Theme;
    isValid?: boolean;
}
