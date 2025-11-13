export enum PostureStatus {
  GOOD = 'Good Posture',
  SLOUCHING = 'Slouching Detected',
  LEANING = 'Leaning Detected',
  IDLE = 'Idle',
  UNKNOWN = 'Analyzing...',
}

export interface PostureDataPoint {
  time: string;
  status: 'good' | 'bad';
}

export interface PostureHistoryItem {
  date: string;
  duration: number; // total seconds
  goodDuration: number; // good posture seconds
}

export type ViewType = 'home' | 'live' | 'history' | 'chat' | 'goals' | 'reports' | 'settings' | 'plans';
