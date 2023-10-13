import {AfterFirst, AfterWhitespace, BeforeWhitespace, IsNonNullable, Maybe} from "../util/general";
import {InsideNextBraces, OutsideNextBraces} from "../util/braces";

type FieldObjectType<Query extends string, BaseType, Schema, Fragments> =
  BaseType extends Array<infer ItemType>
    ? IsNonNullable<ItemType> extends true
      ? Array<ObjectType<Query, ItemType, Schema, Fragments>>
      : Array<Maybe<ObjectType<Query, NonNullable<ItemType>, Schema, Fragments>>>
    : ObjectType<Query, BaseType, Schema, Fragments>;

type NextToken<Query extends string> = BeforeWhitespace<AfterWhitespace<Query>> extends `{${string}`
  ? never
  : BeforeWhitespace<AfterWhitespace<Query>> extends `${infer Token}{`
    ? Token
    : BeforeWhitespace<AfterWhitespace<Query>>;

type AddToFields<Existing extends string, New extends string> = Existing extends ''
  ? New
  : Existing | New;

type ReturnFields<Fields extends string> = Fields extends ''
  ? never
  : Fields;

type AfterNextField<Query extends string> =
  Query extends `${string}${NextToken<Query>}${infer Rest}`
    ? NextToken<Query> extends `...${string}`
      ? AfterNextFragment<Query>
      : NextToken<Query> extends `${string}:` // Alias
        ? AfterNextField<Rest>
        : AfterWhitespace<Rest> extends `{${string}` // Object
          ? OutsideNextBraces<Rest>
          : Rest
    : AfterWhitespace<Query> extends `{${string}`
      ? OutsideNextBraces<Query>
      : Query;

// Get keys of BaseType that are scalars
type ScalarFields<Query extends string, BaseType, Fields extends string = ''> =
  NextToken<Query> extends ''
    ? ReturnFields<Fields>
    : Query extends `${string}${NextToken<Query>}${infer Rest}`
      ? NextToken<Query> extends `...${string}`
        ? ScalarFields<AfterNextFragment<Query>, BaseType, Fields>
        : NextToken<Query> extends `${string}:` // Ignore aliases
          ? ScalarFields<AfterNextField<Rest>, BaseType, Fields>
          : AfterWhitespace<Rest> extends `{${string}` // Ignore object types
            ? ScalarFields<OutsideNextBraces<Rest>, BaseType, Fields>
            : NextToken<Query> extends keyof BaseType // Check if field exists in current type
              ? ScalarFields<Rest, BaseType, AddToFields<Fields, NextToken<Query>>>
              : ScalarFields<Rest, BaseType, Fields>
      : ReturnFields<Fields>;

type ObjectScalarFields<Query extends string, BaseType> =
  ScalarFields<Query, BaseType> extends never
    ? {}
    : Pick<BaseType,  ScalarFields<Query, BaseType>>;

// type NextObjectField<Field extends string, BraceContents extends string, BaseType> =
//   Field extends keyof BaseType
//     ? Record<Field, IsNonNullable<BaseType[Field]> extends true
//         ? FieldObjectType<BraceContents, BaseType[Field]>
//         : Maybe<FieldObjectType<BraceContents, NonNullable<BaseType[Field]>>>
//       >
//     : {};

type ObjectObjectFields<Query extends string, BaseType, Schema, Fragments, Fields = {}> =
  NextToken<Query> extends ''
    ? Fields
    : Query extends `${string}${NextToken<Query>}${infer Rest}`
      ? NextToken<Query> extends `...${string}`
        ? ObjectObjectFields<AfterNextFragment<Query>, BaseType, Schema, Fragments, Fields>
        : NextToken<Query> extends `${string}:` // Ignore aliases
          ? ObjectObjectFields<AfterNextField<Rest>, BaseType, Schema, Fragments, Fields>
          : AfterWhitespace<Rest> extends `{${string}`
            ? ObjectObjectFields<
              OutsideNextBraces<Rest>,
              BaseType,
              Schema,
              Fragments,
              Fields & ResolveNextField<NextToken<Query>, NextToken<Query>, Rest, BaseType, Schema, Fragments>
            >
            : ObjectObjectFields<Rest, BaseType, Schema, Fragments, Fields>
      : Fields;

