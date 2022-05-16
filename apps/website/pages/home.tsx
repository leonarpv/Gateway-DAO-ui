import useTranslation from 'next-translate/useTranslation';

import { Button } from '@mui/material';

import { mockDaos } from '../__mock__/daos';
import { DaoCard } from '../components/molecules/dao-card';
import { GatesCard } from '../components/molecules/gates-card';
import { PersonCard } from '../components/molecules/person-card';
import { DashboardTemplate } from '../components/templates/dashboard';
import {
  HomeTemplate,
  SectionWithGrid,
  SectionWithSlider,
} from '../components/templates/home';
import { useHomepageQuery } from '../types/graphql';

/** TODO: Prevent template remount when navigating between dashboard pages
 * https://nextjs.org/docs/basic-features/layouts
 * */

export default function Home() {
  const { t } = useTranslation('dashboard-home');
  const arrays = new Array(20).fill(1).map((_, i) => i);
  const call = useHomepageQuery({ variables: { id: 'wawawa' } });
  console.log(call);
  return (
    <DashboardTemplate
      containerProps={{
        sx: {
          pt: 2,
          overflow: 'hidden',
        },
      }}
      followingDaos={mockDaos}
    >
      <HomeTemplate title={t('title', { name: 'Lucas Inacio' })}>
        <SectionWithSlider
          title={t('featured-gates.title')}
          caption={t('featured-gates.caption')}
          action={<Button>{t('featured-gates.see-more')}</Button>}
          itemWidth={(theme) => theme.spacing(37.75)}
        >
          {arrays.map((id) => (
            <GatesCard key={id} />
          ))}
        </SectionWithSlider>
        <SectionWithSlider
          title={t('featured-daos.title')}
          caption={t('featured-daos.caption')}
          action={<Button>{t('featured-daos.see-more')}</Button>}
          itemWidth={(theme) => theme.spacing(51)}
        >
          {arrays.map((id) => (
            <DaoCard key={id} />
          ))}
        </SectionWithSlider>
        <SectionWithGrid
          title={t('featured-people.title')}
          caption={t('featured-people.caption')}
          action={<Button>{t('featured-people.see-more')}</Button>}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
            <PersonCard key={id} />
          ))}
        </SectionWithGrid>
      </HomeTemplate>
    </DashboardTemplate>
  );
}
