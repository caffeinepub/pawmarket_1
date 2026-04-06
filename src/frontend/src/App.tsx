import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AdminPage } from "@/pages/AdminPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { ParentDashboardPage } from "@/pages/ParentDashboardPage";
import { ProviderDashboardPage } from "@/pages/ProviderDashboardPage";
import { ProviderProfilePage } from "@/pages/ProviderProfilePage";
import { RegisterPage } from "@/pages/RegisterPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$categoryName",
  component: CategoryPage,
});
const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/provider/$principalId",
  component: ProviderProfilePage,
});
const parentDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/parent",
  component: ParentDashboardPage,
});
const providerDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/provider",
  component: ProviderDashboardPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  categoryRoute,
  providerRoute,
  parentDashRoute,
  providerDashRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
