import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Breadcrumb, Button, Col, Container, Row, Spinner } from "react-bootstrap"
import { getFormattedDate } from "../utils/utils";

import Logo from "../assets/images/star_wars_logo.jpg"

const FilmDetails = () => {

    const location = useLocation();
    const { film } = location?.state;
    const [characterNames, setCharacterNames] = useState([]);
    const [load, setLoad] = useState(true)

    /**
     * 
     * @param {String} url - url to fetch the people for the film 
     * @returns promise of the api call
     */

    const getPeople = (url) => {
        return axios.get(url);
    };

    /**
     * Fetching the people/characters for the respective fil
     */
    const processCharacters = async () => {
        let result;
        let promises = [];
        for (let i = 0; i < film.characters.length; i++) {
            promises.push(getPeople(film.characters[i]));
        }
        result = await Promise.all(promises);
        for (let i = 0; i < film.characters.length; i++) {
            characterNames.push(result[i].data.name)
        }
        setCharacterNames(characterNames);
        setLoad(false);
    }

    useEffect(() => {
        try {
            processCharacters();
        } catch (error) {
            setLoad(false);
            alert("Please try again!");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Breadcrumb to navigate
     * @returns Breadcrumb
     */
    const getBreadcrumb = () => {
        return (
            <Breadcrumb>
                <Breadcrumb.Item href="/" className="cursor">Films</Breadcrumb.Item>
                <Breadcrumb.Item active><b>{film.title}</b></Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    return (
        <>
            <Container className="my-4">
                {getBreadcrumb()}
                <section>
                    <h1 className="mobiquity-color">{film.title} ({(getFormattedDate(film.release_date, "YYYY"))})</h1>
                    <div className="top_movie_content">
                        <Row>
                            <Col className="movie_right">
                                <img src={Logo} alt="Logo" height="365" />
                            </Col>
                            <Col className="movie_left">
                                <dl>
                                    <dt>Tile: </dt>
                                    <dd>{film.title}</dd>
                                    <dt>Episode: </dt>
                                    <dd >{film.episode_id}</dd>
                                    <dt>Release Date: </dt>
                                    <dd>{film.release_date}</dd>
                                    <dt>Added Date: </dt>
                                    <dd>{getFormattedDate(film.created, "YYYY-MM-DD")}</dd>
                                    <dt>Director(s): </dt>
                                    <dd>{film.director}</dd>
                                    <dt>Producer(s): </dt>
                                    <dd>{film.producer}</dd>
                                    <dt>Cast: </dt>
                                    <dd>
                                        {characterNames.map((name, idx) => (
                                            <span key={idx}>{name}, </span>
                                        ))}
                                        {
                                            load && (
                                                <Button variant="primary" disabled>
                                                    <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    Loading...
                                                </Button>
                                            )
                                        }
                                    </dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                    <div className="middle_movie_content">
                        <Row className="m-2" align="align">
                            <strong className="ps-0 mobiquity-color">Film Description:</strong>
                            {film.opening_crawl}
                        </Row>
                    </div>
                </section>
            </Container>
        </>
    )
}

export default FilmDetails;