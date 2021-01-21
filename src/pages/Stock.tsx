import {
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonPage,
    IonToolbar,
    useIonViewDidEnter
} from "@ionic/react";
import { chevronBack, search } from "ionicons/icons";
import React, { CSSProperties, useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router";
import { setStockCode } from "../slice/stockSlice";

interface StockProps
  extends RouteComponentProps<{
    code: string;
    tab: string;
  }> {}

const Stock: React.FC<StockProps> = (props: StockProps) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [tab, setTab] = useState<string>('');

  const code = useSelector(
    (state: RootStateOrAny) => state.stock.code
  );

  const tabs = [
    { key: "info", name: "综合" },
    { key: "post", name: "帖子" },
    { key: "holder", name: "股东" },
  ];

  const stockCode = props.match.params.code;

  const goBack = () => {
    history.goBack();
  };

  useIonViewDidEnter(() => {
    console.log("Stock useIonViewDidEnter", code);
  });

  useEffect(() => {
    dispatch(setStockCode(stockCode));  
    tabChange(props.match.params.tab === undefined ? tabs[0].key : props.match.params.tab)
  }, []);

  const tabChange = (key: string) => {
    setTab(key);
    history.replace("/stock/" + stockCode + "/" + key);
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar className="ion-text-center">
          <IonButtons slot="start">
            <IonButton onClick={goBack}>
              <IonIcon slot="icon-only" icon={chevronBack}></IonIcon>
            </IonButton>
          </IonButtons>

          <IonLabel>{code}</IonLabel>

          <IonButtons slot="end">
            <IonButton routerLink="/search">
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader slot="fixed">
          {tabs &&
            tabs.map((item) => {
              return (
                <IonChip
                  key={item.key}
                  style={chipStyle}
                  outline={tab !== item.key}
                >
                  <IonLabel onClick={() => tabChange(item.key)}>
                    {item.name}
                  </IonLabel>
                </IonChip>
              );
            })}
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

const chipStyle: CSSProperties = {
  borderRadius: "2px",
  //height: "26px",
  border: 0,
};

export default Stock;
