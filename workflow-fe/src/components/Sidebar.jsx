// import React from 'react'

// const Sidebar = () => {
//   return (
//    <div className='w-1/9 h-screen bg-amber-200 p-10 text-white'>
//         <button className='bg-gray-400 p-2 rounded mt-25 w-25'>
//           Workflows
//         </button>
//         <button className='bg-gray-400 p-2 rounded mt-10 w-25'>
//           Jflows
//         </button>
//       </div>
//   )
// }

// export default Sidebar

import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
 const navigate = useNavigate()

 const onClicked=(props)=>{
  navigate(props)
 }

  return (
    <div className="
      w-16 md:w-56
      
      bg-[#E8BD6E]
      h-full 
      flex 
      flex-col 
      items-center 
      md:items-start 
      py-6 
      gap-4
    ">
      <button onClick={()=>{
        onClicked('/')
      }} className="bg-white px-4 py-2 rounded w-3/4 text-left">
        Workflow
      </button>

      <button onClick={()=>{
        onClicked('/Jflow')
      }} className="bg-white px-4 py-2 rounded w-3/4 text-left">
        Jflows
      </button>
    </div>
  )
}

export default Sidebar