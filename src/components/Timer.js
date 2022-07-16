export default function Timer({ minutes, seconds, isSession }){
    return(
        <div id="timer">
            <div id="timer-label">{isSession? "Session" : "Break"}</div>
            <div id="time-left">{minutes}:{seconds}</div>
        </div>
    )
}