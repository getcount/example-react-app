import React, { useEffect } from 'react';
import useDropdown from 'hooks/useDropdown';
import Transition from './Transition';

const DropdownProfile = ({
  isTableDropdown = false,
  bottomOfTable = false,
  ids = [],
  overflowHidden = false,
  onLogout,
}) => {
  const {
    trigger,
    dropdown,
    dropdownOpen,
    setDropdownOpen,
    fixedDropdownPositions,
  } = useDropdown(isTableDropdown, bottomOfTable, ids, overflowHidden);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex w-full mt-4">
      <button
        ref={trigger}
        className="flex justify-center items-center group h-12 w-full rounded-lg bg-gradient p-1"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </button>

      <Transition
        className={`${
          bottomOfTable ? 'fixed !w-fit min-w-44' : 'top-full z-10 absolute'
        } left-0 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded shadow-lg overflow-hidden mt-1`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        style={
          bottomOfTable
            ? {
                top: fixedDropdownPositions?.top,
                left: fixedDropdownPositions?.left,
                zIndex: '1000',
              }
            : {}
        }
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-slate-700 text-black dark:text-white ">
            <div className="font-medium">PI Hive</div>
          </div>
          <ul>
            <li>
              <button
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  onLogout();
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default DropdownProfile;
