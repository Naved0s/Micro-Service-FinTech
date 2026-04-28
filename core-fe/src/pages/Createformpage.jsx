import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { BadgePlus } from "lucide-react";
import DatamodelTableRow from "../components/DatamodelTableRow";
import DatamodelFormPopup from "../components/DatamodelFormPopup";
import axios from "axios";

const Createformpage = () => {
  const [isopen, setIsopen] = useState(false);
  const [applicationName, setApplicationName] = useState("");
  const [description, setDescription] = useState("");
  const [eType, setEType] = useState("Person");
  const [stageName, setStageName] = useState("Created");
  const [fields, setFields] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [flows, setFlows] = useState([]);

  const [onApprove, setOnApprove] = useState();
  const [onReject, setOnReject] = useState();
  const [onSubmit, setOnSubmit] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flowsRes, workflowsRes] = await Promise.all([
          axios.get("http://192.168.1.37:9093/jflows/all"),
          axios.get("http://192.168.1.37:9093/all"),
        ]);

        const merged = [
          ...flowsRes.data.map((flow) => ({
            id: flow.id,
            label: flow.flowName,
            type: "Jflow",
          })),

          ...workflowsRes.data.map((wf) => ({
            id: wf.Id,
            label: wf.name,
            type: "workflow",
          })),
        ];

        setWorkflows(merged);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const createform = ({
    name,
    description,
    stageName,
    eType,
    onsubmit,
    onapprove,
    onreject,
    fields,
  }) => {
    axios
      .post("http://192.168.1.37:9092/form/create", {
        name: name,
        description: description,
        stageName: stageName,
        entityType: eType,
        onSubmitWorkflowId: Number(onsubmit),
        onApproveWorkflowId: Number(onapprove),
        onRejectWorkflowId: Number(onreject),
        fields: fields,
      })
      .then((response) => {
        console.log("This is response.data:", response.data);
        console.log("Saved");
      });
    //  console.log(name , description ,stageName,eType ,onsubmit,onapprove,onreject,fields);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto items-center">
        <div className="flex flex-row justify-between  items-center">
          <h1 className="text-2xl font-bold">Create Forms</h1>
          <button
            onClick={() => {
              // createform({name:{applicationName },description:{description} , stageName:{stageName},eType:{eType},onapprove:{onApprove},onreject:{onReject},onsubmit:{onSubmit} , fields:{fields}});
              createform({
                name: applicationName,
                description: description,
                stageName: stageName,
                eType: eType,
                onapprove: onApprove,
                onreject: onReject,
                onsubmit: onSubmit,
                fields: fields,
              });
            }}
            className="bg-[#335294] text-white p-2 rounded px-4 m-4 active:scale-75"
          >
            Save
          </button>
        </div>
        <div className="mt-10 grid grid-cols-2 w-full max-w-3xl p-10 gap-10 rounded-2xl">
          <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="Application Name"
            value={applicationName}
            onChange={(e) => setApplicationName(e.target.value)}
          />

          <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            value={eType}
            onChange={(e) => setEType(e.target.value)}
          >
            <option className="" value="Person">
              Person
            </option>
            <option value="Company">Company</option>
          </select>

          <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="StageName"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
          />

          {/* <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="DataModel ID"
          /> */}

          {/* <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="WorkflowActions"
          /> */}
        </div>
        <div className="h-screen flex w-3/4 flex-col ">
          <div className="flex flex-row justify-between items-center mb-2">
            <h1 className="text-xl font-medium ">Fields</h1>
            <button
              onClick={() => setIsopen(true)}
              className="bg-[#335294] text-white p-2 rounded  active:scale-75"
            >
              Add
            </button>
            {isopen ? (
              <DatamodelFormPopup
                isopen={isopen}
                onclose={() => setIsopen(false)}
                onsave={(data) => {
                  setFields((prev) => [...prev, data]);
                }}
              />
            ) : (
              ""
            )}
          </div>

          <table className="w-full border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2">Id</th>
                <th className="border border-slate-300 p-2">FieldName</th>
                <th className="border border-slate-300 p-2">FieldType</th>
                <th className="border border-slate-300 p-2">Required</th>
                <th className="border border-slate-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <DatamodelTableRow key={index} field={field} index={index} />
              ))}
            </tbody>
          </table>
          <div className=" mt-12 h-screen ">
            {/* <h1 className="text-xl font-bold">Attach Workflow</h1>
            <div className="flex flex-row gap-2 items-center">
              <select
                className="flex-1 h-10 border p-2 m-2 rounded-2xl bg-gray-200"
                value={eType}
                onChange={(e) => setEType(e.target.value)}
                
              >
                <option className="" value="Person">
                  Person
                </option>
                <option value="Company">Company</option>
              </select>
              <select
                className="flex-1 h-10 border p-2 m-2 rounded-2xl bg-gray-200"
                value={eType}
                onChange={(e) => setEType(e.target.value)}
              >
                <option className="" value="Person">
                  Person
                </option>
                <option value="Company">Company</option>
              </select>
              <select
                className="flex-1 h-10 border p-2 m-2 rounded-2xl bg-gray-200"
                value={eType}
                onChange={(e) => setEType(e.target.value)}
              >
                <option className="" value="Person">
                  Person
                </option>
                <option value="Company">Company</option>
              </select>
            </div>
          </div> */}
            <h1 className="text-xl font-bold mb-2">Attach Workflow</h1>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 font-medium">On Approve</label>
                <select
                  className="h-10 border p-2 rounded-2xl bg-gray-200"
                  className="h-10 border p-2 rounded-2xl bg-gray-200"
                  value={onApprove}
                  onChange={(e) => setOnApprove(e.target.value)}
                >
                  {workflows.map((ele, idx) => {
                    return (
                      <option key={idx} value={ele.id}>
                        {`${idx + 1}. ${ele.label} - ${ele.type}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 font-medium">On Reject</label>
                <select
                  className="h-10 border p-2 rounded-2xl bg-gray-200"
                  className="h-10 border p-2 rounded-2xl bg-gray-200"
                  value={onReject}
                  onChange={(e) => setOnReject(e.target.value)}
                >
                  {workflows.map((ele, idx) => {
                    return (
                      <option key={idx} value={ele.id}>
                        {`${idx + 1}. ${ele.label} - ${ele.type}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 font-medium">On Submit</label>
                <select
                  className="h-10 border p-2 rounded-2xl bg-gray-200"
                  className="h-10 border p-2 rounded-2xl bg-gray-200"
                  value={onSubmit}
                  onChange={(e) => setOnSubmit(e.target.value)}
                >
                  {workflows.map((ele, idx) => {
                    return (
                      <option key={idx} value={ele.id}>
                        {`${idx + 1}. ${ele.label} - ${ele.type}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            /{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createformpage;
