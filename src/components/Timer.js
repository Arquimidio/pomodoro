export default function Timer({ minutes, seconds, isSession }){
    const padZero = value => value.toString().padStart(2, "0");
    const [fixedMin, fixedSec] = [padZero(minutes), padZero(seconds)];
    return(
        <div id="timer">
            <div id="timer-label">{isSession? "Session" : "Break"}</div>
            <div id="time-left">{fixedMin}:{fixedSec}</div>
        </div>
    )
}