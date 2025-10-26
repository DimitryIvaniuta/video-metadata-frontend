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
  BigDecimal: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Long: { input: number; output: number; }
};

export type ConvertPayload = {
  __typename?: 'ConvertPayload';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  fromCurr?: Maybe<Scalars['String']['output']>;
  rate?: Maybe<Scalars['BigDecimal']['output']>;
  result?: Maybe<Scalars['BigDecimal']['output']>;
  toCurr?: Maybe<Scalars['String']['output']>;
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type FxRateNode = {
  __typename?: 'FxRateNode';
  currency?: Maybe<Scalars['String']['output']>;
  rate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type FxRatesPayload = {
  __typename?: 'FxRatesPayload';
  base?: Maybe<Scalars['String']['output']>;
  rates?: Maybe<Array<Maybe<FxRateNode>>>;
};

export type LiveQuoteNode = {
  __typename?: 'LiveQuoteNode';
  rate?: Maybe<Scalars['BigDecimal']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type LiveRatesPayload = {
  __typename?: 'LiveRatesPayload';
  quotes?: Maybe<Array<Maybe<LiveQuoteNode>>>;
  source?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTicketComment?: Maybe<TicketCommentNode>;
  createTicket?: Maybe<TicketNode>;
  createUser?: Maybe<UserResponse>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  importVideo?: Maybe<VideoResponse>;
  importVideosByPublisher?: Maybe<Array<Maybe<VideoResponse>>>;
  login?: Maybe<TokenResponse>;
  refresh?: Maybe<TokenResponse>;
  signUp?: Maybe<UserResponse>;
  updateTicket?: Maybe<TicketNode>;
  updateUser?: Maybe<UserResponse>;
};


export type MutationAddTicketCommentArgs = {
  input?: InputMaybe<TicketCommentInput>;
};


export type MutationCreateTicketArgs = {
  input?: InputMaybe<TicketCreateInput>;
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


export type MutationLoginArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSignUpArgs = {
  input?: InputMaybe<SignUpInput>;
};


export type MutationUpdateTicketArgs = {
  input?: InputMaybe<TicketUpdateInput>;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};

export type Query = {
  __typename?: 'Query';
  _status?: Maybe<Scalars['String']['output']>;
  connectionTickets?: Maybe<TicketConnection>;
  connectionUsers?: Maybe<UserConnection>;
  connectionUsersCount?: Maybe<Scalars['Long']['output']>;
  connectionVideos?: Maybe<VideoConnection>;
  connectionVideosCount?: Maybe<Scalars['Long']['output']>;
  fxConvert?: Maybe<ConvertPayload>;
  fxLive?: Maybe<LiveRatesPayload>;
  fxRates?: Maybe<FxRatesPayload>;
  me?: Maybe<UserResponse>;
  searchUsers?: Maybe<Array<Maybe<UserLite>>>;
  ticket?: Maybe<TicketNode>;
  user?: Maybe<UserResponse>;
  userslist?: Maybe<Array<Maybe<UserResponse>>>;
};


export type QueryConnectionTicketsArgs = {
  assigneeId?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  reporterId?: InputMaybe<Scalars['Long']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TicketStatus>;
};


export type QueryConnectionUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<UserSort>;
  sortDesc?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryConnectionUsersCountArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryConnectionVideosArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<VideoSort>;
  sortDesc?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryConnectionVideosCountArgs = {
  provider?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFxConvertArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFxLiveArgs = {
  currencies?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  source?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFxRatesArgs = {
  base?: InputMaybe<Scalars['String']['input']>;
  symbols?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerySearchUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTicketArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  includeComments?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryUserslistArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SignUpInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type TicketCommentInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  ticketId?: InputMaybe<Scalars['Long']['input']>;
};

export type TicketCommentNode = {
  __typename?: 'TicketCommentNode';
  authorId?: Maybe<Scalars['Long']['output']>;
  authorUsername?: Maybe<Scalars['String']['output']>;
  body?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
};

export type TicketConnection = {
  __typename?: 'TicketConnection';
  items?: Maybe<Array<Maybe<TicketNode>>>;
  page?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Long']['output']>;
};

export type TicketCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<TicketPriority>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type TicketNode = {
  __typename?: 'TicketNode';
  assigneeId?: Maybe<Scalars['Long']['output']>;
  assigneeUsername?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Array<Maybe<TicketCommentNode>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
  priority?: Maybe<TicketPriority>;
  reporterId?: Maybe<Scalars['Long']['output']>;
  reporterUsername?: Maybe<Scalars['String']['output']>;
  status?: Maybe<TicketStatus>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum TicketPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum TicketStatus {
  Closed = 'CLOSED',
  InProgress = 'IN_PROGRESS',
  Open = 'OPEN',
  Resolved = 'RESOLVED'
}

export type TicketUpdateInput = {
  assigneeId?: InputMaybe<Scalars['Long']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
  status?: InputMaybe<TicketStatus>;
};

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

export type UserConnection = {
  __typename?: 'UserConnection';
  items?: Maybe<Array<Maybe<UserResponse>>>;
  page?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Long']['output']>;
};

export type UserLite = {
  __typename?: 'UserLite';
  id?: Maybe<Scalars['Long']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  status?: Maybe<UserStatus>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export enum UserSort {
  CreatedAt = 'CREATED_AT',
  Email = 'EMAIL',
  LastLoginAt = 'LAST_LOGIN_AT',
  UpdatedAt = 'UPDATED_AT',
  Username = 'USERNAME'
}

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

export type VideoConnection = {
  __typename?: 'VideoConnection';
  items?: Maybe<Array<Maybe<VideoResponse>>>;
  page?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Long']['output']>;
};

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
  id?: Maybe<Scalars['Long']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  uploadDate?: Maybe<Scalars['DateTime']['output']>;
  videoCategory?: Maybe<VideoCategory>;
  videoProvider?: Maybe<VideoProvider>;
};

export enum VideoSort {
  ImportedAt = 'IMPORTED_AT',
  Title = 'TITLE',
  UploadDate = 'UPLOAD_DATE'
}

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'TokenResponse', token?: string | null, expiresAt?: number | null } | null };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, roles?: Array<Role | null> | null } | null };

export type FxConvertQueryVariables = Exact<{
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
}>;


export type FxConvertQuery = { __typename?: 'Query', fxConvert?: { __typename?: 'ConvertPayload', fromCurr?: string | null, toCurr?: string | null, amount?: number | null, rate?: number | null, result?: number | null, date?: string | null } | null };

export type FxLiveQueryVariables = Exact<{
  source?: InputMaybe<Scalars['String']['input']>;
  currencies?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type FxLiveQuery = { __typename?: 'Query', fxLive?: { __typename?: 'LiveRatesPayload', source?: string | null, quotes?: Array<{ __typename?: 'LiveQuoteNode', symbol?: string | null, rate?: number | null } | null> | null } | null };

export type AddTicketCommentMutationVariables = Exact<{
  input: TicketCommentInput;
}>;


export type AddTicketCommentMutation = { __typename?: 'Mutation', addTicketComment?: { __typename?: 'TicketCommentNode', id?: number | null, authorId?: number | null, authorUsername?: string | null, body?: string | null, createdAt?: string | null } | null };

export type CreateTicketMutationVariables = Exact<{
  input: TicketCreateInput;
}>;


export type CreateTicketMutation = { __typename?: 'Mutation', createTicket?: { __typename?: 'TicketNode', id?: number | null, title?: string | null, status?: TicketStatus | null, priority?: TicketPriority | null, reporterId?: number | null, assigneeId?: number | null, createdAt?: string | null, updatedAt?: string | null } | null };

export type TicketByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
  includeComments?: Scalars['Boolean']['input'];
}>;


export type TicketByIdQuery = { __typename?: 'Query', ticket?: { __typename?: 'TicketNode', id?: number | null, title?: string | null, description?: string | null, status?: TicketStatus | null, priority?: TicketPriority | null, reporterId?: number | null, reporterUsername?: string | null, assigneeId?: number | null, assigneeUsername?: string | null, createdAt?: string | null, updatedAt?: string | null, comments?: Array<{ __typename?: 'TicketCommentNode', id?: number | null, authorId?: number | null, authorUsername?: string | null, body?: string | null, createdAt?: string | null } | null> | null } | null };

export type TicketsConnectionQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TicketStatus>;
  assigneeId?: InputMaybe<Scalars['Long']['input']>;
  reporterId?: InputMaybe<Scalars['Long']['input']>;
}>;


export type TicketsConnectionQuery = { __typename?: 'Query', connectionTickets?: { __typename?: 'TicketConnection', page?: number | null, pageSize?: number | null, total?: number | null, items?: Array<{ __typename?: 'TicketNode', id?: number | null, title?: string | null, status?: TicketStatus | null, priority?: TicketPriority | null, reporterId?: number | null, assigneeId?: number | null, createdAt?: string | null, updatedAt?: string | null } | null> | null } | null };

export type UpdateTicketMutationVariables = Exact<{
  input: TicketUpdateInput;
}>;


export type UpdateTicketMutation = { __typename?: 'Mutation', updateTicket?: { __typename?: 'TicketNode', id?: number | null, title?: string | null, status?: TicketStatus | null, priority?: TicketPriority | null, assigneeId?: number | null, assigneeUsername?: string | null, updatedAt?: string | null } | null };

export type ConnectionUsersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<UserSort>;
  sortDesc?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ConnectionUsersQuery = { __typename?: 'Query', connectionUsers?: { __typename?: 'UserConnection', page?: number | null, pageSize?: number | null, total?: number | null, items?: Array<{ __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null, createdAt?: string | null, updatedAt?: string | null, lastLoginAt?: string | null } | null> | null } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null };

export type GetMeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeUserQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null, createdAt?: string | null, updatedAt?: string | null, lastLoginAt?: string | null } | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, status?: UserStatus | null, createdAt?: string | null, updatedAt?: string | null, lastLoginAt?: string | null, roles?: Array<Role | null> | null } | null };

