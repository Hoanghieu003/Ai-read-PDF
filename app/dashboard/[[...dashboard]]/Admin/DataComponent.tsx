import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Upload } from "@/app/assets/img/Upload";
import Edit from "@/app/assets/img/Edit";
import Trash from "@/app/assets/img/Trash";
import EditAdminModal from "@/app/dashboard/[[...dashboard]]/Admin/Modal/EditAdminModal";
import DeleteAdminModal from "./Modal/DeleteAdminModal";
import CreateAdminModal from "./Modal/CreateAdminModal";

interface DataComponentProps {
    showDataComponent: boolean;
    setShowDataComponent: (showDataComponent: boolean) => void;
  }
  const DataComponent: React.FC<DataComponentProps> = ({
    showDataComponent,
    setShowDataComponent,
  }) => {
  const [data, setData] = useState([]);
  const [csvData, setCsvData] = useState([{ name: "", prompt: "" }]);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(99999999999);

  
  
  const fetchData = async () => {
    try {
      const response = await fetch("/api/data", { method: "GET" });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCSV = (event: any, done: any) => {
    setCsvData(data);
    done(true);
  };
  

  useEffect(() => {
    fetchData();
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
            Switch To User Management
        </button>
    <div className="flex gap-3">
        <button
        className="rounded-lg border-2 border-white px-4 py-2 text-base text-white font-semibold hover:shadow-xl hover:shadow-slate-800 hover:scale-105 duration-500 ease-in-out w-32"
        onClick={() => setCreateModal(true)}
        >
        Create +
        </button>
    {csvData && (
      <CSVLink
        className="rounded-lg border-2 border-white px-4 py-2 text-base text-white font-semibold flex items-center gap-2 hover:shadow-xl hover:shadow-slate-800 hover:scale-105 duration-500 ease-in-out w-32"
        data={csvData}
        asyncOnClick={true}
        onClick={handleCSV}
      >
        Export
        <Upload className="w-4 h-4 fill-white" />
      </CSVLink>
    )}
  </div>
</div>

        <div className="relative overflow-auto">
          <table className="w-full text-sm text-left  text-gray-400">
            <thead className="text-xs  uppercase  text-gray-400 border-b-2 border-gray-700">
              <tr>
                <th scope="col" className="px-2 py-3">
                  Num
                </th>
                <th scope="col" className="px-6 py-3">
                  name
                </th>
                <th scope="col" className="px-6 py-3">
                  Prompt
                </th>
                <th scope="col" className="py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map(
                  (item: { name: string; prompt: string }, index: number) => {
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
                          <p>{item.name}</p>
                        </td>
                        <td className="px-6 py-4 text-white">
                          <p>{item.prompt}</p>
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
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>
      {editModal && (
        <EditAdminModal
          state={editModal}
          close={() => {
            setEditModal(false);
          }}
          index={modalIndex}
          data={data}
        />
      )}
      {deleteModal && (
        <DeleteAdminModal
          state={deleteModal}
          close={() => {
            setDeleteModal(false);
          }}
          index={modalIndex}
          data={data}
        />
      )}
      {createModal && (
        <CreateAdminModal
          state={createModal}
          close={() => {
            setCreateModal(false);
          }}
          data={data}
        />
      )}
    </div>
  );
};
export default DataComponent;
