import { useEffect, useState } from 'react';

let searchTimeout = null;

const useBasicDropdownSearch = ({ options = [], key = 'name' } = {}) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    if (options?.length > 0) {
      setDropdownOptions([...options]);
    }
  }, [options]);

  const handleDropdownSearch = (value, selectedId) => {
    clearTimeout(searchTimeout);
    if (value) {
      searchTimeout = setTimeout(() => {
        const filteredOptions = options?.filter((option) =>
          option?.[key]
            ?.toLowerCase()
            ?.replace(/\s+/g, '')
            ?.includes(value.toLowerCase()?.replace(/\s+/g, '')),
        );
        // const isInSearchData = filteredOptions?.filter(
        //   (c) => c?.id === selectedId,
        // );
        // const selectedCustomer = options?.find((c) => c?.id === selectedId);

        // if (isInSearchData?.length === 0 && selectedCustomer) {
        //   setDropdownOptions([selectedCustomer, ...filteredOptions]);
        // } else {
        setDropdownOptions(filteredOptions);
        // }
      }, 100);
    } else {
      setDropdownOptions([...options]);
    }
  };

  const resetDropdownSearch = () => {
    setDropdownOptions([...options]);
  };

  return {
    dropdownOptions,
    setDropdownOptions,
    handleDropdownSearch,
    resetDropdownSearch,
  };
};

export default useBasicDropdownSearch;
