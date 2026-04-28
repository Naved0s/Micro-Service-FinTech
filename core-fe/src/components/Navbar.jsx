import React from 'react'
import { CircleUserRound } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between p-3 text-white bg-[#3D78E6]">
        <h1 className="font-semibold text-l">Fintech</h1>
        <CircleUserRound />
      </div>
  )
}

export default Navbar