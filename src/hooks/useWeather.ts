import axios from "axios"
import type { SearchType } from "../types"
import { object, string, number, parse } from "valibot"
import type { InferOutput } from "valibot"
// import { z } from 'zod'

// TYPE GUARD O ASSERTION
// function isWeatherResponse(weather : unknown): weather is Weather {
//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name === 'string' &&
//         typeof (weather as Weather).main.temp === 'number' &&
//         typeof (weather as Weather).main.temp_max === 'number' &&
//         typeof (weather as Weather).main.temp_min === 'number'
//     )

// }

//ZOD

// const Weather = z.object({
//     name: z.string(),
//     main: z.object({
//         temp: z.number(),
//         temp_max: z.number(),
//         temp_min: z.number()
//     })
// })

// type Weather = z.infer<typeof Weather>

// Valibot
const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_max: number(),
        temp_min: number()
    })
})

type Weather = InferOutput<typeof WeatherSchema>


export default function useWeather() {

    const fetchWeather = async (search: SearchType)=> {

        const appId = import.meta.env.VITE_API_KEY
        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const {data} = await axios(geoUrl, {method: 'get'})

            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
            
            // Type Guards
            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = isWeatherResponse(weatherResult)
            // if(result) {
            //     console.log(weatherResult.name)
            // }else {
            //     console.log('Respuesta mal formulada')
            // }

            //ZOD

            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = Weather.safeParse(weatherResult)
            // if(result.success) {
            //     console.log(result.data.name)
            //     console.log(result.data.main.temp)
            // } else {
            //     console.log('Respuesta mal formada')
            // }

            // VALIBOT

            const {data: weatherResult} = await axios(weatherUrl)
            const result = parse(WeatherSchema, weatherResult)
            if(result) {
                console.log(result.name)
                console.log(result.main.temp)
            } else {
                console.log('Respuesta mal formada')
            }

        } catch (error) {
            console.log(error)
        }
    }

    return {
        fetchWeather
    }
}