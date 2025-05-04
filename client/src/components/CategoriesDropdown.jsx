import React, { useState, useRef, useEffect } from 'react';
import useDropdown from 'hooks/useDropdown';
import Transition from './Transition';

const ReuseableAccount = ({
  category,
  selectedCategoryId,
  setSelectedCategoryId,
  setDropdownOpen,
  type,
  name = 'id',
}) => (
  <span
    role="button"
    tabIndex="0"
    onClick={(e) => {
      e.stopPropagation();

      if (category?.[name] !== selectedCategoryId) {
        setSelectedCategoryId(category?.[name], category);
      }
      setDropdownOpen(false);
    }}
    className={`font-normal whitespace-normal leading-tight flex items-center pr-4 text-[15px] text-black hover:text-slate-800 dark:hover:text-slate-200 py-1 px-3
            ${
              category?.[name] === selectedCategoryId
                ? 'text-indigo-500 hover:!text-indigo-600'
                : ''
            }`}
  >
    {category?.name}
    {type === 'account' && category?.mask && ` (...${category?.mask})`}
    <svg
      className={`shrink-0 ml-2 fill-current text-indigo-500 ${
        category?.[name] !== selectedCategoryId && 'invisible'
      }`}
      width="12"
      height="9"
      viewBox="0 0 12 9"
    >
      <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
    </svg>
  </span>
);

