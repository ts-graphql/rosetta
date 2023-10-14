import {QueryData} from "../../query/types";
import {Query, Role, Schema, SearchResult} from "../schema";
import {QueryVariables} from "../../variables/types";

type TestData<Query extends string, BaseType> = QueryData<Query, BaseType, Schema>;
type TestVariables<Query extends string> = QueryVariables<Query, Schema>;

const userQuery = `
  fragment UserData on User {
    username
    email
    email2: email
    role
  }

  query user($id: ID!) {
    aliased: user(id: $id) {
      ...on User {
        ...UserData
      }
    }
    user(id: $id) {
      ...UserData
    }
  }
`;

type UserQuery = TestData<typeof userQuery, Query>;
type UserVariables = TestVariables<typeof userQuery>;

const userVariables: UserVariables = {
  id: 'foo',
};

const userHandler = (result: UserQuery) => {
  if (result.aliased) {
    const { username, email, role } = result.aliased;
    if (role === Role.Admin) {
      console.log(username, email);
    }
  }
  if (result.user) {
    const { username, email, email2, role } = result.user;
    if (role === Role.User) {
      console.log(username, email, email2);
    }
  }
};

const allUsersQuery = `
  query users {
    allUsers {
      username
      email
      role
    }
  }
`;

type AllUsersData = TestData<typeof allUsersQuery, Query>;
const allUsersVars: TestVariables<typeof allUsersQuery> = undefined;

const allUsersHandler = (result: AllUsersData) => {
  result.allUsers?.map((user) => {
    if (user) {
      console.log(user.email, user.role, user.username);
    }
  });
};

type test = keyof SearchResult;

const searchAndChatsQuery = `
  query searchAndChats ($term: String!) {
    search(term: $term) {
      ...on Chat {
        id
        messages {
          id
          content
          time
        }
      }
    }
    myChats {
      id
      messages {
        id
        content
        time
      }
    }
  }
`;

type SearchAndChatsQuery = TestData<typeof searchAndChatsQuery, Query>;

const searchAndChatsHandler = (result: SearchAndChatsQuery) => {
  for (const item of result.search) {
    console.log(item.id);
    for (const message of item.messages) {
      console.log(message.id, message.content, message.time);
    }
  }

  for (const chat of result.myChats) {
    console.log(chat.id);
    for (const message of chat.messages) {
      console.log(message.id, message.time, message.content);
    }
  }
};

const userAndSearch = `
  query userAndSearch ($id: ID!, $term: String!) {
    user(id: $id) {
      email
    }
    search(term: $term) {
      id
    }
  }
`;

type UserAndSearchData = TestData<typeof userAndSearch, Query>;
type UserAndSearchVariables = TestVariables<typeof userAndSearch>;
const userSearchVars: UserAndSearchVariables = {
  term: 'foo',
  id: 'id',
};

const userAndSearchHandler = (result: UserAndSearchData) => {
  for (const item of result.search) {
    console.log(item.id);
  }
  console.log(result.user?.email);
};
