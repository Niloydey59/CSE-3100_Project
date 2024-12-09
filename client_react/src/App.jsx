import React from "react";
import Index from "./routes/index";
import "./index.css";
import Navbar from "./layouts/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";
import { AuthProvider } from "./context/authcontext";

function App() {
  return (
    console.log("App.js"),
    (
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <main>
            <AppRoutes />
          </main>
        </AuthProvider>
      </BrowserRouter>
    )
  );
}

export default App;
