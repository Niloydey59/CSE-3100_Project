import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/home";
import Register from "../pages/register";
import Login from "../pages/login";
import Error from "../pages/Error";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
