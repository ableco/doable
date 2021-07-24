import { BlitzPage } from "blitz";
import Layout from "app/core/layouts/Layout";
import protectPage from "app/core/helpers/protectPage";

const Home: BlitzPage = () => {
  return <div>Home</div>;
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;
Home.suppressFirstRenderFlicker = true;

export const getServerSideProps = protectPage;

export default Home;
