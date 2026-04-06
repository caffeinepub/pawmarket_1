import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAllProviders,
  useIsAdmin,
  useToggleProviderActive,
} from "@/hooks/useQueries";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/categories";
import { useNavigate } from "@tanstack/react-router";
import { Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function AdminPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: providers, isLoading: providersLoading } = useAllProviders();
  const toggleActive = useToggleProviderActive();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-xl font-semibold text-muted-foreground mb-4">
          Admin access required. Please log in.
        </p>
        <Button
          onClick={() => void navigate({ to: "/login" })}
          className="bg-primary text-primary-foreground"
          data-ocid="admin.primary_button"
        >
          Login
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">
          Access Denied. You are not an admin.
        </p>
      </div>
    );
  }

  async function handleToggle(principal: string) {
    const { Principal } = await import("@icp-sdk/core/principal");
    try {
      await toggleActive.mutateAsync(Principal.fromText(principal));
      toast.success("Provider status toggled.");
    } catch {
      toast.error("Failed to toggle provider.");
    }
  }

  return (
    <main
      className="max-w-6xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="admin.page"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage providers and platform content.
          </p>
        </div>
      </div>

      {/* Providers Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
        data-ocid="admin.panel"
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Service Providers</h2>
          <p className="text-sm text-muted-foreground">
            {providers?.length ?? 0} registered providers
          </p>
        </div>

        {providersLoading ? (
          <div
            className="p-6 flex flex-col gap-3"
            data-ocid="admin.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : providers && providers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Price/hr</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((p, i) => (
                  <TableRow
                    key={p.owner.toString()}
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold text-foreground">
                          {p.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {p.owner.toString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-accent text-accent-foreground border-accent/30 text-xs"
                      >
                        {CATEGORY_DISPLAY_NAMES[p.category] ?? p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.city}
                    </TableCell>
                    <TableCell className="text-sm">
                      ${Number(p.pricePerHour)}
                    </TableCell>
                    <TableCell className="text-sm">
                      ★ {Number(p.rating)} ({Number(p.reviewCount)})
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                          p.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={p.isActive}
                          onCheckedChange={() =>
                            handleToggle(p.owner.toString())
                          }
                          disabled={toggleActive.isPending}
                          data-ocid={`admin.switch.${i + 1}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {p.isActive ? (
                            <ToggleRight className="w-4 h-4 text-secondary" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="admin.empty_state"
          >
            <p>No providers registered yet.</p>
          </div>
        )}
      </motion.div>
    </main>
  );
}
