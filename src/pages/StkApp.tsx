import {
  IonAlert,
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { apertureOutline, ellipse, square } from "ionicons/icons";
import React from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { setErrorShow } from "../slice/commonSlice";
import Post from "./Post";
import Search from "./Search";
import Stock from "./Stock";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";

const StkApp: React.FC = () => {
    
  const errorShow = useSelector(
    (state: RootStateOrAny) => state.common.error.show
  );
  const errorMessage = useSelector(
    (state: RootStateOrAny) => state.common.error.message
  );
  const dispatch = useDispatch();

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/post" component={Post} exact={true} />
            <Route path="/tab2" component={Tab2} exact={true} />
            <Route path="/tab3" component={Tab3} />
            <Route path="/search" component={Search} />
            <Route path="/stock/:code/:tab?" component={Stock} />
            <Route
              path="/"
              render={() => <Redirect to="/post" />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="post" href="/post">
              <IonIcon icon={apertureOutline} />
              <IonLabel>帖子</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={ellipse} />
              <IonLabel>Tab 2</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={square} />
              <IonLabel>Tab 3</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>

      <IonAlert
        isOpen={errorShow}
        onDidDismiss={() => dispatch(setErrorShow(false))}
        // cssClass='my-custom-class'
        header={"错误信息"}
        message={errorMessage}
        buttons={["确认"]}
      />
    </IonApp>
  );
};

export default StkApp;
