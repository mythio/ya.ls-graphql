import { QueryResolvers, MutationResolvers } from '../generated/graphql';

import CustErr from '../core/ApiError';

export const queryResolvers: QueryResolvers = {
  test: async (root, args, context) => {
    console.log('ada');
    return 'lol ';
  },

  me: async (root, args, context) => {
    console.log('papap');
    // throw new Error('asdasd');
    // throw new CustErr('pp');

    return {
      userId: '',
      name: '',
      emailAddress: '',
      shortIds: [],
      isAdmin: false,
      isVerified: false
    }
  }
}

export const mutationResolver: MutationResolvers = {

}