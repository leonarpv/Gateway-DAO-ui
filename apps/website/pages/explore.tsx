import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

// import { dehydrate, useQuery } from 'react-query';

import { DashboardTemplate } from '../components/templates/dashboard';
import { ExploreTemplate } from '../components/templates/explore';
import { ROUTES } from '../constants/routes';
import { gqlMethods } from '../services/api';

/** TODO: Prevent template remount when navigating between dashboard pages
 * https://nextjs.org/docs/basic-features/layouts
 * */

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  /* TODO: Implement Custom CLient Session Handling <https://next-auth.js.org/getting-started/client#custom-client-session-handling> */
  if (!session?.user) {
    return {
      redirect: {
        destination: ROUTES.LANDING,
        permanent: true,
      },
      props: {
        exploreProps: null,
      },
    };
  }

  const exploreProps = await gqlMethods(session.user).get_explore({
    id: session.user.id,
  });

  /* TODO: Make this reusable */
  if (!exploreProps.me.init)
    return {
      props: {
        exploreProps,
      },
      redirect: {
        destination: ROUTES.NEW_USER,
        permanent: true,
      },
    };

  return {
    props: {
      // dehydratedState: dehydrate(queryClient),
      exploreProps,
    },
  };
};

export default function Explore({
  exploreProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('explore');

  if (!exploreProps) return null;

  /*   const session = useSession();
  console.log(session);
 */
  return (
    <DashboardTemplate
      containerProps={{
        sx: {
          pt: 2,
          overflow: 'hidden',
        },
      }}
    >
      <ExploreTemplate
        title={t('title')}
        subtitle={t('subtitle')}
        data={exploreProps}
      />
    </DashboardTemplate>
  );
}

Explore.auth = true;