export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Chat = Node & {
  __typename?: 'Chat';
  id: Scalars['ID']['output'];
  messages: Array<ChatMessage>;
  users: Array<User>;
};

export type ChatMessage = Node & {
  __typename?: 'ChatMessage';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['Date']['output'];
  user: User;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  allUsers?: Maybe<Array<Maybe<User>>>;
  me: User;
  myChats: Array<Chat>;
  search: Array<SearchResult>;
  user?: Maybe<User>;
};


export type QuerySearchArgs = {
  term: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SearchResult = Chat | ChatMessage | User;

export type User = Node & {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Role;
  username: Scalars['String']['output'];
};
