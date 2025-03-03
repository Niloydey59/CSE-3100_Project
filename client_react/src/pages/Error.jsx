import React from "react";
import { Helmet } from "react-helmet";

// Components
import PageTitle from "../components/common/pageTitle";

const Error = () => {
  return (
    <div>
      <PageTitle title="Error Page" />
      <h1>Error Page</h1>
      <h2>Welcome to the Error Page</h2>
      <h2>404 Error</h2>
    </div>
  );
};

export default Error;
