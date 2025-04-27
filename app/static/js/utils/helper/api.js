const makeCall = async (url, requestOptions) => {
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            "There was a problem with the fetch operation:",
            error
        );
    }
};

export default makeCall;