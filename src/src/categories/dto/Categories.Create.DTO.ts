import { PickType } from '@nestjs/swagger';
import { Category } from 'src/entities/Category';

export class CreateCategoryDto extends PickType(Category, ['categoryName', 'iconUrl']) {}
