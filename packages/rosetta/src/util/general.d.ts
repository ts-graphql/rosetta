export type Maybe<T> = T | null | undefined;
export type Whitespace = '\n' | ' ' | ',' | `#${string}\n`;
export type AfterWhitespace<Query extends string> = Query extends `${Whitespace}${infer After}` ? AfterWhitespace<After> : Query;
export type BeforeWhitespace<Query extends string> = Query extends `${infer Before}${Whitespace}${string}` ? BeforeWhitespace<Before> : Query;
export type IsNonNullable<T> = T extends {} ? true : false;
export type UntilFirst<Item extends string, Query extends string> = Query extends `${infer A}${Item}${string}` ? A : Query;
export type AfterFirst<Item extends string, Query extends string> = Query extends `${string}${Item}${infer After}` ? After : '';
