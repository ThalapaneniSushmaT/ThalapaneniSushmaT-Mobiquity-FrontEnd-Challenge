import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Dashboard from "./features/dashboard";

const Routings = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routings;

