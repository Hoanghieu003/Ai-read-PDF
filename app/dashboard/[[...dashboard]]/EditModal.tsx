import React, { useContext, useEffect, useRef, useState } from "react";
import { ResultContext } from "./ResultContext";

type Props = {
  className?: string;
  state: boolean;
  close: any;
  index: number;
};

const EditModal = ({ className, state, close, index }: Props) => {
  const modal = useRef(null);
  const { result, setResult } = useContext(ResultContext);
  const [menu_status, setMenuStatus] = useState(state);
  const [text, setText] = useState(result[index]);
  useEffect(() => {
    setMenuStatus(state);
  }, [state]);

  useEffect(() => {
    setText(result[index]);
  }, [index]);

  const handleOkay = () => {
    let tempResult = result;
    result[index] = text;
    setResult(tempResult);
    close();
  };

  // useEffect(() => {
  //   function handleOutsideClick(event: any) {
  //     if (modal?.current && !modal?.current?.contains(event.target)) {
  //       // Clicked outside the div
  //       setMenuStatus(false);
  //     }
  //   }

  //   document.addEventListener('click', handleOutsideClick);

  //   return () => {
  //     document.removeEventListener('click', handleOutsideClick);
  //   };
  // }, [modal]);
  return (
    <div
      id="popup-modal"
      className={`fixed top-0 left-0 right-0 z-50 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full flex items-start justify-center ${className} ${
        menu_status ? "animate-slideUpEnter" : "hidden"
      } backdrop-blur-md bg-opacity-40 bg-black`}
      ref={modal}
    >
      <div className="relative w-full max-w-4xl max-h-full">
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
            <label className="block mb-2 text-sm font-medium  text-white">
              Edit Option
            </label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className="w-full resize-y bg-zinc-800 text-white rounded-lg col-auto py-2 px-3 h-40"
              placeholder="textarea"
            />

            <button
              className="w-full py-3 hover:bg-zinc-800 rounded-md mt-4 text-white"
              onClick={handleOkay}
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
