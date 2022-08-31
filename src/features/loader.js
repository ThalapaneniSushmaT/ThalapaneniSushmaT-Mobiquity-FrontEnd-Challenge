/**
 *  Responsible to render loading wheel
 */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Spinner from 'react-bootstrap/Spinner';


/**
 * Mount the <Spinner> tag of bootstrap if loading is true else nothing
 * @param {Props} props - Component props which has loading true/false
 */
const Loader = ({ loading }) => {
    return loading && <StyledSpin animation="border" size="sm" variant="info" />;
};

/**
 * This is the CSS for current component.
 */
const StyledSpin = styled(Spinner)`
    position: fixed;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    opacity: 0.8;
    z-index: 2;
 `;

Loader.propTypes = {
    loading: PropTypes.bool,
};

Loader.defaultProps = {
    loading: false,
};

export default Loader;