export type GetUsersCountQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersCountQuery = { __typename?: 'Query', connectionUsersCount?: number | null };

export type ListUsersQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type ListUsersQuery = { __typename?: 'Query', userslist?: Array<{ __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null> | null };

export type SearchUsersQueryVariables = Exact<{
  term?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers?: Array<{ __typename?: 'UserLite', id?: number | null, username?: string | null } | null> | null };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UserResponse', id?: number | null, username?: string | null, email?: string | null, status?: UserStatus | null, roles?: Array<Role | null> | null } | null };

export type GetConnectionVideosQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<VideoSort>;
  sortDesc?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetConnectionVideosQuery = { __typename?: 'Query', connectionVideos?: { __typename?: 'VideoConnection', page?: number | null, pageSize?: number | null, total?: number | null, items?: Array<{ __typename?: 'VideoResponse', id?: number | null, title?: string | null, source?: string | null, durationMs?: number | null, description?: string | null, videoCategory?: VideoCategory | null, videoProvider?: VideoProvider | null, externalVideoId?: string | null, uploadDate?: string | null, createdUserId?: number | null } | null> | null } | null };

export type GetVideosCountQueryVariables = Exact<{
  provider?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetVideosCountQuery = { __typename?: 'Query', connectionVideosCount?: number | null };

export type ImportVideoMutationVariables = Exact<{
  provider: VideoProvider;
  externalVideoId: Scalars['String']['input'];
}>;


export type ImportVideoMutation = { __typename?: 'Mutation', importVideo?: { __typename?: 'VideoResponse', id?: number | null, title?: string | null, durationMs?: number | null, description?: string | null, externalVideoId?: string | null, uploadDate?: string | null, createdUserId?: number | null, videoProvider?: VideoProvider | null } | null };

export type ImportVideosByPublisherMutationVariables = Exact<{
  provider: VideoProvider;
  publisherName: Scalars['String']['input'];
}>;


export type ImportVideosByPublisherMutation = { __typename?: 'Mutation', importVideosByPublisher?: Array<{ __typename?: 'VideoResponse', id?: number | null, title?: string | null, source?: string | null, durationMs?: number | null, description?: string | null, externalVideoId?: string | null, uploadDate?: string | null, createdUserId?: number | null } | null> | null };


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
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
export const SignUpDocument = gql`
    mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    id
    username
    email
    roles
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const FxConvertDocument = gql`
    query FxConvert($from: String, $to: String, $amount: BigDecimal, $date: String) {
  fxConvert(from: $from, to: $to, amount: $amount, date: $date) {
    fromCurr
    toCurr
    amount
    rate
    result
    date
  }
}
    `;

/**
 * __useFxConvertQuery__
 *
 * To run a query within a React component, call `useFxConvertQuery` and pass it any options that fit your needs.
 * When your component renders, `useFxConvertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFxConvertQuery({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      amount: // value for 'amount'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useFxConvertQuery(baseOptions?: Apollo.QueryHookOptions<FxConvertQuery, FxConvertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FxConvertQuery, FxConvertQueryVariables>(FxConvertDocument, options);
      }
export function useFxConvertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FxConvertQuery, FxConvertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FxConvertQuery, FxConvertQueryVariables>(FxConvertDocument, options);
        }
export function useFxConvertSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FxConvertQuery, FxConvertQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FxConvertQuery, FxConvertQueryVariables>(FxConvertDocument, options);
        }
export type FxConvertQueryHookResult = ReturnType<typeof useFxConvertQuery>;
export type FxConvertLazyQueryHookResult = ReturnType<typeof useFxConvertLazyQuery>;
export type FxConvertSuspenseQueryHookResult = ReturnType<typeof useFxConvertSuspenseQuery>;
export type FxConvertQueryResult = Apollo.QueryResult<FxConvertQuery, FxConvertQueryVariables>;
export const FxLiveDocument = gql`
    query FxLive($source: String, $currencies: [String]) {
  fxLive(source: $source, currencies: $currencies) {
    source
    quotes {
      symbol
      rate
    }
  }
}
    `;

/**
 * __useFxLiveQuery__
 *
 * To run a query within a React component, call `useFxLiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useFxLiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFxLiveQuery({
 *   variables: {
 *      source: // value for 'source'
 *      currencies: // value for 'currencies'
 *   },
 * });
 */
export function useFxLiveQuery(baseOptions?: Apollo.QueryHookOptions<FxLiveQuery, FxLiveQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FxLiveQuery, FxLiveQueryVariables>(FxLiveDocument, options);
      }
export function useFxLiveLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FxLiveQuery, FxLiveQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FxLiveQuery, FxLiveQueryVariables>(FxLiveDocument, options);
        }
