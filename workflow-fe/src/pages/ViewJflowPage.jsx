import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import WorkflowCanvas from "../components/Workflowcanvas";
import { useLocation, useParams } from "react-router-dom";
import { CirclePlayIcon } from "lucide-react";
import { useEffect } from "react";
import Custompopup from "../components/Custompopup";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewJflowPage = () => {
  const params = useParams();
  const location = useLocation();
  const data = location.state || {};
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isedit, setIsedit] = useState(false);
  const [availableFlows, setAvailableFlows] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [response, setResponse] = useState("");

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

  // const [flowJson, setFlowJson] = useState(() => {
  //   return typeof data.json === "string" ? JSON.parse(data.json) : data.json;
  // });

  const [flowJson, setFlowJson] = useState(() => {
    // if (!data.json) {
    //   return { Steps: [] }; // ✅ prevents crash
    // }

    // try {
    //   return typeof data.json === "string" ? JSON.parse(data.json) : data.json;
    // } catch (e) {
    //   console.error("Invalid JSON:", e);
    //   return { Steps: [] }; // ✅ fallback
    // }
    if (!data.json) return { Steps: [] };
    try {
      // Parse the outer JSON string
      let parsed =
        typeof data.json === "string" ? JSON.parse(data.json) : data.json;
      // If there's a hypermodel wrapper, parse the inner string
      if (parsed.hypermodel) {
        parsed = JSON.parse(parsed.hypermodel);
      }
      // Ensure Steps exists
      return parsed.Steps ? parsed : { Steps: [] };
    } catch (e) {
      console.error("Invalid JSON:", e);
      return { Steps: [] };
    }
  });

  const [flowName, setFlowName] = useState(data.name);
  const [selectedNode, setSelectedNode] = useState(null);

  const buildJSON = () => {
    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const outgoing = {};
    edges.forEach((e) => {
      if (!outgoing[e.source]) outgoing[e.source] = [];
      outgoing[e.source].push(e);
    });

    const usedNodes = new Set();

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
          condition: node.data.condition || "1==1",
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

    const steps = nodes
      .map((n) => buildStep(n.id))
      .filter((step, index) => {
        const nodeId = nodes[index].id;
        return !usedNodes.has(nodeId);
      })
      .filter(Boolean);

    return {
      Name: flowName,
      Steps: steps,
    };
  };

  const updateJflow = () => {
    const updatedJson = buildJSON();
    axios.patch(`http://192.168.1.37:9093/flow/update/${data.id}`, {
      hypermodel: JSON.stringify(updatedJson), // adjust payload as per your API
    }).then(()=>{
      toast.success("Updated Successfully");
    });
    // Optionally update local flowJson state to reflect saved data
    setFlowJson(updatedJson);
    setIsedit(false);
  };

  const triggerJflow = () => {
    const updatedJson = buildJSON();
    console.log("This is buildJson Sending post body", updatedJson);

    axios
      .post(`http://192.168.1.37:9093/execute/hflow`, {
        hypermodel: JSON.stringify(updatedJson), // adjust payload as per your API
      })
      .then((response) => {
        setResponse(response.data);
      });
    // Optionally update local flowJson state to reflect saved data
    setFlowJson(updatedJson);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-5 flex flex-row justify-between items-center h-20 w-full">
          <h1 className="text-3xl mt-10">{flowName}</h1>
        </div>
        <ToastContainer/>
        {/* Form + Editor Section */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Inputs */}
          <div className="p-10 flex flex-row gap-4 justify-between  items-center">
            <input
              type="text"
              className="bg-[#D9D9D9] h-12 w-1/3 p-2 rounded"
              placeholder="Workflow Name"
              value={flowName}
              disabled={!isedit}
              onChange={(e) => {
                setFlowName(e.target.value);
              }}
            />
            <div className="flex flex-row gap-1 items-center">
              <button
                onClick={() => {
                  setIsedit(!isedit);
                  if (isedit) {
                    //save the new Jflow
                    updateJflow();
                  } else {
                    setIsedit(true);
                  }
                }}
                className="bg-[#335294] text-white w-15 h-9 rounded "
              >
                {isedit ? "Save" : "Edit"}
              </button>
              <button
                onClick={() => {
                  triggerJflow();
                  setPopupOpen(true);
                }}
                className="pl-10 active:scale-90"
              >
                <CirclePlayIcon size={30} />
              </button>

              <Custompopup
                isOpen={isPopupOpen}
                onClose={() => setPopupOpen(false)}
              >
                {/* <h1>Output:</h1>
              <h2>{response}</h2> */}
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </Custompopup>
            </div>
          </div>

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
                flowJson={flowJson}
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
                isEditable={isedit}
              />
            </div>
            <div className="w-1/4 border-l p-4 bg-black text-white">
              <h1 className="font-bold mb-4 text-2xl">Properties</h1>

              {/* {selectedNode ? (
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
                      <input
                        className="bg-gray-200 p-2 w-full mb-2 text-black"
                        placeholder="Workflow Id"
                        value={selectedNode.data.workflowIds?.join(",") || ""}
                      />
                    </>
                  )}
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
                        disabled={!isedit}
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
                        disabled={!isedit}
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

export default ViewJflowPage;
