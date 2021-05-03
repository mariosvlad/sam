import { Plugins } from "@capacitor/core";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupConfig,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import "@ionic/react/css/core.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import { settings, gameController } from "ionicons/icons";
import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import HomeTab from "./pages/Home";
import SettingsTab from "./pages/Settings";
import "./theme/variables.css";
const { SplashScreen, App: IonicApp } = Plugins;

setupConfig({
  animated: true,
  hardwareBackButton: true,
});

IonicApp.addListener("backButton", () => {
  IonicApp.exitApp();
});

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={HomeTab} exact={true} />
            <Route path="/settings" component={SettingsTab} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={gameController} />
              <IonLabel>Drive</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
