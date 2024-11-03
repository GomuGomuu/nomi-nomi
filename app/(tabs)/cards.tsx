import React from "react";
import CollectionDetail from "@components/screens/CollectionDetail";

const CollectionDetailScreen: React.FC = () => {
  return <CollectionDetail collectionId={"3"} fetchCollection={true} />;
};

export default CollectionDetailScreen;
