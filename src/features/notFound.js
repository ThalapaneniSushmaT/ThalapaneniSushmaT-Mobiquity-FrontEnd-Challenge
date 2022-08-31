import React from "react";
import { Container } from "react-bootstrap";

import PageNotFound from "../assets/images/page_404.gif";

const NotFound = () => {
    return (
        <Container className="py-4 my-4" align="center">
            <img src={PageNotFound} alt="404"/>
        </Container>
    );
}

export default NotFound;