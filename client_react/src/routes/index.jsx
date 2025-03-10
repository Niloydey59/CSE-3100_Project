import { Route, Routes } from "react-router-dom";

// Pages
import Home from "./../pages/Home";
import Login from "./../pages/forms/Login";
import Error from "./../pages/Error";
import Groups from "./../pages/groups/Groups";
import PostDetails from "../pages/posts/PostDetails";
import GroupDetailsPage from "../pages/groups/GroupDetails";
import Dashboard from "./../pages/Dashboard";
import SearchResults from "./../pages/SearchResults";
import ActivateAccount from "./../pages/ActivateAcount";
import UpdatePost from "./../pages/forms/UpdatePost";
import CreateGroup from "./../pages/forms/CreateGroup";
import AddPostPage from "./../pages/forms/AddPost";
import ManageGroupPage from "./../pages/groups/ManageGroup";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login & Register */}
      <Route path="/login" element={<Login />} />

      {/* Home  */}
      <Route path="/" element={<Home />} />
      <Route path="/add-post" element={<AddPostPage />} />
      <Route path="/add-post/:intialTitle" element={<AddPostPage />} />
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
