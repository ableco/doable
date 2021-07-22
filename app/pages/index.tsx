import { Suspense } from "react";
import { BlitzPage } from "blitz";
import Layout from "app/core/layouts/Layout";
import protectPage from "app/core/helpers/protectPage";
import Header from "app/components/Header";

const Home: BlitzPage = () => {
  return (
    <>
      <Header />
    </>
  );
};

Home.suppressFirstRenderFlicker = true;
Home.getLayout = (page) => (
  <Layout title="Home">
    <Suspense fallback={<span>Loading...</span>}>{page}</Suspense>
  </Layout>
);
export const getServerSideProps = protectPage;

export default Home;
