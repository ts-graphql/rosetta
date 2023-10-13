import {Maybe} from "./general";

type ResolveApiType<Type extends string, ApiTypes> =
  Type extends keyof ApiTypes ? ApiTypes[Type] : never;

type ResolveBaseType<Type extends string, ApiTypes> =
  Type extends 'String' ? string
    : Type extends 'ID' ? string
      : Type extends 'Int' ? number
        : Type extends 'Float' ? number
          : Type extends 'Boolean' ? boolean
            : ResolveApiType<Type, ApiTypes>;

export type ResolveType<Type extends string, ApiTypes> = Type extends `${infer NonNull}!`
  ? ResolveBaseType<NonNull, ApiTypes>
  : Maybe<ResolveBaseType<Type, ApiTypes>>;
