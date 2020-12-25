import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
import "../css/Post.css";
import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import PostListItem from "./PostListItem";

const PostList: React.FC = () => {

  const [segment, setSegment] = useState<string | undefined>("unread");
  //const [posts, setPosts] = useState<Post[] | undefined>([]);
  const [unreadPosts, setUnreadPosts] = useState<Post[] | undefined>([]);
  const [readPosts, setReadPosts] = useState<Post[] | undefined>([]);
  const [favoritePosts, setFavoritePosts] = useState<Post[] | undefined>([]);

  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const ionSegRef = useRef<HTMLIonSegmentButtonElement>(null);
  const ionListRef = useRef<HTMLIonListElement>(null);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [showAlert, setShowAlert] = useState(false);

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

  // const initPostList = async () => {
  //   const result = await postService.getPost('unread');

  //   if (result.success) {
  //     const data = result.data as PageRoot<Post>
  //     setPosts(data.list);
  //   } else {
  //     setErrorMessage(result.data as string)
  //     setShowAlert(true)
  //   }
  // };

  const segmentButtonClick = async () => {
    ionContentRef.current?.getScrollElement().then((el) => {
      el.scrollTo({ left: 0, top: 0 });
    });
  };

  const getPostsBySegment = (): Post[] | undefined => {
    if (segment === "unread") {
      return unreadPosts;
    } else if (segment === "read") {
      return readPosts;
    } else if (segment === "favorite") {
      return favoritePosts;
    }
  };

  const setPostsBySegment = (newPosts: Post[] | undefined) => {
    //setPosts(newPosts)
    if (segment === "unread") {
      setUnreadPosts([...newPosts, ...unreadPosts]);
    } else if (segment === "read") {
      setReadPosts([...newPosts]);
    } else if (segment === "favorite") {
      setFavoritePosts([...newPosts]);
    }
  };

  const doRefresh = async () => {
    ionContentRef.current?.scrollToTop();

    console.log("doRefresh:", segment);
    const result = await postService.getPost(segment);
    if (result.success) {
      const newPosts = await (result.data as PageRoot<Post>).list;
      setPostsBySegment(newPosts);
    } else {
      setErrorMessage(result.data as string);
      setShowAlert(true);
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
            onIonChange={(e) => setSegment(e.detail.value)}
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
          </IonList>

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            // cssClass='my-custom-class'
            header={"错误信息"}
            message={errorMessage}
            buttons={["确认"]}
          />
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PostList;
