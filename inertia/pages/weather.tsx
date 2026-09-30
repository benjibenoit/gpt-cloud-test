import { useCallback, useEffect, useState } from 'react'
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  MapPin,
  RefreshCw,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import { Head } from '@inertiajs/react'
import MarketingLayout from '~/layouts/marketing'

const PARIS_WEATHER_URL = new URL('https://api.open-meteo.com/v1/forecast')

PARIS_WEATHER_URL.search = new URLSearchParams({
  latitude: '48.8566',
  longitude: '2.3522',
  current:
    'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
  daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
  timezone: 'Europe/Paris',
  forecast_days: '1',
}).toString()

type WeatherResponse = {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  current_units: {
    temperature_2m: string
    apparent_temperature: string
    relative_humidity_2m: string
    precipitation: string
    wind_speed_10m: string
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    sunrise: string[]
    sunset: string[]
  }
}

type WeatherCondition = {
  label: string
  Icon: LucideIcon
}

function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { label: 'Clear sky', Icon: Sun }
  if (code <= 3) return { label: 'Partly cloudy', Icon: Cloud }
  if (code === 45 || code === 48) return { label: 'Foggy', Icon: CloudFog }
  if (code >= 51 && code <= 67) return { label: 'Rain', Icon: CloudRain }
  if (code >= 71 && code <= 77) return { label: 'Snow', Icon: CloudSnow }
  if (code >= 80 && code <= 82) return { label: 'Rain showers', Icon: CloudRain }
  if (code >= 85 && code <= 86) return { label: 'Snow showers', Icon: CloudSnow }
  if (code >= 95) return { label: 'Thunderstorms', Icon: CloudLightning }
  return { label: 'Variable conditions', Icon: Cloud }
}

function formatTime(value: string) {
  return value.split('T')[1]?.slice(0, 5) ?? value
}

function windDirection(degrees: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(degrees / 45) % directions.length]
}

function WeatherLoading() {
  return (
    <div className="weather-state" role="status" aria-live="polite">
      <RefreshCw className="weather-state__spinner" size={24} aria-hidden="true" />
      <div>
        <p className="weather-state__title">Checking the Paris sky</p>
        <p className="weather-state__copy">Fetching the latest local observations…</p>
      </div>
    </div>
  )
}

function WeatherError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="weather-state weather-state--error" role="alert">
      <CloudRain size={26} aria-hidden="true" />
      <div>
        <p className="weather-state__title">Weather is temporarily unavailable</p>
        <p className="weather-state__copy">Check your connection, then try again.</p>
      </div>
      <button type="button" className="btn btn--secondary btn--sm" onClick={onRetry}>
        <RefreshCw size={14} aria-hidden="true" />
        Try again
      </button>
    </div>
  )
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [error, setError] = useState(false)
  const [requestId, setRequestId] = useState(0)

  const retry = useCallback(() => {
    setWeather(null)
    setError(false)
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadWeather() {
      try {
        const response = await fetch(PARIS_WEATHER_URL, { signal: controller.signal })

        if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`)

        const data = (await response.json()) as WeatherResponse
        setWeather(data)
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) {
          setError(true)
        }
      }
    }

    loadWeather()

    return () => controller.abort()
  }, [requestId])

  const condition = weather ? getWeatherCondition(weather.current.weather_code) : null
  const ConditionIcon = condition?.Icon

  return (
    <main className="weather-page">
      <Head title="Paris weather" />

      <section className="weather-shell" aria-labelledby="weather-title">
        <div className="weather-heading">
          <span className="tag weather-heading__eyebrow">
            <MapPin size={12} aria-hidden="true" /> Paris, France
          </span>
          <h1 id="weather-title">Weather in Paris</h1>
          <p>Current conditions and today&apos;s essentials, updated live from Open-Meteo.</p>
        </div>

        <div className="weather-card">
          {!weather && !error && <WeatherLoading />}
          {error && <WeatherError onRetry={retry} />}

          {weather && condition && ConditionIcon && (
            <>
              <div className="weather-current">
                <div className="weather-current__summary">
                  <div className="weather-current__icon" aria-hidden="true">
                    <ConditionIcon size={38} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="weather-current__condition">{condition.label}</p>
                    <p className="weather-current__updated">
                      Updated at {formatTime(weather.current.time)}
                    </p>
                  </div>
                </div>

                <div className="weather-current__temperature">
                  <span>{Math.round(weather.current.temperature_2m)}</span>
                  <sup>{weather.current_units.temperature_2m}</sup>
                </div>
              </div>

              <div className="weather-range" aria-label="Today's temperature range">
                <span>
                  Low {Math.round(weather.daily.temperature_2m_min[0])}
                  {weather.current_units.temperature_2m}
                </span>
                <span className="weather-range__track" aria-hidden="true">
                  <span />
                </span>
                <span>
                  High {Math.round(weather.daily.temperature_2m_max[0])}
                  {weather.current_units.temperature_2m}
                </span>
              </div>

              <dl className="weather-details">
                <div className="weather-detail">
                  <dt>
                    <Thermometer size={16} aria-hidden="true" /> Feels like
                  </dt>
                  <dd>
                    {Math.round(weather.current.apparent_temperature)}
                    {weather.current_units.apparent_temperature}
                  </dd>
                </div>
                <div className="weather-detail">
                  <dt>
                    <Droplets size={16} aria-hidden="true" /> Humidity
                  </dt>
                  <dd>
                    {weather.current.relative_humidity_2m}
                    {weather.current_units.relative_humidity_2m}
                  </dd>
                </div>
                <div className="weather-detail">
                  <dt>
                    <Wind size={16} aria-hidden="true" /> Wind
                  </dt>
                  <dd>
                    {Math.round(weather.current.wind_speed_10m)}{' '}
                    {weather.current_units.wind_speed_10m}{' '}
                    {windDirection(weather.current.wind_direction_10m)}
                  </dd>
                </div>
                <div className="weather-detail">
                  <dt>
                    <CloudRain size={16} aria-hidden="true" /> Precipitation
                  </dt>
                  <dd>
                    {weather.current.precipitation} {weather.current_units.precipitation}
                  </dd>
                </div>
                <div className="weather-detail">
                  <dt>
                    <Sunrise size={16} aria-hidden="true" /> Sunrise
                  </dt>
                  <dd>{formatTime(weather.daily.sunrise[0])}</dd>
                </div>
                <div className="weather-detail">
                  <dt>
                    <Sunset size={16} aria-hidden="true" /> Sunset
                  </dt>
                  <dd>{formatTime(weather.daily.sunset[0])}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        <p className="weather-source">
          Forecast data by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
        </p>
      </section>
    </main>
  )
}

Weather.layout = [MarketingLayout]
