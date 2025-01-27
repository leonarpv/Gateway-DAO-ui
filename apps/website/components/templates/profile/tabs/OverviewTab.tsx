import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getTimeZones } from '@vvo/tzdb';
import { DateTime } from 'luxon';
import { PartialDeep } from 'type-fest';

import { TOKENS } from '@gateway/theme';

import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Chip,
  Divider,
} from '@mui/material';

import { ROUTES } from '../../../../constants/routes';
import { useViewMode, ViewMode } from '../../../../hooks/use-view-modes';
import { useAuth } from '../../../../providers/auth';
import { Users } from '../../../../services/graphql/types.generated';
import { SessionUser } from '../../../../types/user';
import { a11yTabProps, TabPanel, useTab } from '../../../atoms/tabs';
import { ExperienceAccordion } from './experience';
import { ReceivedTab } from './recommendations/ReceivedTab';

type Props = {
  user: PartialDeep<Users> | SessionUser;
};

export function OverviewTab({ user }: Props) {
  const { view, toggleView } = useViewMode();
  const { t } = useTranslation();
  const { activeTab, handleTabChange, setTab } = useTab();
  const router = useRouter();
  const { me } = useAuth();
  const canEdit = user === me;

  const TZ = getTimeZones();

  const tabs = [
    {
      key: 'overview',
      label: t('Received'),
      section: <ReceivedTab />,
    },
    {
      key: 'activity',
      label: t('Given'),
    },
  ];

  const timezone = TZ.find((timeZone) => {
    return (
      user.timezone === timeZone.name || timeZone.group.includes(user.timezone)
    );
  });
  const hourToTimezone = DateTime.local()
    .setLocale('en-US')
    .setZone(user?.timezone);

  return (
    <Box>
      {view === ViewMode.grid && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              md: '2fr 1fr',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: 1,
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                py: '50px',
                ...(user.experiences?.length == 0 && {
                  borderBottom: 1,
                  borderColor: 'divider',
                }),
                display: 'flex',
                flexDirection: 'column',
                rowGap: '32px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  px: TOKENS.CONTAINER_PX,
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  style={{ color: '#fff', fontSize: '20px' }}
                  variant="h2"
                >
                  Credentials
                </Typography>
                {/* comment out the Edit experiennce */}
                {/* {canEdit && (
                  <EditIcon
                    sx={{
                      marginLeft: '15px',
                      color: 'rgba(255, 255, 255, 0.56)',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      router.push(ROUTES.PROFILE_EDIT + '#experiences')
                    }
                  ></EditIcon>
                )} */}
              </Box>
              {user.experiences?.length > 0 ? (
                <Stack>
                  {user.experiences.map((experience, index) => (
                    <Box
                      key={experience.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        py: '16px',
                        borderBottom: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <ExperienceAccordion {...{ experience, index }} />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    px: TOKENS.CONTAINER_PX,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                    variant="h6"
                  >
                    No credentials
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                py: '56px',
                px: TOKENS.CONTAINER_PX,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                rowGap: '32px',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '7fr 1fr',
                  width: '100%',
                }}
              >
                <Typography
                  style={{ color: '#fff', fontSize: '20px' }}
                  variant="h2"
                >
                  Skills
                </Typography>
                {canEdit && (
                  <EditIcon
                    sx={{
                      marginLeft: '15px',
                      color: 'rgba(255, 255, 255, 0.56)',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(ROUTES.PROFILE_EDIT + '#skills')}
                  ></EditIcon>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '8px',
                  rowGap: '8px',
                  flexWrap: 'wrap',
                  height: 'auto',
                }}
              >
                {user.skills?.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <Chip
                      key={'skill-' + (idx + 1)}
                      variant="filled"
                      label={skill}
                    ></Chip>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color={(theme) => theme.palette.text.secondary}
                  >
                    No results
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                py: '50px',
                px: TOKENS.CONTAINER_PX,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                rowGap: '32px',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '7fr 1fr',
                  width: '100%',
                }}
              >
                <Typography
                  style={{ color: '#fff', fontSize: '20px' }}
                  variant="h2"
                >
                  Languages
                </Typography>
                {canEdit && (
                  <EditIcon
                    sx={{
                      marginLeft: '15px',
                      color: 'rgba(255, 255, 255, 0.56)',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      router.push(ROUTES.PROFILE_EDIT + '#languages')
                    }
                  ></EditIcon>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '8px',
                  rowGap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {user.languages?.length > 0 ? (
                  user.languages.map((language, idx) => (
                    <Chip
                      key={'language-' + (idx + 1)}
                      variant="filled"
                      label={language}
                    ></Chip>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color={(theme) => theme.palette.text.secondary}
                  >
                    No results
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                py: '50px',
                px: TOKENS.CONTAINER_PX,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                rowGap: '28px',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '7fr 1fr',
                }}
              >
                <Typography
                  style={{ color: '#fff', fontSize: '20px' }}
                  variant="h2"
                >
                  Time Zone
                </Typography>
                {canEdit && (
                  <EditIcon
                    sx={{
                      marginLeft: '15px',
                      color: 'rgba(255, 255, 255, 0.56)',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      router.push(ROUTES.PROFILE_EDIT + '#timezones')
                    }
                  ></EditIcon>
                )}
              </Box>
              <Box>
                {user.timezone ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: '34px',
                        fontWeight: '400',
                        color: 'rgba(255, 255, 255, 1)',
                        letterSpacing: '0.25px',
                        marginBottom: '5px',
                      }}
                      variant="h6"
                    >
                      {
                        hourToTimezone
                          .toLocaleString(DateTime.TIME_SIMPLE)
                          .split(' ')[0]
                      }
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: '400',
                          color: 'rgba(255, 255, 255, 1)',
                          letterSpacing: '0.4px',
                        }}
                        component="span"
                      >
                        {
                          hourToTimezone
                            .toLocaleString(DateTime.TIME_SIMPLE)
                            .split(' ')[1]
                        }
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {timezone?.alternativeName}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant="body1"
                    color={(theme) => theme.palette.text.secondary}
                  >
                    No results
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
