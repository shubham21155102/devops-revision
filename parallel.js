const apiUrl = "https://api.shubhamiitbhu.in/user/health";
const triggerApi = () => {
    return fetch(apiUrl)
        .then(response => {
            if (response.ok) {
                console.log("API triggered successfully.");
                return response.json();
            } else {
                console.log(`Failed to trigger API. Status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error("Error triggering API:", error);
        });
};
const triggerApisInParallel = () => {
    const promises = Array(500).fill(null).map(() => triggerApi());
    Promise.all(promises)
        .then((e) => {
            console.log(e);
            e.map((data) => {
                console.log(data.message);
            }
            )
            // console.log("All 500 API calls completed.");
        })
        .catch(error => {
            console.error("Error in API calls:", error);
        });
};

triggerApisInParallel();