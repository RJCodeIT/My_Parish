export interface Parishioner {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface BaseGroup {
  _id: string;
  name: string;
  description?: string;
  leaderId: string;
  members: string[];
  meetingSchedule?: string;
}

export interface PopulatedGroup extends Omit<BaseGroup, 'leaderId' | 'members'> {
  leaderId: Parishioner;
  members: Parishioner[];
}
