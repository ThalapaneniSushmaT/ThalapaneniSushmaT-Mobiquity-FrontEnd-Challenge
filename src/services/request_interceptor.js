/**
 * This method will perform excess task by adding excess headers
 * @param {Object} reqConfig - Request config object
 */
const RequestInterceptor = (reqConfig) => {
    try {
        reqConfig.headers = {
            ...reqConfig.headers,
        };
        return reqConfig;
    } catch (error) {
        return Promise.reject(error);
    }
};

export default RequestInterceptor;