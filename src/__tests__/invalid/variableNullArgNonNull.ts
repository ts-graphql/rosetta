import { fooRequiredArg, maybeStr, query } from '../testSchema';
import { GQLInt } from '../../scalars';

const q = query('foo',
  { strVar: GQLInt },
  ({ strVar }) => ({
    ...fooRequiredArg({ str: strVar }, {
      maybeStr,
    }),
  }),
);
