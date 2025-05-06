import { useEffect, useRef, useState } from 'react';
import useClickOutside from '../utils/useClickOutside';

const useDropdown = (
  isTableDropdown = false,
  bottomOfTable = false,
  ids = [],
  overflowHidden = false,
  setSearchValue = () => {},
  optionsLength = 0,
  setNoClick = () => {},
) => {
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fixedDropdownPositions, setFixedDropdownPositions] = useState({});

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
      setSearchValue('');
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
      setSearchValue('');
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useClickOutside(dropdown, (event) => {
    if (!trigger.current.contains(event.target))
      if (dropdownOpen) {
        setDropdownOpen(false);
        setSearchValue('');
      }
  });

  const getFixedPositionValues = () => {
    const { x, y, height } = trigger.current?.getBoundingClientRect();
    const dropdownDimensions = dropdown.current?.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const values = {
      left:
        x + dropdownDimensions?.width > windowWidth
          ? windowWidth - dropdownDimensions?.width - 20
          : x,
      top:
        y + height + dropdownDimensions?.height + 10 < windowHeight &&
        !fixedDropdownPositions?.isTop
          ? y + height
          : y - dropdownDimensions?.height - 10 > 0
            ? y - dropdownDimensions?.height - 10
            : windowHeight - dropdownDimensions?.height - 20,
      isTop: !dropdownOpen
        ? false
        : !fixedDropdownPositions?.isTop
          ? y + height + dropdownDimensions?.height + 10 > windowHeight &&
            y - dropdownDimensions?.height - 10 > 0
          : fixedDropdownPositions?.isTop,
    };
    setFixedDropdownPositions(values);
  };

  useEffect(() => {
    if (bottomOfTable) {
      if (dropdownOpen) {
        setNoClick(true);
        ids?.forEach((id) => {
          const ele = document.getElementById(id);
          if (ele) {
            if (overflowHidden) {
              ele.style.overflow = 'hidden';
            }
            ele.style.pointerEvents = 'none';
          }
        });
      } else {
        setNoClick(false);
        ids?.forEach((id) => {
          const ele = document.getElementById(id);
          if (ele) {
            if (overflowHidden) {
              ele.style.overflow = 'auto';
            }
            ele.style.pointerEvents = 'auto';
          }
        });
      }
      getFixedPositionValues();
      return () => {
        setNoClick(false);
        ids?.forEach((id) => {
          const ele = document.getElementById(id);
          if (ele) {
            if (overflowHidden) {
              ele.style.overflow = 'auto';
            }
            ele.style.pointerEvents = 'auto';
          }
        });
      };
    }
  }, [dropdownOpen]);

  useEffect(() => {
    getFixedPositionValues();
  }, [optionsLength]);

  useEffect(() => {
    if (isTableDropdown) {
      const mouseMoveHandler = ({ clientX, clientY }) => {
        if (!dropdown.current) {
          return;
        }
        const { left, top, width, height } =
          dropdown?.current?.getBoundingClientRect();
        const offsetX = Math.max(clientX - (left + width), left - clientX);
        const offsetY = Math.max(clientY - (top + height), top - clientY);
        const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
        if (dropdownOpen && distance > 300) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousemove', mouseMoveHandler);
      return () => document.removeEventListener('mousemove', mouseMoveHandler);
    }
  }, [dropdownOpen]);

  return {
    trigger,
    dropdown,
    dropdownOpen,
    setDropdownOpen,
    fixedDropdownPositions,
    setFixedDropdownPositions,
  };
};

export default useDropdown;
