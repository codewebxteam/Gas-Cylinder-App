import axios from 'axios';

const RAPID_API_KEY = 'd9dcd2ed79mshc1c06f9daa6331dp178d0cjsne0c1cf1ab3a4';
const RAPID_API_HOST = 'google-api31.p.rapidapi.com';

export const searchLocation = async (query) => {
    try {
        const response = await axios.post(
            `https://${RAPID_API_HOST}/map2`,
            {
                text: query,
                place: '',
                street: '',
                city: '',
                country: '',
                state: '',
                postalcode: '',
                latitude: '',
                longitude: '',
                radius: ''
            },
            {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': RAPID_API_HOST,
                    'Content-Type': 'application/json'
                }
            }
        );

        // From our test, results are in response.data.result
        return response.data.result;
    } catch (error) {
        console.error('RapidAPI Map Search Error:', error);
        throw error;
    }
};
