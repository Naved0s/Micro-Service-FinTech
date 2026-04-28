import React from "react";
import { Eye, Play ,Trash } from "lucide-react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const Row1 = (props) => {
   const navigate = useNavigate()
  const onClicked = (id) => {
    navigate(`/workflow/${id}`,{
      state:{
      //  props:props
       id: props.id,
    name: props.name,
    desc: props.desc,
    cond: props.cond,
    action: props.action
      }
    });
  };
  const runWf = (id) => {
    axios.post(`http://192.168.1.37:9093/${id}`).then(function (response) {
      if(response != null){
        onClicked(id)
      }
    });
  };

  // const deleteById=(id)=>{
  //    axios.delete(`http://192.168.1.37:9093/delete/${id}`).then(function (response) {
  //    console.log(response.status);
     
  //   });
  // }

  return (
    <tr className="text-center">
      <td className="border border-slate-300 p-2 ">{props.s_no}</td>
      <td className="border border-slate-300 p-2">{props.name}</td>
      <td className="border border-slate-300 p-2">{props.desc}</td>
      <td className="border border-slate-300 p-2">
        <div className="flex flex-row justify-evenly">
          <button>
        <Trash onClick={() => props.onDelete(props.id)}  />
          </button>
          <button onClick={()=>onClicked(props.id)}>
            <Eye />
          </button>
          <button onClick={()=>{
            runWf(props.id)
          }}>
            <Play />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Row1;
