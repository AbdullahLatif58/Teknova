export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: 'new' | 'read' | 'replied';
  created_at?: Date;
}
