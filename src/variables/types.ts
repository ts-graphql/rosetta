import {BeforeIgnored, AfterWhitespace, UntilFirst} from "../util/general";
import {ResolveType} from "../util/resolveType";

type BuildVariableType<Name extends string, Type extends string, Rest extends string, ApiTypes> = Type extends `${string}!`
  ? { [key in Name]: ResolveType<Type, ApiTypes> } & VariablesType<Rest, ApiTypes>
  : { [key in Name]?: ResolveType<Type, ApiTypes> } & VariablesType<Rest, ApiTypes>;

type VariableTypeForName<Name extends string, Variables extends string, ApiTypes> =
  BuildVariableType<Name, BeforeIgnored<UntilFirst<'$', Variables>>, Variables, ApiTypes>;

type VariablesType<Variables extends string, ApiTypes> = Variables extends `${string}$${infer Name}:${infer Rest}`
  ? VariableTypeForName<Name, AfterWhitespace<Rest>, ApiTypes>
  : {};

export type QueryVariables<Query extends string, ApiTypes = {}> = Query extends `${string}(${infer Variables})${string}`
  ? VariablesType<Variables, ApiTypes>
  : undefined;
