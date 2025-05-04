import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostReqDto } from './dto/createPostReq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { CreatePostResDto } from './dto/createPostRes.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPost(
    body: CreatePostReqDto,
    userPayload: User,
  ): Promise<CreatePostResDto> {
    const { title, content } = body;

    const post = this.postRepository.create({
      title,
      content,
      user: {
        id: userPayload.id,
        email: userPayload.email,
      },
    });
    return this.postRepository.save(post);
  }
}
