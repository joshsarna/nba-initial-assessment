try {
    require('./localConfig')
} catch (error) {
    //
}

import axios from 'axios'
import { BalldontlieAPI } from "@balldontlie/sdk"

const main = async () => {
    // const result = await axios.get('https://www.balldontlie.io/api/v1/players', {
    //     headers: {
    //         Authorization: process.env.BALL_DONT_LIE_API_KEY
    //     }
    // })
    const api = new BalldontlieAPI({apiKey: process.env.BALL_DONT_LIE_API_KEY})

    const results = await api.nba.getTeams()
    console.log(results)
}

void main().catch(error => {
    console.log('SCRIPT FAILED', error)
})