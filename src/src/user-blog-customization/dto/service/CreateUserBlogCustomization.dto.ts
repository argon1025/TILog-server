import { PickType } from '@nestjs/swagger';
import { UserblogCustomization } from 'src/entities/UserblogCustomization';

export class CreateUserBlogCustomizationDto extends PickType(UserblogCustomization, ['usersId', 'blogTitle', 'statusMessage', 'selfIntroduction']) {}
