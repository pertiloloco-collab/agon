"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Clock,
  Shield,
  Save,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "Warrior",
    email: "warrior@agon.com",
    wakeUpTime: "05:00",
    timezone: "Europe/Paris",
    accountabilityLevel: "emotional_warfare",
    pushNotifications: true,
    morningProtocol: true,
    eveningDebrief: true,
    sanctionAlerts: true,
  });

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-[#F5F5F5] mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#C9A84C]" />
          SETTINGS
        </h1>
        <p className="text-sm text-[#525252]">Configure your war machine.</p>
      </div>

      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-[#C9A84C]" />
          <h2 className="font-display text-lg text-[#F5F5F5]">PROFILE</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-[#525252]">Name</Label>
            <Input
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] focus:border-[#C9A84C]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-[#525252]">Email</Label>
            <Input
              value={settings.email}
              disabled
              className="bg-[#0A0A0A] border-[#1F1F1F] text-[#525252]"
            />
          </div>
        </div>
      </motion.section>

      {/* Schedule */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-6 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-[#C9A84C]" />
          <h2 className="font-display text-lg text-[#F5F5F5]">SCHEDULE</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-[#525252]">Wake-up Time</Label>
            <Input
              type="time"
              value={settings.wakeUpTime}
              onChange={(e) => setSettings({ ...settings, wakeUpTime: e.target.value })}
              className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] focus:border-[#C9A84C]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-[#525252]">Timezone</Label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#525252]" />
              <Input
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Accountability */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-[#C9A84C]" />
          <h2 className="font-display text-lg text-[#F5F5F5]">ACCOUNTABILITY</h2>
        </div>
        <div className="space-y-3">
          {[
            { value: "firm", label: "Firm", desc: "Encouraging but direct" },
            { value: "drill_sergeant", label: "Drill Sergeant", desc: "In your face, no excuses" },
            { value: "emotional_warfare", label: "Emotional Warfare", desc: "Maximum intensity — uses your deepest motivations" },
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => setSettings({ ...settings, accountabilityLevel: level.value })}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                settings.accountabilityLevel === level.value
                  ? "border-[#C9A84C]/30 bg-[#C9A84C]/10"
                  : "border-[#1F1F1F] bg-[#0A0A0A] hover:border-[#1F1F1F]"
              }`}
            >
              <p className={`text-sm font-medium ${
                settings.accountabilityLevel === level.value ? "text-[#C9A84C]" : "text-[#F5F5F5]"
              }`}>
                {level.label}
              </p>
              <p className="text-xs text-[#525252] mt-1">{level.desc}</p>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-[#C9A84C]" />
          <h2 className="font-display text-lg text-[#F5F5F5]">NOTIFICATIONS</h2>
        </div>
        {[
          { key: "pushNotifications", label: "Push Notifications" },
          { key: "morningProtocol", label: "Morning Protocol (5 AM)" },
          { key: "eveningDebrief", label: "Evening Debrief (9 PM)" },
          { key: "sanctionAlerts", label: "Sanction Alerts" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <span className="text-sm text-[#A3A3A3]">{item.label}</span>
            <Switch
              checked={settings[item.key as keyof typeof settings] as boolean}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, [item.key]: checked })
              }
            />
          </div>
        ))}
      </motion.section>

      {/* Save */}
      <Button className="w-full bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold py-6 text-lg">
        <Save className="w-5 h-5 mr-2" />
        SAVE SETTINGS
      </Button>
    </div>
  );
}
