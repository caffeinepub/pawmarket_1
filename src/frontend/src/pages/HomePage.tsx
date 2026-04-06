import { ProviderCard } from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllProviders } from "@/hooks/useQueries";
import { CATEGORIES } from "@/lib/categories";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export function HomePage() {
  const { data: providers, isLoading } = useAllProviders();
  const featured = providers?.filter((p) => p.isActive).slice(0, 6) ?? [];

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[520px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-pawmarket.dim_1400x600.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-4">
              Trusted Pet Services,
              <br />
              <span className="text-star">Near You</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Find groomers, walkers, trainers, and more. Book with confidence
              from verified local professionals.
            </p>
            <Link
              to="/category/$categoryName"
              params={{ categoryName: "Grooming" }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base"
                data-ocid="hero.primary_button"
              >
                Browse Services <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Browse by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                to="/category/$categoryName"
                params={{ categoryName: cat.id }}
                data-ocid={`category.item.${i + 1}`}
              >
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center hover:border-secondary hover:shadow-card transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-3xl mb-3 group-hover:bg-secondary/20 transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="mt-3 text-xs font-medium text-primary group-hover:underline flex items-center gap-0.5">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Providers */}
      <section className="bg-muted/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Featured Providers
            </h2>
            <Link
              to="/category/$categoryName"
              params={{ categoryName: "Grooming" }}
              className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
              data-ocid="home.link"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
                <Skeleton key={k} className="h-52 rounded-xl" />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="home.list"
            >
              {featured.length === 0 ? (
                <div
                  className="col-span-full text-center py-12 text-muted-foreground"
                  data-ocid="home.empty_state"
                >
                  No providers yet. Be the first to register!
                </div>
              ) : (
                featured.map((p, i) => (
                  <motion.div
                    key={p.owner.toString()}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                  >
                    <ProviderCard provider={p} index={i + 1} />
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
