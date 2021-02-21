import {
  IonCol,
  IonFooter,
  IonGrid,
  IonItem,
  IonItemGroup,
  IonRow,
  IonToolbar
} from "@ionic/react";
import React, { CSSProperties } from "react";
import { useDispatch } from "react-redux";
import { ItemProps } from "../model/ItemProps";
import { EsDocument } from "../model/SearchResult";
import { setModalDetail, setModalTitle, setShowModal } from "../slice/postSlice";

const ItemStock: React.FC<ItemProps> = ({ segment, esDocument }) => {
  
  const dispatch = useDispatch();

  const popupModal = (esDocument: EsDocument) => {
    dispatch(setModalTitle(esDocument.title));
    dispatch(setModalDetail(esDocument.content));
    dispatch(setShowModal(true));
  };

  return (
    <IonItemGroup className="item">
      <IonItem>
        <b><div
          dangerouslySetInnerHTML={{
            __html: esDocument.title,
          }}
        ></div></b>
      </IonItem>

      <IonFooter className="ion-no-padding ion-no-border">
        <IonToolbar className="footer ion-no-padding">
          <IonGrid className="ion-no-padding footer-grid">
            <IonRow className="ion-no-padding">
              <IonCol style={styleCol}>                
                <div
                  dangerouslySetInnerHTML={{
                    __html: "行业: " + esDocument.desc,
                  }}
                ></div>
              </IonCol>
              <IonCol style={styleCol} onClick={() => popupModal(esDocument)}>F9</IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonItemGroup>
  );
};

const styleCol: CSSProperties = {  
  paddingLeft: 14
};

export default ItemStock;
