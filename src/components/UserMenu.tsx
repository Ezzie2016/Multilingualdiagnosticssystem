import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";
  const email = user?.email ?? "";

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-2.5 py-2 text-sm text-[#0f4f84] shadow-sm"
        title={email}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#118be7] text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[140px] truncate font-semibold lg:block">{email}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <>
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-10 bg-transparent"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#118be7] text-sm font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="max-w-[170px] truncate text-sm font-semibold text-slate-900">{email}</p>
                <p className="text-xs text-slate-500">Clinician</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
