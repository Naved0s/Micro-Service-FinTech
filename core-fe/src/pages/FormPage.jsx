import { SquarePen, Trash } from "lucide-react";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import Formwidget from "../components/Formwidget";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormPage = () => {
  const navigate = useNavigate();
  const [appList, setAppList] = useState([]);
  useEffect(() => {
    axios.get('http://192.168.1.37:9092/getforms').then((response)=>{
      setAppList(response.data);
    })
  
    
  }, [])

  const nav=()=>{
    navigate('/forms/create');
  }

  
  return (
  <div className="flex flex-1 overflow-hidden">
  <Sidebar />

  <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
    
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Forms</h1>

      <button onClick={nav} className="bg-[#335294] text-white px-4 py-2 rounded active:scale-75">
        Add
      </button>
    </div>

    <div className="mt-6 flex flex-wrap gap-4">
      {appList.map((ele, idx) => (
        <Formwidget
          key={idx}
          id={ele.id}
          applicationName={ele.name}
          desc={ele.description}
          eType={ele.entityType}
          stageName={ele.stageName}
          onSubmitWF={ele.onSubmitWorkflowId}
          onApproveWF={ele.onApproveWorkflowId}
          onRejectWF={ele.onRejectWorkflowId}
          field={ele.fields}
        />
      ))}
    </div>

  </div>
</div>)
};

export default FormPage;
