async function testApi() {
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'd9dcd2ed79mshc1c06f9daa6331dp178d0cjsne0c1cf1ab3a4',
            'x-rapidapi-host': 'google-api31.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: 'white house',
            place: 'washington DC',
            street: '',
            city: '',
            country: '',
            state: '',
            postalcode: '',
            latitude: '',
            longitude: '',
            radius: ''
        })
    };

    try {
        const response = await fetch('https://google-api31.p.rapidapi.com/map2', options);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(error.message);
    }
}

testApi();
