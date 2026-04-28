import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ArrowLeftCircle } from "lucide-react";
import Formfieldview from "../components/Formfieldview";
import axios from "axios";

const ViewApplication = () => {
  const param = useParams();
  const [fields, setfields] = useState([])
  const [name,setName] = useState([]);
 
  const [type,setType] = useState([]);
  const navigate = useNavigate();

  console.log("THis is the id ", param.id);

  const getForm = () =>{
    axios.get(`http://192.168.1.37:9092/application/${param.id}`).then((response)=>{
        console.log(response.data);
        setName(response.data.entity.firstName + " "+response.data.entity.lastName)
        setType(response.data.entityType);
        setfields(response.data.fields);
    })
  }

  const reject =() => {
    axios.put(`http://192.168.1.37:9092/app/${param.id}/reject`,{
        "rejectedReason":"Test 1"
    }).then((response)=>{
        console.log("RESPONSE IS ",response);
        getForm();
    })
  }

  

  useEffect(() => {
   getForm();
  }, [])
  

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <ArrowLeftCircle className="mb-5" onClick={() => navigate(-1)} />
        <h1 className="font-bold text-2xl">Application</h1>
        <div className="m-4  flex flex-col gap-10 content-center">
          <div className="flex flex-row justify-between p-4  rounded-2xl bg-[#D9D9D9] mt-6">
            <h1 className="text-xl">Name:{name}</h1>
            <h1 className="text-xl">Type:{type}</h1>
          </div>
        </div>
        <div className=" h-screen m-4 ">
          <div className="flex flex-row justify-end flex-1">
            <button className="bg-[#339494] text-white p-2 rounded px-4 m-4 active:scale-75 w-20">
              Edit
            </button>
            <button className="bg-[#335294] text-white p-2  rounded px-4 m-4 active:scale-75 w-25 ">
              Approve
            </button>
            <button onClick={()=>{
                reject();
            }} className="bg-[#FA1414] text-white p-2 rounded px-4 m-4 active:scale-75 w-20">
              Reject
            </button>
          </div>
          <div  className="grid grid-cols-2 gap-4 mt-2">
           {fields.map((ele,idx)=>{
            return <Formfieldview fieldName={ele.fieldName}  fieldValue={ele.value} required={ele.required} key={ele.id}/>
           })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;
