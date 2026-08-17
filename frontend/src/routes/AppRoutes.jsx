import { createBrowserRouter } from "react-router-dom";
import BrowseCharitiesPage from "../pages/BrowseCharitiesPage";

// import DonationPage from "../pages/DonationPage";
// import DonationHistoryPage from "../pages/DonationHistoryPage";
// import NotFoundPage from "../pages/NotFoundPage";
// import ProtectedRoute from "../components/common/ProtectedRoute";
import AuthPage from "../pages/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BrowseCharitiesPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
]);

export default router;

// export default function AppRoutes() {
//   return (
// <Routes>
//   {/* Public — anyone can browse charities without an account */}
//   <Route path="/" element={<BrowseCharitiesPage />} />
//   <Route path="/login" element={<AuthPage />} />

// {
//   /* Gated — must be logged in to actually donate or view history */
// }
// {
/* <Route
        path="/donate/:charityId"
        element={
          <ProtectedRoute>
            <DonationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations"
        element={
          <ProtectedRoute>
            <DonationHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} /> */
// }
// </Routes>
//   );
// }
