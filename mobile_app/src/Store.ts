import { types } from "mobx-state-tree";
import { sendSpeed } from "./Services";
import { voltageToPercentage } from "./helper";

const Store = types
  .model("Root", {
    speedL: types.number,
    speedR: types.number,
    RPIUrl: types.maybe(types.string),
    connectionStatus: "failed",
    maxSpeed: 255,
    LRCalibration: 0,
    S0: 0,
    S1: 0,
    battery: -1,
  })
  .actions((self) => ({
    setSpeed(speedL: number, speedR: number) {
      let adjustedSpeedL = speedL;
      let adjustedSpeedR = speedR;

      if (self.LRCalibration < 0 && speedR > 0) {
        adjustedSpeedR += self.LRCalibration;
      }
      if (self.LRCalibration > 0 && speedL > 0) {
        adjustedSpeedL -= self.LRCalibration;
      }
      adjustedSpeedL = Math.max(0, adjustedSpeedL);
      adjustedSpeedR = Math.max(0, adjustedSpeedR);

      self.speedL = adjustedSpeedL;
      self.speedR = adjustedSpeedR;
      sendSpeed(adjustedSpeedL, adjustedSpeedR);
    },
    setRPIUrl(RPIUrl: string) {
      self.RPIUrl = RPIUrl;
    },
    setConnectionStatus(connectionStatus: string) {
      self.connectionStatus = connectionStatus;
    },
    setMaxSpeed(maxSpeed: number) {
      self.maxSpeed = maxSpeed;
    },
    setLRCalibration(LRCalibration: number) {
      self.LRCalibration = LRCalibration;
      this.setSpeed(self.speedL, self.speedR);
    },
    shutdown() {
      this.setSpeed(0, 0);
      fetch(`${self.RPIUrl}/shutdown`);
    },
    onArduinoData(data: string) {
      const values = data.split(",");
      switch (values[0]) {
        case "S0":
          self.S0 = Number(values[1]);
          break;
        case "S1":
          self.S1 = Number(values[1]);
          break;
        case "B":
          self.battery = voltageToPercentage(Number(values[1]));
          if (self.battery <= 10) {
            this.setSpeed(0, 0);
          }
          break;
      }
    },
  }));

const store = Store.create({
  speedL: 0,
  speedR: 0,
});

export default store;
