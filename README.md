The application uses the Visual Crossing Weather API to fetch real-time weather data. The base endpoint used is:

https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{CITY_NAME}

The request includes parameters such as:
- `unitGroup=metric` – to ensure temperatures are returned in Celsius
- `key=API_KEY` – a unique key required to access the API
- `contentType=json` – to specify that data should be returned in JSON format

A sample API call looks like this:
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/London?unitGroup=metric&key=YOUR_API_KEY&contentType=json

The response includes:
- A `days` array, where `days[0]` represents today and `days[1]` is tomorrow.
- Fields like `temp`, `conditions`, and `icon` are extracted to build the UI.

The API is called dynamically when a user adds a city or when the Guildford forecast is updated in the scrolling banner.

Live Deployment:

This project is deployed using GitHub Pages.

🔗 View it here: [Live Weather Website](https://muhammad11123.github.io/Live-Weather-Website/)
