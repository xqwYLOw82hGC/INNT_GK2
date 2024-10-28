import React, { createContext, useState, useEffect } from 'react';

export const TimerContext = createContext(); //Bruges til at holde styr på timeren.

//forskellen på timeerprovider og timercontext er at timerprovider er en funktion, der tager children som argument og returnerer en provider, der indeholder værdierne for remainingTime, setRemainingTime, isActive og setIsActive.
export const TimerProvider = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [isActive, setIsActive] = useState(false);

  //useeffect sørger for at timeren tæller ned.
  useEffect(() => {
    let timer;
    if (isActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            setIsActive(false);
            return 0;
          }
          return prev - 1000; //Tæller ned med 1 sek ad gangen.
        });
      }, 1000);
    }

    //stopper timeren når den er færdig
    return () => clearInterval(timer);
  }, [isActive, remainingTime]);

  //returnerer værdierne for den tid der er tilbage, samt om timeren er aktiv eller ej.
  return (
    <TimerContext.Provider
      value={{
        remainingTime,
        setRemainingTime,
        isActive,
        setIsActive,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
