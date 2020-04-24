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


export enum IRole {
  Admin = 'ADMIN',
  User = 'USER',
  UserUnauth = 'USER_UNAUTH',
  Reviewer = 'REVIEWER'
}

export type IUserDetail = {
  _id: Scalars['ID'];
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  shortIds?: Maybe<Array<IShortUrl>>;
  roles?: Maybe<Array<IRole>>;
};

export type IUser = {
  _id: Scalars['ID'];
  name: Scalars['String'];
  emailAddress: Scalars['String'];
};

export type IShortUrlDetail = {
  _id: Scalars['ID'];
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<IUser>>;
  createdBy?: Maybe<IUser>;
};

export type IShortUrl = {
  _id: Scalars['ID'];
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<IUser>>;
};

export type ICreateUserResp = {
  user: IUser;
  tokens: ITokens;
};

export type ILoginUserResp = {
  user: IUser;
  tokens: ITokens;
};

export type IMeResp = {
  user: IUserDetail;
};

export type ITokens = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type IQuery = {
  me: IMeResp;
  login: ILoginUserResp;
  expandUrl: IShortUrlDetail;
};


export type IQueryLoginArgs = {
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};


export type IQueryExpandUrlArgs = {
  _id: Scalars['String'];
};

export type IMutation = {
  createUser: ICreateUserResp;
  shortenUrl: IShortUrl;
  editRole: IUserDetail;
  deleteUser: Scalars['String'];
};


export type IMutationCreateUserArgs = {
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};


export type IMutationShortenUrlArgs = {
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<Scalars['String']>>;
};


export type IMutationEditRoleArgs = {
  userId: Scalars['ID'];
  role: IRole;
};


export type IMutationDeleteUserArgs = {
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
export type IResolversTypes = {
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Role: IRole,
  UserDetail: ResolverTypeWrapper<IUserDetail>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  User: ResolverTypeWrapper<IUser>,
  ShortUrlDetail: ResolverTypeWrapper<IShortUrlDetail>,
  ShortUrl: ResolverTypeWrapper<IShortUrl>,
  CreateUserResp: ResolverTypeWrapper<ICreateUserResp>,
  LoginUserResp: ResolverTypeWrapper<ILoginUserResp>,
  MeResp: ResolverTypeWrapper<IMeResp>,
  Tokens: ResolverTypeWrapper<ITokens>,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  Role: IRole,
  UserDetail: IUserDetail,
  ID: Scalars['ID'],
  User: IUser,
  ShortUrlDetail: IShortUrlDetail,
  ShortUrl: IShortUrl,
  CreateUserResp: ICreateUserResp,
  LoginUserResp: ILoginUserResp,
  MeResp: IMeResp,
  Tokens: ITokens,
  Query: {},
  Mutation: {},
};

export type IAuthDirectiveArgs = {   requires?: Maybe<IRole>; };

export type IAuthDirectiveResolver<Result, Parent, ContextType = any, Args = IAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IUserDetailResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserDetail'] = IResolversParentTypes['UserDetail']> = {
  _id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  emailAddress?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  shortIds?: Resolver<Maybe<Array<IResolversTypes['ShortUrl']>>, ParentType, ContextType>,
  roles?: Resolver<Maybe<Array<IResolversTypes['Role']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type IUserResolvers<ContextType = any, ParentType extends IResolversParentTypes['User'] = IResolversParentTypes['User']> = {
  _id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  emailAddress?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type IShortUrlDetailResolvers<ContextType = any, ParentType extends IResolversParentTypes['ShortUrlDetail'] = IResolversParentTypes['ShortUrlDetail']> = {
  _id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>,
  originalUrl?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  shareWith?: Resolver<Maybe<Array<IResolversTypes['User']>>, ParentType, ContextType>,
  createdBy?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type IShortUrlResolvers<ContextType = any, ParentType extends IResolversParentTypes['ShortUrl'] = IResolversParentTypes['ShortUrl']> = {
  _id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>,
  originalUrl?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  shareWith?: Resolver<Maybe<Array<IResolversTypes['User']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ICreateUserRespResolvers<ContextType = any, ParentType extends IResolversParentTypes['CreateUserResp'] = IResolversParentTypes['CreateUserResp']> = {
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>,
  tokens?: Resolver<IResolversTypes['Tokens'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ILoginUserRespResolvers<ContextType = any, ParentType extends IResolversParentTypes['LoginUserResp'] = IResolversParentTypes['LoginUserResp']> = {
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>,
  tokens?: Resolver<IResolversTypes['Tokens'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type IMeRespResolvers<ContextType = any, ParentType extends IResolversParentTypes['MeResp'] = IResolversParentTypes['MeResp']> = {
  user?: Resolver<IResolversTypes['UserDetail'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ITokensResolvers<ContextType = any, ParentType extends IResolversParentTypes['Tokens'] = IResolversParentTypes['Tokens']> = {
  accessToken?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  refreshToken?: Resolver<IResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type IQueryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  me?: Resolver<IResolversTypes['MeResp'], ParentType, ContextType>,
  login?: Resolver<IResolversTypes['LoginUserResp'], ParentType, ContextType, RequireFields<IQueryLoginArgs, 'emailAddress' | 'password'>>,
  expandUrl?: Resolver<IResolversTypes['ShortUrlDetail'], ParentType, ContextType, RequireFields<IQueryExpandUrlArgs, '_id'>>,
};

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  createUser?: Resolver<IResolversTypes['CreateUserResp'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'name' | 'emailAddress' | 'password'>>,
  shortenUrl?: Resolver<IResolversTypes['ShortUrl'], ParentType, ContextType, RequireFields<IMutationShortenUrlArgs, 'originalUrl'>>,
  editRole?: Resolver<IResolversTypes['UserDetail'], ParentType, ContextType, RequireFields<IMutationEditRoleArgs, 'userId' | 'role'>>,
  deleteUser?: Resolver<IResolversTypes['String'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'userId'>>,
};

export type IResolvers<ContextType = any> = {
  UserDetail?: IUserDetailResolvers<ContextType>,
  User?: IUserResolvers<ContextType>,
  ShortUrlDetail?: IShortUrlDetailResolvers<ContextType>,
  ShortUrl?: IShortUrlResolvers<ContextType>,
  CreateUserResp?: ICreateUserRespResolvers<ContextType>,
  LoginUserResp?: ILoginUserRespResolvers<ContextType>,
  MeResp?: IMeRespResolvers<ContextType>,
  Tokens?: ITokensResolvers<ContextType>,
  Query?: IQueryResolvers<ContextType>,
  Mutation?: IMutationResolvers<ContextType>,
};


export type IDirectiveResolvers<ContextType = any> = {
  auth?: IAuthDirectiveResolver<any, any, ContextType>,
};

