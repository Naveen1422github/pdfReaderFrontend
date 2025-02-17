


import { Moon, Sun, Search, BookOpen, Menu, Settings, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '../../login/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}

export function Header({
  darkMode,
  setDarkMode,
  searchText,
  setSearchText,
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header
      className={`fixed top-0 w-full ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow-md z-50`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Welcome Message */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Home className="w-6 h-6" />
              <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search in document..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Search in document"
              />
              <Search
                className={`w-5 h-5 absolute left-3 top-2.5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            {/* Settings Button */}
            <Link
              to="/settings"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to settings"
            >
              <Settings className="w-6 h-6" />
            </Link>

            {/* Vocabulary Section */}
            <Link
              to="/library"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to vocabulary library"
            >
              <BookOpen className="w-6 h-6" />
            </Link>

            {/* Logout Button */}
            {user && (
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>Toggle Theme</span>
              </button>
              <Link
                to="/settings"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <Link
                to="/library"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <BookOpen className="w-5 h-5" />
                <span>Vocabulary</span>
              </Link>
              {user && (
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
    </header>
  );
}