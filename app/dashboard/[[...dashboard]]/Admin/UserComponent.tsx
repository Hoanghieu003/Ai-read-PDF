import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Upload } from "@/app/assets/img/Upload";
import Edit from "@/app/assets/img/Edit";
import Trash from "@/app/assets/img/Trash";
import { clerkClient } from "@clerk/nextjs";
import { User } from "../../../Model";
import EditUserModal from "./Modal/EditUserModal";
import DeleteUserModal from "./Modal/DeleteUserModal";
import CreateUserModal from "./Modal/CreateUserModal";
interface UserComponentProps {
  showDataComponent: boolean;
  setShowDataComponent: (showDataComponent: boolean) => void;
}

const UserComponent: React.FC<UserComponentProps> = ({
  showDataComponent,
  setShowDataComponent,
}) => {
  const [user, setUser] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(99999999999);
  const [requestCount, setRequestCount] = useState([]);

  // const fetchDataUser = async () => {
  //   try {
  //     const response = await fetch("/api/user", { method: "GET" });
  //     const user = await response.json();
  //     setUser(user);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const fetchDataUser = async () => {
  //   try {
  //     const response = await fetch("/api/user", { method: "GET" });
  //     const user = await response.json();
  //     await fetchUserRequestCount();
  //     setUser({ ...user });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const fetchUserRequestCount = async () => {
  //   try {
  //     const response = await fetch("/api/request", { method: "GET" });
  //     const data = await response.json();
  //     setRequestCount(data);
  //     console.log("userRequestCount", data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const fetchUserRequestCount = async () => {
  //   try {
  //     const response = await fetch("/api/request", { method: "GET" });
  //     const data = await response.json();
  //     setUser((prevUser) => ({ ...prevUser, requestCount: data.requestCount }));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const fetchDataUser = async () => {
    try {
      const [userResponse, requestCountResponse] = await Promise.all([
        fetch("/api/user", { method: "GET" }),
        fetch("/api/request", { method: "GET" }),
      ]);

      const users = await userResponse.json();
      const data = await requestCountResponse.json();
      // const updatedUsers: User[] = [];

      // const updatedUsers = users.reduce((acc: any, user: any) => {
      //   const requestCount = data.find(
      //     (d: any) => d.userId === user.id
      //   )?.requestCount;
      //   if (requestCount) {
      //     acc.push({ ...user, requestCount });
      //   } else {
      //     acc.push(user);
      //   }
      //   return acc;
      // }, []);
      const updatedUsers = users.reduce((acc: any, user: any) => {
        const requestCountData = data.find((d: any) => d.userId === user.id);
        const updatedUser: User = { ...user };
        if (requestCountData) {
          updatedUser.requestCount = requestCountData.requestCount;
        } else {
          updatedUser.requestCount = 0;
        }
        if (requestCountData) {
          updatedUser.uploadCount = requestCountData.uploadCount;
          updatedUser.uploadTotalMB = requestCountData.uploadTotalMB;
        } else {
          updatedUser.uploadCount = 0;
          updatedUser.uploadTotalMB = 0;
        }

        acc.push(updatedUser);
        return acc;
      }, []);

      setUser(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataUser();
    return () => {};
  }, [createModal, editModal, deleteModal]);
  return (
    <div className="flex flex-col gap-2 items-center overflow-auto mb-2 scrollbar-white scrollbar-thin p-5">
      <div>
        <div className="flex px-2 justify-between gap-3">
          <button
            className="rounded-lg border-2 border-white px-4 py-2 text-base text-white font-semibold hover:shadow-xl hover:shadow-slate-800 hover:scale-105 duration-500 ease-in-out w-50"
            onClick={() => setShowDataComponent(!showDataComponent)}
          >
            Switch To Data Management
          </button>
          <button
            className="rounded-lg border-2 border-white px-4 py-2 text-base text-white font-semibold  hover:shadow-xl hover:shadow-slate-800 hover:scale-105 duration-500 ease-in-out w-32"
            onClick={() => setCreateModal(true)}
          >
            Create +
          </button>
        </div>
        <div className="relative overflow-auto">
          <table className="w-full text-sm text-left  text-gray-400">
            <thead className="text-xs  uppercase  text-gray-400 border-b-2 border-gray-700">
              <tr>
                <th scope="col" className="px-2 py-3">
                  Num
                </th>
                <th scope="col" className="px-2 py-3">
                  User ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Request API Count
                </th>
                <th scope="col" className="px-6 py-3">
                  Upload API Count
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Upload MB
                </th>
                <th scope="col" className="py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {user &&
                user.map((item: User, index: number) => {
                  return (
                    <tr
                      className=" border-b  border-gray-700 hover:bg-gray-600 duration-150 ease-in-out"
                      key={index}
                    >
                      <th
                        scope="row"
                        className="px-2 py-4 font-medium whitespace-nowrap text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="px-6 py-4 text-white">
                        <p>{item.id}</p>
                      </td>
                      <td className="px-6 py-4 text-white">
                        <p>
                          {item.firstName && item.lastName
                            ? `${item.firstName} ${item.lastName}`
                            : " "}
                        </p>{" "}
                      </td>
                      <td className="px-6 py-4 text-white">
                        <p>{item.emailAddresses[0].emailAddress}</p>
                      </td>
                      <td className="px-6 py-4 text-white">
                        <p>{item.requestCount}</p>
                      </td>
                      <td className="px-6 py-4 text-white">
                        <p>{item.uploadCount}</p>
                      </td>
                      <td className="px-6 py-4 text-white">
                        <p>{item.uploadTotalMB.toFixed(3)} MB</p>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setModalIndex(index);
                            setEditModal(true);
                          }}
                          className="mr-2"
                        >
                          <Edit className="fill-white w-auto h-5 hover:fill-blue-500" />
                        </button>
                        <button
                          onClick={() => {
                            setModalIndex(index);
                            setDeleteModal(true);
                          }}
                        >
                          <Trash className="w-3 h-5 fill-red-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {editModal && (
        <EditUserModal
          state={editModal}
          close={() => {
            setEditModal(false);
          }}
          index={modalIndex}
          user={user}
        />
      )}
      {deleteModal && (
        <DeleteUserModal
          state={deleteModal}
          close={() => {
            setDeleteModal(false);
          }}
          index={modalIndex}
          user={user}
        />
      )}
      {createModal && (
        <CreateUserModal
          state={createModal}
          fetchDataUser={fetchDataUser}
          close={() => {
            setCreateModal(false);
          }}
        />
      )}
    </div>
  );
};
export default UserComponent;
