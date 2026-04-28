import { React, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [];
const initialEdges = [];
let id = 0;
const getId = () => `${id++}`;

const ConditionalNode = ({ data }) => {
  return (
    <div className="bg-yellow-200 p-3 rounded border w-40 text-center">
      <div className="font-bold">Conditional</div>
      <div className="text-xs">{data.condition || "No condition"}</div>

      {/* input */}
      <Handle type="target" position={Position.Top} />

      {/* TRUE */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: "25%", background: "green" }}
      />

      {/* FALSE */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: "75%", background: "red" }}
      />
    </div>
  );
};

const buildFlow = (steps) => {
  let nodes = [];
  let edges = [];
  let y = 0;
  let x = 250;
  let id = 0;



  const getId = () => `${id++}`;

  // const processStep = (step, parentId = null, branch = "") => {
  //     if (!step) return null;
  //   const nodeId = getId();

  //   // Create node
  //   nodes.push({
  //     id: nodeId,
  //     // data: {
  //     //   label: step.type,
  //     //   condition: step.condition || "",
  //     //   workflowIds: step.workflowIds || [],
  //     // },
  //     data: {
  //       type:  step.type === "Conditional" ? "conditional" : undefined,//step.type,
  //       label: step.type,
  //       condition: step.condition || "",
  //       workflowIds: step.workflowIds || [],
  //     },
  //     position: { x, y },
  //   });

  //   // Connect to parent
  //   if (parentId) {
  //     edges.push({
  //       id: `${parentId}-${nodeId}`,
  //       source: parentId,
  //       target: nodeId,
  //       label: branch,
  //     });
  //   }

  //   y += 100;

  //   // Handle Conditional
  //   if (step.type === "Conditional") {
  //     processStep(step.trueStep, nodeId, "True");

  //     const prevX = x;
  //     x += 200; // move right for false branch
  //     processStep(step.falseStep, nodeId, "False");
  //     x = prevX;
  //   }

  //   return nodeId;
  // };
const processStep = (step, parentId = null, branch = "") => {
  if (!step) return null;

  const nodeId = getId();

  nodes.push({
    id: nodeId,
    type: step.type === "Conditional" ? "conditional" : undefined,
    data: {
      type: step.type,
      label: step.type,
      condition: step.condition || "",
      workflowIds: step.workflowIds || [],
    },
    position: { x, y },
  });

  if (parentId) {
    edges.push({
      id: `${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      label: branch,
      sourceHandle: branch.toLowerCase(), // ✅ critical for JSON export
    });
  }

  y += 100;

  if (step.type === "Conditional") {
    if (step.trueStep) {
      processStep(step.trueStep, nodeId, "True");
    }
    if (step.falseStep) {
      const prevX = x;
      x += 200;
      processStep(step.falseStep, nodeId, "False");
      x = prevX;
    }
  }

  return nodeId;
};
  let prevNodeId = null;
  steps.forEach((step) => {
     if (!step) return;
    const currentId = processStep(step, prevNodeId);
    prevNodeId = currentId;
  });

  return { nodes, edges };
};

const nodeTypes = {
  conditional: ConditionalNode,
};

const Workflowcanvas = ({
  setSelectedNode,
  nodes,
  setNodes,
  edges,
  setEdges,
  flowJson,
  isEditable = true
}) => {
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [],
  // );
  const onNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = useCallback((params) => {
    const label =
      params.sourceHandle === "true"
        ? "True"
        : params.sourceHandle === "false"
          ? "False"
          : "";

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          label,
        },
        eds,
      ),
    );
  }, []);
  const deleteNode = (nodeId) => {
    setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
  };

  // useEffect(() => {
  //   if (flowJson) {
  //     const { nodes, edges } = buildFlow(flowJson.Steps);
  //     setNodes(nodes);
  //     setEdges(edges);
  //   }
  // }, [flowJson]);
  
  useEffect(() => {
  if (flowJson && flowJson.Steps) {
    const { nodes, edges } = buildFlow(flowJson.Steps);
    setNodes(nodes);
    setEdges(edges);
  }
}, [flowJson]);
  
  const onDrop = (event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("type");

    const position = {
      x: event.clientX - 250,
      y: event.clientY - 100,
    };

    const newNode = {
      id: getId(),
      position,
      //This is what need to be passed to API
      // data: {
      //   label: type,
      //   seq: id,
      //   condition: "",
      //   // trueStep: "",
      // },
      data: {
        type,
        label: type,
        condition: "",
        workflowIds: [],
      },
      type: type === "Conditional" ? "conditional" : "default",
    };

    setNodes((nds) => [...nds, newNode]);
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        onNodeClick={(event, node) => {
          setSelectedNode(node);
          //checking clikc event how to work with node values
          const output = {
            // seq: node.data.seq,
            // condition: node.data.condition || "1==1",
            // true: node.data.trueStep || "1",
            type: node.data.type,
            condition: node.data.condition || "",
          };

          console.log(output);
        }}
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        // onConnect={isEditable ? onConnect : undefined}
        // onNodesChange={isEditable ? onNodesChange : undefined}
        // onEdgesChange={isEditable ? onEdgesChange : undefined}
        // onDrop={isEditable ? onDrop : undefined}
        // onDragOver={isEditable ? onDragOver : undefined}
        deleteKeyCode={["Backspace", "Delete"]}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Workflowcanvas;
