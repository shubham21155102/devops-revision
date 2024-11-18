const apiUrl = "https://api.shubhamiitbhu.in/user/health";
// const apiUrl = "https://www.placement.iitbhu.ac.in/"
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
let requestNumber=1;
const triggerApisInParallel = () => {
    const promises = Array(100).fill(null).map(() => triggerApi());
    console.log(promises)
    Promise.all(promises)
        .then((e) => {
            e.map((data) => {
                try{
                    console.log(requestNumber+" : "+data.message);
                    
                }catch(e){
                    console.log("Error in request number ",requestNumber)
                    console.log("Error",e)
                }
                requestNumber++;
            }
            )
            console.log("All 500 API calls completed.");
        })
        .catch(error => {
            console.error("Error in API calls:", error);
        });
};

triggerApisInParallel();