function CategoriesDropdown({
  allCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  isTableDropdown = false,
  selectedCategory,
  disabled = false,
  type = null,
  allAccounts = null,
  physicalCategoryName = null,
  scrollIntoView = false,
  ids = [],
  bottomOfTable = false,
  transitionClass = '',
  setNoClick = () => {},
  showSubAccount = true,
  placeholderText = 'Select...',
  error = '',
  className = '',
  height = '',
  label = '',
  required = false,
  name = 'id',
}) {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState(
    physicalCategoryName ? allAccounts : [...allCategories],
  );
  const [standardData, setStandardData] = useState([...allCategories]);
  const [isResultFound, setIsResultFound] = useState(true);
  const [transferOptionsOpen, setTransferOptionsOpen] = useState(false);
  const [refundOptionsOpen, setRefundOptionsOpen] = useState(false);
  const [incomeRefundOptionsOpen, setIncomeRefundOptionsOpen] = useState(false);

  const searchInput = useRef(null);
  const scrollRef = useRef(null);

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
    false,
    setSearchValue,
    filteredData,
    setNoClick,
  );

  const mergeCategoriesAndAccounts = (allCategories, allAccounts) => {
    const newFilteredData =
      allCategories?.map((catGroup) => ({
        ...catGroup,
        categories: catGroup.categories.filter(
          (cat) => !cat.name.startsWith('Uncategorized'),
        ),
      })) || [];
    return newFilteredData.map((category) => {
      const matchedAccount = allAccounts?.find(
        (account) => account.name === category.name,
      );
      return matchedAccount
        ? { ...category, categories: matchedAccount.categories }
        : category;
    });
  };

  const getSelectedCategory = () => {
    const selectedCategory = allCategories
      ?.map((grp) => grp.categories)
      .flat()
      .reduce((result, category) => {
        if (result) return result; // Stop searching once a match is found

        if (category?.[name] === selectedCategoryId) {
          return category; // Return category if ID matches
        }

        const matchingSubAccount = category?.subAccounts?.find(
          (subAcc) => subAcc?.[name] === selectedCategoryId,
        );

        return matchingSubAccount || result; // Return subAccount if ID matches
      }, null);
    if (physicalCategoryName) {
      return physicalCategoryName;
    }
    if (
      selectedCategory?.name &&
      selectedCategory.name.startsWith('Uncategorized')
    ) {
      return 'Select Category';
    }
    if (selectedCategory?.mask) {
      return `${selectedCategory?.name} (...${selectedCategory?.mask})`;
    }
    return selectedCategory?.name ? `${selectedCategory?.name}` : '';
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchValue(searchTerm);

    if (!searchTerm) {
      if (allCategories?.length) {
        setIsResultFound(true);
      }
      setStandardData(mergeCategoriesAndAccounts(allCategories, allAccounts));

      const newFilteredData =
        allCategories?.map((catGroup) => ({
          ...catGroup,
          categories: catGroup.categories.filter(
            (cat) => !cat.name.startsWith('Uncategorized'),
          ),
        })) || [];

      if (refundOptionsOpen) {
        setFilteredData([
          newFilteredData.find((item) => item.name === 'Expenses'),
        ]);
      } else if (incomeRefundOptionsOpen) {
        setFilteredData([
          newFilteredData.find((item) => item.name === 'Income'),
        ]);
      } else if (transferOptionsOpen) {
        setFilteredData(allAccounts);
      } else {
        setFilteredData([...newFilteredData]);
      }
      return;
    }

    setIsResultFound(false);
    const formattedValue = searchTerm.replace(/\s/g, '').toLowerCase();

    const result = standardData
      .map((group) => {
        const filteredCategories = group.categories
          .map((category) => {
            const categoryNameMatch = category?.name
              ?.replace(/\s/g, '')
              .toLowerCase()
              .includes(formattedValue);

            // Case 1: If category has subAccounts
            if (
              Array.isArray(category?.subAccounts) &&
              category.subAccounts.length > 0
            ) {
              const matchingSubAccounts = category.subAccounts.filter(
                (subAccount) => {
                  const nameMatch = subAccount?.name
                    ?.replace(/\s/g, '')
                    .toLowerCase()
                    .includes(formattedValue);

                  return nameMatch;
                },
              );

              if (categoryNameMatch || matchingSubAccounts.length > 0) {
                return {
                  ...category,
                  subAccounts:
                    matchingSubAccounts.length > 0
                      ? matchingSubAccounts
                      : category.subAccounts,
                };
              }

              return null;
            }

            // Case 2: Flat account (no subAccounts)
            const flatNameMatch = category?.name
              ?.replace(/\s/g, '')
              .toLowerCase()
              .includes(formattedValue);

            if (flatNameMatch) {
              return category;
            }

            return null;
          })
          .filter(Boolean);

        if (filteredCategories.length > 0) {
          setIsResultFound(true);
        }

        return {
          ...group,
          categories: filteredCategories,
        };
      })
      .filter((group) => group.categories.length > 0);

    setFilteredData(result);
  };

  const filterUncategorized = () => {
    const newFilteredData =
      allCategories?.map((catGroup) => ({
        ...catGroup,
        categories: catGroup.categories.filter(
          (cat) => !cat.name.startsWith('Uncategorized'),
        ),
      })) || [];
    if (type === 'Income' && !refundOptionsOpen) {
      const expensesRemoved = newFilteredData.filter(
        (category) => category.name !== 'Expenses',
      );
      setFilteredData([...expensesRemoved]);
      setStandardData(mergeCategoriesAndAccounts(allCategories, allAccounts));
    } else if (type === 'Expense') {
      const incomeRemoved = newFilteredData.filter(
        (category) => category.name !== 'Income',
      );
      setFilteredData([...incomeRemoved]);
      setStandardData(mergeCategoriesAndAccounts(allCategories, allAccounts));
    } else {
      setFilteredData([...newFilteredData]);
      setStandardData(mergeCategoriesAndAccounts(allCategories, allAccounts));
    }
  };

  useEffect(() => {
    filterUncategorized();
    if (allCategories?.length === 0) {
      setIsResultFound(false);
    } else {
      setIsResultFound(true);
    }
  }, [allCategories]);

  useEffect(() => {
    if (dropdownOpen) {
      setSearchValue('');
      if (!physicalCategoryName && !selectedCategory?.type === 'Expenses') {
        filterUncategorized();
      }
      if (allCategories?.length) {
        setIsResultFound(true);
      }
      if (window.innerWidth >= 768) {
        searchInput.current?.focus();
      }
    } else {
      setTransferOptionsOpen(false);
      setRefundOptionsOpen(false);
      setIncomeRefundOptionsOpen(false);
    }
    if (!dropdownOpen) {
      setSearchValue('');
      filterUncategorized();
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (scrollIntoView) {
      if (dropdownOpen && scrollIntoView) {
        dropdown.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [dropdownOpen]);

  return (
    <div className={`${className} text-black w-full`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-1 ${error ? '!text-rose-500' : ''}`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative inline-flex w-full">
        <button
          ref={trigger}
          disabled={disabled}
          className={`btn !justify-between min-w-44 w-full bg-white dark:bg-transparent border-black dark:border-slate-700
         hover:border-slate-800 dark:hover:border-slate-600 text-slate-black hover:text-slate-600 dark:text-slate-300
         dark:hover:text-slate-200 ${height} ${error ? '!border-rose-500 dark:!border-rose-500 hover:!border-rose-500 dark:hover:!border-rose-500' : ''}`}
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
            setSearchValue('');
          }}
          aria-expanded={dropdownOpen}
          type="button"
        >
          <div className="flex items-center truncate w-full justify-between gap-1">
            <span
              className={`truncate ${!selectedCategoryId ? 'text-slate-400 dark:text-slate-500' : ''}`}
            >
              {selectedCategoryId === null
                ? placeholderText
                : getSelectedCategory()}
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
          </div>
        </button>

        <Transition
          tag="div"
          className={`${
            bottomOfTable ? 'fixed !w-fit min-w-44' : 'top-full z-10 absolute'
          } left-0 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded shadow-lg overflow-hidden mt-1 ${transitionClass || ''}`}
          style={
            bottomOfTable
              ? {
                  top: fixedDropdownPositions?.top,
                  left: fixedDropdownPositions?.left,
                  zIndex: '1000',
                }
              : {}
          }
          show={dropdownOpen}
          enter="transition ease-out duration-200 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        >
          {dropdownOpen && (
            <div ref={dropdown} className="flex flex-col py-1.5">
              <div className="relative flex-1 px-3 mb-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-input text-indigo-600  placeholder:!text-indigo-600 !border-indigo-600  my-2 !pl-8 w-full inline-block"
                  value={searchValue}
                  onChange={handleSearch}
                  autoFocus
                  ref={searchInput}
                  onClick={(e) => e.stopPropagation()}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 pl-2 w-6 h-6"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 14.5L11.6667 12.1667M13.3333 8.16667C13.3333 11.2963 10.7963 13.8333 7.66667 13.8333C4.53705 13.8333 2 11.2963 2 8.16667C2 5.03705 4.53705 2.5 7.66667 2.5C10.7963 2.5 13.3333 5.03705 13.3333 8.16667Z"
                    stroke="#E48642"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                className="max-h-40 overflow-y-auto pointer-events-auto scrollbar overflow-x-auto sm:overflow-x-hidden w-full flex flex-col scrollbar pt-2"
                ref={scrollRef}
              >
                {filteredData?.map(
                  (group) =>
                    group?.name.toLowerCase() !== 'custom' &&
                    group?.categories?.length > 0 && (
                      <div
                        key={group.id}
                        className="cursor-default	mb-2"
                        onClick={(e) => e.stopPropagation()}
                        role="button"
                        tabIndex="0"
                      >
                        <span className="font-semibold text-[12px] uppercase tracking-wider whitespace-nowrap flex items-center pr-4  text-black  py-1 px-3">
                          {group?.name}
                        </span>
                        {group?.categories?.map((category) => (
                          <div
                            key={category.id}
                            className="ml-2 cursor-pointer"
                          >
                            <ReuseableAccount
                              category={category}
                              selectedCategoryId={selectedCategoryId}
                              setSelectedCategoryId={setSelectedCategoryId}
                              setDropdownOpen={setDropdownOpen}
                              type={type}
                              name={name}
                            />
                            {showSubAccount &&
                              category?.subAccounts?.length > 0 && (
                                <div className="pl-4">
                                  {category?.subAccounts?.map((subAccount) => (
                                    <ReuseableAccount
                                      key={subAccount?.id}
                                      category={subAccount}
                                      selectedCategoryId={selectedCategoryId}
                                      setSelectedCategoryId={
                                        setSelectedCategoryId
                                      }
                                      setDropdownOpen={setDropdownOpen}
                                      type={type}
                                      name={name}
                                    />
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    ),
                )}
                {!isResultFound && (
                  <span className="whitespace-nowrap text-center font-bold pr-4 text-sm text-slate-600 text-opacity-60 dark:text-slate-300 py-1 px-4">
                    No Option
                  </span>
                )}
              </div>
            </div>
          )}
        </Transition>
      </div>
      {error && <div className=" text-xs mt-1 text-rose-500">{error}</div>}
    </div>
  );
}

export default CategoriesDropdown;
