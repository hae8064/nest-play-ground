import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostReqDto } from './dto/createPostReq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPost(body: CreatePostReqDto, user: User) {
    const post = this.postRepository.create({
      ...body,
      user,
    });
    return this.postRepository.save(post);
  }
}
