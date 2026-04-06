import { ProviderCard } from "@/components/ProviderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProvidersByCategory } from "@/hooks/useQueries";
import { CATEGORIES, CATEGORY_DISPLAY_NAMES } from "@/lib/categories";
import { Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";

export function CategoryPage() {
  const { categoryName } = useParams({ from: "/category/$categoryName" });
  const { data: providers, isLoading } = useProvidersByCategory(categoryName);
  const catInfo = CATEGORIES.find((c) => c.id === categoryName);
  const displayName = CATEGORY_DISPLAY_NAMES[categoryName] ?? categoryName;

  const active = providers?.filter((p) => p.isActive) ?? [];

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="category.page"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          to="/"
          className="hover:text-foreground transition-colors"
          data-ocid="category.link"
        >
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{displayName}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {catInfo && (
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-4xl">
            {catInfo.icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
          {catInfo && (
            <p className="text-muted-foreground mt-1">{catInfo.description}</p>
          )}
        </div>
      </div>

      {/* Category nav pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to="/category/$categoryName"
            params={{ categoryName: cat.id }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              cat.id === categoryName
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-card text-muted-foreground border-border hover:border-secondary/50"
            }`}
            data-ocid="category.tab"
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {/* Provider grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="category.loading_state"
        >
          {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
            <Skeleton key={k} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="category.empty_state"
        >
          <div className="text-5xl mb-4">{catInfo?.icon ?? "🐾"}</div>
          <p className="text-lg font-medium">
            No providers in {displayName} yet.
          </p>
          <p className="text-sm mt-1">Be the first to offer this service!</p>
          <Link to="/register" className="inline-block mt-4">
            <span className="text-primary font-medium hover:underline">
              Register as a Provider
            </span>
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="category.list"
        >
          {active.map((p, i) => (
            <motion.div
              key={p.owner.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <ProviderCard provider={p} index={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
