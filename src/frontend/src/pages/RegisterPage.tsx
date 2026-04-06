import { UserRole } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAssignRole, useCreateProviderProfile } from "@/hooks/useQueries";
import { CATEGORIES } from "@/lib/categories";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Dog, Loader2, PawPrint } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Step = "role" | "details";
type RoleType = "parent" | "provider";

export function RegisterPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const pendingParentRegister = useRef(false);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");

  const assignRole = useAssignRole();
  const createProfile = useCreateProviderProfile();

  // When identity becomes available after clicking "Pet Parent", complete registration
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only when identity changes
  useEffect(() => {
    if (identity && pendingParentRegister.current) {
      pendingParentRegister.current = false;
      void (async () => {
        try {
          await assignRole.mutateAsync({
            user: identity.getPrincipal(),
            role: UserRole.user,
          });
          toast.success("Registered as Pet Parent!");
          void navigate({ to: "/dashboard/parent" });
        } catch {
          toast.error("Registration failed. Please try again.");
        }
      })();
    }
  }, [identity]);

  async function handleRoleSelect(role: RoleType) {
    setSelectedRole(role);
    if (!identity) {
      if (role === "parent") pendingParentRegister.current = true;
      login();
      return;
    }
    if (role === "parent") {
      await handleParentRegister();
    } else {
      setStep("details");
    }
  }

  async function handleParentRegister() {
    if (!identity) return;
    try {
      await assignRole.mutateAsync({
        user: identity.getPrincipal(),
        role: UserRole.user,
      });
      toast.success("Registered as Pet Parent!");
      void navigate({ to: "/dashboard/parent" });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  }

  async function handleProviderRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) return;
    try {
      await assignRole.mutateAsync({
        user: identity.getPrincipal(),
        role: UserRole.user,
      });
      await createProfile.mutateAsync({
        displayName,
        bio,
        category,
        pricePerHour: BigInt(Math.round(Number(price))),
        city,
        availability,
      });
      toast.success("Registered as Service Provider!");
      void navigate({ to: "/dashboard/provider" });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  }

  const isBusy =
    assignRole.isPending ||
    createProfile.isPending ||
    isLoggingIn ||
    isInitializing;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      data-ocid="register.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl shadow-card p-8 w-full max-w-lg"
        data-ocid="register.modal"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Join PawMarket
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === "role"
                ? "How will you use PawMarket?"
                : "Complete your provider profile"}
            </p>
          </div>
        </div>

        {step === "role" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleRoleSelect("parent")}
              disabled={isBusy}
              className="border-2 border-border rounded-xl p-5 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5 transition-all text-center disabled:opacity-50"
              data-ocid="register.button"
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Dog className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Pet Parent</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse and book pet services
                </p>
              </div>
              {isBusy && selectedRole === "parent" && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("provider")}
              disabled={isBusy}
              className="border-2 border-border rounded-xl p-5 flex flex-col items-center gap-3 hover:border-secondary hover:bg-secondary/5 transition-all text-center disabled:opacity-50"
              data-ocid="register.button"
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Service Provider
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Offer your pet services
                </p>
              </div>
            </button>
          </div>
        )}

        {step === "details" && (
          <form
            onSubmit={handleProviderRegister}
            className="flex flex-col gap-4"
            data-ocid="register.panel"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your business name"
                  required
                  data-ocid="register.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  required
                  data-ocid="register.input"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio / Description</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your services and experience..."
                rows={3}
                required
                data-ocid="register.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-ocid="register.select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">Price per Hour ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 25"
                  required
                  data-ocid="register.input"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Mon-Fri 9am-5pm"
                required
                data-ocid="register.input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("role")}
                className="flex-1"
                data-ocid="register.cancel_button"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isBusy || !category}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="register.submit_button"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </main>
  );
}
