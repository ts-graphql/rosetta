type AddDepth<Depth extends string> = `${Depth}.`;
type SubtractDepth<Depth extends string> = Depth extends `${infer Next}.` ? Next : never;
type GetBraceContents<PreOpen extends string, PostOpen extends string, Depth extends string> = PreOpen extends `${infer PreClose}}${infer PostClose}` ? Depth extends AddDepth<''> ? PreClose : `${PreClose}}${InsideNextBraces<`${PostClose}{${PostOpen}`, SubtractDepth<Depth>>}` : Depth extends '' ? InsideNextBraces<PostOpen, AddDepth<Depth>> : `${PreOpen}{${InsideNextBraces<PostOpen, AddDepth<Depth>>}`;
export type InsideNextBraces<Query extends string, Depth extends string = ''> = Query extends `${infer PreOpen}{${infer PostOpen}` ? GetBraceContents<PreOpen, PostOpen, Depth> : Depth extends '' ? '' : GetBraceContents<Query, '', Depth>;
export type OutsideNextBraces<Query extends string> = Query extends `${infer Before}{${InsideNextBraces<Query>}}${infer After}` ? `${Before}${After}` : Query;
export {};
