import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import CollectionDetail from "@components/screens/CollectionDetail";

type RootStackParamList = {
  CollectionDetail: { id: string };
};

type CollectionDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "CollectionDetail"
>;

const CollectionDetailScreen: React.FC = () => {
  return (
    <CollectionDetail
      collectionId={useRoute<CollectionDetailScreenRouteProp>().params.id}
    />
  );
};

export default CollectionDetailScreen;
