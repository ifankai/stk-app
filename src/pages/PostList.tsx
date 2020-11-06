import { RefresherEventDetail } from "@ionic/core";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
import React, { useEffect, useState } from "react";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import { tsFormat } from "../util/utils.date";
import "./Post.css";

const PostList: React.FC = () => {
  const [segment, setSegment] = useState("all");
  const [posts, setPosts] = useState<Post[] | undefined>([]);

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
  }, [segment]); // 仅在 segment 更改时更新

  useIonViewWillEnter(() => {
    console.log("useIonViewWillEnter");
    getPostList();
  });

  const getPostList = async () => {
    const result = await postService.getPost();

    if (result.success) {
      setPosts(await result.data);
    } else {
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
      ];
      setPosts(mock);
    }
  };

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log("Begin async doRefresh");

    setTimeout(() => {
      // setList(getPostList().concat(list))
      console.log("Async doRefresh has ended");
      event.detail.complete();
    }, 1000);
  };

  const toggleFavorite = (post: Post) => {
    // isFavorite ? removeFavorite(session.id) : addFavorite(session.id);
    let newList =
      posts &&
      posts.map((item) =>
        item.id === post.id ? { ...item, isFavorite: !post.isFavorite } : item
      );
    setPosts(newList);
  };

  return (
    <IonPage id="post">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>帖子</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as string)}
        >
          <IonSegmentButton value="all">全部</IonSegmentButton>
          <IonSegmentButton value="read">已读</IonSegmentButton>
          <IonSegmentButton value="favorite">收藏</IonSegmentButton>
        </IonSegment>

        <IonContent>
          <IonRefresher
            slot="fixed"
            onIonRefresh={(e) => {
              doRefresh(e);
            }}
          >
            <IonRefresherContent
              pullingIcon={null}
              refreshingSpinner="bubbles"
            ></IonRefresherContent>
          </IonRefresher>
          <IonContent>
            <IonList>
              {posts &&
                posts.map((post: Post) => {
                  return (
                    <IonItemGroup className="post-item" key={post.id}>
                      <IonItemDivider>
                        <IonAvatar slot="start">
                          <img
                            src="http://xavatar.imedao.com/community/20145/1402578363291-1402578413963.jpg!180x180.png"
                            alt=""
                          />
                        </IonAvatar>
                        <div>
                          <IonLabel>{post.userId}</IonLabel>
                          <IonLabel>{tsFormat(post.createdAt)}</IonLabel>
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
                          className="post-content"
                          dangerouslySetInnerHTML={{ __html: post.text }}
                        ></div>
                      </IonItem>
                    </IonItemGroup>
                  );
                })}
            </IonList>
          </IonContent>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PostList;
