import {AfterFirst, AfterWhitespace, BeforeWhitespace, IsNonNullable, Maybe} from "../util/general";
import {InsideNextBraces, OutsideNextBraces} from "../util/braces";

type FieldObjectType<Query extends string, BaseType> =
  BaseType extends Array<infer ItemType>
    ? IsNonNullable<ItemType> extends true
      ? Array<ObjectType<Query, ItemType>>
      : Array<Maybe<ObjectType<Query, NonNullable<ItemType>>>>
    : ObjectType<Query, BaseType>;

type NextFieldName<Query extends string> = BeforeWhitespace<AfterWhitespace<Query>>;

type AddToFields<Existing extends string, New extends string> = Existing extends ''
  ? New
  : Existing | New;

type ReturnFields<Fields extends string> = Fields extends ''
  ? never
  : Fields;

type AfterNextField<Query extends string> =
  Query extends `${string}${NextFieldName<Query>}${infer Rest}`
    ? NextFieldName<Query> extends `${string}:` // Alias
      ? AfterNextField<Rest>
      : AfterWhitespace<Rest> extends `{${string}` // Object
        ? OutsideNextBraces<Rest>
        : Rest
    : Query;

// Get keys of BaseType that are scalars
type ScalarFields<Query extends string, BaseType, Fields extends string = ''> =
  NextFieldName<Query> extends ''
    ? ReturnFields<Fields>
    : Query extends `${string}${NextFieldName<Query>}${infer Rest}`
      ? NextFieldName<Query> extends `${string}:` // Ignore aliases
        ? ScalarFields<AfterNextField<Rest>, BaseType, Fields>
        : AfterWhitespace<Rest> extends `{${string}` // Ignore object types
          ? ScalarFields<OutsideNextBraces<Rest>, BaseType, Fields>
          : NextFieldName<Query> extends keyof BaseType // Check if field exists in current type
            ? ScalarFields<Rest, BaseType, AddToFields<Fields, NextFieldName<Query>>>
            : ScalarFields<Rest, BaseType, Fields>
      : ReturnFields<Fields>;

type ObjectScalarFields<Query extends string, BaseType> =
  ScalarFields<Query, BaseType> extends never
    ? {}
    : Pick<BaseType,  ScalarFields<Query, BaseType>>;

type NextObjectField<Field extends string, BraceContents extends string, BaseType> =
  Field extends keyof BaseType
    ? Record<Field, IsNonNullable<BaseType[Field]> extends true
        ? FieldObjectType<BraceContents, BaseType[Field]>
        : Maybe<FieldObjectType<BraceContents, NonNullable<BaseType[Field]>>>
      >
    : {};

type ObjectObjectFields<Query extends string, BaseType, Fields = {}> =
  NextFieldName<Query> extends ''
    ? Fields
    : Query extends `${string}${NextFieldName<Query>}${infer Rest}`
      ? NextFieldName<Query> extends `${string}:` // Ignore aliases
        ? ObjectObjectFields<AfterFirst<NextFieldName<Rest>, Rest>, BaseType, Fields>
        : AfterWhitespace<Rest> extends `{${string}`
          ? ObjectObjectFields<
              OutsideNextBraces<Rest>,
              BaseType,
              Fields & NextObjectField<NextFieldName<Query>, InsideNextBraces<Rest>, BaseType>
            >
          : ObjectObjectFields<Rest, BaseType, Fields>
      : Fields;

type ResolveNextField<Field extends string, Alias extends string, Rest extends string, BaseType> =
  Field extends keyof BaseType
    ? AfterWhitespace<Rest> extends `{${string}`
      ? Record<
          Alias,
          IsNonNullable<BaseType[Field]> extends true
            ? FieldObjectType<InsideNextBraces<Rest>, BaseType[Field]>
            : Maybe<FieldObjectType<InsideNextBraces<Rest>, NonNullable<BaseType[Field]>>>
        >
      : Record<Alias, BaseType[Field]>
    : {};

type ObjectAliasFields<Query extends string, BaseType, Fields = {}> =
  NextFieldName<Query> extends ''
    ? Fields
    : Query extends `${string}${NextFieldName<Query>}${infer Rest}`
      ? NextFieldName<Query> extends `${infer Alias}:`
        ? ObjectAliasFields<
            AfterNextField<Rest>,
            BaseType,
            Fields & ResolveNextField<
              NextFieldName<Rest>,
              Alias,
              AfterFirst<NextFieldName<Rest>, Rest>,
              BaseType
            >
          >
        : ObjectAliasFields<Rest, BaseType, Fields>
      : Fields;

type ObjectType<Query extends string, BaseType> =
  ObjectScalarFields<Query, BaseType> &
  ObjectObjectFields<Query, BaseType> &
  ObjectAliasFields<Query, BaseType>;

type ExcludeArgs<Query extends string> = Query extends `${infer Before}(${string})${infer After}`
  ? ExcludeArgs<`${Before}${After}`>
  : Query;

export type QueryData<Query extends string, BaseType> = ObjectType<ExcludeArgs<InsideNextBraces<Query>>, BaseType>;
