import { BlitzPage } from "blitz";
import Layout from "app/core/layouts/Layout";
import protectPage from "app/core/helpers/protectPage";
import { TextInput } from "@ableco/abledev-components";

const Home: BlitzPage = () => {
  return (
    <div
      className="mt-14 mx-auto flex flex-col justify-center space-y-4"
      style={{
        // TODO: 500 is not in the normal tailwind classes
        width: 500,
      }}
    >
      <TextInput
        label="New task description"
        hideLabel
        className="w-full"
        placeholder="Add a new task..."
      />
      <div className="h-5 w-full bg-red-600" />
      <p className="text-center">
        <button className="text-gray-400 text-sm cursor-pointer underline">
          Show completed tasks
        </button>
      </p>
    </div>
  );
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;
Home.suppressFirstRenderFlicker = true;

export const getServerSideProps = protectPage;

export default Home;
