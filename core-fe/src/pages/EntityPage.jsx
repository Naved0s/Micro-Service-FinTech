import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { TableRow } from '../components/TableRow'
import axios from 'axios'
import Custompopup from '../components/Custompopup'
import { useNavigate } from 'react-router-dom'
export const EntityPage = () => {

  const [open, setOpen] = useState(false);
  const [eList, setEList] = useState([]);

   

  const handleSave = (data) =>{
    // console.log("THIS IS DATA",data.name);
    
    axios.post('http://192.168.1.37:9092/create',{
      name:data.name,
      type:data.type
    }).then((response)=>{
        // console.log("GOT RESPONSE",response.data);
      setOpen(false);
    })
  }

  const getAllEntities=()=>{
    axios.get('http://192.168.1.37:9092/entity/all').then((response)=>{
      console.log("This is what gell all enity response is ",response.data);
      
      setEList(response.data)
    })
  }

  
  useEffect(() => {
   getAllEntities()  
  }, [])
  

  return (
   <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <h1 className="font-bold text-2xl">Entity</h1>
          <div className="flex flex-row justify-between ">
            <input
              type="text"
              placeholder="Search"
              className="h-10 w-full md:w-1/3 border p-2 m-4 rounded bg-gray-200 "
            />
            <button onClick={()=>setOpen(true)} className="bg-[#335294] text-white p-2 rounded px-4 m-4 active:scale-75">
              Add
            </button>
          </div>
          <Custompopup
          isOpen={open}
          onClose={()=>setOpen(false)}
          onSave={handleSave}
          />
          <div className="p-10">
            <table className="w-full border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">Id</th>
                  <th className="border border-slate-300 p-2">Name</th>
                  <th className="border border-slate-300 p-2">Type</th>
                  <th className="border border-slate-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  eList.map(function(e,idx){
                    return <TableRow key={idx} f_data={e} s_no={idx+1} />
                  })
                }
                
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}