export function useFxLiveSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FxLiveQuery, FxLiveQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FxLiveQuery, FxLiveQueryVariables>(FxLiveDocument, options);
        }
export type FxLiveQueryHookResult = ReturnType<typeof useFxLiveQuery>;
export type FxLiveLazyQueryHookResult = ReturnType<typeof useFxLiveLazyQuery>;
export type FxLiveSuspenseQueryHookResult = ReturnType<typeof useFxLiveSuspenseQuery>;
export type FxLiveQueryResult = Apollo.QueryResult<FxLiveQuery, FxLiveQueryVariables>;
export const AddTicketCommentDocument = gql`
    mutation AddTicketComment($input: TicketCommentInput!) {
  addTicketComment(input: $input) {
    id
    authorId
    authorUsername
    body
    createdAt
  }
}
    `;
export type AddTicketCommentMutationFn = Apollo.MutationFunction<AddTicketCommentMutation, AddTicketCommentMutationVariables>;

/**
 * __useAddTicketCommentMutation__
 *
 * To run a mutation, you first call `useAddTicketCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTicketCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTicketCommentMutation, { data, loading, error }] = useAddTicketCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddTicketCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddTicketCommentMutation, AddTicketCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTicketCommentMutation, AddTicketCommentMutationVariables>(AddTicketCommentDocument, options);
      }
export type AddTicketCommentMutationHookResult = ReturnType<typeof useAddTicketCommentMutation>;
export type AddTicketCommentMutationResult = Apollo.MutationResult<AddTicketCommentMutation>;
export type AddTicketCommentMutationOptions = Apollo.BaseMutationOptions<AddTicketCommentMutation, AddTicketCommentMutationVariables>;
export const CreateTicketDocument = gql`
    mutation CreateTicket($input: TicketCreateInput!) {
  createTicket(input: $input) {
    id
    title
    status
    priority
    reporterId
    assigneeId
    createdAt
    updatedAt
  }
}
    `;
export type CreateTicketMutationFn = Apollo.MutationFunction<CreateTicketMutation, CreateTicketMutationVariables>;

/**
 * __useCreateTicketMutation__
 *
 * To run a mutation, you first call `useCreateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTicketMutation, { data, loading, error }] = useCreateTicketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTicketMutation(baseOptions?: Apollo.MutationHookOptions<CreateTicketMutation, CreateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTicketMutation, CreateTicketMutationVariables>(CreateTicketDocument, options);
      }
export type CreateTicketMutationHookResult = ReturnType<typeof useCreateTicketMutation>;
export type CreateTicketMutationResult = Apollo.MutationResult<CreateTicketMutation>;
export type CreateTicketMutationOptions = Apollo.BaseMutationOptions<CreateTicketMutation, CreateTicketMutationVariables>;
export const TicketByIdDocument = gql`
    query TicketById($id: Long!, $includeComments: Boolean! = true) {
  ticket(id: $id, includeComments: $includeComments) {
    id
    title
    description
    status
    priority
    reporterId
    reporterUsername
    assigneeId
    assigneeUsername
    createdAt
    updatedAt
    comments @include(if: $includeComments) {
      id
      authorId
      authorUsername
      body
      createdAt
    }
  }
}
    `;

/**
 * __useTicketByIdQuery__
 *
 * To run a query within a React component, call `useTicketByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      includeComments: // value for 'includeComments'
 *   },
 * });
 */
