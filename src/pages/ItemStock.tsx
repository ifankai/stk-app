import { IonCol, IonFooter, IonGrid, IonItem, IonItemGroup, IonRow, IonToolbar } from "@ionic/react";
import React from "react";
import { ItemProps } from "../model/ItemProps";

const ItemStock: React.FC<ItemProps> = ({ segment, esDocument }) => {
  return (
    <IonItemGroup className="item">
      <IonItem>{esDocument.title}</IonItem>

      <IonFooter className="ion-no-padding ion-no-border">
        <IonToolbar className="footer ion-no-padding">
          <IonGrid className="ion-no-padding footer-grid">
            <IonRow className="ion-no-padding">
              <IonCol className="ion-padding-horizontal">
                行业 {esDocument.desc}
              </IonCol>
              <IonCol className="ion-padding-horizontal">
                F9
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>

    </IonItemGroup>
  );
};

export default ItemStock;
