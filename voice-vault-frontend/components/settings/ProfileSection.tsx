import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import type { User } from "@/types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ProfileSectionProps {
  user: User | null;
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function ProfileSection({ user, name, email, onNameChange, onEmailChange }: ProfileSectionProps) {
  return (
    <Card>
      <p className="font-semibold text-white light:text-slate-900">Profile</p>

      <div className="mt-4 flex items-center gap-4">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
          {user ? getInitials(user.name) : "?"}
        </span>
        <div>
          <p className="font-medium text-white light:text-slate-900">{user?.name ?? "Guest"}</p>
          <p className="text-sm text-slate-400 light:text-slate-500">{user?.email ?? "Not signed in"}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-slate-300 light:text-slate-700">
            Full Name
          </Label>
          <Input id="fullName" variant="dashboard" value={name} onChange={(event) => onNameChange(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="emailAddress" className="text-slate-300 light:text-slate-700">
            Email Address
          </Label>
          <Input
            id="emailAddress"
            type="email"
            variant="dashboard"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
