export default function Progress({ minutes, seconds, sessionLength, breakLength, isSession }){
    const CIRCLE_RADIUS = 100;
    const timeLength = 60 * 1000 * (isSession? sessionLength : breakLength); 
    const msMinutes = Number(minutes) * 60 * 1000;
    const msSeconds = Number(seconds) * 1000;
    const totalMs = msMinutes + msSeconds;
    const percentage = totalMs / timeLength * 100;
    const strokeDasharray = `${percentage} 100`;

    return(
        <svg width="250" height="250">
            <circle 
                r={CIRCLE_RADIUS}
                pathLength="100"
                cx="125" 
                cy="125" 
                className="empty__circle"
            ></circle>
            <circle 
                r={CIRCLE_RADIUS}
                pathLength="100"
                cx="125" 
                cy="125" 
                className="progress"
                style={{ strokeDasharray }}
            ></circle>
        </svg>
    )
}