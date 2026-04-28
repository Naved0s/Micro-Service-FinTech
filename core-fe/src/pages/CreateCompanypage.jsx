import React from 'react'
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftCircle, ArrowLeftFromLine } from "lucide-react";

const CreateCompanypage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
   const data =   location.state;
    console.log(data);
    
  return (
     <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <ArrowLeftCircle className="mb-5" onClick={()=>navigate(-1)}/>
        <h1 className="font-bold text-2xl">Edit Company Details</h1>
        <div className="m-4  flex flex-col gap-10 content-center">
          <div className="flex flex-row justify-between p-4  rounded-2xl bg-[#D9D9D9] mt-6">
            <h1 className="text-xl">Name:{data.name}</h1>
            <h1 className="text-xl">Type:{data.type}</h1>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 w-full max-w-3xl">
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Company Name"
                value={data.name}
              
              />
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Tax Id"
                value={data.tax_id}
              />

              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Email"
                value={data.email}
              />
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Industry"
                value={data.industry}
              />

              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Website"
                value={data.website}
              />
              <input
                className="h-10 w-full border p-2 rounded-2xl bg-gray-200"
                placeholder="Registration No."
                value={data.reg_no}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-[#335294] text-white px-6 py-2 rounded-lg active:scale-75">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCompanypage