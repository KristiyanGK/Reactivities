import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityLIstItem";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityList: React.FC = () => {
  const { activitiesByDate } = useContext(ActivityStore);
  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
              {activities.map(activitiy => (
                <ActivityListItem key={activitiy.id} activity={activitiy} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
