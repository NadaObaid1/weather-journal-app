// Global Variables
const apiKey = 'a55817b2e50d5e782661359b404013e5&units=imperial';
const baseURL = 'http://api.openweathermap.org/data/2.5/weather';
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    e.preventDefault(); 
    const newZip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeatherData(newZip)
        .then(function (data) {
            if (data && data.main) {
                return postData('http://localhost:3000/add', {
                    temperature: data.main.temp,
                    date: newDate,
                    userResponse: feelings
                });
            } else {
                throw new Error('No data returned...');
            }
        })
        .then(() => retrieveData())
        .catch((error) => {
            console.log("Error:", error);
            document.getElementById('temp').innerHTML = 'Error temp';
            document.getElementById('content').innerHTML = 'Error content';
            document.getElementById('date').innerHTML = 'Error date';
        });
    }

    
// Function to GET Web API Data
const getWeatherData = async (zip) => {
    try {
        const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}`);
        const data = await res.json();
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
};

// Function to POST data
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("Error:", error);
    }
};

// Function to GET Project Data 
const retrieveData = async () => {
    try {
        const request = await fetch('http://localhost:3000/all');
        const allDataReturn = await request.json();
        document.getElementById('temp').innerHTML = Math.round(allDataReturn.temperature) + ' degrees';
        document.getElementById('content').innerHTML = allDataReturn.userResponse;
        document.getElementById('date').innerHTML = allDataReturn.date;
    } catch (error) {
        console.log("Error:", error);
    }
};

