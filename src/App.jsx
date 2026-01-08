import React, { useState } from "react";
import Routes from "./Routes";

function App() {
  const [currentRole, setCurrentRole] = useState('admin');

  return (
    <Routes currentRole={currentRole} onRoleChange={setCurrentRole} />
  );
}

export default App;