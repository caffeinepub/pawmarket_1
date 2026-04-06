import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">PawMarket</span>
            </div>
            <p className="text-sm text-primary-foreground/75 leading-relaxed">
              Connecting pet owners with trusted local service providers.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-80">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li>
                <Link
                  to="/category/$categoryName"
                  params={{ categoryName: "Grooming" }}
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Grooming
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$categoryName"
                  params={{ categoryName: "Walker" }}
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Dog Walker
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$categoryName"
                  params={{ categoryName: "Trainer" }}
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Dog Trainer
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$categoryName"
                  params={{ categoryName: "PetTransport" }}
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Pet Transport
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$categoryName"
                  params={{ categoryName: "DogMating" }}
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Dog Mating
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-80">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li>
                <Link
                  to="/register"
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/parent"
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Pet Parent Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/provider"
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Provider Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-80">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li>
                <Link
                  to="/admin"
                  className="hover:text-primary-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
          <span>© {year} PawMarket. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
