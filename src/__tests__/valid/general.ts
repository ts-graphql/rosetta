import {QueryData} from "../../query/types";
import {Chat, Query, Role, SearchResult, User} from "../schema";
import {QueryVariables} from "../../variables/types";

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

type UserQuery = QueryData<typeof userQuery, Query, { User: User }>;
type UserVariables = QueryVariables<typeof userQuery>;

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
    if (role === Role.Admin) {
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

type AllUsersData = QueryData<typeof allUsersQuery, Query>;
const allUsersVars: QueryVariables<typeof allUsersQuery> = undefined;

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

type SearchAndChatsQuery = QueryData<typeof searchAndChatsQuery, Query, { Chat: Chat }>;

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

type UserAndSearchData = QueryData<typeof userAndSearch, Query>;
type UserAndSearchVariables = QueryVariables<typeof userAndSearch>;
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
