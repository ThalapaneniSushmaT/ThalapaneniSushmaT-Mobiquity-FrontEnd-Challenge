import { React } from "react";

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import Logo from "../assets/images/Mobiquity_Hexaware.webp";


const Header = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container className="mx-5">
                <Navbar.Brand href="/">
                    <img
                        alt="Logo"
                        src={Logo}
                        className="d-inline-block align-top"
                    />

                </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default Header;