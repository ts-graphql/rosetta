type AddDepth<Depth extends string> = `${Depth}.`;
type SubtractDepth<Depth extends string> = Depth extends `${infer Next}.` ? Next : never;

type GetBraceContents<PreOpen extends string, PostOpen extends string, Depth extends string> = PreOpen extends `${infer PreClose}}${infer PostClose}`
  ? Depth extends AddDepth<''>
    ? PreClose
    // @ts-ignore
    : `${PreClose}}${InsideBraces<`${PostClose}{${PostOpen}`, SubtractDepth<Depth>>}`
  : Depth extends ''
    ? InsideBraces<PostOpen, AddDepth<Depth>>
    : `${PreOpen}{${InsideBraces<PostOpen,  AddDepth<Depth>>}`

export type InsideBraces<Query extends string, Depth extends string = ''> = Query extends `${infer PreOpen}{${infer PostOpen}`
  ? GetBraceContents<PreOpen, PostOpen, Depth>
  : Depth extends '' ? '' : GetBraceContents<Query, '', Depth>;

export type OutsideBraces<Query extends string> = Query extends `${infer Before}{${InsideBraces<Query>}}${infer After}`
  ? `${Before}${After}`
  : Query;
