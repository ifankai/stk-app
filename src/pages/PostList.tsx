import { RefresherEventDetail } from '@ionic/core';
import { IonAvatar, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { heartOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Post } from '../model/Post';
import { timestampFormat } from '../util/utils.date';
import './Post.css';

const PostList: React.FC = () => { 

  const [segment, setSegment] = useState('all')
  const [list, setList] = useState<Post[]>([])

  useEffect(() => {
    console.log('useEffect');
    
    // eslint-disable-next-line
  }, [])

  useIonViewWillEnter(() => {
    console.log('useIonViewWillEnter');
    setList(getPostList().concat(list))
  })

  const getPostList = () => {
    return [
      {
        id:1,
        userId:"1",
        text:'#荣泰健康# 配债成功',
        date: new Date().getTime()
      },
      {
        id:2,
        userId:"2",
        text:'<a target="_blank" href="http://xueqiu.com/S/SZ001979/162123601">招商蛇口：关于招为投资以集中竞价方式减持股份实施进展的公告 </a>',
        date: new Date().getTime()-1000*60*60
      },
      {
        id:3,
        userId:"3",
        text:'成本上升，售价下降，利润怎么办，唉，28的成本怎么办',
        date: new Date().getTime()-1000*60*100
      }
    ]
  }

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log('Begin async operation');
    
    setTimeout(() => {
      setList(getPostList().concat(list))
      console.log('Async operation has ended');
      event.detail.complete();
    }, 1000);
  }
  
 
  return (
    <IonPage id='post'>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>帖子</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>    
        <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as string)}>
          <IonSegmentButton value="all">全部</IonSegmentButton>
          <IonSegmentButton value="readed">已读</IonSegmentButton>
          <IonSegmentButton value="favorites">收藏</IonSegmentButton>
        </IonSegment>

        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={(e)=>{doRefresh(e)}}>
            <IonRefresherContent pullingIcon={null}
              refreshingSpinner="bubbles"></IonRefresherContent>
          </IonRefresher>
          <IonContent>
          <IonList> 
            {
              list.map((post : Post)=>{
                return (
                  <IonItemGroup className="post-item" key={post.id}>
                  <IonItemDivider>
                    <IonAvatar slot="start">
                      <img src="http://xavatar.imedao.com/community/20145/1402578363291-1402578413963.jpg!180x180.png" alt=""/>
                    </IonAvatar>
                      <div>
                        <IonLabel>{post.userId}</IonLabel>
                        <IonLabel>{timestampFormat(post.date)}</IonLabel>
                      </div>
                      <IonIcon slot="end" icon={heartOutline}/>
                
                  </IonItemDivider>
                  <IonItem>
                    <div className="post-content" dangerouslySetInnerHTML={{__html:post.text}}>
                    </div>
                  </IonItem>
                  </IonItemGroup>
                )
              })
            }
          </IonList>   
          </IonContent>
        </IonContent>
      </IonContent>
    </IonPage>
  );
  
};

export default PostList;
