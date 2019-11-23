import {action, computed, configure, observable, runInAction} from 'mobx';
import {createContext, SyntheticEvent} from 'react';

import agent from '../api/agent';
import {IActivity} from '../models/activity';

configure({enforceActions: 'always'});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity|null = null;
  @observable loadingIntial = false;  // starts loading indicator
  @observable submitting = false;
  @observable target = '';

  @computed
  get activitiesByDate() {
    return this.groupActivitiesByDate(
        Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities =
        activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.split('T')[0];
      activities[date] =
          activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[]}));
  }

  @action
  loadActivities = async () => {
    this.loadingIntial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction('loading activities final', () => {
        this.loadingIntial = false;
      });
    }
  };

  @action
  loadActivity =
      async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
    } else {
      this.loadingIntial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = activity;
        })
      } catch (error) {
        console.log(error);
      } finally {
        runInAction('activity finaly', () => {
          this.loadingIntial = false;
        })
      }
    }
  }

  @action clearActivity =
      () => {
        this.activity = null;
      }

  getActivity =
      (id: string) => {
        return this.activityRegistry.get(id);
      }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      })
    }
  };

  @action
  editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  @action
  deleteActivity =
      async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
        this.target = '';
      });
    }
  };
}

export default createContext(new ActivityStore());
