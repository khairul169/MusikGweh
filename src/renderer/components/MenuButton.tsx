/* eslint-disable react/jsx-props-no-spreading */
import { FaEllipsisV } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IconType } from 'react-icons';

type Props = {
  items: {
    icon?: IconType;
    title: string;
    onClick(): void;
  }[];
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const MenuButton = ({ items, className, ...props }: Props) => {
  return (
    <Menu
      as="div"
      className={['relative inline-block text-left', className].join(' ')}
      {...props}
    >
      <Menu.Button
        onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
          e.stopPropagation();
        }}
        className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 p-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <FaEllipsisV
          className="h-5 w-5 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 right-0 mt-2 min-w-[180px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            {items.map((item) => (
              <Menu.Item key={item.title}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick();
                    }}
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                  >
                    {item.icon ? <item.icon className="mr-2" /> : null}
                    {item.title}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuButton;
