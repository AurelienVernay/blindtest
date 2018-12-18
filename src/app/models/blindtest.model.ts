import { Theme } from './theme.model';

export interface Blindtest {
    id: number;
    title: string;
    author: string;
    themes: Theme[];
    gloubi?: Theme;
}
