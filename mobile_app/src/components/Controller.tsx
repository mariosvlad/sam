import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import ReactNipple from "react-nipple";
import "react-nipple/lib/styles.css";
import store from "../Store";

const controllerSVG = `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMTM1LjEgMjA0LjZjLTEwLjcgMC0xOS4zIDguNy0xOS4zIDE5LjRzOC43IDE5LjQgMTkuMyAxOS40YzEwLjYgMCAxOS4zLTguNyAxOS4zLTE5LjRzLTguNi0xOS40LTE5LjMtMTkuNHoiLz48cGF0aCBkPSJNNDY2LjMgMjQ4LjljLTIxLjItODguNS00My42LTEzNS41LTg4LjUtMTQ4LjgtOS44LTIuOS0xOC4xLTQtMjUuNy00LTI3LjYgMC00Ni45IDE0LjctOTYuMSAxNC43LTQ5LjIgMC02OC41LTE0LjctOTYuMS0xNC43LTcuNyAwLTE2IDEuMS0yNS43IDQtNDQuOSAxMy4zLTY3LjMgNjAuNC04OC41IDE0OC44LTIxLjIgODguNS0xNy4zIDE1Mi40IDcuNyAxNjQuMyA0LjEgMS45IDguMiAyLjggMTIuNSAyLjggMjEuNyAwIDQ1LjEtMjMuOCA2Ny43LTUyIDI1LjctMzIuMSAzMi4xLTMzIDExMC4zLTMzaDI0LjNjNzguMSAwIDg0LjYuOCAxMTAuMyAzMyAyMi41IDI4LjIgNDYgNTIgNjcuNyA1MiA0LjIgMCA4LjQtLjkgMTIuNS0yLjggMjQuOS0xMiAyOC43LTc1LjkgNy42LTE2NC4zem0tMzMxLjEgMTQuN2MtMjEuNiAwLTM5LjItMTcuOC0zOS4yLTM5LjZzMTcuNi0zOS42IDM5LjItMzkuNmMyMS43IDAgMzkuMiAxNy44IDM5LjIgMzkuNi4xIDIxLjktMTcuNSAzOS42LTM5LjIgMzkuNnptMTcyLjktMTkuNWMtMTEuMSAwLTIwLjEtOS0yMC4xLTIwLjEgMC0xMS4xIDktMjAuMSAyMC4xLTIwLjEgMTEuMSAwIDIwLjEgOSAyMC4xIDIwLjEgMCAxMS4xLTkgMjAuMS0yMC4xIDIwLjF6TTM1MiAyODhjLTExLjEgMC0yMC4xLTktMjAuMS0yMCAwLTExLjIgOS0yMC4xIDIwLjEtMjAuMSAxMS4xIDAgMjAuMSA4LjkgMjAuMSAyMC4xIDAgMTEtOSAyMC0yMC4xIDIwem0wLTg3LjhjLTExLjEgMC0yMC4xLTktMjAuMS0yMC4xIDAtMTEuMSA5LTIwLjEgMjAuMS0yMC4xIDExLjEgMCAyMC4xIDkgMjAuMSAyMC4xIDAgMTEuMS05IDIwLjEtMjAuMSAyMC4xem00My45IDQzLjljLTExLjEgMC0yMC4xLTktMjAuMS0yMC4xIDAtMTEuMSA5LTIwLjEgMjAuMS0yMC4xIDExLjEgMCAyMC4xIDkgMjAuMSAyMC4xIDAgMTEuMS05IDIwLjEtMjAuMSAyMC4xeiIvPjwvc3ZnPg==`;
const rippleMaxDistance = 50;

function Controller() {
  const [angle, setAngle] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // send speed information periodically to the server even if it didn't change
    // otherwise it will stop (security safeguard)
    const interval = setInterval(() => {
      if (isPressed) {
        store.setSpeed(store.speedL, store.speedR);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [isPressed]);

  const handleEvent = (e: any, data: any) => {
    if (data.angle && data.angle.degree) {
      setAngle(data.angle.degree);
    }
    if (data.distance != null) {
      setDistance(data.distance);
    }
    if (e.type === "end") {
      setDistance(0);
      setIsPressed(false);
    }
    if (e.type === "start") {
      setIsPressed(true);
    }
  };

  const speed = (distance * store.maxSpeed) / rippleMaxDistance;

  const [speedL, speedR] = calculateSpeedByAngle(speed, angle);

  store.setSpeed(speedL, speedR);

  return (
    <ReactNipple
      className="joystick"
      options={{ mode: "dynamic", color: "red", dynamicPage: true }}
      style={{
        width: "100%",
        height: "100%",
        bottom: 0,
        backgroundImage: isPressed
          ? null
          : `url(data:image/svg+xml;base64,${controllerSVG})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "40%"
      }}
      onEnd={handleEvent}
      onMove={handleEvent}
      onStart={handleEvent}
    />
  );
}

function calculateSpeedByAngle(speed: number, angle: number): [number, number] {
  let speedL = 0;
  let speedR = 0;
  if (angle < 90) {
    speedL = speed;
    speedR = speed - ((90 - angle) * speed * 2) / 90;
  } else if (angle < 180) {
    speedR = speed;
    speedL = -speed + ((180 - angle) * speed * 2) / 90;
  } else if (angle < 270) {
    speedL = -speed;
    speedR = -speed + ((270 - angle) * speed * 2) / 90;
  } else {
    speedR = -speed;
    speedL = speed - ((360 - angle) * speed * 2) / 90;
  }
  return [speedL, speedR];
}

export default observer(Controller);
