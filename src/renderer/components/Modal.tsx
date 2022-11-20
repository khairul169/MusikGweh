import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './Button';

export type ModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  title: string;
  children?: React.ReactNode;
  onCancel?: VoidFunction;
  onConfirm?: VoidFunction;
  confirmText?: string;
};

const Modal = (props: ModalProps) => {
  const { isOpen, onClose, title, children, onCancel, onConfirm, confirmText } =
    props;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200 transform"
              enterFrom="opacity-0 translate-y-5"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200 transform"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-10"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-3"
                  >
                    {title}
                  </Dialog.Title>
                )}

                <div>{children}</div>

                <div className="flex gap-4">
                  {onCancel && (
                    <Button className="flex-1 mt-6" onClick={onCancel}>
                      Kembali
                    </Button>
                  )}
                  {onConfirm && (
                    <Button
                      className="flex-1 mt-6"
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                    >
                      {confirmText}
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.defaultProps = {
  confirmText: 'OK',
  children: null,
  onCancel: null,
  onConfirm: null,
};

export default Modal;
