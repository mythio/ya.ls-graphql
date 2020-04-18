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
  userId: Scalars['ID'];
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  shortIds?: Maybe<Array<ShortUrl>>;
  isAdmin: Scalars['Boolean'];
  isVerified: Scalars['Boolean'];
};

export type User = {
   __typename?: 'User';
  userId: Scalars['ID'];
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  isVerified: Scalars['Boolean'];
};

export type ShortUrlDetail = {
   __typename?: 'ShortUrlDetail';
  shortId: Scalars['String'];
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

export type AuthData = {
   __typename?: 'AuthData';
  token: Scalars['String'];
  userId: Scalars['ID'];
};

export type Query = {
   __typename?: 'Query';
  test: Scalars['String'];
  me: UserDetail;
  login: AuthData;
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
  createUser: User;
  verifyUser: User;
  shortenUrl: ShortUrl;
  editPrivilege: UserDetail;
  deleteUser: Scalars['String'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifyUserArgs = {
  token?: Maybe<Scalars['String']>;
};


export type MutationShortenUrlArgs = {
  originalUrl: Scalars['String'];
  shareWith?: Maybe<Array<Scalars['ID']>>;
};


export type MutationEditPrivilegeArgs = {
  userId: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID'];
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
  AuthData: ResolverTypeWrapper<AuthData>,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
  AdditionalEntityFields: AdditionalEntityFields,
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
  AuthData: AuthData,
  Query: {},
  Mutation: {},
  AdditionalEntityFields: AdditionalEntityFields,
};

export type AuthDirectiveArgs = {   requires?: Maybe<Role>; };

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UnionDirectiveArgs = {   discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {   discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {   embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {  };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {  };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {   path: Scalars['String']; };

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UserDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDetail'] = ResolversParentTypes['UserDetail']> = {
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shortIds?: Resolver<Maybe<Array<ResolversTypes['ShortUrl']>>, ParentType, ContextType>,
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ShortUrlDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShortUrlDetail'] = ResolversParentTypes['ShortUrlDetail']> = {
  shortId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
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

export type AuthDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthData'] = ResolversParentTypes['AuthData']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  test?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  me?: Resolver<ResolversTypes['UserDetail'], ParentType, ContextType>,
  login?: Resolver<ResolversTypes['AuthData'], ParentType, ContextType, RequireFields<QueryLoginArgs, 'emailAddress' | 'password'>>,
  expandUrl?: Resolver<ResolversTypes['ShortUrlDetail'], ParentType, ContextType, RequireFields<QueryExpandUrlArgs, 'shortId'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'name' | 'emailAddress' | 'password'>>,
  verifyUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationVerifyUserArgs, never>>,
  shortenUrl?: Resolver<ResolversTypes['ShortUrl'], ParentType, ContextType, RequireFields<MutationShortenUrlArgs, 'originalUrl'>>,
  editPrivilege?: Resolver<ResolversTypes['UserDetail'], ParentType, ContextType, RequireFields<MutationEditPrivilegeArgs, 'userId' | 'isAdmin'>>,
  deleteUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'userId'>>,
};

export type Resolvers<ContextType = any> = {
  UserDetail?: UserDetailResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
  ShortUrlDetail?: ShortUrlDetailResolvers<ContextType>,
  ShortUrl?: ShortUrlResolvers<ContextType>,
  AuthData?: AuthDataResolvers<ContextType>,
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
  union?: UnionDirectiveResolver<any, any, ContextType>,
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>,
  entity?: EntityDirectiveResolver<any, any, ContextType>,
  column?: ColumnDirectiveResolver<any, any, ContextType>,
  id?: IdDirectiveResolver<any, any, ContextType>,
  link?: LinkDirectiveResolver<any, any, ContextType>,
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>,
  map?: MapDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
import { ObjectID } from 'mongodb';