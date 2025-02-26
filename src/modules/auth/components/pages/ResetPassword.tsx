import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth, { ResetPasswordInput } from '@modules/auth/hooks/useAuth';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Routes from '@common/defs/routes';

interface ResetPasswordProps {
  token: string;
}
type ResetPasswordInputForm = Omit<ResetPasswordInput, 'token'>;
const ResetPassword = (props: ResetPasswordProps) => {
  const { resetPassword } = useAuth();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email format is incorrect')
      .required('This field is required'),
    password: Yup.string().max(191, 'Field is too long').required('This field is required'),
    passwordConfirmation: Yup.string()
      .max(191, 'Field is too long')
      .required('This field is required')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
  });
  const methods = useForm<ResetPasswordInputForm>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: ResetPasswordInputForm) => {
    await resetPassword(
      {
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        token: props.token,
      },
      { displayProgress: true, displaySuccess: true }
    );
  };
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Change Password
      </Typography>
      <Card sx={{ maxWidth: '450px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ padding: 5 }}>
            <Grid item xs={12}>
              <RHFTextField name="email" label="Email" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="password" label="Password" type="password" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="passwordConfirmation"
                label="Confirm Password"
                type="password"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                startIcon={<LockOpen />}
                loadingPosition="start"
                loading={isSubmitting}
              >
                Change Password
              </LoadingButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?
                {` `}
                <Link href={Routes.Auth.Login}>Click here</Link>
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default ResetPassword;
