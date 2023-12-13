import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { CreateUserParams, User } from "../../../../Model";

type Props = {
  className?: string;
  state: boolean;
  close: any;
  fetchDataUser: any;
};

const CreateUserModal = ({ className, state, fetchDataUser, close }: Props) => {
  const modal = useRef(null);
  const [newUser, setNewUser] = useState<CreateUserParams>({
    emailAddress: [""],
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    publicMetadata: {},
    privateMetadata: {},
    unsafeMetadata: {},
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setNewUser({ ...newUser, emailAddress: [e.target.value] });
    } else setNewUser({ ...newUser, [name]: value });
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };
  const handleOkay = async () => {
    if (newUser.password !== confirmPassword) {
      toast.error("Passwords must match!");
      return;
    }
    const data = { ...newUser };
    toast.promise(
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: data,
        }),
      }),
      {
        loading: <p className="text-sm">Creating...</p>,
        success: <p className="text-sm">Creating Success!</p>,
        error: <p className="text-sm">Creating Failed!</p>,
      }
    );
    close();
    fetchDataUser();
  };

  return (
    <div
      id="popup-modal"
      className={`fixed top-0 left-0 right-0 z-50 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full flex items-start justify-center ${className} ${
        state ? "animate-slideUpEnter" : "hidden"
      } backdrop-blur-md bg-opacity-40 bg-black`}
      ref={modal}
    >
      <div className="relative w-full max-w-4xl max-h-full">
        <div className="relative mt-52 bg-main-bg border-2 border-zinc-800 rounded-lg shadow-xl shadow-zinc-800 bg-[#212020]">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
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
              />{" "}
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6">
            <label className="block mb-2 text-xl font-medium text-white">
              Full Name
            </label>
            <div className="flex flex-row">
              <input
                type="text"
                name="firstName"
                value={newUser.firstName}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white rounded-lg col-auto py-2 px-3 mr-2"
              />
              <input
                type="text"
                name="lastName"
                value={newUser.lastName}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white rounded-lg col-auto py-2 px-3"
              />
            </div>
            <label className="block mb-2 text-xl font-medium text-white">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={newUser.emailAddress[0] || ""}
              onChange={handleChange}
              className="w-full bg-zinc-800 text-white rounded-lg col-auto py-2 px-3"
            />
            <label className="block mb-2 text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              className="w-full bg-zinc-800 text-white rounded-lg col-auto py-2 px-3"
            />
            <label className="block mb-2 text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              className="w-full bg-zinc-800 text-white rounded-lg col-auto py-2 px-3"
            />
            <label className="block mb-2 text-sm font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full bg-zinc-800 text-white rounded-lg col-auto py-2 px-3"
            />
            <button
              type="button"
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
export default CreateUserModal;
