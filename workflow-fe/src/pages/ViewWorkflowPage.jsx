import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import { CirclePlay, Pencil } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const ViewWorkflowPage = () => {
  const param = useParams();
  console.log(param.id);
  const location = useLocation();
const data = location.state || {};

const [updateCode, setUpdateCode] = useState('');//data.action || "");
const [name, setName] = useState('');//data.name || "");
const [desc, setDesc] = useState('');//data.desc || "");
const [cond, setCond] = useState('');//data.cond || "");
  const [response, setResponse] = useState('')

  const [editbool, setEditbool] = useState(false);

  const saveWf = (id) => {
    axios
      .patch(`http://192.168.1.37:9093/update/${id}`, {
        name: name,
        description: desc,
        priority: 1,
        condition: cond,
        actions: updateCode,
      })
      .then(function (response) {
        console.log(response);
        
        executeById(data.id);
      });
    
    
    // console.log(wfName,wfCond,wfDesc,code);
  };

  const executeById = (id) => {
    axios
      .post(`http://192.168.1.37:9093/${data.id}`)
      .then(function (response) {
        console.log(response);
        setResponse(response.data)
      });
  };

useEffect(() => {
  
axios.get(`http://192.168.1.37:9093/${data.id}`).then((response)=>{
  console.log(response.data);
  setUpdateCode(response.data.actions);
  setCond(response.data.condition)
  setName(response.data.name);
  setDesc(response.data.description)
})
}, [])


  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-5 flex flex-row justify-between items-center h-20 w-full">
          <h1 className="text-3xl mt-10">{data.name}</h1>

          <div className="flex flex-row items-center ">
            <h1 className="font-bold">{editbool ? "Edit Mode" : "  "}</h1>

            <button
              onClick={() => setEditbool((prev) => !prev)}
              className="text-black rounded mt-10 active:scale-90 mr-5"
            >
              <Pencil />
            </button>
            <button
              onClick={() => {
                saveWf(data.id);
                // executeById(props.id);
              }}
              className="text-black rounded mt-10 active:scale-90"
            >
              <CirclePlay size={30} />
            </button>
          </div>
        </div>

        {/* Form + Editor Section */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Inputs */}
          <div className="p-10 flex flex-row gap-4 justify-between w-2/3">
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="Workflow Name"
              value={name}
              disabled={!editbool}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="Workflow Description"
              value={desc}
              disabled={!editbool}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="px-10 flex flex-row gap-4 justify-between w-2/3">
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="Condition"
              value={cond}
              disabled={!editbool}
              onChange={(e) => setCond(e.target.value)}
            />
          </div>
          <div className="flex flex-row flex-1 overflow-hidden">
            <div className="w-2/3 m-10 ">
              <Editor
                height="100%"
                defaultLanguage="Java"
                // defaultValue={updateCode}
                value={updateCode}
                theme="vs-dark"
                options={{
                  readOnly: !editbool,
                }}
                onChange={(value) => setUpdateCode(value)}
              />
            </div>
            <div className="border-2 w-screen overflow-hidden p-5 m-5 mb-1 flex-1">
              <h1 className="font-bold">Output:</h1>
                {response}
            </div>
          </div>
          {/* Editor */}
        </div>
      </div>
    </div>
  );
};

export default ViewWorkflowPage;
