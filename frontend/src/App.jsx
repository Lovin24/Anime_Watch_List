import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlist from "./pages/Watchlist";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchPage from "./pages/SearchPage";
import AnimeDetails from "./pages/AnimeDetails";
import Recommendations from "./pages/Recommendations";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      {token && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
