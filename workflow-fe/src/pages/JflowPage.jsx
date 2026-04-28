import Sidebar from "../components/Sidebar";
import { useState } from "react";
import WorkflowCanvas from "../components/Workflowcanvas";
import { CirclePlay, Play } from "lucide-react";
import axios from "axios";
import { data } from "react-router-dom";
import { useEffect } from "react";
import Custompopup from "../components/Custompopup";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JflowPage = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [jflowName, setJflowName] = useState("");
  const [errors, setErrors] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [availableFlows, setAvailableFlows] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [response, setResponse] = useState('')
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const response = await axios.get("http://192.168.1.37:9093/all");
        // Assume response.data is an array of { id, flowName } – adjust as needed
        console.log("Workflows Fethched:", response.data);

        setAvailableFlows(response.data);
      } catch (error) {
        console.error("Failed to fetch flows:", error);
      }
    };
    fetchFlows();
  }, []);

  const buildJSON = () => {
    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const outgoing = {};
    edges.forEach((e) => {
      if (!outgoing[e.source]) outgoing[e.source] = [];
      outgoing[e.source].push(e);
      console.log("Node pushed:", e);
    });

    const visited = new Set();

    // const buildStep = (nodeId) => {
    //   const node = nodeMap.get(nodeId);

    //   if (!node || visited.has(nodeId)) return null;

    //   visited.add(nodeId);

    //   if (node.data.type === "Conditional") {
    //     const outs = outgoing[nodeId] || [];

    //     const trueEdge = outs.find((e) => e.sourceHandle === "true");
    //     const falseEdge = outs.find((e) => e.sourceHandle === "false");
    //     console.log("This is condition value set from ui", node.data);
    //     return {
    //       type: "Conditional",
    //       condition: node.data.condition,
    //       trueStep: trueEdge ? buildStep(trueEdge.target) : null,
    //       falseStep: falseEdge ? buildStep(falseEdge.target) : null,
    //     };
    //   }
    //   console.log("This is response build into Json:", node.data);

    //   return {
    //     type: node.data.type,
    //     workflowIds: node.data.workflowIds || [],
    //     condition: node.data.condition || true,
    //   };
    // };

    const buildStep = (nodeId) => {
      const node = nodeMap.get(nodeId);
      if (!node) return null;

      const outs = outgoing[nodeId] || [];

      if (node.data.type === "Conditional") {
        const trueEdge = outs.find((e) => e.sourceHandle === "true");
        const falseEdge = outs.find((e) => e.sourceHandle === "false");

        if (trueEdge) usedNodes.add(trueEdge.target);
        if (falseEdge) usedNodes.add(falseEdge.target);

        return {
          type: "Conditional",
          condition: node.data.condition,
          trueStep: trueEdge
            ? {
                type: "Sequential",
                workflowIds:
                  nodeMap.get(trueEdge.target)?.data.workflowIds || [],
              }
            : null,
          falseStep: falseEdge
            ? {
                type: "Sequential",
                workflowIds:
                  nodeMap.get(falseEdge.target)?.data.workflowIds || [],
              }
            : null,
        };
      }

      return {
        type: "Sequential",
        workflowIds: node.data.workflowIds || [],
      };
    };
    const targets = new Set(edges.map((e) => e.target));
    const roots = nodes.filter((n) => !targets.has(n.id));
    const usedNodes = new Set();
    // const steps = roots.map((r) => buildStep(r.id)).filter(Boolean);
    //   const steps = nodes
    // .map((n) => buildStep(n.id))
    // .filter(Boolean);
    //   console.log("This are the steps", steps);
    const steps = nodes
      .map((n) => buildStep(n.id))
      .filter((step, index) => {
        const nodeId = nodes[index].id;
        return !usedNodes.has(nodeId); // 🔥 remove embedded nodes
      })
      .filter(Boolean);

    return {
      Name: jflowName,
      Steps: steps,
    };
  };
  const executejFlow = () => {
    const json = buildJSON();
    console.log("this is the final body", json);
    axios
      .post("http://192.168.1.37:9093/execute/hflow", {
        hypermodel: JSON.stringify(json), // 👈 STRING BODY
      })
      .then((res) => {
        setResponse(res.data);
      });
  };

  const savejflow = () => {
    const json = buildJSON();
    console.log("This is payload", json);

    axios
      .post("http://192.168.1.37:9093/flow/save", {
        hypermodel: JSON.stringify(json), // 👈 STRING BODY
      })
      .then((res) => {
        toast.success("Saved successfully!", { position: "top-right" });
      });
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-5 flex flex-row justify-between items-center h-20 w-full">
          <h1 className="text-3xl mt-10">Create a new Workflow</h1>
        </div>

        {/* Form + Editor Section */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Inputs */}
          <div className="p-10 flex flex-row gap-4 justify-between  items-center">
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="JWorkflow Name"
              onChange={(e) => setJflowName(e.target.value)}
            />
            <div className="flex flex-row items-center justify-between">
              <button
                onClick={() => {
                  if (jflowName === null || jflowName === "") {
                    setErrors(true);
                  } else {
                    savejflow();
                    setErrors(false);
                  }
                }}
                className="bg-[#335294] text-white w-15 h-9 rounded mr-2"
              >
                Save
              </button>
              {/* <div onClick={()=>{
                  executejFlow()
                   setPopupOpen(true)
                 
                   
              }} className="ml-10 active:scale-90">
                <CirclePlay size={30} />
          <Custompopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)}>
             <h2>Welcome!</h2>
        <p>This is your custom content inside the popup.</p>
        </Custompopup>
                
              </div> */}
              <div className="ml-10 active:scale-90">
                <CirclePlay
                  size={30}
                  onClick={() => {
                   
                    executejFlow();
                     setPopupOpen(true);
                  }}
                />

                <ToastContainer/>
              </div>
               <Custompopup
                  isOpen={isPopupOpen}
                  onClose={() => setPopupOpen(false)}
                >
                   <pre>{JSON.stringify(response, null, 2)}</pre>
                </Custompopup>
            </div>
          </div>
          {errors ? (
            <div className="p-5 text-red-500 ">Please give Jflow Name</div>
          ) : (
            ""
          )}

          {/* Workflow Builder */}
          <div className="flex flex-row h-screen border-2 m-5">
            <div className="flex flex-col gap-0.5 bg-black w-1/9 ">
              <div className="text-2xl text-white font-bold">
                <h1>Node</h1>
              </div>
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("type", "Sequential");
                }}
                className="bg-gray-300 p-3 m-2 cursor-move"
              >
                Sequential
              </div>
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("type", "Conditional");
                }}
                className="bg-gray-300 p-3 m-2 cursor-move"
              >
                Conditional
              </div>
            </div>
            <div className="flex-1">
              {" "}
              <WorkflowCanvas
                setSelectedNode={setSelectedNode}
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
              />
            </div>
            <div className="w-1/4 border-l p-4 bg-black text-white">
              <h1 className="font-bold mb-4 text-2xl">Properties</h1>
              {/* 
              {selectedNode ? (
                <div>
                  <p className="mb-2">
                    <strong>Type:</strong> {selectedNode.data.label}
                  </p>

                  {selectedNode.data.label === "Conditional" && (
                    <>
                      <input
                        className="bg-gray-200 p-2 w-full mb-3 text-black"
                        placeholder="Condition"
                        value={selectedNode.data.condition || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          setSelectedNode((prev) => ({
                            ...prev,
                            data: { ...prev.data, condition: value },
                          }));
                          setNodes((nds) =>
                            nds.map((n) =>
                              n.id === selectedNode.id
                                ? {
                                    ...n,
                                    data: {
                                      ...n.data,
                                      condition: value,
                                    },
                                  }
                                : n,
                            ),
                          );
                        }}
                      />

                      <div className="text-sm text-gray-300 mt-2">
                        <p>Define flow using canvas connections:</p>
                        <ul className="list-disc ml-4 mt-2">
                          <li>✔ TRUE → connect to next node</li>
                          <li>✔ FALSE → connect to alternate node</li>
                        </ul>
                      </div>
                    </>
                  )}
                 
                  <input
                    className="bg-gray-200 p-2 w-full mb-2 text-black"
                    placeholder="Workflow Ids (comma separated)"
                    value={selectedNode.data.workflowIds?.join(",") || ""}
                    onChange={(e) => {
                      console.log(e.target.value);

                      const value = e.target.value
                        .split(",")
                        .map((v) => v.trim());

                      // 1. update selected node UI
                      setSelectedNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          workflowIds: value,
                        },
                      }));

                      // 2. update actual graph node (IMPORTANT)
                      setNodes((nds) =>
                        nds.map((n) =>
                          n.id === selectedNode.id
                            ? {
                                ...n,
                                data: {
                                  ...n.data,
                                  workflowIds: value,
                                },
                              }
                            : n,
                        ),
                      );
                    }}
                  />
                </div>
              ) : (
                <p>Select a node</p>
              )} */}
              {selectedNode ? (
                <div>
                  <p className="mb-2">
                    <strong>Type:</strong> {selectedNode.data.label}
                  </p>

                  {selectedNode.data.label === "Conditional" && (
                    <>
                      <input
                        className="bg-gray-200 p-2 w-full mb-3 text-black"
                        placeholder="Condition"
                        value={selectedNode.data.condition || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedNode((prev) => ({
                            ...prev,
                            data: { ...prev.data, condition: value },
                          }));
                          setNodes((nds) =>
                            nds.map((n) =>
                              n.id === selectedNode.id
                                ? {
                                    ...n,
                                    data: { ...n.data, condition: value },
                                  }
                                : n,
                            ),
                          );
                        }}
                      />
                      <div className="text-sm text-gray-300">
                        Connect outputs on canvas:
                        <ul className="list-disc ml-4 mt-2">
                          <li>True → connect to next node</li>
                          <li>False → connect to alternate node</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {selectedNode.data.label === "Sequential" && (
                    <>
                      <label className="text-white text-sm mb-1 block">
                        Select Workflow(s):
                      </label>
                      <select
                        multiple
                        size={5}
                        className="bg-gray-200 p-2 w-full mb-2 text-black rounded"
                        value={selectedNode.data.workflowIds || []}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                          ).map((opt) => opt.value);
                          setSelectedNode((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              workflowIds: selectedOptions,
                            },
                          }));
                          setNodes((nds) =>
                            nds.map((n) =>
                              n.id === selectedNode.id
                                ? {
                                    ...n,
                                    data: {
                                      ...n.data,
                                      workflowIds: selectedOptions,
                                    },
                                  }
                                : n,
                            ),
                          );
                        }}
                      >
                        {availableFlows.map((flow) => (
                          <option key={flow.Id} value={flow.Id}>
                            {flow.name} (ID: {flow.Id})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        Hold Ctrl/Cmd to select multiple
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p>Select a node</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JflowPage;
