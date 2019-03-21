import 'jest';
import {
  alias,
  branchField,
  branchFieldWithArgs,
  GQLString,
  leafField,
  nonNull,
  print, QueryObjectType,
  rootType,
} from '../';

class Address {
  line1!: string;
  line2!: string;
}

const line1 = leafField<Address, 'line1'>('line1');
const line2 = leafField<Address, 'line2'>('line2');

class User {
  name?: string;
  email!: string;
  address!: Address;
}

const name = leafField<User, 'name'>('name');
const email = leafField<User, 'email'>('email');
const address = branchField<User, 'address', Address>('address');

class Query {
  users!: User[]
}

const users = branchFieldWithArgs<Query, 'users', User, { first?: number | null, query?: string | null }>('users');

const query = rootType<Query>('query');

describe('print', () => {
  it('should return expected query', () => {
    const testQuery = query('testQuery',
      { foo: nonNull(GQLString) },
      ({ foo }) => ({
        ...alias('aliasTest', users({ query: foo, first: 10 }, {
          name,
          email,
          ...address({
            line1,
            line2,
          }),
        })),
      })
    );

    const expected = `query testQuery($foo: String!) {
  aliasTest: users(query: $foo, first: 10) {
    name
    email
    address {
      line1
      line2
    }
  }
}`;
    const result = print(testQuery);
    expect(result).toEqual(expected);
  });
});
