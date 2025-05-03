import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostReqDto } from './dto/createPostReq.dto';
import { JwtAuthGuard } from '../users/guards/jwtAuth.guard';
import { User } from '../users/users.entity';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() body: CreatePostReqDto, @Req() req: Request) {
    console.log('req:', req);
    const user = req as any;
    return this.postService.createPost(body, user);
  }
}
