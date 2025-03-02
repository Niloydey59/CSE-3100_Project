import "./index.css";
import Navbar from "./layouts/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";
import { AuthProvider } from "./context/authcontext";
import { SidebarProvider } from "./context/sidebarContext";

function App() {
  return (
    console.log("App.js"),
    (
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            <main>
              <AppRoutes />
            </main>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    )
  );
}

export default App;
