import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};


export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Reviewer = 'REVIEWER'
}

export type UserDetail = {
   __typename?: 'UserDetail';
  _id: Scalars['ID'];
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  shortIds?: Maybe<Array<ShortUrl>>;
  roles?: Maybe<Array<Scalars['String']>>;
};

export type User = {
   __typename?: 'User';
  _id: Scalars['ID'];
  name: Scalars['String'];
  emailAddress: Scalars['String'];
};

export type ShortUrlDetail = {
   __typename?: 'ShortUrlDetail';
  _id: Scalars['String'];
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<User>>;
  createdBy?: Maybe<User>;
};

export type ShortUrl = {
   __typename?: 'ShortUrl';
  shortId: Scalars['String'];
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<Scalars['ID']>>;
};

export type CreateUserResp = {
   __typename?: 'CreateUserResp';
  user: User;
  tokens: Tokens;
};

export type LoginUserResp = {
   __typename?: 'LoginUserResp';
  user: User;
  tokens: Tokens;
};

export type MeResp = {
   __typename?: 'MeResp';
  user: UserDetail;
};

export type Tokens = {
   __typename?: 'Tokens';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  me: MeResp;
  login: LoginUserResp;
  expandUrl: ShortUrlDetail;
};


export type QueryLoginArgs = {
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};


export type QueryExpandUrlArgs = {
  shortId: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createUser: CreateUserResp;
  shortenUrl: ShortUrl;
  editRole: UserDetail;
  deleteUser: Scalars['String'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};


export type MutationShortenUrlArgs = {
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<Scalars['ID']>>;
};


export type MutationEditRoleArgs = {
  userId: Scalars['ID'];
  role: Role;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Role: Role,
  UserDetail: ResolverTypeWrapper<UserDetail>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  User: ResolverTypeWrapper<User>,
  ShortUrlDetail: ResolverTypeWrapper<ShortUrlDetail>,
  ShortUrl: ResolverTypeWrapper<ShortUrl>,
  CreateUserResp: ResolverTypeWrapper<CreateUserResp>,
  LoginUserResp: ResolverTypeWrapper<LoginUserResp>,
  MeResp: ResolverTypeWrapper<MeResp>,
  Tokens: ResolverTypeWrapper<Tokens>,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  Role: Role,
  UserDetail: UserDetail,
  ID: Scalars['ID'],
  User: User,
  ShortUrlDetail: ShortUrlDetail,
  ShortUrl: ShortUrl,
  CreateUserResp: CreateUserResp,
  LoginUserResp: LoginUserResp,
  MeResp: MeResp,
  Tokens: Tokens,
  Query: {},
  Mutation: {},
};

export type AuthDirectiveArgs = {   requires?: Maybe<Role>; };

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UserDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDetail'] = ResolversParentTypes['UserDetail']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shortIds?: Resolver<Maybe<Array<ResolversTypes['ShortUrl']>>, ParentType, ContextType>,
  roles?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ShortUrlDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShortUrlDetail'] = ResolversParentTypes['ShortUrlDetail']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  originalUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shareWith?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>,
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ShortUrlResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShortUrl'] = ResolversParentTypes['ShortUrl']> = {
  shortId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  originalUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shareWith?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CreateUserRespResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserResp'] = ResolversParentTypes['CreateUserResp']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  tokens?: Resolver<ResolversTypes['Tokens'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type LoginUserRespResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginUserResp'] = ResolversParentTypes['LoginUserResp']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  tokens?: Resolver<ResolversTypes['Tokens'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MeRespResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeResp'] = ResolversParentTypes['MeResp']> = {
  user?: Resolver<ResolversTypes['UserDetail'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TokensResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tokens'] = ResolversParentTypes['Tokens']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['MeResp'], ParentType, ContextType>,
  login?: Resolver<ResolversTypes['LoginUserResp'], ParentType, ContextType, RequireFields<QueryLoginArgs, 'emailAddress' | 'password'>>,
  expandUrl?: Resolver<ResolversTypes['ShortUrlDetail'], ParentType, ContextType, RequireFields<QueryExpandUrlArgs, 'shortId'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['CreateUserResp'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'name' | 'emailAddress' | 'password'>>,
  shortenUrl?: Resolver<ResolversTypes['ShortUrl'], ParentType, ContextType, RequireFields<MutationShortenUrlArgs, 'originalUrl'>>,
  editRole?: Resolver<ResolversTypes['UserDetail'], ParentType, ContextType, RequireFields<MutationEditRoleArgs, 'userId' | 'role'>>,
  deleteUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'userId'>>,
};

export type Resolvers<ContextType = any> = {
  UserDetail?: UserDetailResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
  ShortUrlDetail?: ShortUrlDetailResolvers<ContextType>,
  ShortUrl?: ShortUrlResolvers<ContextType>,
  CreateUserResp?: CreateUserRespResolvers<ContextType>,
  LoginUserResp?: LoginUserRespResolvers<ContextType>,
  MeResp?: MeRespResolvers<ContextType>,
  Tokens?: TokensResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;