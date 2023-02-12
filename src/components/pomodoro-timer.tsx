import React, { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import Button from './button';
import Timer from './timer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export default function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime((prev) => prev - 1);
      if (working) setFullWorkingTime((prev) => prev + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) setMainTime(props.longRestTime);
      else setMainTime(props.shortRestTime);

      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (working) document.body.classList.add('bg-red-working');
    if (resting) document.body.classList.remove('bg-red-working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles((prev) => prev + 1);
    }

    if (working) setNumberOfPomodoros((prev) => prev + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    props.cycles,
  ]);

  return (
    <div className={`bg-white my-12 mx-5 p-5 rounded shadow-2xl`}>
      <h2 className="text-2xl text-center">
        Você está: {working ? 'Trabalhando' : 'Descansando'}
      </h2>
      <Timer mainTime={mainTime}></Timer>
      <div className="flex items-center justify-evenly">
        {[
          { text: 'Work', fn: configureWork },
          { text: 'Rest', fn: () => configureRest(false) },
          { text: 'Play', fn: () => setTimeCounting(!timeCounting) },
        ].map(({ text, fn }, idx) => (
          <Button
            key={idx}
            text={text === 'Play' && timeCounting ? 'Pause' : text}
            onClick={fn}
            className={`
              ${text === 'Play' && !working && !resting ? 'hidden' : ''}
              ${!working ? 'bg-green-resting' : 'bg-red-working'}
              border-none cursor-pointer
              px-6 py-3 text-black my-5 mx-auto
              transition-[background-color] delay-300 ease-in-out
            `}
          />
        ))}
      </div>

      <div className={`my-5 mx-0`}>
        <p>Cyclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
