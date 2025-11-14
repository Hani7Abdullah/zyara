export type RecipientType = 'client' | 'vendor' | 'admin' | 'all';

export interface NotificationModel {
  id: string;
  title: string;
  message: string;
  recipient_type: RecipientType;
  is_read: boolean;
}