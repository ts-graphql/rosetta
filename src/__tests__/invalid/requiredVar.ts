import {QueryData} from "../../query/types";
import {Query} from "../schema";
import {QueryVariables} from "../../variables/types";

const userQuery = `
  query user($id: ID!) {
    user(id: $id) {
      username
      email
      role
    }
  }
`;

type UserQuery = QueryData<typeof userQuery, Query>;
type UserVariables = QueryVariables<typeof userQuery>;

const userVariables: UserVariables = {
  id: null,
};
