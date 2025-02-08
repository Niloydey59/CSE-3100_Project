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
import CreateGroup from "../pages/CreateGroup";
import AddPostPage from "../pages/AddPost";
import ManageGroupPage from "../pages/ManageGroup";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login & Register */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Home  */}
      <Route path="/" element={<Home />} />
      <Route path="/add-post" element={<AddPostPage />} />
      <Route path="/search" element={<SearchResults />} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/api/users/verify/:token" element={<ActivateAccount />} />
      <Route path="/post/update/:id" element={<UpdatePost />} />

      {/* Posts */}
      <Route path="/post/:postId" element={<PostDetails />} />

      {/* Groups */}
      <Route path="/groups" element={<Groups />} />
      <Route path="/create-group" element={<CreateGroup />} />
      {/* Group Details */}
      <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
      <Route path="/groups/:groupId/manage" element={<ManageGroupPage />} />
      <Route path="/groups/:groupId/add-post" element={<AddPostPage />} />
      <Route path="/groups/:groupId/post/:postId" element={<PostDetails />} />
      {/* Error */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