export function useTicketByIdQuery(baseOptions: Apollo.QueryHookOptions<TicketByIdQuery, TicketByIdQueryVariables> & ({ variables: TicketByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketByIdQuery, TicketByIdQueryVariables>(TicketByIdDocument, options);
      }
export function useTicketByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketByIdQuery, TicketByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketByIdQuery, TicketByIdQueryVariables>(TicketByIdDocument, options);
        }
export function useTicketByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TicketByIdQuery, TicketByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TicketByIdQuery, TicketByIdQueryVariables>(TicketByIdDocument, options);
        }
export type TicketByIdQueryHookResult = ReturnType<typeof useTicketByIdQuery>;
export type TicketByIdLazyQueryHookResult = ReturnType<typeof useTicketByIdLazyQuery>;
export type TicketByIdSuspenseQueryHookResult = ReturnType<typeof useTicketByIdSuspenseQuery>;
export type TicketByIdQueryResult = Apollo.QueryResult<TicketByIdQuery, TicketByIdQueryVariables>;
export const TicketsConnectionDocument = gql`
    query TicketsConnection($page: Int, $pageSize: Int, $search: String, $status: TicketStatus, $assigneeId: Long, $reporterId: Long) {
  connectionTickets(
    page: $page
    pageSize: $pageSize
    search: $search
    status: $status
    assigneeId: $assigneeId
    reporterId: $reporterId
  ) {
    page
    pageSize
    total
    items {
      id
      title
      status
      priority
      reporterId
      assigneeId
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useTicketsConnectionQuery__
 *
 * To run a query within a React component, call `useTicketsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketsConnectionQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      search: // value for 'search'
 *      status: // value for 'status'
 *      assigneeId: // value for 'assigneeId'
 *      reporterId: // value for 'reporterId'
 *   },
 * });
 */
