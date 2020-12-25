import {
  IonFooter,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter
} from "@ionic/react";
import React, { CSSProperties, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import darkLogo from "../assets/google_dark.png";
import lightLogo from "../assets/google_light.png";
import { getSearchResult, setSearchPosts } from "../slice/searchSlice";

const SearchModal = () => {
  const [searchText, setSearchText] = useState<string>();
  const dispatch = useDispatch();

  const history = useHistory();

  // Component ref
  const keyboard = useRef<HTMLIonSearchbarElement>(null);
  // 进入页面后光标focus
  useIonViewDidEnter(() => keyboard.current?.setFocus());

  const search = (text : string) => {
    console.log('search text:'+text)
    if (!text.length) {
      dispatch(setSearchPosts([]))
    }
    setSearchText(text)
    dispatch(getSearchResult(text))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonSearchbar
            mode="ios"
            style={searchBarStyle}
            value={searchText}
            onIonChange={(e: CustomEvent) => search(e.detail.value)}
            placeholder="查询"
            debounce={750}
            enterkeyhint="search"
            showCancelButton="always"
            cancelButtonText="取消"
            onIonCancel={() => history.goBack()}
            ref={keyboard}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      {/* <SearchModalContent /> */}
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <IonTitle slot="end">
            <picture>
              <source srcSet={darkLogo} media="(prefers-color-scheme: dark)" />
              <img style={imgStyle} src={lightLogo} alt={"google logo"} />
            </picture>
          </IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

const imgStyle: CSSProperties = {
  height: "25px",
  width: "150px",
  objectFit: "contain",
};

const searchBarStyle: CSSProperties = {
  paddingBottom: "0px",
  paddingTop: "0px",
};

export default SearchModal;
