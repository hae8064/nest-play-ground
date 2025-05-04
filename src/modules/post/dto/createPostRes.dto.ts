export class CreatePostResDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    email: string;
  };
}
