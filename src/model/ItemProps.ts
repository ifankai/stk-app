import { EsDocument } from "./SearchResult";

export interface ItemProps {
  segment: string;
  esDocument: EsDocument;
  toggleFavorite: (esDocument: EsDocument) => void;
}
