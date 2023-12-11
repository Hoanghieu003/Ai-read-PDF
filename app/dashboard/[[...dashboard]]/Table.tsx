import React, { useContext, useState } from "react";
import { ResultContext } from "./ResultContext";
import Trash from "@/app/assets/img/Trash";
import { CSVLink } from "react-csv";
import { Upload } from "@/app/assets/img/Upload";
import ReactMarkdown from "react-markdown";
import EditModal from "./EditModal";
import Edit from "@/app/assets/img/Edit";

type Props = {
  className?: string;
};

const Table = (props: Props) => {
  const { result, setResult } = useContext(ResultContext);
  const [tempState, setTempState] = useState(false);
  const [csvData, setCsvData] = useState([["Num", "Material"]]);
  const [editModal, setEditModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(99999999999);
  const handleDelete = (index: number) => {
    let tempList = result as Array<string>;
    tempList.splice(index, 1);
    setResult(tempList);
    setTempState(!tempState);
  };

  const handleCSV = (event: any, done: any) => {
    let tempData: any = [["Num", "Material"]];
    for (let index = 0; index < result.length; index++) {
      tempData.push([index + 1, result[index]]);
    }
    setCsvData(tempData);
    done(true);
  };

  return (
    <div className={props.className}>
      <div className="flex px-2 justify-end">
        <CSVLink
          className="rounded-lg border-2 border-white px-4 py-2 text-base text-white font-semibold flex items-center gap-2 hover:shadow-xl hover:shadow-slate-800 hover:scale-105 duration-500 ease-in-out w-32"
          data={csvData}
          asyncOnClick={true}
          onClick={handleCSV}
        >
          Export
          <Upload className="w-4 h-4 fill-white" />
        </CSVLink>
      </div>
      <div className="relative overflow-auto">
        <table className="w-full text-sm text-left  text-gray-400">
          <thead className="text-xs  uppercase  text-gray-400 border-b-2 border-gray-700">
            <tr>
              <th scope="col" className="px-2 py-3">
                Num
              </th>
              <th scope="col" className="px-6 py-3">
                Material
              </th>
              <th scope="col" className="py-3">
                Act
              </th>
            </tr>
          </thead>
          <tbody>
            {result &&
              result.map((item: string, index: number) => {
                return (
                  <tr className=" border-b  border-gray-700" key={index}>
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium whitespace-nowrap text-white"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4 text-white">
                      <ReactMarkdown>{item}</ReactMarkdown>
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
                      <button onClick={() => handleDelete(index)}>
                        <Trash className="w-3 h-5 fill-red-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <EditModal
        state={editModal}
        close={() => {
          setEditModal(false);
        }}
        index={modalIndex}
      />
    </div>
  );
};

export default Table;