type ResolveNextField<Field extends string, Alias extends string, Rest extends string, BaseType, Schema, Fragments> =
  Field extends keyof BaseType
    ? AfterWhitespace<Rest> extends `{${string}`
      ? Record<
        Alias,
        IsNonNullable<BaseType[Field]> extends true
          ? FieldObjectType<InsideNextBraces<Rest>, BaseType[Field], Schema, Fragments>
          : Maybe<FieldObjectType<InsideNextBraces<Rest>, NonNullable<BaseType[Field]>, Schema, Fragments>>
      >
      : Record<Alias, BaseType[Field]>
    : {};

type ObjectAliasFields<Query extends string, BaseType, Schema, Fragments, Fields = {}> =
  NextToken<Query> extends ''
    ? Fields
    : Query extends `${string}${NextToken<Query>}${infer Rest}`
      ? NextToken<Query> extends `${infer Alias}:`
        ? ObjectAliasFields<
            AfterNextField<Rest>,
            BaseType,
            Schema,
            Fragments,
            Fields & ResolveNextField<
              NextToken<Rest>,
              Alias,
              AfterFirst<NextToken<Rest>, Rest>,
              BaseType,
              Schema,
              Fragments
            >
          >
        : ObjectAliasFields<AfterNextField<Query>, BaseType, Schema, Fragments, Fields>
      : Fields;

type ObjectFragmentFields<Query extends string, Schema, Fragments, Fields = {}> =
  NextToken<Query> extends ''
    ? Fields
    : Query extends `${string}${NextToken<Query>}${infer Rest}`
      ? NextToken<Query> extends `...${infer TokenRest}`
        ? ObjectFragmentFields<
            AfterNextFragment<Query>,
            Schema,
            Fragments,
            Fields & ResolveFragment<`${TokenRest}${Rest}`, Schema, Fragments>
          >
        : ObjectFragmentFields<
            AfterNextField<Query>,
            Schema,
            Fragments,
            Fields
          >
      : Fields;

type AfterNextFragment<Query extends string> =
  AfterWhitespace<AfterFirst<'...', Query>> extends `on${infer AfterOn}`
    ? AfterOn extends `${string}${NextToken<AfterOn>}${infer Rest}`
      ? AfterWhitespace<Rest> extends `{${string}`
        ? OutsideNextBraces<Rest>
        : AfterNextField<AfterFirst<'...', Query>>
      : AfterNextField<AfterFirst<'...', Query>>
    : AfterNextField<AfterFirst<'...', Query>>

type ResolveNamedFragment<Query extends string, Fragments> =
  NextToken<AfterWhitespace<Query>> extends keyof Fragments
    ? Fragments[NextToken<AfterWhitespace<Query>>]
    : {};

// Expects:
// "on Foo { ... }"
// or
// "NamedFragment"
type ResolveFragment<Query extends string, Schema, Fragments> =
  AfterWhitespace<Query> extends `on${infer Rest}`
    ? NextToken<Rest> extends keyof Schema
      ? ObjectType<InsideNextBraces<Rest>, Schema[NextToken<Rest>], Schema, Fragments>
      : ResolveNamedFragment<Query, Fragments>
    : ResolveNamedFragment<Query, Fragments>

type NamedFragments<Query extends string, Schema, Fragments = {}> =
  Query extends `${string}fragment${infer Rest}`
    ? NamedFragments<
        OutsideNextBraces<Rest>,
        Schema,
        Fragments & Record<
          NextToken<Rest>,
          ResolveFragment<AfterFirst<NextToken<Rest>, Rest>, Schema, Fragments>
        >
      >
    : Fragments;

type ObjectType<Query extends string, BaseType, Schema, Fragments> =
  ObjectScalarFields<Query, BaseType> &
  ObjectObjectFields<Query, BaseType, Schema, Fragments> &
  ObjectAliasFields<Query, BaseType, Schema, Fragments> &
  ObjectFragmentFields<Query, Schema, Fragments>;

type ExcludeArgs<Query extends string> = Query extends `${infer Before}(${string})${infer After}`
  ? ExcludeArgs<`${Before}${After}`>
  : Query;

type ExcludeFragments<Query extends string> = Query extends `${infer Before}fragment${infer Rest}`
  ? Rest extends `${string}on${string}{${string}`
    // @ts-ignore
    ? `${Before}${ExcludeFragments<OutsideNextBraces<Rest>>}`
    : Rest
  : Query;

export type QueryData<Query extends string, BaseType, Schema = {}> = ObjectType<
  InsideNextBraces<ExcludeFragments<ExcludeArgs<Query>>>,
  BaseType,
  Schema,
  NamedFragments<ExcludeArgs<Query>, Schema>
>;
