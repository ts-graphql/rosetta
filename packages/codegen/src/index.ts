import {PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { plugin as tsPlugin, includeIntrospectionTypesDefinitions } from '@graphql-codegen/typescript';
export const plugin: PluginFunction<{}, Types.ComplexPluginOutput> = async (
  schema,
  documents,
  config,
) => {
  const tsOutput = await tsPlugin(schema, documents, {
    namingConvention: {
      typeNames: 'keep',
      enumValues: 'change-case-all#pascalCase',
    },
    addUnderscoreToArgsType: true,
  });

  const getTypeRegex = (type: string) =>
    new RegExp(`export (type|enum) ${type} `, 'g');

  const schemaTypeContents = Object.keys(schema.getTypeMap())
    // This is NOT a good way of doing this
    .filter((type) => tsOutput.content.match(getTypeRegex(type)))
    .map((type) => `  ${type}: ${type};`);

  const schemaTypeDefinition = [
    'export type Schema = {',
    ...schemaTypeContents,
    '}',
  ].join('\n');

  return {
    prepend: tsOutput.prepend,
    content: [
      tsOutput.content,
      schemaTypeDefinition,
    ].join('\n'),
    append: tsOutput.append,
  }
}
