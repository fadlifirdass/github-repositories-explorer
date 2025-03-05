import React, { useState, useEffect } from "react";
import "./App.css";
import DashboardView from "./features/dashboard/presentation/view/dashboardView";
const App: React.FC = () => {
  return (
    <div className="App">
      <DashboardView />
    </div>
  );
};

export default App;
