import { IonAvatar, IonButton, IonButtons, IonCol, IonFooter, IonGrid, IonIcon, IonImg, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonRow, IonToolbar } from "@ionic/react";
import _ from "lodash";
import React from "react";
import { Post } from "../model/Post";
import { tsFormat } from "../util/utils.date";

interface PostListItemProps {
    post : Post;
    toggleFavorite : (post: Post) => void;
}

const PostListItem : React.FC<PostListItemProps> = ({post, toggleFavorite}) => {
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
                    {tsFormat(post.insertTime)}抓取 &nbsp;{post.isRead?"":(<span className="unread">未读</span>)}
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
                    
            {post.title && <IonItemDivider><IonLabel slot="start"><h3 className="title">{post.title}</h3></IonLabel></IonItemDivider>}
                    
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
                    <IonCol><a href={"https://xueqiu.com/"+post.userId+"/"+post.postId}>{tsFormat(post.createdAt)}发表</a></IonCol>
                    </IonRow>
                </IonGrid>
                </IonToolbar>
            </IonFooter>
        </IonItemGroup>
    );
};

export default PostListItem;