export function useTicketsConnectionQuery(baseOptions?: Apollo.QueryHookOptions<TicketsConnectionQuery, TicketsConnectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketsConnectionQuery, TicketsConnectionQueryVariables>(TicketsConnectionDocument, options);
      }
export function useTicketsConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketsConnectionQuery, TicketsConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketsConnectionQuery, TicketsConnectionQueryVariables>(TicketsConnectionDocument, options);
        }
export function useTicketsConnectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TicketsConnectionQuery, TicketsConnectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TicketsConnectionQuery, TicketsConnectionQueryVariables>(TicketsConnectionDocument, options);
        }
export type TicketsConnectionQueryHookResult = ReturnType<typeof useTicketsConnectionQuery>;
export type TicketsConnectionLazyQueryHookResult = ReturnType<typeof useTicketsConnectionLazyQuery>;
export type TicketsConnectionSuspenseQueryHookResult = ReturnType<typeof useTicketsConnectionSuspenseQuery>;
export type TicketsConnectionQueryResult = Apollo.QueryResult<TicketsConnectionQuery, TicketsConnectionQueryVariables>;
export const UpdateTicketDocument = gql`
    mutation UpdateTicket($input: TicketUpdateInput!) {
  updateTicket(input: $input) {
    id
    title
    status
    priority
    assigneeId
    assigneeUsername
    updatedAt
  }
}
    `;
export type UpdateTicketMutationFn = Apollo.MutationFunction<UpdateTicketMutation, UpdateTicketMutationVariables>;

