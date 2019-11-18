import React, { SyntheticEvent } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activitiy => (
          <Item key={activitiy.id}>
            <Item.Content>
              <Item.Header as="a">{activitiy.title}</Item.Header>
              <Item.Meta>{activitiy.date}</Item.Meta>
              <Item.Description>
                <div>{activitiy.description}</div>
                <div>
                  {activitiy.city}, {activitiy.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(activitiy.id)}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Button
                  name={activitiy.id}
                  loading={target === activitiy.id && submitting}
                  onClick={(e) => deleteActivity(e, activitiy.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={activitiy.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};
