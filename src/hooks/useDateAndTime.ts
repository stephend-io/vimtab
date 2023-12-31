import { useState, useEffect } from 'react'

const date = new Date()

const shortMonthTable = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
}

const monthsTable = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
}

const weekdayTable = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
}

const shortWeekdayTable = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun',
}

export const dayDetails = {
    month: shortMonthTable[(date.getMonth() + 1) as keyof typeof shortMonthTable],
    day: shortWeekdayTable[date.getDay() as keyof typeof shortWeekdayTable],
    date: date.getDate(),
}

// function getTime() {
//     console.log('time called')
//     const date = new Date()
//     return {
//         timeData: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//         month: date.getMonth(),
//         date: date.getDate(),
//         day: date.getDay(),
//         getTimeData: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//     }
// }

export default function useDateAndTime() {
    // const { timeData, date, day, month, getTimeData } = getTime()
    const dateObj = new Date()
    const day = shortWeekdayTable[dateObj.getDay() as keyof typeof shortWeekdayTable]
    const month = shortMonthTable[dateObj.getMonth() as keyof typeof shortMonthTable]
    const date = dateObj.getDate()
    const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    const [time, setTime] = useState(timeString)

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        }, 1000)
    }, [])

    return { time, date, month, day }
}