/**
 * __useUpdateTicketMutation__
 *
 * To run a mutation, you first call `useUpdateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTicketMutation, { data, loading, error }] = useUpdateTicketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTicketMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTicketMutation, UpdateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTicketMutation, UpdateTicketMutationVariables>(UpdateTicketDocument, options);
      }
export type UpdateTicketMutationHookResult = ReturnType<typeof useUpdateTicketMutation>;
export type UpdateTicketMutationResult = Apollo.MutationResult<UpdateTicketMutation>;
export type UpdateTicketMutationOptions = Apollo.BaseMutationOptions<UpdateTicketMutation, UpdateTicketMutationVariables>;
export const ConnectionUsersDocument = gql`
    query ConnectionUsers($page: Int, $pageSize: Int, $search: String, $sortBy: UserSort, $sortDesc: Boolean) {
  connectionUsers(
    page: $page
    pageSize: $pageSize
    search: $search
    sortBy: $sortBy
    sortDesc: $sortDesc
  ) {
    items {
      id
      username
      email
      status
      roles
      createdAt
      updatedAt
      lastLoginAt
    }
    page
    pageSize
    total
  }
}
    `;

/**
 * __useConnectionUsersQuery__
 *
 * To run a query within a React component, call `useConnectionUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useConnectionUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConnectionUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      search: // value for 'search'
 *      sortBy: // value for 'sortBy'
 *      sortDesc: // value for 'sortDesc'
 *   },
 * });
 */
export function useConnectionUsersQuery(baseOptions?: Apollo.QueryHookOptions<ConnectionUsersQuery, ConnectionUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConnectionUsersQuery, ConnectionUsersQueryVariables>(ConnectionUsersDocument, options);
      }
export function useConnectionUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConnectionUsersQuery, ConnectionUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConnectionUsersQuery, ConnectionUsersQueryVariables>(ConnectionUsersDocument, options);
        }
export function useConnectionUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConnectionUsersQuery, ConnectionUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConnectionUsersQuery, ConnectionUsersQueryVariables>(ConnectionUsersDocument, options);
        }
export type ConnectionUsersQueryHookResult = ReturnType<typeof useConnectionUsersQuery>;
export type ConnectionUsersLazyQueryHookResult = ReturnType<typeof useConnectionUsersLazyQuery>;
export type ConnectionUsersSuspenseQueryHookResult = ReturnType<typeof useConnectionUsersSuspenseQuery>;
export type ConnectionUsersQueryResult = Apollo.QueryResult<ConnectionUsersQuery, ConnectionUsersQueryVariables>;
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
export const GetMeUserDocument = gql`
    query GetMeUser {
  me {
    id
    username
    email
    status
    roles
    createdAt
    updatedAt
    lastLoginAt
  }
}
    `;

/**
 * __useGetMeUserQuery__
 *
 * To run a query within a React component, call `useGetMeUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeUserQuery(baseOptions?: Apollo.QueryHookOptions<GetMeUserQuery, GetMeUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeUserQuery, GetMeUserQueryVariables>(GetMeUserDocument, options);
      }
export function useGetMeUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeUserQuery, GetMeUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeUserQuery, GetMeUserQueryVariables>(GetMeUserDocument, options);
        }
export function useGetMeUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeUserQuery, GetMeUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeUserQuery, GetMeUserQueryVariables>(GetMeUserDocument, options);
        }
export type GetMeUserQueryHookResult = ReturnType<typeof useGetMeUserQuery>;
export type GetMeUserLazyQueryHookResult = ReturnType<typeof useGetMeUserLazyQuery>;
export type GetMeUserSuspenseQueryHookResult = ReturnType<typeof useGetMeUserSuspenseQuery>;
export type GetMeUserQueryResult = Apollo.QueryResult<GetMeUserQuery, GetMeUserQueryVariables>;
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
export const GetUsersCountDocument = gql`
    query GetUsersCount($search: String) {
  connectionUsersCount(search: $search)
}
    `;

/**
 * __useGetUsersCountQuery__
 *
 * To run a query within a React component, call `useGetUsersCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersCountQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetUsersCountQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersCountQuery, GetUsersCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersCountQuery, GetUsersCountQueryVariables>(GetUsersCountDocument, options);
      }
export function useGetUsersCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersCountQuery, GetUsersCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersCountQuery, GetUsersCountQueryVariables>(GetUsersCountDocument, options);
        }
export function useGetUsersCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersCountQuery, GetUsersCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersCountQuery, GetUsersCountQueryVariables>(GetUsersCountDocument, options);
        }
export type GetUsersCountQueryHookResult = ReturnType<typeof useGetUsersCountQuery>;
export type GetUsersCountLazyQueryHookResult = ReturnType<typeof useGetUsersCountLazyQuery>;
export type GetUsersCountSuspenseQueryHookResult = ReturnType<typeof useGetUsersCountSuspenseQuery>;
export type GetUsersCountQueryResult = Apollo.QueryResult<GetUsersCountQuery, GetUsersCountQueryVariables>;
export const ListUsersDocument = gql`
    query ListUsers($page: Int!, $size: Int!) {
  userslist(page: $page, size: $size) {
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
export const SearchUsersDocument = gql`
    query SearchUsers($term: String, $limit: Int) {
  searchUsers(term: $term, limit: $limit) {
    id
    username
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      term: // value for 'term'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions?: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export function useSearchUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersSuspenseQueryHookResult = ReturnType<typeof useSearchUsersSuspenseQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
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
export const GetConnectionVideosDocument = gql`
    query GetConnectionVideos($page: Int, $pageSize: Int, $provider: String, $sortBy: VideoSort, $sortDesc: Boolean) {
  connectionVideos(
    page: $page
    pageSize: $pageSize
    provider: $provider
    sortBy: $sortBy
    sortDesc: $sortDesc
  ) {
    items {
      id
      title
      source
      durationMs
      description
      videoCategory
      videoProvider
      externalVideoId
      uploadDate
      createdUserId
    }
    page
    pageSize
    total
  }
}
    `;

/**
 * __useGetConnectionVideosQuery__
 *
 * To run a query within a React component, call `useGetConnectionVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectionVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectionVideosQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      provider: // value for 'provider'
 *      sortBy: // value for 'sortBy'
 *      sortDesc: // value for 'sortDesc'
 *   },
 * });
 */
