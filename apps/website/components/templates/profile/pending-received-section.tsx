import useTranslation from 'next-translate/useTranslation';

import { useMutation } from '@tanstack/react-query';

import { Button, Stack, Typography } from '@mui/material';

import { useBidirectionFollow } from '../../../hooks/use-bidirectional-follow';

type Props = {
  username: string;
  wallet: string;
  onSuccess?: () => void;
};

export function PendingReceivedSection({ wallet, username, onSuccess }: Props) {
  const { t } = useTranslation('notifications');
  const { onAccept, onReject } = useBidirectionFollow();
  const acceptMutation = useMutation(() => onAccept(wallet), { onSuccess });
  const rejectMutation = useMutation(() => onReject(wallet), { onSuccess });

  const isLoading = acceptMutation.isLoading || rejectMutation.isLoading;

  return (
    <Stack
      alignSelf="flex-start"
      gap={3}
      sx={{
        alignItems: {
          xs: 'flex-start',
          md: 'center',
        },
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
        background: '#E5E5E514',
        px: 3,
        py: 2,
      }}
    >
      <Typography sx={{ opacity: 0.8 }}>
        @{username} {t('user-requested')}
      </Typography>
      <Stack direction="row" gap={1}>
        <Button
          disabled={isLoading}
          onClick={() => acceptMutation.mutate()}
          variant="contained"
        >
          {t('common:actions.accept')}
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => rejectMutation.mutate()}
          variant="outlined"
        >
          {t('common:actions.decline')}
        </Button>
      </Stack>
    </Stack>
  );
}
