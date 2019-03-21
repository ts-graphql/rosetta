import { bar, foo, query, str } from '../testSchema';
import { nonNull } from '../../variables';
import { GQLString } from '../../scalars';

const q = query('foo',
  { strVar: nonNull(GQLString) },
  ({ strVar }) => ({
      ...foo({ num: strVar }, {
      ...bar({ str })
    })
  }),
);
