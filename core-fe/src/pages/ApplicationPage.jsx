import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ApplicationTable from '../components/ApplicationTable'
import axios from 'axios'

const ApplicationPage = () => {

    const [applicationsList, setApplicationsList] = useState([])
    const getApplications=()=>{
        axios.get("http://192.168.1.37:9092/applicationForms").then((response)=>{
            setApplicationsList(response.data);
        })
    }

    useEffect(() => {
        getApplications();
    }, [])
    
  return (
    <div className="flex flex-1 overflow-hidden">
  <Sidebar />

  <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
    
    <div className="flex justify-between items-center ">
      <h1 className="text-2xl font-bold">Applications</h1>

      <button className="bg-[#335294] text-white px-4 py-2 rounded active:scale-75">
        Add
      </button>
    </div>

    <div className=' h-screen  mt-4'>
       <div className="p-10">
            <table className="w-full border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">Id</th>
                  <th className="border border-slate-300 p-2">FirstName</th>
                  <th className="border border-slate-300 p-2">LastName</th>
                  <th className="border border-slate-300 p-2">Status</th>
                  <th className="border border-slate-300 p-2">Date</th>
                  <th className="border border-slate-300 p-2">Application Name</th>
                  <th className="border border-slate-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
              
                {
                    applicationsList.map((ele,idx)=>{
                        return <ApplicationTable key={idx}  data={ele} sr_no = {idx+1}/>
                    })
                }
                </tbody>
    </table>
    </div>
    </div>
    </div>
    </div>
  )
}

export default ApplicationPage