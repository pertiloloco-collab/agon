"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#8B7432] flex items-center justify-center mx-auto">
          <span className="font-display text-2xl font-bold text-[#050505]">A</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#C9A84C] tracking-wider">
          AGON
        </h1>
        <p className="text-sm text-[#525252]">Enter the arena.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#A3A3A3] text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="warrior@agon.com"
            required
            className="bg-[#111111] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] focus:ring-[#C9A84C]/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#A3A3A3] text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#111111] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] focus:ring-[#C9A84C]/20 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#A3A3A3]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#DC2626]">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold hover:from-[#E5D494] hover:to-[#C9A84C] transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "ENTER THE ARENA"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[#525252]">
        No account yet?{" "}
        <Link href="/register" className="text-[#C9A84C] hover:text-[#E5D494] transition-colors">
          Begin your transformation
        </Link>
      </p>
    </div>
  );
}
