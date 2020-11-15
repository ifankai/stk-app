import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSegment,
  IonSegmentButton,

  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from "@ionic/react";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import { tsFormat } from "../util/utils.date";
import "./Post.css";

const PostList: React.FC = () => {
  const [segment, setSegment] = useState<string | undefined>("unread");
  const [posts, setPosts] = useState<Post[] | undefined>([]);
  const [unreadPosts, setUnreadPosts] = useState<Post[] | undefined>([]);
  // const [readPosts, setReadPosts] = useState<Post[] | undefined>([]);
  // const [favoritePosts, setFavoritePosts] = useState<Post[] | undefined>([]);

  const ionContentRef = useRef<HTMLIonContentElement>(null)
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const ionSegRef = useRef<HTMLIonSegmentButtonElement>(null)
  const ionListRef = useRef<HTMLIonListElement>(null)

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
    doRefresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]); // 第二个参数表明 仅在 segment 更改时调用这个方法(useEffect)

  useEffect(() => {
    setPosts(unreadPosts)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadPosts]);

  useIonViewWillEnter(() => {
    console.log("useIonViewWillEnter");
    initPostList();
  });

  const initPostList = async () => {
    const result = await postService.getPost('unread');

    if (result.success) {
      setPosts(result.data);
    } else {
      setErrorMessage(result.msg)
      setShowAlert(true)
    }
  };

  const segmentButtonClick = async () => {
    ionContentRef.current?.getScrollElement().then((el) => {
      el.scrollTo({left:0, top:0})
    })
  }

  const doRefresh = async () => {
    ionContentRef.current?.scrollToTop()

    console.log('doRefresh:',segment)
    const result = await postService.getPost(segment);
    if (result.success) {
      const newPosts = await result.data
      if(segment === 'unread'){    
        setUnreadPosts([...newPosts, ...unreadPosts?.map((item) => {item.isRead = true; return item})])        
      } else if(segment === 'read' || segment === 'favorite'){
        setPosts(newPosts)
      }
    } else {
      setErrorMessage(result.msg)
      setShowAlert(true)
    }
    ionRefresherRef.current!.complete();
  };

  const toggleFavorite = (post: Post) => {
    let newList =
      posts &&
      posts.map((item) =>
        item.id === post.id ? { ...item, isFavorite: !post.isFavorite } : item
      );
    setPosts(newList);
    postService.setFavorite(post.id, !post.isFavorite)
  };

  return (
    <IonPage id="post">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>帖子</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        <IonHeader slot="fixed">
          <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value)} >
            <IonSegmentButton value="unread" ref={ionSegRef} onClick={segmentButtonClick}>全部</IonSegmentButton>
            <IonSegmentButton value="read" onClick={segmentButtonClick}>已读</IonSegmentButton>
            <IonSegmentButton value="favorite" onClick={segmentButtonClick}>收藏</IonSegmentButton>
          </IonSegment>
        </IonHeader>
        
        <IonContent ref={ionContentRef} slot="fixed">
          
          <IonRefresher
            slot="fixed"          
            onIonRefresh={(e) => {
              doRefresh();
            }}
            ref={ionRefresherRef}>
            <IonRefresherContent
              pullingIcon={null}
              refreshingSpinner="bubbles"
            ></IonRefresherContent>
          </IonRefresher>
   
          <IonList ref={ionListRef}>
            {posts &&
              posts.map((post: Post) => {
                return (
                  <IonItemGroup className="item" key={post.id}>
                    <IonItemDivider>
                      <IonAvatar slot="start" className="avatar">
                        <IonImg
                          src={"http://xavatar.imedao.com/"+post.userAvatar}
                          alt=""
                        />
                      </IonAvatar>
                      <div>
                        <IonLabel>
                          <a className="username" href={"https://xueqiu.com/u/"+post.userId}>{post.userName}</a>&nbsp; <span className="info">粉丝：{post.followersCount}</span>
                        </IonLabel>
                        <IonLabel className="info">
                          {tsFormat(post.insertDate)}抓取 &nbsp;{post.isRead?"":(<span className="unread">未读</span>)}
                        </IonLabel>
                      </div>
                      <IonButtons slot="end">
                        <IonButton onClick={() => toggleFavorite(post)}>
                          {post.isFavorite ? (
                            <IonIcon
                              slot="icon-only"
                              src="/assets/icon/favorite-filling.svg"
                            ></IonIcon>
                          ) : (
                            <IonIcon
                              slot="icon-only"
                              src="/assets/icon/favorite.svg"
                            ></IonIcon>
                          )}
                        </IonButton>
                      </IonButtons>
                    </IonItemDivider>
                    <IonItem>
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{ __html: _.replace(post.text,'_blank','') }}
                      ></div>
                    </IonItem>
                    <IonFooter className="ion-no-padding ion-no-border">
                      <IonToolbar className="footer ion-no-padding">
                        <IonGrid className="ion-no-padding footer-grid">
                          <IonRow className="ion-no-padding">
                            <IonCol className="ion-padding-horizontal">评论 {post.replyCount}</IonCol>
                            <IonCol><a href={"https://xueqiu.com/"+post.userId+"/"+post.id}>{tsFormat(post.createdAt)}发表</a></IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonToolbar>
                    </IonFooter>
                  </IonItemGroup>
                );
              })}
          </IonList>

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            // cssClass='my-custom-class'
            header={'错误信息'}
            subHeader={'Subtitle'}
            message={errorMessage}
            buttons={['确认']}
          />

        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PostList;
