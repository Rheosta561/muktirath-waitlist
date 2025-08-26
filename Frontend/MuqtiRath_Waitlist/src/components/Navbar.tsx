import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "../assets/logo.png";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function Navbar() {
  const { theme } = useTheme();
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  return (
    <div className="w-full fixed top-0 z-30 right-0 left-0 bg-opacity-70  px-4 py-3 border-b border-border bg-background flex items-center justify-between">
      <div className="text-xl font-bold flex items-center gap-4">
        <img
          src={Logo}
          alt="Logo"
          className={`h-10 w-full scale-125 object-cover rounded-full transition duration-300 ${
            theme === "light"
              ? ""
              : "[filter:invert(1)_hue-rotate(195deg)_saturate(100%)]"
          }`}
        />
      </div>

      <div className="hidden md:flex gap-4">
        <a href="#home">
          <Button variant="ghost">Home</Button>
        </a>
        <a href="#about">
          <Button variant="ghost">About</Button>
        </a>
        <a href="#features">
          <Button variant="ghost">Features</Button>
        </a>
        <a href="#waitlist">
          <Button variant="ghost">Volunteer</Button>
        </a>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {hasToken ? (
          <span className="text-xs ">Hi there </span>
        ) : (
          <a href="#waitlist">
            <Button variant="outline">Login</Button>
          </a>
        )}

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
