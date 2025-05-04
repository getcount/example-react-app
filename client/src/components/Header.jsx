import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-white dark:bg-[#182235] border-b border-black dark:border-slate-700 z-50">
      <div className="relative px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex w-full justify-between lg:justify-end">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              type="button"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
            {/* Header: Right side */}
            <div className="flex items-center space-x-3 ">
              <button
                type="button"
                className="underline font-medium cursor-pointer text-indigo-500 "
                onClick={() => {
                  localStorage.clear();
                  navigate('/signin');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
