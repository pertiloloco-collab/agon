"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/onboarding");
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
        <p className="text-sm text-[#525252]">Your transformation begins here.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#A3A3A3] text-sm">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="bg-[#111111] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] focus:ring-[#C9A84C]/20"
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#A3A3A3] text-sm">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-[#111111] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] focus:ring-[#C9A84C]/20"
          />
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
            "BEGIN TRANSFORMATION"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[#525252]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#C9A84C] hover:text-[#E5D494] transition-colors">
          Enter the arena
        </Link>
      </p>
    </div>
  );
}
