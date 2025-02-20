import NotFound from '@common/components/pages/NotFound';
import { NextPage } from 'next';

const ForbiddenPage: NextPage = () => {
  return (
    <>
      <NotFound />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
  },
});

export default ForbiddenPage;
