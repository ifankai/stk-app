import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from "@ionic/react";
import { chevronBack, closeOutline, search } from "ionicons/icons";
import _ from "lodash";
import React, { CSSProperties, useEffect, useRef } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import "../css/Post.css";
import { PageRoot } from "../model/PageRoot";
import { EsDocument } from "../model/SearchResult";
import postService from "../service/post.service";
import {
  getPostAfter,
  getPostBefore,
  getSearchResults,
  setPostsBySegment,
  setSearchPage,
  setSegment,
  setShowDetail,
  setSubSegment
} from "../slice/postSlice";
import PostListItem from "./PostListItem";

const PostList: React.FC = () => {
  const dispatch = useDispatch();

  const segment = useSelector((state: RootStateOrAny) => state.post.segment);
  const subSegment = useSelector(
    (state: RootStateOrAny) => state.post.subSegment
  );

  const allPosts = useSelector((state: RootStateOrAny) => state.post.allPosts);

  //const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const favoritePosts = useSelector(
    (state: RootStateOrAny) => state.post.favoritePosts
  );
  //const [searchPosts, setSearchPosts] = useState<Post[]>([]);
  const searchResults = useSelector(
    (state: RootStateOrAny) => state.post.searchResults
  );
  const searchPage = useSelector(
    (state: RootStateOrAny) => state.post.searchPage
  );

  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const ionSegRef = useRef<HTMLIonSegmentButtonElement>(null);
  const ionListRef = useRef<HTMLIonListElement>(null);
  const ionInfinite = useRef<HTMLIonInfiniteScrollElement>(null);
  const ionModalRef = useRef<HTMLIonModalElement>(null);
  const ionMenuRef = useRef<HTMLIonMenuElement>(null);

  const searchText = useSelector((state: RootStateOrAny) => state.search.text);

  const showDetail = useSelector(
    (state: RootStateOrAny) => state.post.showDetail
  );
  const postDetail = useSelector(
    (state: RootStateOrAny) => state.post.postDetail
  );
  const noMoreData = useSelector(
    (state: RootStateOrAny) => state.post.noMoreData
  );

  //你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合
  /**
   * 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。
   * 这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。
   */
  useEffect(() => {
    console.log("useEffect init");
  }, []);

  useEffect(() => {
    console.log("useEffect", segment);
    //dispatch(setNoMoreData(false))
    doRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]); // 第二个参数表明 仅在 segment 更改时调用这个方法(useEffect)

  useEffect(() => {
    console.log("useEffect subSegment", subSegment);
    doRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subSegment]);

  // useEffect(() => {
  //   //setPosts(unreadPosts)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [readPosts]);

  useIonViewWillEnter(() => {
    console.log("useIonViewWillEnter");
    //initPostList();
  });

  const segmentButtonClick = async () => {
    ionContentRef.current?.getScrollElement().then((el) => {
      el.scrollTo({ left: 0, top: 0 });
    });
  };

  const getPostsBySegment = (): PageRoot<EsDocument> => {
    if (segment === "all") {
      return allPosts;
    } else if (segment === "favorite") {
      return favoritePosts;
    } else if (segment === "search") {
      return searchResults;
    }
    return {} as PageRoot<EsDocument>;
  };

  const doRefresh = async () => {
    ionContentRef.current?.scrollToTop();
    console.log("doRefresh:", segment);

    if (segment === "search") {
      if (!searchText) return;
      else {
        dispatch(setSearchPage(1));
        dispatch(getSearchResults(searchText));
      }
    } else {
      const posts: EsDocument[] = getPostsBySegment().list;
      dispatch(
        getPostAfter(
          segment,
          posts?.length > 0 ? posts[0].post.id : -1,
          searchText
        )
      );
    }
    ionRefresherRef.current!.complete();
  };

  const toggleFavorite = (esDocument: EsDocument) => {
    let posts = getPostsBySegment().list;
    console.log(posts);
    posts &&
      posts.forEach((e) => {
        if (e.post.id === esDocument.post.id) {
          e.post.isFavorite = !e.post.isFavorite;
        }
      });
    console.log(posts);
    dispatch(setPostsBySegment(posts));
    postService.setFavorite(esDocument.post.id, esDocument.post.isFavorite);
  };

  const appendData = async () => {
    if (noMoreData) return;
    ionInfinite.current?.complete();

    if (segment === "search") {
      dispatch(setSearchPage(searchPage + 1));
      dispatch(getSearchResults(searchText, searchPage + 1));
    } else {
      const posts: EsDocument[] = getPostsBySegment().list;
      dispatch(
        getPostBefore(
          segment,
          posts.length > 0 ? posts[posts.length - 1].post.id : -1,
          searchText
        )
      );
    }
  };

  const closeDetail = () => {
    dispatch(setShowDetail(false));
    if (ionModalRef) ionModalRef.current?.dismiss();
  };

  const closeMenu = () => {
    console.log("menuclose...");
    ionMenuRef.current?.close();
  };

  return (
    <IonPage id="post">
      <IonMenu
        side="start"
        contentId="post"
        type="overlay"
        ref={ionMenuRef}
        onClick={closeMenu}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Start Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>Menu Item</IonItem>
            <IonItem>Menu Item</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonHeader translucent={true}>
        <IonToolbar className="ion-text-center">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonLabel>帖子</IonLabel>

          <IonButtons slot="end">
            <IonButton routerLink="/search">
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader slot="fixed">
          <IonSegment
            value={segment}
            onIonChange={(e) => dispatch(setSegment(e.detail.value))}
          >
            <IonSegmentButton
              value="all"
              ref={ionSegRef}
              onClick={segmentButtonClick}
            >
              全部
            </IonSegmentButton>
            <IonSegmentButton value="favorite" onClick={segmentButtonClick}>
              收藏
            </IonSegmentButton>
            <IonSegmentButton value="search" onClick={segmentButtonClick}>
              搜索
            </IonSegmentButton>
          </IonSegment>
        </IonHeader>

        {segment === "search" && (
          <IonHeader slot="fixed">
            <IonSegment
              style={styleSubSegment}
              mode="ios"
              value={subSegment}
              onIonChange={(e) => dispatch(setSubSegment(e.detail.value))}
            >
              <IonSegmentButton value="all">
                <IonLabel>综合</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="type=post&subType=300">
                <IonLabel>雪球公告</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
        )}

        <IonContent ref={ionContentRef} slot="fixed">
          <IonRefresher
            slot="fixed"
            onIonRefresh={(e) => {
              doRefresh();
            }}
            ref={ionRefresherRef}
          >
            <IonRefresherContent
              pullingIcon={null}
              refreshingSpinner="bubbles"
            ></IonRefresherContent>
          </IonRefresher>

          <IonList ref={ionListRef}>
            {segment === "all" &&
              allPosts.list &&
              allPosts.list.map((esDocument: EsDocument) => {
                return (
                  <PostListItem
                    segment={segment}
                    esDocument={esDocument}
                    toggleFavorite={(post) => toggleFavorite(esDocument)}
                    key={esDocument.post?.id}
                  />
                );
              })}

            {segment === "favorite" &&
              favoritePosts.list &&
              favoritePosts.list.map((esDocument: EsDocument) => {
                return (
                  <PostListItem
                    segment={segment}
                    esDocument={esDocument}
                    toggleFavorite={(post) => toggleFavorite(esDocument)}
                    key={esDocument.post.id}
                  />
                );
              })}

            {segment === "search" &&
              searchResults.list &&
              searchResults.list.map((esDocument: EsDocument) => {
                if (esDocument.type === "post") {
                  return (
                    <PostListItem
                      segment={segment}
                      esDocument={esDocument}
                      toggleFavorite={(post) => toggleFavorite(esDocument)}
                      key={esDocument.post.id}
                    />
                  );
                } else if (esDocument.type === "stock") {
                  //sconst stock = { ...(result.data as Post), ...result };
                  // return (
                  //   <StockListItem
                  //     stock={stock}
                  //     key={stock.id}
                  //   />
                  // );
                }
              })}

            {noMoreData && <div className="no-more-data">---已经到底---</div>}
            <div className="post-item-footer"></div>
          </IonList>

          <IonInfiniteScroll
            ref={ionInfinite}
            threshold="100px"
            onIonInfinite={appendData}
            disabled={noMoreData}
          >
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="正在加载..."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>

        <IonModal
          ref={ionModalRef}
          isOpen={showDetail}
          onDidDismiss={closeDetail}
        >
          <IonHeader>
            <IonToolbar className="ion-text-center">
              <IonButtons slot="start">
                <IonButton onClick={closeDetail}>
                  <IonIcon slot="icon-only" icon={chevronBack}></IonIcon>
                </IonButton>
              </IonButtons>

              <IonLabel>帖子内容</IonLabel>

              <IonButtons slot="end">
                <IonButton onClick={closeDetail}>
                  <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <p
              dangerouslySetInnerHTML={{
                __html: _.replace(postDetail, "_blank", ""),
              }}
            ></p>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

const styleSubSegment: CSSProperties = {
  borderRadius: "5px",
  margin: "10px auto",
  width: "80%",
};

export default PostList;
