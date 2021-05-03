import io from "socket.io-client";
import store from "./Store";

const baseIP = "http://192.168.43"; // 172.20.10 for iPhone
let socket: SocketIOClient.Socket;

export function sendSpeed(speedL: number, speedR: number) {
  if (!socket) {
    return;
  }
  socket.emit("setSpeed", Math.round(speedL), Math.round(speedR));
}

function oneSuccess(promises: Promise<any>[]) {
  return Promise.all(
    promises.map((p) => {
      return p.then(
        (val) => Promise.reject(val),
        (err) => Promise.resolve(err)
      );
    })
  ).then(
    (errors) => Promise.reject(errors),
    (val) => Promise.resolve(val)
  );
}

const findIPPromises = () =>
  [...Array(254)].map((_, i) => {
    return new Promise((resolve, reject) => {
      fetch(`${baseIP}.${i + 2}:4000`)
        .then((r) => r.text())
        .then((result) => {
          if (result === "sam") {
            resolve(i + 2);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  });

export function initializeWebsockets() {
  store.setConnectionStatus("loading");
  if (store.RPIUrl) {
    if (!socket) {
      socket = io(store.RPIUrl as string);
    }
    socket.connect();
    return;
  }

  if (process.env.NODE_ENV !== "production") return;

  oneSuccess(findIPPromises())
    .then((result) => {
      store.setRPIUrl(`${baseIP}.${result}:4000`);
      socket = io(store.RPIUrl as string);

      socket.connect();
      socket.on("arduino", (data: string) => {
        store.onArduinoData(data);
      });
      socket.on("connect", () => {
        store.setConnectionStatus("online");
      });
      socket.on("connect_timeout", () => {
        store.setConnectionStatus("failed");
      });
      socket.on("disconnect", () => {
        store.setConnectionStatus("failed");
      });
    })
    .catch((e) => {
      store.setConnectionStatus("failed");
    });
}
