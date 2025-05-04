/* eslint-disable react/display-name */
import React, { forwardRef, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = forwardRef(
  ({ children, pageId = '', mainClass = '', showSidebar = true }, ref) => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 640);

    return (
      <div className={`flex h-[100dvh] overflow-hidden ${mainClass || ''}`}>
        {/* Sidebar */}

        {showSidebar && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Content area */}
        <div
          id={pageId}
          className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
          ref={ref}
        >
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {children}
        </div>
      </div>
    );
  },
);
export default AppLayout;
