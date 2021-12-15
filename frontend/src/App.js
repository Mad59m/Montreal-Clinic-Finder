import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { ToastProvider } from "react-toast-notifications";
import SignUpPage from "./pages/SignupPage";

function App() {
  return (
    <Layout>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </ToastProvider>
    </Layout>
  );
}

export default App;
