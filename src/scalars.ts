import { wrap } from './variables';

export const GQLString = wrap<string>('String');
export const GQLInt = wrap<number>('Int');
export const GQLFloat = wrap<number>('Float');
export const GQLBoolean = wrap<boolean>('Boolean');
export const GQLID = wrap<string | number>('ID');
