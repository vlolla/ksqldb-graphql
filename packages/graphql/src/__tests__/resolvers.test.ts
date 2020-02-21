import { GraphQLSchema, GraphQLResolveInfo, GraphQLString, GraphQLObjectType } from 'graphql';

import { generateResolvers, handleResolve } from '../resolvers';

describe('resolvers', () => {
  it('takes graphql and maps a command', () => {
    const objType = new GraphQLObjectType({
      name: 'PAGEVIEWS_ORIGINAL',
      fields: { one: { type: GraphQLString } },
    });
    const schema = new GraphQLSchema({ query: objType });
    const selectionSet = {
      kind: 'SelectionSet',
      selections: [
        { kind: 'FragmentSpread', name: { value: 'command', kind: 'Name' } },
        { kind: 'FragmentSpread', name: { value: 'viewtime', kind: 'Name' } },
      ],
    };
    const info: GraphQLResolveInfo = {
      fieldName: 'spongebob',
      fieldNodes: [
        {
          kind: 'Field',
          name: { value: 'PAGEVIEWS_ORIGINAL', kind: 'Name' },
          selectionSet,
        },
      ],
      returnType: objType,
      parentType: objType,
      path: {
        prev: undefined,
        key: 'PAGEVIEWS_ORIGINAL',
      },
      schema: schema,
      fragments: {},
      rootValue: undefined,
      operation: {
        kind: 'OperationDefinition',
        operation: 'query',
        name: { kind: 'Name', value: 'getPageviews' },
        selectionSet,
      },
      variableValues: {},
    } as GraphQLResolveInfo;
    const resolvedValue = handleResolve(undefined, {}, undefined, info);
    expect(resolvedValue).toEqual({ command: 'select viewtime from PAGEVIEWS_ORIGINAL;' });
  });

  it('creates resolvers for queries and subscriptions', () => {
    const subscription = jest.fn();
    const fields = { one: { type: GraphQLString }, two: { type: GraphQLString } };
    const { queryResolvers, subscriptionResolvers } = generateResolvers(fields, subscription);
    expect(queryResolvers).toEqual({
      one: expect.any(Function),
      two: expect.any(Function),
    });
    expect(subscriptionResolvers).toEqual({
      one: { subscribe: expect.any(Function) },
      two: { subscribe: expect.any(Function) },
    });
  });
});
