import { AuthLayout } from '@modules/auth/components/AuthLayout';
import { LoginForm } from '@modules/auth/components/LoginForm';
import { withAuth } from '@modules/auth/hocs/withAuth';
import { AUTH_MODE } from '@modules/auth/types/auth.types';
import Head from 'next/head';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login | EventHub</title>
      </Head>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'sign-in', 'common'])),
  },
});

export default withAuth(LoginPage, {
  mode: AUTH_MODE.LOGGED_OUT,
  redirectUrl: Routes.Common.Home,
});
