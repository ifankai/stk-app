import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonFooter,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonRow,
  IonToolbar
} from "@ionic/react";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { ItemProps } from "../model/ItemProps";
import { EsDocument } from "../model/SearchResult";
import { setModalDetail, setModalTitle, setShowModal } from "../slice/postSlice";
import { getCodeWithPlace } from "../util/utils";
import { tsFormat } from "../util/utils.date";

const ItemPost: React.FC<ItemProps> = ({
  segment,
  esDocument,
  toggleFavorite,
}) => {
  const dispatch = useDispatch();

  const popupModal = (esDocument: EsDocument) => {
    dispatch(setModalTitle("讨论内容"));
    dispatch(setModalDetail(esDocument.post.content));
    dispatch(setShowModal(true));
  };

  return (
    <IonItemGroup className="item">
      <IonItemDivider>
        <IonAvatar slot="start" className="avatar">
          <IonImg
            src={
              esDocument.post?.userAvatar && "http://xavatar.imedao.com/" + esDocument.post.userAvatar
            }
            alt=""
          />
        </IonAvatar>
        <div>
          <IonLabel>
            <a
              className="username"
              href={"https://xueqiu.com/u/" + esDocument.post?.userId}
            >
              {esDocument.post?.userName}
            </a>
            &nbsp; <span className="info">粉丝：{esDocument.post?.followersCount}</span>
          </IonLabel>
          <IonLabel className="info">
            {tsFormat(esDocument.post?.insertTime)}抓取
          </IonLabel>
        </div>
        <IonButtons slot="end">
          <IonButton onClick={() => toggleFavorite(esDocument)}>
            {esDocument.post?.isFavorite ? (
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

      {esDocument.post?.title && (
        <IonItemDivider>
          <IonLabel slot="start">
            <h2
              className="title"
              dangerouslySetInnerHTML={{
                __html: _.replace(segment === "search"?esDocument.title:esDocument.post?.title, "_blank", ""),
              }}
            ></h2>
          </IonLabel>
        </IonItemDivider>
      )}

      <IonItem >
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: _.replace(
              segment === "search"? esDocument.desc || esDocument.content: esDocument.post?.desc || esDocument.post?.content,
              "_blank",
              ""
            ),
          }}
        ></div>
      </IonItem>

      <IonFooter className="ion-no-padding ion-no-border">
        <IonToolbar className="footer ion-no-padding">
          <IonGrid className="ion-no-padding footer-grid">
            <IonRow className="ion-no-padding">
              <IonCol className="ion-padding-horizontal">
                评论 {esDocument.post?.replyCount}
              </IonCol>
              <IonCol>{esDocument.post?.createdAt && tsFormat(esDocument.post?.createdAt)}发表</IonCol>
              <IonCol>
                <a target="_black"
                  href={"https://xueqiu.com/" + (esDocument.post?.userId===-1 ? getCodeWithPlace(esDocument.stock) : esDocument.post?.userId) + "/" + esDocument.post?.postId}
                >
                  雪球原文
                </a>
              </IonCol>
              <IonCol onClick={() => popupModal(esDocument)}>
                {esDocument.post?.content.length >= esDocument.post?.desc?.length + 40 && "帖子内容"}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonItemGroup>
  );
};

export default ItemPost;
