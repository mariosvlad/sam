import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner
} from "@ionic/react";
import { checkmarkCircle, batteryFull, batteryDead } from "ionicons/icons";
import { observer } from "mobx-react";
import React from "react";
import store from "../Store";
import { initializeWebsockets } from "../Services";

function StatusCard() {
  const loadingStatus = (
    <>
      <IonLabel>Connecting</IonLabel>
      <IonSpinner />
    </>
  );

  const onlineStatus = (
    <>
      <IonLabel>Status</IonLabel>
      <IonChip color="success">
        <IonIcon icon={checkmarkCircle} />
        <IonLabel>Online</IonLabel>
      </IonChip>
    </>
  );

  const isBatteryEmpty = store.battery < 15;
  let batteryColor = isBatteryEmpty ? "danger" : "success";
  if (store.battery < 60 && store.battery >= 15) {
    batteryColor = "warning";
  }
  const batteryStatus = (
    <>
      <IonLabel>Battery</IonLabel>
      <IonChip color={batteryColor}>
        <IonIcon icon={isBatteryEmpty ? batteryDead : batteryFull} />
        <IonLabel>{store.battery}%</IonLabel>
      </IonChip>
    </>
  );

  const failedStatus = (
    <>
      <IonLabel>Connection failed</IonLabel>
      <IonButton
        color="danger"
        slot="end"
        shape="round"
        fill="outline"
        onClick={() => initializeWebsockets()}
      >
        Retry
      </IonButton>
    </>
  );

  let status = loadingStatus;
  if (store.connectionStatus === "online") {
    status = onlineStatus;
  } else if (store.connectionStatus === "failed") {
    status = failedStatus;
  }

  return (
    <>
      <IonCard>
        <IonCardContent>
          <IonItem lines="none">{status}</IonItem>
          {store.battery >= 0 && (
            <IonItem lines="none">{batteryStatus}</IonItem>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
}

export default observer(StatusCard);
