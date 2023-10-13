import {AfterWhitespace, BeforeIgnored, IsNonNullable, Maybe} from "../util/general";
import {InsideBraces, OutsideBraces} from "../util/braces";

type FieldObjectType<Query extends string, BaseType> =
  BaseType extends Array<infer ItemType>
    ? IsNonNullable<ItemType> extends true
      ? Array<ObjectType<Query, ItemType>>
      : Array<Maybe<ObjectType<Query, NonNullable<ItemType>>>>
    : ObjectType<Query, BaseType>;

type FieldType<Field extends string, Rest extends string, BaseType> =
  Field extends keyof BaseType
    ? AfterWhitespace<Rest> extends `{${string}`
      ? Record<
      Field,
      IsNonNullable<BaseType[Field]> extends true
        ? FieldObjectType<InsideBraces<Rest>, BaseType[Field]>
        : Maybe<FieldObjectType<InsideBraces<Rest>, NonNullable<BaseType[Field]>>>
    > & ObjectType<OutsideBraces<Rest>, BaseType>
      : Pick<BaseType, Field> & ObjectType<Rest, BaseType>
      // : Record<Field, Rest> & ObjectType<Rest, BaseType>
    : {};
    // : Record<Field, Rest> // [Field, BaseType];

type ObjectType<Query extends string, BaseType, TField extends string = BeforeIgnored<AfterWhitespace<Query>>> =
  Query extends `${string}${TField}${infer Rest}`
    ? FieldType<TField, Rest, BaseType>
    : Record<TField, Query>;

type ExcludeArgs<Query extends string> = Query extends `${infer Before}(${string})${infer After}`
  ? ExcludeArgs<`${Before}${After}`>
  : Query;

export type QueryData<Query extends string, BaseType> = ObjectType<ExcludeArgs<InsideBraces<Query>>, BaseType>;
