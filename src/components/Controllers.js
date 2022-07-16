export default function Controllers({ toggleTimer, resetTimer, isTimeRunning, changeModality, isSession }){
    const modality = isSession? "person-running" : "bed";
    return(
        <div id="controllers">
            <div className="controller__button"  id="start_stop" onClick={toggleTimer}>
                {isTimeRunning? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
            </div>
            <i onClick={changeModality} className={`controller__button fa-solid fa-${modality}`}></i>
            <i onClick={resetTimer} id="reset" className="controller__button fa-solid fa-arrow-rotate-left"></i>
        </div>
    )
}