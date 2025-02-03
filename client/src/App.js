import './styles/App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserContextProvider} from "./components/UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from './pages/PostPage';
import EditPost from "./pages/EditPost";
import ForgotPasswordPage from './pages/forgotPasswordPage';
import AboutUs from './pages/AboutUs';
import Contact from './pages/ContactUs';
import Services from './pages/Services';
import ResetPasswordPage from './pages/resetPasswordPage';
import SearchHandlingPage from './pages/searchPage';


function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/forgot-password' element={< ForgotPasswordPage />} />
          <Route path='/reset-password/:id/:token' element={< ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path='/contact' element={< Contact />} />
          <Route path='/services' element={< Services />} />
          <Route path='/search' element={< SearchHandlingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;