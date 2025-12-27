
export interface Participant {
  id: string;
  name: string;
  isDuplicate: boolean;
}

export enum AppTab {
  INPUT = 'input',
  RAFFLE = 'raffle',
  GROUPING = 'grouping'
}

export interface GroupResult {
  groupName: string;
  members: string[];
}

export interface DrawRound {
  id: string;
  roundNumber: number;
  names: string[];
  timestamp: string;
}
