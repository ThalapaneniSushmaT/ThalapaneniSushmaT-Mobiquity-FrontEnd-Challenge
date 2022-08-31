import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getFilmsList } from "../services/films.service";

import Loader from "./loader";
import Arrow from "../assets/images/arrow.png";
import Logo from "../assets/images/star_wars_logo.jpg";


const Dashboard = () => {

    const [load, setLoad] = useState(true);
    const [films, setiFlmsList] = useState([]);
    const navigate = useNavigate();

    /**
     * Fetching all the star wars films
     */
    const getAllFilmsList = async () => {
        try {
            const res = await getFilmsList();
            setiFlmsList(res?.data?.results);
            setLoad(false);
        } catch (error) {
            setLoad(false);
            alert("Please try again!");
        }
    };

    useEffect(() => {
        getAllFilmsList();
    }, []);

    return (
        <>
            <h1 className="g-4 m-4 mobiquity-color">Star Wars Films</h1>
            <Loader loading={load} />
            <Row xs={1} md={2} lg={3} className="g-4 m-4">
                {films.map((film, idx) => (
                    <Col key={idx}>
                        <Card className="cursor" onClick={() => navigate(`/details`, { state: { film } })}>
                            <Card.Img variant="top" src={Logo} />
                            <Card.Body>
                                <Card.Title className="m-3" align="center"><b>{film.title}</b></Card.Title>
                                <Card.Text className="d-flex justify-content-between hand">
                                    <span>Episode : <b>{film.episode_id}</b></span>
                                    <span className="cursor mobiquity-color" ><b>Read More</b><img src={Arrow} className="ms-2" alt="arrow" /></span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default Dashboard;