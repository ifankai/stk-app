import {
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import React, { CSSProperties, useRef, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import darkLogo from "../assets/google_dark.png";
import lightLogo from "../assets/google_light.png";
import { Dict } from "../model/Dict";
import { SearchResult } from "../model/SearchResult";
import dictService from "../service/dict.service";
import { setErrorMessage } from "../slice/commonSlice";
import { getPost, setSegment } from "../slice/postSlice";
import { getSearchResult, setSearchResult, setSearchText } from "../slice/searchSlice";

const SearchModal = () => {

  const searchText = useSelector(
    (state: RootStateOrAny) => state.search.text
  );
  
  const searchResults : SearchResult[] = useSelector(
    (state: RootStateOrAny) => state.search.results
  );
  

  const [keywords, setKeywords] = useState<Dict[]>([]);
  const dispatch = useDispatch();
  const history = useHistory();

  // Component ref
  const keyboard = useRef<HTMLIonSearchbarElement>(null);
  // 进入页面后光标focus
  useIonViewDidEnter(() => keyboard.current?.setFocus());

  const search = (text: string) => {
    console.log("search text:" + text);
    if (!text.length) {
      dispatch(setSearchText(""));
      dispatch(setSearchResult([]));
    } else {
      dispatch(setSearchText(text));
      dispatch(getSearchResult(text));
    }
  };

  const displayResult = (type: string, searchText: string) => {
    //history.push("/tab2")
    if (type === "post") {
      history.goBack();
      dispatch(setSegment("search"));
      dispatch(getPost("search", 1, searchText))
    }
  };

  useIonViewWillEnter(async () => {
    console.log("useIonViewWillEnter");
    const result = await dictService.getDict(1200);    
    if (result.success) {
      const dicts = await result.data as [];
      setKeywords(dicts);
    } else {
      dispatch(setErrorMessage(result.data as string));
    }
  });

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
            debounce={500}
            enterkeyhint="search"
            showCancelButton="always"
            cancelButtonText="取消"
            onIonCancel={() => history.goBack()}
            ref={keyboard}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {searchText && (
          <IonItem
            className="ion-no-margin"            
            onClick={() => displayResult("post", searchText)}
            detail={false}
          >
            <IonIcon
              color={"primary"}
              ios={searchOutline}
              md={searchOutline}
              slot="start"
            />
            <IonLabel>{searchText}</IonLabel>
          </IonItem>
        )}
        {
          searchResults && searchResults.map((result) => 
            (
            <IonItem className="ion-no-margin" key={result.text}>
              <IonLabel className="ion-no-margin">{result.text}</IonLabel>
            </IonItem>
            )
          )
        }
        <IonItemDivider>
          <IonLabel>重点关键字：<IonRouterLink href="/stock/SH600600">600600</IonRouterLink></IonLabel>
        </IonItemDivider>
        {keywords &&
          keywords.map((k) => {
            return (
              <IonChip style={chipStyle} key={k.text}>
                <IonLabel key={k.text} onClick={() => displayResult("post", k.text)}>
                  {k.text}
                </IonLabel>
              </IonChip>
            );
          })}

      </IonContent>

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

const chipStyle: CSSProperties = {
  borderRadius: "5px",
};

const searchBarStyle: CSSProperties = {
  paddingBottom: "0px",
  paddingTop: "0px",
};

export default SearchModal;
