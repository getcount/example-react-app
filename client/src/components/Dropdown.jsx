import useDropdown from 'hooks/useDropdown';
import { useEffect, useRef, useState } from 'react';
import Loader from './Loader';
import Transition from './Transition';

const Dropdown = ({
  options,
  selected,
  setSelected,
  name,
  idKey = 'id',
  error = false,
  disabled = false,
  className = '',
  placeholder,
  search = false,
  bottomOfTable = false,
  isTableDropdown = false,
  ids = [],
  transitionClass = '',
  handleSearch = null,
  searchPlaceholder = '',
  searchLoading = false,
  setNoClick = () => {},
  overflowHidden = false,
  dropdownClassMain = '',
  label = '',
  resetSearch = () => {},
  required = false,
}) => {
  const searchInput = useRef();
  const [searchValue, setSearchValue] = useState('');

  const {
    trigger,
    dropdown,
    dropdownOpen,
    setDropdownOpen,
    fixedDropdownPositions,
  } = useDropdown(
    isTableDropdown,
    bottomOfTable,
    ids,
    overflowHidden,
    setSearchValue,
    options?.length,
    setNoClick,
  );

  useEffect(() => {
    if (dropdownOpen) {
      searchInput?.current?.focus();
    } else if (search && resetSearch) {
      resetSearch();
    }
  }, [dropdownOpen]);

  return (
    <div className={`${className} w-full text-black dark:text-white`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-1 ${error ? '!text-rose-500' : ''}`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative inline-flex w-full">
        <button
          type="button"
          ref={trigger}
          className={`btn !justify-between min-w-44 w-full bg-white dark:bg-transparent border-slate-800 dark:border-slate-700
           hover:border-slate-800 dark:hover:border-slate-600 text-black hover:text-slate-600 dark:text-slate-300
           dark:hover:text-slate-200 ${error ? '!border-rose-500 dark:!border-rose-500 hover:!border-rose-500 dark:hover:!border-rose-500' : ''}`}
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          aria-expanded={dropdownOpen}
          disabled={disabled}
        >
          <span
            className={`${!selected ? 'text-slate-400 dark:text-slate-500' : ''}`}
          >
            {selected
              ? options?.find((opt) => opt?.[idKey] === selected)?.[name]
              : placeholder || 'Select...'}
          </span>
          <svg
            className={`shrink-0 ml-1 fill-current text-slate-400 ${
              error ? ' !text-rose-500' : ''
            } ${dropdownOpen ? 'rotate-180' : ''}`}
            width="11"
            height="7"
            viewBox="0 0 11 7"
          >
            <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
          </svg>
        </button>
        <Transition
          show={dropdownOpen}
          tag="div"
          className={`${
            bottomOfTable ? 'fixed !w-fit min-w-44' : 'top-full z-10 absolute'
          } left-0 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded shadow-lg overflow-hidden mt-1 ${transitionClass || ''}`}
          enter="transition ease-out duration-100 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-100"
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
          {dropdownOpen && (
            <div
              ref={dropdown}
              className={`font-medium pointer-events-auto flex flex-col py-1.5 ${
                search ? 'max-h-80' : 'max-h-48'
              } scrollbar ${dropdownClassMain}`}
            >
              {search && (
                <div className="relative flex-1 px-3 mb-1">
                  <input
                    type="text"
                    placeholder={searchPlaceholder || 'Search...'}
                    className={`form-input text-indigo-600  placeholder:!text-indigo-600 !border-indigo-600 my-2 !px-8 w-full inline-block font-normal `}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      if (handleSearch) {
                        handleSearch(e.target.value, selected);
                      }
                    }}
                    autoFocus
                    ref={searchInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <svg
                    className="absolute left-3 top-[50%] -translate-y-[50%] pl-2 w-6 h-6 text-indigo-500"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 14.5L11.6667 12.1667M13.3333 8.16667C13.3333 11.2963 10.7963 13.8333 7.66667 13.8333C4.53705 13.8333 2 11.2963 2 8.16667C2 5.03705 4.53705 2.5 7.66667 2.5C10.7963 2.5 13.3333 5.03705 13.3333 8.16667Z"
                      className="stroke-current"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {searchLoading && (
                    <div className="absolute right-6 top-[50%] -translate-y-[50%]">
                      <Loader height="h-5 " width="w-5" fill="" />
                    </div>
                  )}
                </div>
              )}
              <div className="overflow-auto max-h-48 scrollbar">
                {options?.map((option) => (
                  <button
                    key={option?.[idKey]}
                    tabIndex="0"
                    className={`flex items-center w-full hover:bg-slate-50 hover:dark:bg-slate-700/20 py-1 px-3 cursor-pointer ${option?.[idKey] === selected && 'text-indigo-500'}`}
                    onClick={() => {
                      setSelected(option?.[idKey]);
                      setDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <svg
                      className={`shrink-0 mr-2 fill-current text-indigo-500 ${option?.[idKey] !== selected && 'invisible'}`}
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                    >
                      <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                    </svg>
                    <span>{option?.[name]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Transition>
      </div>
      {error && <div className=" text-xs mt-1 text-rose-500">{error}</div>}
    </div>
  );
};

export default Dropdown;
