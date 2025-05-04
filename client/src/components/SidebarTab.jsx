import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarTab = ({ text, Icon, isActive, to = '', inboxCount = null }) => (
  <NavLink
    end
    to={to}
    className="relative block truncate transition duration-150 h-9"
  >
    {/* {isActive && <div className="absolute h-full w-[3px] bg-indigo-500" />} */}
    <div
      className={`mx-2 rounded-md pl-5 h-full flex items-center justify-between  ${
        isActive ? 'bg-[#FCF1E9]' : ''
      }`}
      role="button"
      tabIndex="0"
    >
      <div className="flex items-center gap-4">
        <div className="w-[1.375rem]">
          <Icon />
        </div>
        <span
          className={`${
            isActive
              ? ' font-medium'
              : 'text-[#667085] group-hover:text-slate-700  font-normal'
          } text-base  leading-tight lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200`}
        >
          {text}
        </span>
        {inboxCount !== null && inboxCount !== 0 && (
          <div className="ml-20 rounded-[5px] w-[1.375rem] h-[1.375rem] bg-indigo-500 text-white p-2.5 flex items-center justify-center text-[13px] font-medium">
            {inboxCount}
          </div>
        )}
      </div>
    </div>
  </NavLink>
);

export default SidebarTab;
