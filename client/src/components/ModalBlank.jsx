import React, { useRef, useEffect } from 'react';
import useClickOutside from 'utils/useClickOutside';
import Transition from './Transition';

function ModalBlank({
  children,
  id,
  modalOpen,
  setModalOpen,
  noClick = false,
  width = '',
}) {
  const modalContent = useRef(null);
  const noClickRef = useRef(noClick);

  useClickOutside(modalContent, () => {
    if (noClickRef.current) return;
    setModalOpen(false);
  });

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    noClickRef.current = noClick;
  }, [noClick]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 dark:bg-slate-500 dark:bg-opacity-40 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className={`bg-white dark:bg-slate-950 rounded shadow-lg overflow-auto  w-full max-h-full ${width || 'max-w-lg'}`}
        >
          {children}
        </div>
      </Transition>
    </>
  );
}

export default ModalBlank;
