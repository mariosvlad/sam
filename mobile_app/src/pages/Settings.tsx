import { RangeChangeEventDetail } from "@ionic/core";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
  IonTitle,
  IonToolbar,
  IonButton,
  IonFooter,
  IonAlert,
  IonPage
} from "@ionic/react";
import React, { useState } from "react";
import store from "../Store";
import { observer } from "mobx-react";

const MaxLRCalibration = 20; 

function Settings() {
  const updateMaxSpeed = (event: CustomEvent<RangeChangeEventDetail>) => {
    store.setMaxSpeed(event.detail.value as number);
  };

  const updateLRCalibration = (event: CustomEvent<RangeChangeEventDetail>) => {
    store.setLRCalibration(event.detail.value as number);
  };

  const [showShutdownModal, setShowShutdownModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel className="ion-text-wrap" style={{ minWidth: 100 }}>
              Max Speed
            </IonLabel>
            <IonRange
              color="dark"
              pin={true}
              onIonChange={updateMaxSpeed}
              debounce={500}
              min={50}
              max={255}
              value={store.maxSpeed}
            />
          </IonItem>
          <IonItem>
            <IonLabel className="ion-text-wrap" style={{ minWidth: 100 }}>
              L/R Motor Calibration
            </IonLabel>
            <IonRange
              color="dark"
              pin={true}
              onIonChange={updateLRCalibration}
              debounce={500}
              min={-MaxLRCalibration}
              max={MaxLRCalibration}
              value={store.LRCalibration}
            />
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonButton
          color="danger"
          expand="block"
          onClick={() => setShowShutdownModal(true)}
        >
          Shutdown Raspberry PI
        </IonButton>
        <IonAlert
          isOpen={showShutdownModal}
          onDidDismiss={() => setShowShutdownModal(false)}
          header={"Are you sure?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel"
            },
            {
              text: "Confirm",
              handler: () => {
                store.shutdown();
              }
            }
          ]}
        />
      </IonFooter>
    </IonPage>
  );
}

export default observer(Settings);
