import { SquarePen, Trash } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Formwidget = (props) => {
  console.log(props);
  const navigate = useNavigate();
  const direct=()=>{
    navigate(`/forms/edit/${props.id}`,{
      state:props
    })
  }
  return (
     <div className="bg-white w-64 rounded-2xl p-4 border m-2">
  <h1 className="text-xl font-bold">{props.applicationName}</h1>

  <p className="text-sm">{props.desc}</p>

  <div className="flex mt-4">
    <div className="ml-auto flex">
      <SquarePen  onClick={()=>{
        console.log("Clicked"); 
        direct()
        
      }} className="m-1 active:scale-75" size={20} />
      <Trash className="m-1 active:scale-75" size={20} />
    </div>
  </div>
</div>
  )
}

export default Formwidget