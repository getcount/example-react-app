/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../assets/images/count-logo.png';
import SidebarTab from './SidebarTab';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={` flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-[#ffffff] transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}

        <div className="h-16 bg-white  inline-flex pl-10   items-center border-b border-black">
          <NavLink end to="/person/invoices?tab=invoices" className="block">
            <img src={Logo} alt="logo" className="h-8" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-between space-y-8 lg:border-r  border-black pt-5 flex-1 pb-4 overflow-auto">
          {/* Pages group */}
          <div>
            <ul className="mt-4 space-y-4 w-full">
              <li className="group  relative">
                <SidebarTab
                  to="/"
                  isActive={pathname === '/'}
                  Icon={() => (
                    <svg
                      width="22"
                      height="19"
                      viewBox="0 0 22 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        pathname === '/'
                          ? ''
                          : 'text-[#667085] group-hover:text-slate-700'
                      }`}
                    >
                      <path
                        d="M21.2675 11.6998H20.8034L18.4152 6.73765H18.7023C19.1069 6.73765 19.4348 6.3969 19.4348 5.97659C19.4348 5.55628 19.1069 5.21553 18.7023 5.21553H11.7103V4.54225C12.4725 4.23569 13.0151 3.46824 13.0151 2.56958C13.0151 1.40252 12.1012 0.453125 10.9778 0.453125C9.85453 0.453125 8.94074 1.40252 8.94074 2.56958C8.94074 3.46814 9.48339 4.23569 10.2453 4.54225V5.21553H3.25366C2.84901 5.21553 2.52114 5.55628 2.52114 5.97659C2.52114 6.3969 2.84901 6.73765 3.25366 6.73765H3.58485L1.19674 11.6998H0.732519C0.327876 11.6998 0 12.0405 0 12.4608C0 15.1934 2.13974 17.4165 4.76997 17.4165C7.40011 17.4165 9.53975 15.1934 9.53975 12.4608C9.53975 12.0405 9.21187 11.6998 8.80723 11.6998H8.3431L5.95519 6.73765H10.2454V17.0275H7.91902C7.51438 17.0275 7.1865 17.3682 7.1865 17.7886C7.1865 18.2089 7.51438 18.5496 7.91902 18.5496H14.1264C14.531 18.5496 14.8589 18.2089 14.8589 17.7886C14.8589 17.3682 14.531 17.0275 14.1264 17.0275H11.7104V6.73765H16.0449L13.657 11.6998H13.1929C12.7882 11.6998 12.4604 12.0405 12.4604 12.4608C12.4604 15.1934 14.6 17.4165 17.2301 17.4165C19.8604 17.4165 22.0001 15.1934 22.0001 12.4608C22 12.0405 21.6721 11.6998 21.2675 11.6998ZM10.9778 1.97515C11.2933 1.97515 11.5501 2.24182 11.5501 2.56958C11.5501 2.89735 11.2933 3.16392 10.9778 3.16392C10.6625 3.16392 10.4058 2.89735 10.4058 2.56958C10.4058 2.24182 10.6625 1.97515 10.9778 1.97515ZM4.76997 15.8944C3.19935 15.8944 1.88111 14.7501 1.54689 13.2219H1.64631L1.64875 13.222L1.65081 13.2219H7.88884L7.89089 13.222L7.89334 13.2219H7.99276C7.65873 14.7502 6.34049 15.8944 4.76997 15.8944ZM2.83446 11.6998L4.76987 7.67832L6.70509 11.6998H2.83446ZM17.23 7.67832L19.1654 11.6998H15.2947L17.23 7.67832ZM17.23 15.8944C15.6595 15.8944 14.3413 14.7501 14.0071 13.2219H14.1066L14.109 13.222L14.1111 13.2219H20.3491L20.3511 13.222L20.3536 13.2219H20.453C20.1189 14.7502 18.8006 15.8944 17.23 15.8944Z"
                        fill="#667085"
                      />
                    </svg>
                  )}
                  text="Chart of Accounts"
                />
              </li>
              <li className="group  relative">
                <SidebarTab
                  to="/create-transaction"
                  isActive={pathname?.includes('/create-transaction')}
                  Icon={() => (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        pathname?.includes('/create-transaction')
                          ? ''
                          : 'text-[#667085] group-hover:text-slate-700'
                      }`}
                    >
                      <path
                        d="M10 0.833008V19.1663"
                        stroke="#667085"
                        strokeWidth="1.11816"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-current fill-current"
                      />
                      <path
                        d="M14.1667 4.16699H7.91667C7.14312 4.16699 6.40125 4.47428 5.85427 5.02126C5.30729 5.56825 5 6.31011 5 7.08366C5 7.85721 5.30729 8.59907 5.85427 9.14605C6.40125 9.69303 7.14312 10.0003 7.91667 10.0003H12.0833C12.8569 10.0003 13.5987 10.3076 14.1457 10.8546C14.6927 11.4016 15 12.1434 15 12.917C15 13.6905 14.6927 14.4324 14.1457 14.9794C13.5987 15.5264 12.8569 15.8337 12.0833 15.8337H5"
                        stroke="#667085"
                        strokeWidth="1.11816"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-current"
                      />
                    </svg>
                  )}
                  text="Create Transaction"
                />
              </li>
              <li className="group  relative">
                <SidebarTab
                  to="/create-bill"
                  isActive={pathname?.includes('/create-bill')}
                  Icon={() => (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        pathname?.includes('/create-bill')
                          ? ''
                          : 'text-[#667085] group-hover:text-slate-700'
                      }`}
                    >
                      <path
                        d="M11 11.1667L14.5714 11.1667"
                        stroke="#667085"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        className="stroke-current"
                      />
                      <path
                        d="M13.8571 9.7381L15.2857 11.1667L13.8571 12.5952"
                        stroke="#667085"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-current"
                      />
                      <path
                        d="M14.7003 8.19704V6.49979C14.7003 4.84293 13.3572 3.49979 11.7003 3.49979H4C2.34315 3.49979 1 4.84293 1 6.49978V8.71998C1 10.3768 2.34315 11.72 4 11.72H9.09564"
                        stroke="#667085"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-current"
                      />
                      <circle
                        cx="7.85016"
                        cy="7.60988"
                        r="1.37003"
                        stroke="#667085"
                        strokeWidth="1.3"
                        className="stroke-current"
                      />
                    </svg>
                  )}
                  text="Create Bill"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
