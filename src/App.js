import { useState, useEffect, useRef } from 'react';
import TimerOptions from './components/TimerOptions';
import Timer from './components/Timer';
import Controllers from './components/Controllers';
import Progress from './components/Progress';

function App() {

  const PomodoroRules = {
    MAX_MINUTES: 60,
    DEFAULT_SESSION_LENGTH: 25,
    DEFAULT_BREAK_LENGTH: 5
  }

  const [sessionLength, setSessionLength] = useState(PomodoroRules.DEFAULT_SESSION_LENGTH);
  const [breakLength, setBreakLength] = useState(PomodoroRules.DEFAULT_BREAK_LENGTH);
  const [minutes, setMinutes] = useState(() => sessionLength);
  const [seconds, setSeconds] = useState(0);
  const [isSession, setIsSession] = useState(true);
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const beep = useRef(null);

  // Responde imediatamente à alteração do tempo de sessão se houver uma em andamento
  useEffect(() => {
    if(isSession){
      setMinutes(sessionLength);
      setSeconds(0);
    }
  }, [sessionLength])

  // Responde imediatamente à alteração do tempo de pausa se houver uma em andamento
  useEffect(() => {
    if(!isSession){
      setMinutes(breakLength);
      setSeconds(0);
    }
  }, [breakLength])

  // Faz o tempo diminuir caso ele não esteja pausado e toca o beep caso seja exatamente 00:00
  useEffect(() => {
    let timeOut;
    if(isTimeRunning){
      if(minutes === 0 && seconds === 0){
        beep.current.play();
      }
      timeOut = setTimeout(manageTimer, 1000);
    }
    return function cleanUp(){
      clearTimeout(timeOut);
    }
  })

  // Lida com a situação de mudança entre sessão e pausa, reiniciando o timer para a modalidade adequada
  useEffect(() => {
      if(isSession){
        setMinutes(sessionLength);
      }else{
        setMinutes(breakLength);
      }
      setSeconds(0);
  }, [isSession])

  // Retorna uma callback genérica que incrementará a duração máxima (pode ser usada para a sessão ou pausa)
  function increment(val, callback){
    return () => {
      if(!isTimeRunning && val < PomodoroRules.MAX_MINUTES){
        callback(prevVal => prevVal + 1);
      }
    }
  }

  // Retorna uma callback genérica que decrementará a duração máxima (pode ser usada para sessão ou pausa)
  function decrement(val, callback){
    return () => {
      if(!isTimeRunning && val > 1){
        callback(prevVal => prevVal - 1);
      }
    }
  }

  /*
    Trata de situações relacionadas a: fim de uma sessão / pausa, passagem de 1 minuto
    e passagem de 1 segundo
  */
  function manageTimer(){
    if(minutes === 0 && seconds === 0){
      setIsSession(prevIsSession => !prevIsSession);
    }else if(seconds === 0){
      setSeconds(59)
      setMinutes(prevMinutes => prevMinutes - 1)
    }else{
      setSeconds(prevSeconds => prevSeconds - 1)
    }
  }

  // Liga ou desliga a contagem temporal
  function toggleTimer(){
    setIsTimeRunning(prevIsTimeRunning => !prevIsTimeRunning);
  }

  function changeModality(){
    setIsSession(prevIsSession => !prevIsSession);
  }

  function resetTimer(){
    if (!beep.current.paused) {
      beep.current.pause();
      beep.current.currentTime = 0;
    }
    setIsTimeRunning(false);
    setSeconds(0);
    setMinutes(PomodoroRules.DEFAULT_SESSION_LENGTH);
    setSessionLength(PomodoroRules.DEFAULT_SESSION_LENGTH);
    setBreakLength(PomodoroRules.DEFAULT_BREAK_LENGTH);
    setIsSession(true);
  }

  return (
    <div className='main__container'>
      <div className='timer__container'>
        <Progress 
          minutes={minutes}
          seconds={seconds}
          sessionLength={sessionLength}
          breakLength={breakLength}
          isSession={isSession}
        />
        <Timer 
          minutes={minutes}
          seconds={seconds}
          isSession={isSession}
        />
      </div>
      <Controllers 
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        isTimeRunning={isTimeRunning}
        changeModality={changeModality}
        isSession={isSession}
      />
      <div className='timer__options__container'>
        <TimerOptions 
          idText={'session'} 
          toDisplay={sessionLength} 
          increment={increment(sessionLength, setSessionLength)}
          decrement={decrement(sessionLength, setSessionLength)}
        />
        <TimerOptions 
          idText={'break'} 
          toDisplay={breakLength}
          increment={increment(breakLength, setBreakLength)}
          decrement={decrement(breakLength, setBreakLength)}
        />
      </div>
      <audio 
        ref={beep} 
        id="beep" 
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        preload="auto"
      >Error</audio>
    </div>
  );
}

export default App;
