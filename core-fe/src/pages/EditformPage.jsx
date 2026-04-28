import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import DatamodelTableRow from "../components/DatamodelTableRow";
import DatamodelFormPopup from "../components/DatamodelFormPopup";
const EditformPage = () => {
  const params = useParams();
  console.log("This is params", params);

  const location = useLocation();
  const data = location.state || {};
  console.log("This isdata recived:", data);
  data.id = data.id || params.id;
  const [isopen, setIsopen] = useState(false);
  const [applicationName, setApplicationName] = useState('');
  const [description, setDescription] = useState('');
  const [eType, setEType] = useState('');
  const [stageName, setStageName] = useState('');
  const [fields, setFields] = useState([]);
  console.log("this are the fields:", fields);

  const [workflows, setWorkflows] = useState([]);
  const [flows, setFlows] = useState([]);

  const [onApprove, setOnApprove] = useState();
  const [onReject, setOnReject] = useState();
  const [onSubmit, setOnSubmit] = useState();
  const [isedit, setIsEdit] = useState(false);

  const [isworkflowEdited, setIsworkflowEdited] = useState(false);

  const [isFieldsEdited,setIsFieldsEdited] = useState(false);

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
      console.log("This are the merged workflows", merged);

      setWorkflows(merged);
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [flowsRes, workflowsRes] = await Promise.all([
  //         axios.get("http://192.168.1.37:9093/jflows/all"),
  //         axios.get("http://192.168.1.37:9093/all"),
  //       ]);

  //       const merged = [
  //         ...flowsRes.data.map((flow) => ({
  //           id: flow.id,
  //           label: flow.flowName,
  //           type: "Jflow",
  //         })),

  //         ...workflowsRes.data.map((wf) => ({
  //           id: wf.Id,
  //           label: wf.name,
  //           type: "workflow",
  //         })),
  //       ];

  //       setWorkflows(merged);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    fetchData();
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://192.168.1.37:9092/form/${data.id}`);

        const form = res.data;
        console.log("THIS IS FETCHED FORM", res);

        setApplicationName(form.name);
        setDescription(form.description);
        setEType(form.eType);
        setStageName(form.stageName);
        setFields(form.fields); // ✅ fresh fields from DB
        setOnApprove(form.onApproveWorkflowId);
        setOnReject(form.onRejectWorkflowId);
        setOnSubmit(form.onSubmitWorkflowId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchForm();
  }, [params.id]);

  const updateFields = (p) => {
     console.log("Calling api",p);
    
    axios
      .put(`http://192.168.1.37:9092/edit/form/${data.id}/save`, {
       fieldName: p.fieldName,
       fieldType:p.fieldType,
       required:p.required,
       
      })
      .then((response) => {
        console.log("EDITED!");
      });
  };

  const deleteField = (id) => {
    axios
      .delete(`http://192.168.1.37:9092/edit/form/${id}/delete`)
      .then((response) => {
        console.log("Deleted ID", id);
        setFields((prev) => prev.filter((field) => field.id !== id));
        console.log("This are UI rendered Fields", fields);
      });
    console.log("DELETING:", id);
  };
  const updateWorkflows = ({ onsubmit, onapprove, onreject }) => {
    axios
      .patch(`http://192.168.1.37:9092/form/${data.id}/workflows/map`, {
        onSubmitWorkflowId: Number(onsubmit),
        onApproveWorkflowId: Number(onapprove),
        onRejectWorkflowId: Number(onreject),
      })
      .then((response) => {
        console.log("WORKFLOW UPDATED:", onsubmit, onapprove, onreject);
      });
  };
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto items-center">
        <div className="flex flex-row justify-between  items-center">
          <h1 className="text-2xl font-bold">Edit Form: {applicationName}</h1>
          <button
            onClick={() => {
              setIsEdit(!isedit);
              if (isedit) {
                if (isworkflowEdited) {
                  updateWorkflows({
                    onapprove: onApprove,
                    onreject: onReject,
                    onsubmit: onSubmit,
                  });
                } 
              }
              // createform({name:{applicationName },description:{description} , stageName:{stageName},eType:{eType},onapprove:{onApprove},onreject:{onReject},onsubmit:{onSubmit} , fields:{fields}});
              //   createform({
              //     name: applicationName,
              //     description: description,
              //     stageName: stageName,
              //     eType: eType,
              //     onapprove: onApprove,
              //     onreject: onReject,
              //     onsubmit: onSubmit,
              //     fields: fields,
              //   });
            }}
            className="bg-[#335294] text-white p-2 rounded px-4 m-4 active:scale-75"
          >
            {isedit ? "Save" : "Edit"}
          </button>
        </div>
        <div className="mt-10 grid grid-cols-2 w-full max-w-3xl p-10 gap-10 rounded-2xl">
          <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="Application Name"
            value={applicationName}
            onChange={(e) => setApplicationName(e.target.value)}
            disabled={!isedit}
          />

          <input
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isedit}
          />

          <select
            className="h-10 border p-2 rounded-2xl bg-gray-200"
            value={eType}
            onChange={(e) => setEType(e.target.value)}
            disabled={!isedit}
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
            disabled={!isedit}
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
              disabled={!isedit}
            >
              Add
            </button>
            {isopen ? (
              <DatamodelFormPopup
                isopen={isopen}
                onclose={() => setIsopen(false)}
                onsave={(data) => {
                  setFields((prev) => [...prev, data]);
                  console.log("Saving Fields",data);
                  
                   updateFields(data);
                    setIsFieldsEdited(true);
                  //  setIsopen(false);
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
                <DatamodelTableRow
                  key={index}
                  field={field}
                  index={index}
                  iseditable={!isedit}
                  onDelete={(id) => deleteField(field.id)}
                />
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
                  value={onApprove ?? ""}
                  onChange={(e) => {
                    setOnApprove(Number(e.target.value));
                    setIsworkflowEdited(true);
                  }}
                  disabled={!isedit}
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
                  value={onReject ?? ""}
                  onChange={(e) => {
                    setOnReject(Number(e.target.value));
                    setIsworkflowEdited(true);
                  }}
                  disabled={!isedit}
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
                  value={onSubmit ?? ""}
                  onChange={(e) => {
                    setOnSubmit(Number(e.target.value));
                    setIsworkflowEdited(true);
                  }}
                  disabled={!isedit}
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

export default EditformPage;
