import { foo, query } from '../testSchema';
import { Maybe } from '../../types';
import { leafField } from '../../fields';

class SomethingElse {
  maybeStr?: Maybe<number>;
}

const maybeStr = leafField<SomethingElse, 'maybeStr'>('maybeStr');

const q = query('foo', {}, () => ({
  ...foo({}, { maybeStr, })
}));
