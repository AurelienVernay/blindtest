import { ITheme } from './theme.interface';

export interface IBlindtest {
    title: string;
    author: string;
    themes: ITheme[];
    gloubi?: ITheme;
    isValid?: boolean;
}
