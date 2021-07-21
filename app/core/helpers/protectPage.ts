import { getSession, Routes } from "blitz";

async function protectPage({ req, res }) {
  const session = await getSession(req, res);
  console.log("????????");
  if (!session.userId) {
    return {
      redirect: {
        destination: Routes.LoginPage().pathname,
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default protectPage;
