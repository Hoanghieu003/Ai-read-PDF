import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { User } from "../../../../Model";

type Props = {
  className?: string;
  state: boolean;
  close: any;
  user: User[];
  index: number;
};

const DeleteUserModal = ({ className, state, close, user, index }: Props) => {
  const modal = useRef(null);

  const handleOkay = async () => {
    toast.promise(
      fetch("/api/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user[index].id,
        }),
      }),
      {
        loading: <p className="text-sm">Deleting...</p>,
        success: <p className="text-sm">Delete item success!</p>,
        error: <p className="text-sm">Could not delete.</p>,
      }
    );
    close();
  };

  return (
    <div
      id="popup-modal"
      className={`fixed top-0 left-0 right-0 z-50 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full flex items-start justify-center ${className} ${
        state ? "animate-slideUpEnter" : "hidden"
      } backdrop-blur-md bg-opacity-40 bg-black`}
      ref={modal}
    >
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative mt-52 bg-main-bg border-2 border-zinc-800 rounded-lg shadow-xl shadow-zinc-800 bg-[#212020]">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
            onClick={close}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6">
            <label className="block mb-2 text-xl font-bold  text-red-600 ">
              Delete Option
            </label>
            <p className="text-white text-center">Are you sure to delete ?</p>
            <div className="flex justify-around">
              <button
                className="py-1 px-2 border border-white text-center w-2/5 hover:bg-zinc-800 rounded-md mt-4 text-white"
                onClick={close}
              >
                Cancel
              </button>
              <button
                className="border border-white py-1 px-3 text-center w-2/5 hover:bg-red-700  duration-150 ease-in-out rounded-md mt-4 bg-red-600 text-white font-bold"
                onClick={handleOkay}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
