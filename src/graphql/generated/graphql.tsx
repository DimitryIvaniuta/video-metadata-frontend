import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Long: { input: any; output: any; }
};

export type Mutation = {
  __typename?: 'Mutation';
  authlogin?: Maybe<TokenResponse>;
  createUser?: Maybe<UserResponse>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  importVideo?: Maybe<VideoResponse>;
  importVideosByPublisher?: Maybe<Array<Maybe<VideoResponse>>>;
  updateUser?: Maybe<UserResponse>;
};


export type MutationAuthloginArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationImportVideoArgs = {
  externalVideoId?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<VideoProvider>;
};


export type MutationImportVideosByPublisherArgs = {
  provider?: InputMaybe<VideoProvider>;
  publisherName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  _status?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserResponse>;
  users?: Maybe<Array<Maybe<UserResponse>>>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type TokenResponse = {
  __typename?: 'TokenResponse';
  expiresAt?: Maybe<Scalars['Long']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  status?: Maybe<UserStatus>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  LOCKED = 'LOCKED',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum VideoCategory {
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  GAMING = 'GAMING',
  GENERAL = 'GENERAL',
  MUSIC = 'MUSIC',
  NEWS = 'NEWS',
  OTHER = 'OTHER',
  SPORTS = 'SPORTS',
  TECHNOLOGY = 'TECHNOLOGY',
  UNSPECIFIED = 'UNSPECIFIED'
}

export enum VideoProvider {
  DAILYMOTION = 'DAILYMOTION',
  INTERNAL = 'INTERNAL',
  OTHER = 'OTHER',
  UNSPECIFIED = 'UNSPECIFIED',
  VIMEO = 'VIMEO',
  YOUTUBE = 'YOUTUBE'
}

export type VideoResponse = {
  __typename?: 'VideoResponse';
  createdUserId?: Maybe<Scalars['Long']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  durationMs?: Maybe<Scalars['Long']['output']>;
  externalVideoId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  uploadDate?: Maybe<Scalars['DateTime']['output']>;
  videoCategory?: Maybe<VideoCategory>;
  videoProvider?: Maybe<VideoProvider>;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', authlogin?: { __typename?: 'TokenResponse', token?: string | null, expiresAt?: any | null } | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'UserResponse', id?: string | null, username?: string | null, email?: string | null, status?: UserStatus | null, createdAt?: any | null, updatedAt?: any | null, lastLoginAt?: any | null, roles?: Array<Role | null> | null } | null };

export type ListUsersQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type ListUsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'UserResponse', id?: string | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null> | null };


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  authlogin(username: $username, password: $password) {
    token
    expiresAt
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GetUserDocument = gql`
    query GetUser($id: Long!) {
  user(id: $id) {
    id
    username
    email
    status
    createdAt
    updatedAt
    lastLoginAt
    roles
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const ListUsersDocument = gql`
    query ListUsers($page: Int!, $size: Int!) {
  users(page: $page, size: $size) {
    id
    username
    email
    status
    roles
  }
}
    `;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useListUsersQuery(baseOptions: Apollo.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables> & ({ variables: ListUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
      }
export function useListUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export function useListUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersSuspenseQueryHookResult = ReturnType<typeof useListUsersSuspenseQuery>;
export type ListUsersQueryResult = Apollo.QueryResult<ListUsersQuery, ListUsersQueryVariables>;