// import React from 'react'
// import {CircleUserRound} from 'lucide-react'
// const Navbar = () => {
//   return (
//     <div className='flex flex-row justify-between bg-amber-400 p-2 text-white'>
//         <h1 className='text-xl font-bold'>Workflow</h1>
//         <CircleUserRound />
//       </div>
//   )
// }

// export default Navbar


import React from 'react'
import { CircleUserRound } from 'lucide-react'

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-[#E5A329] px-6 py-3 text-white">
      <h1 className="text-lg font-semibold">Workflow</h1>
      <CircleUserRound />
    </div>
  )
}

export default Navbar