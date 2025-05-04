import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostReqDto } from './dto/createPostReq.dto';
import { JwtAuthGuard } from '../users/guards/jwtAuth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/users.entity';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() body: CreatePostReqDto, @CurrentUser() userPayload: User) {
    return this.postService.createPost(body, userPayload);
  }
}
