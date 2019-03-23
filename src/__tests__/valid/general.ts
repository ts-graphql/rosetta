import { nonNull, variable } from '../../variables';
import { GQLString } from '../../scalars';
import { ReturnedObjectType } from '../../types';
import { Bar, bar, barArr, bool, float, Foo, foo, FooInput, int, maybeStr, query, str } from '../testSchema';
import { fragment } from '../../fields';

const queryA = query('a',
  { strVar: nonNull(GQLString) },
  ({ strVar }) => ({
    ...foo({ nested: { str: strVar, num: 4 } }, {
      ...bar({
        ...fragment(Bar, {
          int,
        }),
        float,
        str,
        str2: str,
        ...bool({}),
        bool2: bool({ test: strVar }),
      }),
      ...barArr({
        int,
        float,
      })
    }),
    foo2: foo({}, {
      ...bar({ int }),
    }),
  })
);

const returnValueA: ReturnedObjectType<typeof queryA.query> = {
  foo: {
    bar: {
      str: 'something',
      str2: 'something',
      int: 1,
      float: 0.1,
      bool: false,
      bool2: true,
    },
    barArr: [{ int: 1, float: 1.2 }],
  },
  foo2: {
    bar: {
      int: 3,
    },
  },
};

const queryB = query('b',
  { objVar: variable(FooInput) },
  ({ objVar }) => ({
    ...foo({ nested: objVar }, {
      ...bar({ str }),
    }),
  }),
);

const queryNoNameNoVariables = query({
  ...foo({}, {
    maybeStr,
  }),
});

const queryNameNoVariables = query('foo', {
  ...foo({}, {
    maybeStr,
  }),
});

const queryNoNameVariables = query({ objVar: variable(FooInput) }, ({ objVar }) => ({
  ...foo({ nested: objVar }, {
    maybeStr,
  })
}));

const inlineBarFragment = fragment(Bar, {
  str,
  int,
});

const namedBarFragment = fragment('NamedBarFragment', Bar, {
  float,
});

const inlineFragmentWithInlineFragment = fragment(Foo, {
  maybeStr,
  ...bar({
    ...inlineBarFragment,
  }),
});

const inlineFragmentWithNamedFragment = fragment(Foo, {
  ...bar({
    ...namedBarFragment,
  }),
});

const queryWithFragments = query({
  ...foo({}, {
    ...inlineFragmentWithInlineFragment,
    // Types cannot be correct when multiple fragments both include
    // the same object type field
    // ...inlineFragmentWithNamedFragment,
  }),
});

const queryWithFragmentsReturnValue: ReturnedObjectType<typeof queryWithFragments.query> = {
  foo: {
    maybeStr: null,
    bar: {
      int: 3,
      str: '',
    }
  }
}

const queryWithFragments2 = query({
  ...foo({}, {
    ...inlineFragmentWithNamedFragment,
  }),
});

const queryWithFragmentsReturnValue2: ReturnedObjectType<typeof queryWithFragments2.query> = {
  foo: {
    bar: {
      float: 4.5,
    }
  }
}
