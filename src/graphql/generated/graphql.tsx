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
  DateTime: { input: string; output: string; }
  Long: { input: number; output: number; }
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  username?: InputMaybe<Scalars['String']['input']>;
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
  input?: InputMaybe<CreateUserInput>;
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
  input?: InputMaybe<UpdateUserInput>;
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
  Admin = 'ADMIN',
  User = 'USER'
}

export type TokenResponse = {
  __typename?: 'TokenResponse';
  expiresAt?: Maybe<Scalars['Long']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  status?: InputMaybe<UserStatus>;
  username?: InputMaybe<Scalars['String']['input']>;
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
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED',
  Locked = 'LOCKED',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export enum VideoCategory {
  Business = 'BUSINESS',
  Education = 'EDUCATION',
  Entertainment = 'ENTERTAINMENT',
  Gaming = 'GAMING',
  General = 'GENERAL',
  Music = 'MUSIC',
  News = 'NEWS',
  Other = 'OTHER',
  Sports = 'SPORTS',
  Technology = 'TECHNOLOGY',
  Unspecified = 'UNSPECIFIED'
}

export enum VideoProvider {
  Dailymotion = 'DAILYMOTION',
  Internal = 'INTERNAL',
  Other = 'OTHER',
  Unspecified = 'UNSPECIFIED',
  Vimeo = 'VIMEO',
  Youtube = 'YOUTUBE'
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


export type LoginMutation = { __typename?: 'Mutation', authlogin?: { __typename?: 'TokenResponse', token?: string | null, expiresAt?: number | null } | null };

export type ImportVideoMutationVariables = Exact<{
  provider: VideoProvider;
  externalVideoId: Scalars['String']['input'];
}>;


export type ImportVideoMutation = { __typename?: 'Mutation', importVideo?: { __typename?: 'VideoResponse', id?: string | null, title?: string | null, durationMs?: number | null, description?: string | null, externalVideoId?: string | null, uploadDate?: string | null, createdUserId?: number | null } | null };

export type ImportVideosByPublisherMutationVariables = Exact<{
  publisherName: Scalars['String']['input'];
}>;


export type ImportVideosByPublisherMutation = { __typename?: 'Mutation', importVideosByPublisher?: Array<{ __typename?: 'VideoResponse', id?: string | null, title?: string | null, externalVideoId?: string | null, uploadDate?: string | null, createdUserId?: number | null } | null> | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'UserResponse', id?: string | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'UserResponse', id?: string | null, username?: string | null, email?: string | null, status?: UserStatus | null, createdAt?: string | null, updatedAt?: string | null, lastLoginAt?: string | null, roles?: Array<Role | null> | null } | null };

export type ListUsersQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type ListUsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'UserResponse', id?: string | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null> | null };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UserResponse', id?: string | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null };


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
export const ImportVideoDocument = gql`
    mutation ImportVideo($provider: VideoProvider!, $externalVideoId: String!) {
  importVideo(provider: $provider, externalVideoId: $externalVideoId) {
    id
    title
    durationMs
    description
    externalVideoId
    uploadDate
    createdUserId
  }
}
    `;
export type ImportVideoMutationFn = Apollo.MutationFunction<ImportVideoMutation, ImportVideoMutationVariables>;

/**
 * __useImportVideoMutation__
 *
 * To run a mutation, you first call `useImportVideoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportVideoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importVideoMutation, { data, loading, error }] = useImportVideoMutation({
 *   variables: {
 *      provider: // value for 'provider'
 *      externalVideoId: // value for 'externalVideoId'
 *   },
 * });
 */
export function useImportVideoMutation(baseOptions?: Apollo.MutationHookOptions<ImportVideoMutation, ImportVideoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportVideoMutation, ImportVideoMutationVariables>(ImportVideoDocument, options);
      }
export type ImportVideoMutationHookResult = ReturnType<typeof useImportVideoMutation>;
export type ImportVideoMutationResult = Apollo.MutationResult<ImportVideoMutation>;
export type ImportVideoMutationOptions = Apollo.BaseMutationOptions<ImportVideoMutation, ImportVideoMutationVariables>;
export const ImportVideosByPublisherDocument = gql`
    mutation ImportVideosByPublisher($publisherName: String!) {
  importVideosByPublisher(publisherName: $publisherName) {
    id
    title
    externalVideoId
    uploadDate
    createdUserId
  }
}
    `;
export type ImportVideosByPublisherMutationFn = Apollo.MutationFunction<ImportVideosByPublisherMutation, ImportVideosByPublisherMutationVariables>;

/**
 * __useImportVideosByPublisherMutation__
 *
 * To run a mutation, you first call `useImportVideosByPublisherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportVideosByPublisherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importVideosByPublisherMutation, { data, loading, error }] = useImportVideosByPublisherMutation({
 *   variables: {
 *      publisherName: // value for 'publisherName'
 *   },
 * });
 */
export function useImportVideosByPublisherMutation(baseOptions?: Apollo.MutationHookOptions<ImportVideosByPublisherMutation, ImportVideosByPublisherMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportVideosByPublisherMutation, ImportVideosByPublisherMutationVariables>(ImportVideosByPublisherDocument, options);
      }
export type ImportVideosByPublisherMutationHookResult = ReturnType<typeof useImportVideosByPublisherMutation>;
export type ImportVideosByPublisherMutationResult = Apollo.MutationResult<ImportVideosByPublisherMutation>;
export type ImportVideosByPublisherMutationOptions = Apollo.BaseMutationOptions<ImportVideosByPublisherMutation, ImportVideosByPublisherMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    status
    roles
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: Long!) {
  deleteUser(id: $id)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
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
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    username
    email
    status
    roles
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;