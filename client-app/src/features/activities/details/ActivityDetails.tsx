import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match
}) => {
  const { activity, loadActivity, loadingIntial } = useContext(ActivityStore);

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingIntial) {
    return <LoadingComponent content="Loading activity..." />;
  }

  if (!activity) {
    return <h2>Activity not found</h2>
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
