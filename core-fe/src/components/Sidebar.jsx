import React from "react";
import { User, FileUser, FormIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div
      className="
      w-15 md:w-15
      
      bg-[#3D86E6]
      h-screen 
      flex 
      flex-col 
      items-center 
      md:items-center 
      py-6 
      gap-4
      text-white  
    "
    >
      <User
        className="mt-8 active:scale-75"
        onClick={() => {
          navigate("/");
        }}
      />
      <FileUser
        className="mt-8  active:scale-75"
        onClick={() => {
          navigate("/forms");
        }}
      />

      <FormIcon className="mt-8  active:scale-75"
      onClick={()=>{
        navigate("/applications")
      }} />
    </div>
  );
};

export default Sidebar;
