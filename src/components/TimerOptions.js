export default function TimerOptions({ idText, toDisplay, increment, decrement }){
    const mergeId = identifier => `${idText}-${identifier}`;
    return(
        <div className="timer__options">
            <div className="label" id={mergeId('label')}>{idText} Length</div>
            <div className="length__container">
                <div onClick={decrement} className="change__length" id={mergeId('decrement')}>-</div>
                <div className="length" id={mergeId('length')}>{ toDisplay }</div>
                <div onClick={increment} className="change__length" id={mergeId('increment')}>+</div>
            </div>
        </div>     
    )
}