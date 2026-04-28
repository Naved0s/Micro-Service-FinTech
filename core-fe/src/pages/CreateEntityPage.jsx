import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftCircle, ArrowLeftFromLine } from "lucide-react";
import axios from "axios";

const CreateEntityPage = () => {
  const location = useLocation();
  const data = location.state || {};
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState(data.name || "");
  const [middlename, setMiddleName] = useState(data.middleName || "");
  const [lastname, setLastName] = useState(data.lastName || "");
  const [email, setEmail] = useState(data.email || "");
  const [govid, setGovId] = useState(data.govid || "");
  const [dob, setDob] = useState(data.dob || "");

  const updateEntity =()=>{
      axios.put(`http://192.168.1.37:9092/update/indi/${data.id}`,{
        firstName: firstname,
        middleName:middlename,
        lastName:lastname,
        email:email,
        gov_id:govid,
        dob:dob
      }).then((response)=>{
        console.log("DATA UPDATED");
        
      })
  } 

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <ArrowLeftCircle className="mb-5" onClick={() => navigate(-1)} />
        <h1 className="font-bold text-2xl">Edit an Entity</h1>
        <div className="m-4  flex flex-col gap-10 content-center">
          <div className="flex flex-row justify-between p-4  rounded-2xl bg-[#D9D9D9] mt-6">
            <h1 className="text-xl">Name:{firstname}</h1>
            <h1 className="text-xl">Type:{data.type}</h1>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 w-full max-w-3xl">
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="FirstName"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="MiddleName"
                value={middlename}
                onChange={(e) => setMiddleName(e.target.value)}
              />

              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="LastName"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="GovId"
                value={govid}
                onChange={(e) => setGovId(e.target.value)}
              />
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="DOB(YYYY-MM-DD)"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                type="date"
               
              />
            </div>
            
          </div>
          <div className="flex justify-center">
            <button onClick={updateEntity} className="bg-[#335294] text-white px-6 py-2 rounded-lg active:scale-75">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntityPage;
