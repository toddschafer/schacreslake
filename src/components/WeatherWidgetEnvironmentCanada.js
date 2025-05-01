import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherWidget = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({});

  useEffect(async () => {
    setLoading(true);

    try {
      axios
        .get(`${document.location.origin}/.netlify/functions/weather`)
        .then(({ data }) => {
          setLoading(false);

          // console.log("=== here", data);

          const {
            siteData: { currentConditions, dateTime, forecastGroup, riseSet },
          } = data;
          const dateTimeObj = dateTime?.[1];
          const date = new Date(
            `${dateTimeObj?.month?._attributes?.name} ${dateTimeObj?.day?._text}, ${dateTimeObj?.year?._text}`
          );

          setWeatherData({
            current: {
              dewpoint: currentConditions?.dewpoint?._text,
              humidity: currentConditions?.relativeHumidity?._text,
              pressure: currentConditions?.pressure?._text,
              sunrise: `${riseSet?.dateTime[1]?.hour?._text}:${riseSet?.dateTime[1]?.minute?._text}`,
              sunset: `${riseSet?.dateTime[3]?.hour?._text}:${riseSet?.dateTime[3]?.minute?._text}`,
              temperature: currentConditions?.temperature?._text,
              windDirection: currentConditions?.wind?.direction?._text,
              windGust: currentConditions?.wind?.gust?._text || 0,
              windSpeed: currentConditions?.wind?.speed?._text,
            },
            daily: forecastGroup?.forecast?.map((day, index) => {
              const newDate = new Date(date);
              newDate.setDate(newDate.getDate() + index);
              return {
                iconFormat:
                  day?.abbreviatedForecast?.iconCode?._attributes?.format,
                iconNumber: day?.abbreviatedForecast?.iconCode?._text,
                forecastName: day?.period?._attributes?.textForecastName,
                humidity: day?.relativeHumidity?._text,
                summary: day?.textSummary._text,
                temperature: day?.temperatures?.temperature?._text,
                uvSummary: day?.uv?.textSummary?._text,
                windSummary: day?.winds?.textSummary?._text,
              };
            }),
          });
        });
    } catch (error) {
      setError(error);
    }
  }, []);

  const { current, daily } = weatherData;
  console.log("Weather data:", { current, daily });

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
            href="https://dd.weather.gc.ca/citypage_weather/xml/AB/s0000297_e.xml"
            style={{ color: "white", textDecoration: "underline" }}
            target="_blank"
          >
            https://dd.weather.gc.ca/citypage_weather/xml/AB/s0000297_e.xml
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherWidget;
