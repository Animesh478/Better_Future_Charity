import { createBrowserRouter } from "react-router-dom";
import BrowseCharitiesPage from "../pages/BrowseCharitiesPage";
import LoginSignupPage from "../pages/LoginSignupPage";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import CharityDetailPage from "../pages/CharityDetailPage";

const router = createBrowserRouter([
  // --- Public routes : anyone can see these, even without creating an account ---
  {
    path: "/",
    element: <BrowseCharitiesPage />,
  },
  {
    path: "/login",
    element: <LoginSignupPage />,
  },
  {
    path: `/charity/:charityId`,
    element: <CharityDetailPage />,
  },

  // --- Protected Routes ---
  // The ProtectedRoute acts as the Layout component
  // The 'children' will be rendered in place of <Outlet />
  {
    element: <ProtectedRoute />,
    // all the protected routes needs to be inside the children array
    children: [
      // {path:'', element: }
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
