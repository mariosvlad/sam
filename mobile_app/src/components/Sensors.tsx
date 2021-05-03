import { IonCard, IonCardContent, IonItem } from "@ionic/react";
import { observer } from "mobx-react";
import React from "react";
import store from "../Store";

function SensorsCard() {
  return (
    <>
      <IonCard>
        <IonCardContent>
          <IonItem lines="none">Sonar 1: {store.S0}cm</IonItem>
          <IonItem lines="none">Sonar 2: {store.S1}cm</IonItem>
        </IonCardContent>
      </IonCard>
    </>
  );
}

export default observer(SensorsCard);
