import React, { useEffect, useState } from "react";
import DataComponent from "../Admin/DataComponent";
import UserComponent from "./UserComponent";

const AdminPortal = () => {
  const [showDataComponent, setShowDataComponent] = useState(true);
  return (
  <div>
      {showDataComponent ?
      <DataComponent
        showDataComponent={showDataComponent}
        setShowDataComponent={setShowDataComponent}
      />
      :
      <UserComponent 
      showDataComponent={showDataComponent}
      setShowDataComponent={setShowDataComponent}
      />}
  </div>
  );
};

export default AdminPortal;
