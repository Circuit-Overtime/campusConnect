export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
  organizer: string;
  capacity?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  club: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Slides';
  tags: string[];
  link: string;
  course: string;
  uploaded: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  major: string;
  year: number;
  bio: string;
}
