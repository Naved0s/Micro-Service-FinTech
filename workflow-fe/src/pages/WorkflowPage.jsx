import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CirclePlay } from "lucide-react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkflowPage = () => {
  const [wfName, setWfName] = useState("");
  const [wfDesc, setWfDesc] = useState("");
  const [wfCond, setWfCond] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
   const [response, setResponse] = useState('');
   const navigate = useNavigate()
  const saveWf = () => {
    axios
      .post(`http://192.168.1.37:9093/save`, {
        name: wfName, 
        description: wfDesc,
        priority: 1,
        condition: wfCond,
        actions: code,
      })
      .then(function (response) {
        console.log("This is the save response ",response);
        navigate('/');
      });
    // console.log(wfName,wfCond,wfDesc,code);
  };


  const executeWf = () => {
    if (wfCond === null || !wfCond) {
  setError("Condition is required!");
    return;
    } 
    setError(""); 
      axios
        .post(`http://192.168.1.37:9093/run`, {
          name: wfName,
          description: wfDesc,
          priority: 1,
          condition: wfCond,
          actions: code,
        })
        .then(function (response) {
          console.log("This is execute resposne",response);
          setResponse(response.data);
        }); 
    
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-5 flex flex-row justify-between items-center h-20 w-full">
          <h1 className="text-3xl mt-10">Create a new Workflow</h1>

          <div className="flex flex-row items-center">
            <button
              onClick={saveWf}
              className="bg-[#335294] text-white w-15 h-9 rounded mt-10 mr-10"
            >
              Save
            </button>
            <button onClick={executeWf} className="text-black rounded mt-10">
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
              onChange={(value) => setWfName(value.target.value)}
              value={wfName}
            />
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="Workflow Description"
              onChange={(value) => setWfDesc(value.target.value)}
              value={wfDesc}
            />
          </div>

          <div className="px-10 flex flex-row gap-4 justify-between w-2/3">
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="Condition"
              onChange={(value) => setWfCond(value.target.value)}
              value={wfCond}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Editor
          <div className="w-2/3 m-10 flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="java"
              defaultValue={code}
              theme="vs-dark"
              onChange={(value) => setCode(value)}
            />
          </div> */}
          <div className="flex flex-row flex-1 overflow-hidden">
            <div className="w-2/3 m-10 ">
              <Editor
                height="100%"
                defaultLanguage="Java"
                defaultValue={code}
                theme="vs-dark"
                
                onChange={(value) => setCode(value)}
              />
            </div>
            <div className="border-2 w-screen overflow-hidden p-5 m-5 mb-1 flex-1">
              <h1 className="font-bold">Output:</h1>
                {response}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
