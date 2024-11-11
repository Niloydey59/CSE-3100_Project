import React from "react";
import Index from "./routes/index";
import "./index.css";
import Navbar from "./layouts/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";

function App() {
  return (
    console.log("App.js"),
    (
      <BrowserRouter>
        <Navbar />
        <main>
          <AppRoutes />
        </main>
      </BrowserRouter>
    )
  );
}

export default App;
