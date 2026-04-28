import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Eye, Play } from "lucide-react";
import Row1 from "../components/Row1";
import Popup from "../components/Popup";
import { use, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const HomePage = () => {
 
  const [workflowList, setWorkflowList] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
 const navigate = useNavigate()
 const onClicked=()=>{
  navigate('/workflow')
 }

 const getWorkflows =()=>{
  axios.get('http://192.168.1.37:9093/all').then(function(response){
    setWorkflowList(response.data)
  })
  
 }
 const handleDelete = (id) => {
  axios.delete(`http://192.168.1.37:9093/delete/${id}`)
    .then(() => {
      setWorkflowList(prev =>
        prev.filter(item => item.Id !== id)
      );
    });
};

 useEffect(() => {
   getWorkflows()
   
 },[])
 useEffect(() => {
    const filtered = workflowList.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [workflowList, query]);


 
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
              onChange={(e) => setQuery(e.target.value)}
              value={query}

            />
            <button onClick={()=>{
              onClicked()
              // getWorkflows()
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
                    <th className="border border-slate-300 p-2">Description</th>
                    <th className="border border-slate-300 p-2">Actions</th>
                  </tr>
                </thead>
              <tbody>
                {
                  filteredItems.sort((a, b) => a.Id - b.Id).map(function(elem,idx){
                    return <Row1 key={elem.Id} s_no={idx+1} id = {elem.Id} name={elem.name} desc={elem.description} cond={elem.condition} action={elem.actions}  onDelete={handleDelete} />
                  })
                }
              {/* <Row1/>
              <Row1/> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
  )
}

export default HomePage