import React from 'react';
import PomodoroTimer from './components/pomodoro-timer';

function App() {
  return (
    <div className="max-w-2xl my-0 mx-auto">
      <PomodoroTimer
        pomodoroTime={5}
        shortRestTime={2}
        longRestTime={5}
        cycles={4}
      />
    </div>
  );
}

export default App;
