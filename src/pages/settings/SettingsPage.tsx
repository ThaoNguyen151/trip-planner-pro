import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 rounded-xl bg-muted/40 px-2 py-4 sm:px-4 sm:gap-5 md:px-6 md:py-6 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your app preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose your preferred color theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="size-5 text-muted-foreground" />
              ) : (
                <Sun className="size-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
