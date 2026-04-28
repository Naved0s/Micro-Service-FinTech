import React, { useState } from 'react'
import Formwidget from '../components/Formwidget';
import Sidebar from '../components/Sidebar';
import DatamodelTableRow from '../components/DatamodelTableRow';
import DatamodelFormPopup from '../components/DatamodelFormPopup';

const CreateDatamodelpage = () => {
    const [isopen, setIsopen] = useState(false)
  return (
     <div className="flex flex-1 overflow-hidden">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="flex flex-row justify-between bg-rose-200 items-center">
 <h1 className="text-2xl font-bold ">
        DataModels
     </h1>
   <button  className="bg-[#335294] text-white p-2 rounded px-4 m-4 active:scale-75">
        Save
     </button>
        </div>
        <div className='flex flex-row justify-between p-10'>
            <input
          className="w-90 border p-3 rounded-lg mb-4"
          placeholder="Enter Datamodel Name"
         
        />
         <button onClick={()=>{
            setIsopen(true)
           
            
         }} className="bg-[#335294] text-white p-2 rounded px-4 m-4 active:scale-75">
        Add
     </button>
     <DatamodelFormPopup isopen={isopen} onclose={()=>setIsopen(false)} onSave={()=>console.log("hellop")}  />
        </div>
        <div className='bg-amber-200 h-screen'>
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
                <DatamodelTableRow/>    
                </tbody>
                </table>
        </div>
        
    
      </div>
    </div>
  )
}

export default CreateDatamodelpage;