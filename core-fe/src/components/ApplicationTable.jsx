import { Eye } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ApplicationTable = (props) => {
  const navigate = useNavigate();
  const openPage=()=>{
    navigate(`/applications/view/${props.data.id}`)
  }
    console.log("This are the props" , props);
    
  return (
   <tr className="text-center">
      <td className="border border-slate-300 p-2 ">{props.sr_no}</td>
      <td className="border border-slate-300 p-2">{props.data.entity.firstName}</td>
      <td className="border border-slate-300 p-2">{props.data.entity.lastName}</td>
      <td className="border border-slate-300 p-2"> {props.data.status}</td>
      <td className="border border-slate-300 p-2">{props.data.entity.dob}</td>
      <td className="border border-slate-300 p-2">{props.data.applicationForm.name}</td>
      <td className="border border-slate-300 p-2">
        <div className="flex flex-row justify-center ">
            <Eye onClick={openPage}/>
        </div>
      </td>
    </tr>
  )
}

export default ApplicationTable