"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "../icons";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;

    // Update the state and local storage
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));

    // Toggle dark mode class on the HTML element
    document.documentElement.classList.toggle("dark", newMode);
  };

  useEffect(() => {
    // Check if dark mode is enabled in local storage
    const savedDarkMode = localStorage.getItem("darkMode");

    // If user explicitly chose dark or light mode, use that preference
    if (savedDarkMode === "true") {
      toggleDarkMode(); // Toggle dark mode if it was explicitly set to "true"
    } else if (savedDarkMode === "false") {
      // If it was set to "false," ensure light mode is active
      document.documentElement.classList.remove("dark");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // If user hasn't explicitly chosen and system prefers dark mode, enable dark mode
      toggleDarkMode();
    }
  }, []);
  return (
    <button type="button" onClick={toggleDarkMode} className="text-gray-400">
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default DarkModeToggle;
