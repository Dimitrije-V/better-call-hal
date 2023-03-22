const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async (fn, retries = 3, backoff = 10000) => {
    try {
        return await fn();
    } catch (error) {
        if (error.response.status === 429 && retries > 0) {
            await sleep(backoff);
            console.log('Retrying...');
            return withRetry(fn, retries - 1, backoff * 2);
        } else {
            throw error;
        }
    }
};


module.exports = {
    sleep,
    withRetry
}