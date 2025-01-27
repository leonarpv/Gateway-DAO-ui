import useTranslation from 'next-translate/useTranslation';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { useAccount } from 'wagmi';

import { Box, Snackbar, Stack, Typography } from '@mui/material';

import { useSnackbar } from '../../../hooks/use-snackbar';
import { useUploadImage } from '../../../hooks/use-upload-image';
import { useAuth } from '../../../providers/auth';
import { ErrorResponse } from '../../../types/graphql';
import { NavBarAvatar } from '../../organisms/navbar/navbar-avatar';
import { AvatarUploadCard } from './avatar-upload-card';
import { Form } from './form';
import { schema, NewUserSchema, defaultValues } from './schema';

/*
  TODO: Downsize the image to a max size
  TODO: Create an api endpoint for photo manipulation
*/

export function NewUserTemplate() {
  const { t } = useTranslation('dashboard-new-user');
  const { me, gqlAuthMethods, onInvalidateMe } = useAuth();
  const methods = useForm<NewUserSchema>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues(me),
  });

  const snackbar = useSnackbar();

  const uploadImage = useUploadImage();

  const updateMutation = useMutation(
    ['updateProfile', me.id],
    async ({ pfp, ...data }: NewUserSchema) => {
      let uploadedPicture = null;

      if (pfp) {
        uploadedPicture = await uploadImage({
          base64: pfp,
          name: `${me.id}-pfp`,
        });
      }

      return gqlAuthMethods.update_user_profile({
        ...data,
        id: me.id,
        ...(uploadedPicture && { pic_id: uploadedPicture.upload_image.id }),
      });
    },
    {
      onSuccess() {
        snackbar.onOpen({ message: 'Profile created!' });
        onInvalidateMe();
      },
      onError(error: ErrorResponse) {
        let totalUnmappedErrors = 0;
        error.response.errors?.forEach(({ message, extensions }) => {
          if (
            extensions.code === 'constraint-violation' &&
            message.includes('users_email_address_uindex')
          ) {
            return methods.setError('email_address', {
              message: 'Email already in use',
            });
          }
          if (
            extensions.code === 'constraint-violation' &&
            message.includes('user_username_uindex')
          ) {
            return methods.setError('username', {
              message: 'Username already in use',
            });
          }
          totalUnmappedErrors++;
        });

        if (totalUnmappedErrors) {
          snackbar.onOpen({ message: 'Unknown server error', type: 'error' });
        }
      },
    }
  );

  const onSubmit = (data: NewUserSchema) => updateMutation.mutate(data);

  return (
    <>
      <Stack style={{ position: 'absolute', top: '50px', right: '50px' }}>
        <NavBarAvatar hideProfile />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        gap={2}
        sx={{
          width: '100%',
          display: { xs: 'block', md: 'flex' },
          alignSelf: 'center',
          maxWidth: (theme) => theme.breakpoints.values.lg,
        }}
      >
        <Stack
          direction="column"
          gap={7.5}
          sx={{ maxWidth: { xs: '100%', md: '50%', lg: '40%' }, width: '100%' }}
        >
          <Typography component="h1" variant="h4">
            {t('title')}
          </Typography>
          <Stack direction="column" gap={4}>
            <Box>
              <Typography component="h2" variant="h5">
                {t('form.title')}
              </Typography>
              <Typography component="p" variant="caption">
                {t('form.caption')}
              </Typography>
            </Box>
            <FormProvider {...methods}>
              <AvatarUploadCard
                showUserData={false}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
              />
              <Form onSubmit={onSubmit} isLoading={updateMutation.isLoading} />
            </FormProvider>
          </Stack>
        </Stack>

        <FormProvider {...methods}>
          <AvatarUploadCard
            sx={{
              display: { xs: 'none', md: 'flex' },
              width: 400,
            }}
          />
        </FormProvider>
      </Stack>
      <Snackbar
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }}
        open={snackbar.open}
        onClose={snackbar.handleClose}
        message={snackbar.message}
        key={snackbar.vertical + snackbar.horizontal}
      />
    </>
  );
}
