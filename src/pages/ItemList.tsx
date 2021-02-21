import React from "react";
import { ItemProps } from "../model/ItemProps";
import ItemPost from "./ItemPost";
import ItemStock from "./ItemStock";

const ItemList: React.FC<ItemProps> = ({
  segment,
  esDocument,
  toggleFavorite,
}) => {
  return (
    <>
      {esDocument.type === "post" && (
        <ItemPost
          segment={segment}
          esDocument={esDocument}
          toggleFavorite={() => toggleFavorite(esDocument)}
          key={esDocument.id}
        />
      )}
      {esDocument.type === "stock" && (
        <ItemStock
          segment={segment}
          esDocument={esDocument}
          toggleFavorite={() => toggleFavorite(esDocument)}
          key={esDocument.id}
        />
      )}
    </>
  );
};

export default ItemList;
