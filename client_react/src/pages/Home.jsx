import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import "../styling/home.css";

import PageTitle from "../components/common/PageTitle";
import Sidebar from "../components/home/Sidebar";
import PostList from "../components/home/PostList";

const Home = () => {
  return (
    <div>
      <PageTitle title="Home Page" />
      <div className="main-content">
        <Sidebar />
        <PostList />
      </div>
    </div>
  );
};

export default Home;