export function useGetConnectionVideosQuery(baseOptions?: Apollo.QueryHookOptions<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>(GetConnectionVideosDocument, options);
      }
export function useGetConnectionVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>(GetConnectionVideosDocument, options);
        }
export function useGetConnectionVideosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>(GetConnectionVideosDocument, options);
        }
export type GetConnectionVideosQueryHookResult = ReturnType<typeof useGetConnectionVideosQuery>;
export type GetConnectionVideosLazyQueryHookResult = ReturnType<typeof useGetConnectionVideosLazyQuery>;
export type GetConnectionVideosSuspenseQueryHookResult = ReturnType<typeof useGetConnectionVideosSuspenseQuery>;
export type GetConnectionVideosQueryResult = Apollo.QueryResult<GetConnectionVideosQuery, GetConnectionVideosQueryVariables>;
export const GetVideosCountDocument = gql`
    query GetVideosCount($provider: String) {
  connectionVideosCount(provider: $provider)
}
    `;

/**
 * __useGetVideosCountQuery__
 *
 * To run a query within a React component, call `useGetVideosCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideosCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideosCountQuery({
 *   variables: {
 *      provider: // value for 'provider'
 *   },
 * });
 */
export function useGetVideosCountQuery(baseOptions?: Apollo.QueryHookOptions<GetVideosCountQuery, GetVideosCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVideosCountQuery, GetVideosCountQueryVariables>(GetVideosCountDocument, options);
      }
export function useGetVideosCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVideosCountQuery, GetVideosCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVideosCountQuery, GetVideosCountQueryVariables>(GetVideosCountDocument, options);
        }
export function useGetVideosCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVideosCountQuery, GetVideosCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVideosCountQuery, GetVideosCountQueryVariables>(GetVideosCountDocument, options);
        }
export type GetVideosCountQueryHookResult = ReturnType<typeof useGetVideosCountQuery>;
export type GetVideosCountLazyQueryHookResult = ReturnType<typeof useGetVideosCountLazyQuery>;
export type GetVideosCountSuspenseQueryHookResult = ReturnType<typeof useGetVideosCountSuspenseQuery>;
export type GetVideosCountQueryResult = Apollo.QueryResult<GetVideosCountQuery, GetVideosCountQueryVariables>;
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
    videoProvider
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
    mutation ImportVideosByPublisher($provider: VideoProvider!, $publisherName: String!) {
  importVideosByPublisher(provider: $provider, publisherName: $publisherName) {
    id
    title
    source
    durationMs
    description
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
 *      provider: // value for 'provider'
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