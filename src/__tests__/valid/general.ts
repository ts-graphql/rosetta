import { nonNull, variable } from '../../variables';
import { GQLString } from '../../scalars';
import { ReturnedObjectType } from '../../types';
import { bar, barArr, bool, float, foo, FooInput, int, maybeStr, query, str } from '../testSchema';

const queryA = query('a',
  { strVar: nonNull(GQLString) },
  ({ strVar }) => ({
    ...foo({ nested: { str: strVar, num: 4 } }, {
      ...bar({
        int,
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
