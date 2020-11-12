import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
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
  }, [segment]); // 第二个参数表明 仅在 segment 更改时调用这个方法(useEffect)

  useIonViewWillEnter(() => {
    console.log("useIonViewWillEnter");
    getPostList();
  });

  const getPostList = async () => {
    const result = await postService.getPost();

    if (result.success) {
      setPosts(result.data);
    } else {
      // eslint-disable-next-line
      const mock = [
        {
          id: 1,
          userId: "1",
          text: "#荣泰健康# 配债成功",
          createdAt: new Date().getTime(),
          isFavorite: false,
        },
        {
          id: 2,
          userId: "2",
          text:
            '<a target="_blank" href="http://xueqiu.com/S/SZ001979/162123601">招商蛇口：关于招为投资以集中竞价方式减持股份实施进展的公告 </a>',
          createdAt: new Date().getTime() - 1000 * 60 * 60,
          isFavorite: true,
        },
        {
          id: 3,
          userId: "3",
          text: "成本上升，售价下降，利润怎么办，唉，28的成本怎么办",
          createdAt: new Date().getTime() - 1000 * 60 * 100,
          isFavorite: false,
        },
        {
          id: 4,
          userId: "4",
          text: "成本上升，售价下降，利润怎么办，唉，28的成本怎么办",
          createdAt: new Date().getTime() - 1000 * 60 * 100,
          isFavorite: false,
        },
        {
          id: 5,
          userId: "4",
          text: "成本上升，售价下降，利润怎么办，唉，28的成本怎么办",
          createdAt: new Date().getTime() - 1000 * 60 * 100,
          isFavorite: false,
        }
      ];
      // setPosts(mock);
    }
  };

  const segmentButtonClick = async () => {
    ionContentRef.current?.getScrollElement().then((el) => {
      el.scrollTo({left:0, top:0})
    })
    // ionListRef.current?.scrollTo({left:0, top:200})

    // const scrollEl = await ionContentRef.current?.getScrollElement();
    // let scrollStyle = await scrollEl!.style;

    // let backgroundContentEl = ionContentRef.current!;
    // console.log(backgroundContentEl);
    
    // const backgroundStyle = backgroundContentEl.style;
    // scrollStyle.transform = backgroundStyle.transform = ((60 > 0) ? `translateY(40px) translateZ(0px)` : '');
    // scrollStyle.transitionDuration = backgroundStyle.transitionDuration = "300ms";
    // scrollStyle.transitionDelay = backgroundStyle.transitionDelay = "300ms";
    // scrollStyle.overflow = (true ? 'hidden' : '');

    // document.querySelector(".refresher-refreshing")?.setAttribute("style","display:block")

    //ionRefresherRef.current!.complete();
  }

  const doRefresh = async () => {
    ionContentRef.current?.scrollToTop()

    const result = await postService.getPost("unread");
    if (result.success) {
      const unreadPosts = await result.data
      setPosts([...unreadPosts, ...posts])
    } else {
      setErrorMessage(result.msg)
      setShowAlert(true)
    }
    ionRefresherRef.current!.complete();
  };

  const toggleFavorite = (post: Post) => {
    // isFavorite ? removeFavorite(session.id) : addFavorite(session.id);
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
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value)}
          >
            <IonSegmentButton value="unread" ref={ionSegRef} onClick={segmentButtonClick}>全部</IonSegmentButton>
            <IonSegmentButton value="read">已读</IonSegmentButton>
            <IonSegmentButton value="favorite">收藏</IonSegmentButton>
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
                      <IonAvatar slot="start">
                        <IonImg
                          src={"http://xavatar.imedao.com/"+post.userAvatar}
                          alt=""
                        />
                      </IonAvatar>
                      <div>
                        <IonLabel>
                          <a className="username" href={"https://xueqiu.com/u/"+post.userId}>{post.userName}</a>
                        </IonLabel>
                        <IonLabel className="info">{tsFormat(post.createdAt)}</IonLabel>
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
                    <IonItem className={(post.isRead?"read":"unread")}>
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{ __html: _.replace(post.text,'_blank','') }}
                      ></div>
                    </IonItem>
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
