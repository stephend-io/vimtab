import useDateAndTime from '../../hooks/useDateAndTime'

const Left = () => {
    const { time, day, month, date } = useDateAndTime()

    return (
        <div className="flex h-[90%] w-full items-center justify-between ">
            <div className="mt-8 self-start">
                <div className="text-8xl font-black tracking-widest">{time}</div>
                <div className="ml-2 flex gap-2">
                    <div>{day}</div>
                    <div>{month}</div>
                    <div>{date}</div>
                </div>
            </div>
        </div>
    )
}

export default Left
