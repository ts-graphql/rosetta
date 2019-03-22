import 'jest';
import {
  branchField,
  branchFieldWithArgs,
  GQLString,
  leafField,
  nonNull,
  print, QueryObjectType,
  operation,
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

const query = operation<Query>('query');

describe('print', () => {
  it('should return expected value for simple query', () => {
    const testQuery = query({
      ...users({ }, {
        name,
        email,
        ...address({
          line1,
          line2,
        }),
      }),
    });

    const expected = `query {
  users {
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

  it('should return expected value for named query', () => {
    const testQuery = query('foo', {
      ...users({}, {
        name,
        email,
        ...address({
          line1,
        }),
      }),
    });

    const expected = `query foo {
  users {
    name
    email
    address {
      line1
    }
  }
}`
    const result = print(testQuery);
    expect(result).toEqual(expected);
  });

  it('should return expected value for unnamed query with variables', () => {
    const testQuery = query(
      { foo: nonNull(GQLString) },
      ({ foo }) => ({
        ...users({ query: foo }, {
          name,
          email,
        }),
      }),
    );

    const expected = `query ($foo: String!) {
  users(query: $foo) {
    name
    email
  }
}`

    const result = print(testQuery);
    expect(result).toEqual(expected);
  });

  it('should return expected value for query with name and variables', () => {
    const testQuery = query('testQuery',
      { foo: nonNull(GQLString) },
      ({ foo }) => ({
        aliasTest: users({ query: foo, first: 10 }, {
          name,
          email,
          ...address({
            line1,
            line2,
          }),
        }),
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
