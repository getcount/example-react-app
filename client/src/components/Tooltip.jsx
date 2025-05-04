import React, { useEffect, useRef, useState } from 'react';
import Transition from './Transition';

function Tooltip({
  children,
  className,
  bg,
  size,
  position,
  content = '',
  contentClassName,
  RenderComponent = null,
  tooltipShow = true,
  isFixed = false,
  fixedPosition = 'top',
  ids = [],
}) {
  const trigger = useRef(null);
  const tooltipContent = useRef(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [fixedDropdownPositions, setFixedDropdownPositions] = useState({});

  const positionOuterClasses = (position) => {
    switch (position) {
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'bottom-full left-0';
      case 'top-left':
        return 'bottom-full right-0';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2';
    }
  };

  const sizeClasses = (size) => {
    switch (size) {
      case 'lg':
        return 'min-w-72 p-3';
      case 'md':
        return 'min-w-56 p-3';
      case 'sm':
        return 'min-w-44 p-2';
      default:
        return 'p-2';
    }
  };

  const colorClasses = (bg) => {
    switch (bg) {
      case 'light':
        return 'bg-white text-slate-600 border-slate-200';
      case 'dark':
        return 'bg-slate-700 text-slate-100 border-slate-600';
      default:
        return 'text-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 border-slate-200 dark:border-slate-600';
    }
  };

  const positionInnerClasses = (position) => {
    switch (position) {
      case 'right':
        return 'ml-2';
      case 'left':
        return 'mr-2';
      case 'bottom':
        return 'mt-2';
      default:
        return 'mb-2';
    }
  };

  const getFixedPositionValues = () => {
    const { x, y, height, width } = trigger.current?.getBoundingClientRect();
    const parentHalfWidth = width / 2;
    const tooltipDimensions = tooltipContent.current?.getBoundingClientRect();
    const tooltipHalfWidth = tooltipDimensions?.width / 2;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const values = {
      left:
        x - tooltipHalfWidth + parentHalfWidth > 0 &&
        x + tooltipHalfWidth + parentHalfWidth < windowWidth
          ? x - tooltipHalfWidth + parentHalfWidth
          : x + tooltipHalfWidth + parentHalfWidth > windowWidth // Is Near to Right side
            ? windowWidth - tooltipDimensions?.width - 20 // Align Right side
            : 20, // Align Left side
      top:
        fixedPosition === 'top' && y - tooltipDimensions?.height - 5 > 0
          ? y - tooltipDimensions?.height - 5
          : y + height + tooltipDimensions?.height > windowHeight
            ? windowHeight - tooltipDimensions?.height - 20
            : y + height,
    };
    setFixedDropdownPositions(values);
  };

  useEffect(() => {
    if (isFixed) {
      getFixedPositionValues();
    }

    const handleScroll = () => {
      setTooltipOpen(false);
    };

    const onRemove = () => {
      ids?.forEach((id) => {
        const scrollableDiv = document.getElementById(id);
        if (scrollableDiv) {
          scrollableDiv.removeEventListener('scroll', handleScroll);
        }
      });
    };

    if (isFixed && tooltipOpen) {
      ids?.forEach((id) => {
        const scrollableDiv = document.getElementById(id);
        if (scrollableDiv) {
          scrollableDiv.addEventListener('scroll', handleScroll);
        }
      });
    }

    return () => {
      if (isFixed) {
        onRemove();
      }
    };
  }, [tooltipOpen]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
      onBlur={() => setTooltipOpen(false)}
      ref={trigger}
    >
      {children}
      {/* <button className="block" aria-haspopup="true" aria-expanded={tooltipOpen} onClick={(e) => e.preventDefault()}>
        <svg className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500" viewBox="0 0 16 16">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
        </svg>
      </button> */}
      {tooltipShow && (
        <div
          className={`${isFixed ? 'fixed' : `z-10 absolute ${positionOuterClasses(position)}`} 
              whitespace-nowrap`}
          ref={tooltipContent}
          style={
            isFixed
              ? {
                  top: fixedDropdownPositions?.top,
                  left: fixedDropdownPositions?.left,
                  zIndex: '1000',
                  right: 'none',
                  bottom: 'none',
                }
              : {}
          }
        >
          <Transition
            show={tooltipOpen}
            tag="div"
            className={`rounded border overflow-hidden shadow-lg ${sizeClasses(
              size,
            )} ${colorClasses(bg)} ${positionInnerClasses(
              position,
            )} ${contentClassName}`}
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
          >
            {RenderComponent ? <RenderComponent /> : content}
          </Transition>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
