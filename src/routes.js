import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./features/dashboard";
import FilmDetails from "./features/filmDetails";
import Header from "./features/header";
import NotFound from "./features/notFound";

const Routings = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/details" element={<FilmDetails />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Routings;

