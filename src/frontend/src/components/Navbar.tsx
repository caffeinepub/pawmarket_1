import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, PawPrint, Search, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate({
        to: "/category/$categoryName",
        params: { categoryName: "Grooming" },
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              PawMarket
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="pl-9 bg-muted/40 border-border"
                data-ocid="nav.search_input"
              />
            </div>
          </form>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/category/$categoryName"
              params={{ categoryName: "Grooming" }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Services
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard/parent"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="nav.link"
                >
                  My Pets
                </Link>
                <Link
                  to="/dashboard/provider"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="nav.link"
                >
                  Provider
                </Link>
              </>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/parent"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  data-ocid="nav.link"
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.button"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="nav.button"
                >
                  {isLoggingIn ? "Connecting..." : "Login"}
                </Button>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                    data-ocid="nav.primary_button"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            className="text-sm font-medium"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Home
          </Link>
          <Link
            to="/category/$categoryName"
            params={{ categoryName: "Grooming" }}
            className="text-sm font-medium"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Services
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/parent"
                className="text-sm font-medium"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clear();
                  setMenuOpen(false);
                }}
                data-ocid="nav.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  login();
                  setMenuOpen(false);
                }}
                data-ocid="nav.button"
              >
                Login
              </Button>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground rounded-full w-full"
                  data-ocid="nav.primary_button"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
