/**
 * This method will perform excess task if needed.
 * @param {Object} error - Denotes API error
 */
const ResponseInterceptor = (error) => {
    return Promise.reject(error);
};

export default ResponseInterceptor;