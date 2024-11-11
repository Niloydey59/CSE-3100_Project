import React from "react";
import { Helmet } from "react-helmet";

import PageTitle from "../components/common/PageTitle";

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
