import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { observer } from "mobx-react";
import React from "react";
import Controller from "../components/Controller";
import Sensors from "../components/Sensors";
import Status from "../components/Status";

function Home() {
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sam</IonTitle>
          </IonToolbar>
          <Status />
          <Sensors />
        </IonHeader>
        <IonContent>
          <Controller />
        </IonContent>
      </IonPage>
    </>
  );
}

export default observer(Home);
