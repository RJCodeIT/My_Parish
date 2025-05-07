export interface Parishioner {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
}

export interface BaseGroup {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  leaderId: string | Parishioner | { _id?: string; id?: string; firstName?: string; lastName?: string };
  members: Array<string | Parishioner | { _id?: string; id?: string; firstName?: string; lastName?: string }>;
  meetingSchedule?: string;
}

export interface PopulatedGroup extends Omit<BaseGroup, 'leaderId' | 'members'> {
  leaderId: Parishioner;
  members: Parishioner[];
}
