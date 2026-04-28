import React, { useEffect, useState } from 'react'

import Sidebar from "../components/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Jrow from '../components/Jrow';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const JhomePage = () => {
   const navigate = useNavigate()

   const [query, setQuery] = useState('')
     const [filteredItems, setFilteredItems] = useState([]);

  const onClicked=(props)=>{
  navigate(props)
 }

const handleDelete = (id) => {
  axios.delete(`http://192.168.1.37:9093/jflow/delete/${id}`)
    .then(() => {
      setJflowList(prev =>
        prev.filter(item => item.id !== id)
      );
      toast.success("Deleted Successfully");
    });
};

 const getallJflows=()=>{
      axios.get(`http://192.168.1.37:9093/jflows/all`).then(function (response) {
        console.log(response.data);
        
       setJflowList(response.data)
     });
   }
   
     const [jflowList, setJflowList] = useState([])

     useEffect(() => {
      getallJflows()
     }, [])

     useEffect(() => {
    const filtered = jflowList.filter(item =>
      item.flowName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [jflowList, query]);

    
 
  return (
  
    
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <input
              className="h-10 w-full md:w-1/3 border p-2 m-4 rounded bg-gray-200"
              placeholder="Search Workflows"
              value={query}
              onChange={(v)=>setQuery(v.target.value)}
            />
            <button onClick={()=>{
              onClicked("/create-jflow")
            }} className="bg-blue-600 text-white px-4 py-2 m-4 rounded w-full md:w-auto">
              Add
            </button>
           
          </div>

          <div className="p-4">
            {/* border-collapse ensures borders don't double up */}
            <table className="w-full border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">Id</th>
                  <th className="border border-slate-300 p-2">WorkflowName</th>
                  <th className="border border-slate-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
             {filteredItems.map(function(elem,idx){
               // console.log(elem);
              
              return <Jrow key={elem.id} id={elem.id} s_no={idx+1} name={elem.flowName} json={elem.flowJson} onDelete={handleDelete}/>
             })}
              </tbody>
            </table>
            <ToastContainer/>
          </div>
        </div>
      </div>
  )
}

export default JhomePage