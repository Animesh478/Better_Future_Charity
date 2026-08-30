import { createBrowserRouter } from "react-router-dom";
import BrowseCharitiesPage from "../pages/BrowseCharitiesPage";
import LoginSignupPage from "../pages/LoginSignupPage";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import CharityDetailPage from "../pages/CharityDetailPage";
import DonationPage from "../pages/DonationPage";
import DonationStatusPage from "../pages/DonationStatusPage";
import CharityDashboardPage from "../pages/CharityDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CreateCharityPage from "../pages/CreateCharityPage";
import ProjectReportsPage from "../pages/ProjectReportsPage";
import ProfilePage from "../pages/ProfilePage";
import MyDonationsPage from "../pages/MyDonationsPage";

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
  {
    path: `/projects/:projectId/reports`,
    element: <ProjectReportsPage />,
  },

  // --- Protected Routes ---
  // The ProtectedRoute acts as the Layout component
  // The 'children' will be rendered in place of <Outlet />
  {
    element: <ProtectedRoute />,
    // all the protected routes needs to be inside the children array
    children: [
      { path: "/donate/:projectId", element: <DonationPage /> },
      { path: "/donations/status", element: <DonationStatusPage /> },
      { path: "/charity/register", element: <CreateCharityPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/donations", element: <MyDonationsPage /> },
      {
        path: "/charity/dashboard",
        element: <CharityDashboardPage />,
      },
    ],
  },
  // {
  //   element: <ProtectedRoute allowedRoles={["Charity"]} />,
  //   children: [],
  // },
  {
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
