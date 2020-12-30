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
import React, { useEffect, useRef } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import "../css/Post.css";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import {
  getPost,
  setPostsBySegment,
  setSearchPage,
  setSegment,
  setShowDetail
} from "../slice/postSlice";
import PostListItem from "./PostListItem";

const PostList: React.FC = () => {
  const dispatch = useDispatch();

  const segment = useSelector((state: RootStateOrAny) => state.post.segment);

  //const [unreadPosts, setUnreadPosts] = useState<Post[]>([]);
  const unreadPosts = useSelector(
    (state: RootStateOrAny) => state.post.unreadPosts
  );
  //const [readPosts, setReadPosts] = useState<Post[]>([]);
  const readPosts = useSelector(
    (state: RootStateOrAny) => state.post.readPosts
  );
  //const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const favoritePosts = useSelector(
    (state: RootStateOrAny) => state.post.favoritePosts
  );
  //const [searchPosts, setSearchPosts] = useState<Post[]>([]);
  const searchPosts = useSelector(
    (state: RootStateOrAny) => state.post.searchPosts
  );

  //const [searchPage, setSearchPage] = useState<number>(1);
  const searchPage = useSelector(
    (state: RootStateOrAny) => state.post.searchPage
  );

  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const ionSegRef = useRef<HTMLIonSegmentButtonElement>(null);
  const ionListRef = useRef<HTMLIonListElement>(null);
  const ionInfinite = useRef<HTMLIonInfiniteScrollElement>(null);
  const ionModalRef = useRef<HTMLIonModalElement>(null);

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
    //doRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]); // 第二个参数表明 仅在 segment 更改时调用这个方法(useEffect)

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
    if (getPostsBySegment().length > 0) {
      return;
    }
    doRefresh();
  };

  const getPostsBySegment = (): Post[] => {
    if (segment === "unread") {
      return unreadPosts;
    } else if (segment === "read") {
      return readPosts;
    } else if (segment === "favorite") {
      return favoritePosts;
    } else if (segment === "search") {
      return searchPosts;
    }
    return [];
  };

  const doRefresh = async () => {
    ionContentRef.current?.scrollToTop();
    console.log("doRefresh:", segment);

    if (segment === "search") {
      if (!searchText) return;
      dispatch(setSearchPage(1));
    }
    dispatch(getPost(segment, 1, searchText));

    ionRefresherRef.current!.complete();
  };

  const toggleFavorite = (post: Post) => {
    let posts = getPostsBySegment();
    console.log(posts);
    posts &&
      posts.forEach((e) => {
        if (e.id === post.id) {
          e.isFavorite = !e.isFavorite;
        }
      });
    console.log(posts);
    dispatch(setPostsBySegment(posts));
    postService.setFavorite(post.id, post.isFavorite);
  };

  const appendData = async () => {
    if (noMoreData) return;
    ionInfinite.current?.complete();

    let page = searchPage + 1;
    dispatch(setSearchPage(page));
    dispatch(getPost(segment, page, searchText));
  };

  const closeDetail = () => {
    dispatch(setShowDetail(false));
    if (ionModalRef) ionModalRef.current?.dismiss();
  };

  return (
    <IonPage id="post">
      <IonMenu side="start" contentId="post" type="overlay">
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
              value="unread"
              ref={ionSegRef}
              onClick={segmentButtonClick}
            >
              未读
            </IonSegmentButton>
            <IonSegmentButton value="read" onClick={segmentButtonClick}>
              已读
            </IonSegmentButton>
            <IonSegmentButton value="favorite" onClick={segmentButtonClick}>
              收藏
            </IonSegmentButton>
            <IonSegmentButton value="search" onClick={segmentButtonClick}>
              搜索
            </IonSegmentButton>
          </IonSegment>
        </IonHeader>

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
            {segment === "unread" &&
              unreadPosts &&
              unreadPosts.map((post: Post) => {
                return (
                  <PostListItem
                    post={post}
                    toggleFavorite={(post) => toggleFavorite(post)}
                    key={post.id}
                  />
                );
              })}
            {segment === "read" &&
              readPosts &&
              readPosts.map((post: Post) => {
                return (
                  <PostListItem
                    post={post}
                    toggleFavorite={(post) => toggleFavorite(post)}
                    key={post.id}
                  />
                );
              })}
            {segment === "favorite" &&
              favoritePosts &&
              favoritePosts.map((post: Post) => {
                return (
                  <PostListItem
                    post={post}
                    toggleFavorite={(post) => toggleFavorite(post)}
                    key={post.id}
                  />
                );
              })}

            {segment === "search" &&
              searchPosts &&
              searchPosts.map((post: Post) => {
                return (
                  <PostListItem
                    post={post}
                    toggleFavorite={(post) => toggleFavorite(post)}
                    key={post.id}
                  />
                );
              })}
            
            {noMoreData && (
                <div className="no-more-data">---已经到底---</div>
            )}
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

        <IonContent>
          <IonModal ref={ionModalRef} isOpen={showDetail}>
            <IonHeader translucent={true}>
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
      </IonContent>

    </IonPage>
  );
};

export default PostList;
