import {BeforeWhitespace, AfterWhitespace, UntilFirst} from "../util/general";
import {ResolveType} from "../util/resolveType";

type BuildVariableType<Name extends string, Type extends string, Rest extends string, Schema> = Type extends `${string}!`
  ? { [key in Name]: ResolveType<Type, Schema> } & VariablesType<Rest, Schema>
  : { [key in Name]?: ResolveType<Type, Schema> } & VariablesType<Rest, Schema>;

type VariableTypeForName<Name extends string, Variables extends string, Schema> =
  BuildVariableType<Name, BeforeWhitespace<UntilFirst<'$', Variables>>, Variables, Schema>;

type VariablesType<Variables extends string, Schema> = Variables extends `${string}$${infer Name}:${infer Rest}`
  ? VariableTypeForName<Name, AfterWhitespace<Rest>, Schema>
  : {};

export type QueryVariables<Query extends string, Schema> = Query extends `${string}(${infer Variables})${string}`
  ? VariablesType<Variables, Schema>
  : undefined;
