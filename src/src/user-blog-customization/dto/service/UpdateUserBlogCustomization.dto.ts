import { PartialType } from '@nestjs/swagger';
import { CreateUserBlogCustomizationDto } from './CreateUserBlogCustomization.dto';

export class UpdateUserBlogCustomizationDto extends PartialType(CreateUserBlogCustomizationDto) {}
