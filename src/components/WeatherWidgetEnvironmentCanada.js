import React, { useEffect, useState } from "react";
import axios from "axios";
import xmlToJson from "simple-xml-to-json";

const WeatherWidget = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({});

  useEffect(async () => {
    setLoading(true);

    const { data } = await axios.get(
      "https://dd.weather.gc.ca/citypage_weather/xml/AB/s0000297_e.xml"
    );
    const json = xmlToJson.toJson(data);
    console.log("=== weather data:", json);

    try {
      axios
        .get("https://schacreslakev2.netlify.app/.netlify/functions/weather")
        .then(({ data }) => {
          setLoading(false);

          // console.log(data);

          const {
            siteData: { currentConditions, dateTime, forecastGroup, riseSet },
          } = data;
          const dateTimeObj = dateTime?.[1];
          const date = new Date(
            `${dateTimeObj?.month?.name} ${dateTimeObj?.day?.$t}, ${dateTimeObj?.year}`
          );

          setWeatherData({
            current: {
              dewpoint: currentConditions?.dewpoint?.$t,
              humidity: currentConditions?.relativeHumidity?.$t,
              pressure: currentConditions?.pressure?.$t,
              sunrise: `${riseSet?.dateTime[1]?.hour}:${riseSet?.dateTime[1]?.minute}`,
              sunset: `${riseSet?.dateTime[3]?.hour}:${riseSet?.dateTime[3]?.minute}`,
              temperature: currentConditions?.temperature?.$t,
              windDirection: currentConditions?.wind?.direction?.$t,
              windGust: currentConditions?.wind?.gust?.$t || 0,
              windSpeed: currentConditions?.wind?.speed?.$t,
            },
            daily: forecastGroup?.forecast?.map((day, index) => {
              const newDate = new Date(date);
              newDate.setDate(newDate.getDate() + index);

              return {
                iconFormat: day?.abbreviatedForecast?.iconCode?.format,
                iconNumber: day?.abbreviatedForecast?.iconCode?.$t,
                forecastName: day?.period?.textForecastName,
                humidity: day?.relativeHumidity?.$t,
                summary: day?.textSummary,
                temperature: day?.temperatures?.temperature?.$t,
                uvSummary: day?.uv?.textSummary,
                windSummary: day?.winds.textSummary,
              };
            }),
          });
        });
    } catch (error) {
      setError(error);
    }
  }, []);

  const { current, daily, timeStamp } = weatherData;
  console.log({ current, daily, timeStamp });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "white" }}>
        Oops! There was an issue fetching weather data...
      </div>
    );
  }

  if (current && daily) {
    return (
      <div>
        <h4>Current:</h4>
        <div className="weather-current">
          <div className="card">
            <div className="card-content">
              <div>
                <b>Temp:</b> {current.temperature}°C
              </div>
              <div>
                <b>Wind:</b> {current.windDirection} {current.windSpeed}km/h
                (Gusts of {current.windGust}km/h)
              </div>
              <div>
                <b>Humidity:</b> {current.humidity}%
              </div>
              <div>
                <b>Pressure:</b> {current.pressure}kPa
              </div>
              <div>
                <b>Dewpoint:</b> {current.dewpoint}°C
              </div>
              <div>
                <b>Sunrise/set:</b> {current.sunrise}↑ {current.sunset}↓
              </div>
            </div>
          </div>
        </div>

        <br />

        <h4>Daily:</h4>
        <div className="columns is-multiline">
          {daily.map((day, index) => {
            return (
              <div key={index} className="column is-half">
                <div className="card weather-card">
                  <div className="card-content">
                    {/* <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      <b>{dayjs(day.date.toUTCString()).format('ddd, MMM DD')}</b>
                    </div> */}
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {day.forecastName}
                    </div>
                    {day.iconNumber && day.iconFormat ? (
                      <div className="weather-card-icon">
                        <img
                          src={`https://weather.gc.ca/weathericons/${day.iconNumber}.${day.iconFormat}`}
                          alt="Weather Icon"
                        />
                      </div>
                    ) : null}
                    <div
                      style={{
                        fontSize: "1.25rem",
                        marginBottom: "0.5rem",
                        textDecoration: "underline",
                      }}
                    >
                      {day.temperature}°C
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>{day.summary}</div>
                    <div>
                      <b>Humidity:</b> {day.humidity}%
                    </div>
                    {day.windSummary ? (
                      <div>
                        <b>Wind:</b> {day.windSummary}
                      </div>
                    ) : null}
                    {day.uvSummary ? (
                      <div>
                        <b>UV:</b> {day.uvSummary}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ color: "white" }}>
          <span>Weather source: </span>
          <a
            href="https://weather.gc.ca/city/pages/ab-39_metric_e.html"
            style={{ color: "white", textDecoration: "underline" }}
            target="_blank"
          >
            https://weather.gc.ca/city/pages/ab-39_metric_e.html
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherWidget;
