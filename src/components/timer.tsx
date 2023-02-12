import React from 'react';
import secondsToMinutes from '../utils/seconds-to-minutes';

interface Props {
  mainTime: number;
}

export default function Timer(props: Props) {
  return (
    <div className={`text-8xl text-center`}>
      {secondsToMinutes(props.mainTime)}
    </div>
  );
}
