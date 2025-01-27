import { GraphQLClient } from 'graphql-request';

import {
  getSdk,
  RefreshMutation,
  SdkFunctionWrapper,
} from './graphql/types.generated';

export type GqlMethods = ReturnType<typeof getSdk>;

const glqAnonClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_ENDPOINT
);

export const gqlAnonMethods = getSdk(glqAnonClient);

const gqlUserHeader = (token: string, userId?: string) => ({
  'X-Hasura-Role': 'user',
  Authorization: `Bearer ${token}`,
  ...(userId && { 'X-Hasura-User-Id': userId }),
});

const gqlClient = (token?: string, userId?: string) =>
  new GraphQLClient(process.env.NEXT_PUBLIC_HASURA_ENDPOINT, {
    headers: token ? gqlUserHeader(token, userId) : undefined,
  });

export const gqlMethods = (token: string, userId?: string) =>
  getSdk(gqlClient(token, userId));

export const gqlMethodsWithRefresh = (
  token: string,
  refreshToken: string,
  userId: string | undefined,
  // saves the new token to the user. The callback response doesn't matter
  saveToken: (newTokens: RefreshMutation['refresh']) => Promise<any>
) => {
  const wrapper: SdkFunctionWrapper = async (action) => {
    try {
      const res = await action();
      return res;
    } catch (e) {
      const isExpiredToken =
        e?.response?.errors?.[0].extensions.code === 'invalid-jwt';
      if (isExpiredToken) {
        /* Retrieves the new token */
        const newTokens = (
          await gqlAnonMethods.refresh({
            refresh_token: refreshToken,
          })
        )?.refresh;

        /* Saves the token on stored user */
        const res = await action(gqlUserHeader(userId, newTokens.token));
        await saveToken(newTokens);
        return res;
      }
      throw e;
    }
  };
  const methods = getSdk(gqlClient(token, userId), wrapper);
  return methods;
};
