import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/home";
import Register from "../pages/register";
import Login from "../pages/login";
import Error from "../pages/Error";
import Groups from "../pages/Groups";
import PostDetails from "../pages/postDetails";
import GroupDetailsPage from "../pages/groupDetails";
import Dashboard from "../pages/Dashboard";
import SearchResults from "../pages/SearchResults";
import ActivateAccount from "../pages/ActivateAcount";
import UpdatePost from "../pages/UpdatePost";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/api/users/verify/:token" element={<ActivateAccount />} />
      <Route path="/post/update/:id" element={<UpdatePost />} />
      <Route path="/post/:postId" element={<PostDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
