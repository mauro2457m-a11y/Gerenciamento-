export enum SocialPlatform {
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter/X',
  FACEBOOK = 'Facebook'
}

export enum PostTone {
  PROFESSIONAL = 'Profissional',
  CASUAL = 'Casual',
  HUMOROUS = 'Bem-humorado',
  INSPIRATIONAL = 'Inspiracional',
  EDUCATIONAL = 'Educativo'
}

export interface GeneratedContent {
  text: string;
  hashtags: string[];
  imagePrompt?: string; // The prompt used to generate the image
  imageBase64?: string; // The actual image data
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  hashtags: string[];
  imageUrl?: string;
  scheduledDate: string; // ISO string
  status: 'draft' | 'scheduled' | 'published';
  createdAt: number;
}

export interface AnalyticsData {
  date: string;
  engagement: number;
  impressions: number;
  followers: number;
}