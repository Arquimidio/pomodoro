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


  const [timerState, setTimerState] = useState({
    minutes: PomodoroRules.DEFAULT_SESSION_LENGTH,
    seconds: 0,
    sessionLength: PomodoroRules.DEFAULT_SESSION_LENGTH,
    breakLength: PomodoroRules.DEFAULT_BREAK_LENGTH,
    isSession: true,
    isTimeRunning: false
  })
  const beep = useRef(null);

  // Responde imediatamente à alteração do tempo de sessão se houver uma em andamento
  useEffect(() => {
    if(timerState.isSession){
      setTimerState(prevTimerState => {
        return {
          ...prevTimerState,
          minutes: timerState.sessionLength,
          seconds: 0
        } 
      })
    }
  }, [timerState.sessionLength])

  useEffect(() => {
    document.title = `${timerState.minutes} : ${timerState.seconds}`
  }, [timerState.seconds])

  // Responde imediatamente à alteração do tempo de pausa se houver uma em andamento
  useEffect(() => {
    if(!timerState.isSession){
      setTimerState(prevTimerState => {
        return {
          ...prevTimerState,
          minutes: timerState.breakLength,
        }
      })
    }
  }, [timerState.breakLength])

  // Faz o tempo diminuir caso ele não esteja pausado e toca o beep caso seja exatamente 00:00
  useEffect(() => {
    let timeOut;
    if(timerState.isTimeRunning){
      if(timerState.minutes === 0 && timerState.seconds === 0){
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
      setTimerState(prevTimerState => {
        return {
          ...prevTimerState,
          minutes: prevTimerState.isSession? timerState.sessionLength : timerState.breakLength,
          seconds: 0
        }
      })
  }, [timerState.isSession])

  // Retorna uma callback genérica que incrementará a duração máxima (pode ser usada para a sessão ou pausa)
  function increment(val, callback){
    return () => {
      if(!timerState.isTimeRunning && val < PomodoroRules.MAX_MINUTES){
        callback(prevVal => prevVal + 1);
      }
    }
  }

  // Retorna uma callback genérica que decrementará a duração máxima (pode ser usada para sessão ou pausa)
  function decrement(val, callback){
    return () => {
      if(!timerState.isTimeRunning && val > 1){
        callback(prevVal => prevVal - 1);
      }
    }
  }

  function setSessionLength(fn){
    setTimerState(prevTimerState => {
      return {
        ...prevTimerState,
        sessionLength: fn(prevTimerState.sessionLength)
      }
    })
  }

  function setBreakLength(fn){
    setTimerState(prevTimerState => {
      return {
        ...prevTimerState,
        breakLength: fn(prevTimerState.sessionLength)
      }
    })
  }

  /*
    Trata de situações relacionadas a: fim de uma sessão / pausa, passagem de 1 minuto
    e passagem de 1 segundo
  */
  function manageTimer(){
    if(timerState.minutes === 0 && timerState.seconds === 0){
      setTimerState(prevTimerState => {
        return {
          ...prevTimerState,
          isSession: !prevTimerState.isSession
        }
      })
    }else if(timerState.seconds === 0){
      setTimerState(prevTimerState => {
        return {
          ...prevTimerState,
          minutes: prevTimerState.minutes - 1,
          seconds: 59
        }
      })
    }else{
      setTimerState(prevTimerState => {
        return {
          ...prevTimerState,
          seconds: prevTimerState.seconds - 1
        }
      })
    }
  }

  // Liga ou desliga a contagem temporal
  function toggleTimer(){
    setTimerState(prevTimerState => {
      return {
        ...prevTimerState,
        isTimeRunning: !prevTimerState.isTimeRunning
      }
    })
  }

  function changeModality(){
    setTimerState(prevTimerState => {
      return {
        ...prevTimerState,
        isSession: !prevTimerState.session
      }
    })
  }

  function resetTimer(){
    if (!beep.current.paused) {
      beep.current.pause();
      beep.current.currentTime = 0;
    }

    setTimerState(prevTimerState => {
      return {
        minutes: PomodoroRules.DEFAULT_SESSION_LENGTH,
        seconds: 0,
        isTimeRunning: false,
        isSession: true,
        sessionLength: PomodoroRules.DEFAULT_SESSION_LENGTH,
        breakLength: PomodoroRules.DEFAULT_BREAK_LENGTH
      }
    })
  }

  return (
    <div className='main__container'>
      <div className='timer__container'>
        <Progress 
          minutes={timerState.minutes}
          seconds={timerState.seconds}
          sessionLength={timerState.sessionLength}
          breakLength={timerState.breakLength}
          isSession={timerState.isSession}
        />
        <Timer 
          minutes={timerState.minutes}
          seconds={timerState.seconds}
          isSession={timerState.isSession}
        />
      </div>
      <Controllers 
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        isTimeRunning={timerState.isTimeRunning}
        changeModality={changeModality}
        isSession={timerState.isSession}
      />
      <div className='timer__options__container'>
        <TimerOptions 
          idText={'session'} 
          toDisplay={timerState.sessionLength} 
          increment={increment(timerState.sessionLength, setSessionLength)}
          decrement={decrement(timerState.sessionLength, setSessionLength)}
        />
        <TimerOptions 
          idText={'break'} 
          toDisplay={timerState.breakLength}
          increment={increment(timerState.breakLength, setBreakLength)}
          decrement={decrement(timerState.breakLength, setBreakLength)}
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
