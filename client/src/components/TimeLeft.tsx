import { useEffect, useState } from "react";

interface Props {
  expiresAt: string;
}

const TimeLeft = ({ expiresAt }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expiresAtTime = new Date(expiresAt).getTime();
    if (expiresAtTime <= Date.now()) {
      setTimeLeft(0);
      return;
    }
    const findTimeLeft = () => {
      const msLeft = expiresAtTime - Date.now();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60); // Calculate minutes
  const seconds = timeLeft % 60; // Calculate remaining seconds

  if (timeLeft <= 0) {
    return <div>Expired</div>;
  }
  return (
    <div>
      {minutes}:{seconds}
    </div>
  );
};

export default TimeLeft;
