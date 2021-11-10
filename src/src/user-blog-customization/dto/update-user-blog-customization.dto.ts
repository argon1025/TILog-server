import { PartialType } from '@nestjs/swagger';
import { CreateUserBlogCustomizationDto } from './create-user-blog-customization.dto';

export class UpdateUserBlogCustomizationDto extends PartialType(CreateUserBlogCustomizationDto) {}
