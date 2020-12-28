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
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from "@ionic/react";
import { search } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import "../css/Post.css";
import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import { setErrorMessage } from "../slice/commonSlice";
import { setSegment } from "../slice/postSlice";
import PostListItem from "./PostListItem";

const PostList: React.FC = () => {

  const perPage = 10;

  const segment = useSelector((state: RootStateOrAny) => state.post.segment);

  const [unreadPosts, setUnreadPosts] = useState<Post[]>([]);
  const [readPosts, setReadPosts] = useState<Post[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [searchPosts, setSearchPosts] = useState<Post[]>([]);
  
  const [searchPage, setSearchPage] = useState<number>(1);

  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const ionSegRef = useRef<HTMLIonSegmentButtonElement>(null);
  const ionListRef = useRef<HTMLIonListElement>(null);
  const ionInfinite = useRef<HTMLIonInfiniteScrollElement>(null);

  const dispatch = useDispatch();

  const searchText = useSelector((state: RootStateOrAny) => state.search.text);

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
    doRefresh();
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

  const setPostsBySegment = (newPosts: Post[]) => {
    //setPosts(newPosts)
    if (segment === "unread") {
      setUnreadPosts([...newPosts, ...unreadPosts]);
    } else if (segment === "read") {
      setReadPosts([...newPosts]);
    } else if (segment === "favorite") {
      setFavoritePosts([...newPosts]);
    } else if (segment === "search") {
      setSearchPosts([...newPosts]);
    }
  };

  const doRefresh = async () => {
    ionContentRef.current?.scrollToTop();
    let keyword = undefined;
    
    console.log("doRefresh:", segment);
    if (segment === "search") {
      keyword = searchText
      setSearchPage(1)
    }
    const result = await postService.getPost(segment, keyword, 1, perPage);

    if (result.success) {
      const newPosts = await (result.data as PageRoot<Post>).list;
      setPostsBySegment(newPosts);
    } else {
      dispatch(setErrorMessage(result.data as string));
    }

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
    setPostsBySegment(posts);
    postService.setFavorite(post.id, post.isFavorite);
  };


  const appendData = async () => {
    ionInfinite.current?.complete()    
    const result = await postService.getPost(segment, searchText, searchPage, perPage);
    if(result.success){
      setSearchPage(searchPage + 1)
      const newPosts = await (result.data as PageRoot<Post>).list;
      setSearchPosts([...searchPosts, ...newPosts])
    } else {
      dispatch(setErrorMessage(result.data as string));
    }
  }

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

      <IonContent fullscreen>
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
              全部
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
          </IonList>

          <IonInfiniteScroll ref={ionInfinite} threshold="100px" onIonInfinite={appendData}>
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="正在加载..."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
          
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PostList;
