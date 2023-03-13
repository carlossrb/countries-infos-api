import { ApiProperty } from '@nestjs/swagger';

import { TextLengthNotSatisfied } from '@core/exception/exception.types';
import {
  Length,
  ValidationArguments,
  IsDateString,
  Equals,
  IsOptional,
} from 'class-validator';

export class UpdatePartialPlaceDTO {
  @Equals(undefined)
  @IsOptional()
  country?: string;

  @ApiProperty()
  @Length(2, 200, {
    message: ({ property, constraints }: ValidationArguments) => {
      throw new TextLengthNotSatisfied(
        property,
        constraints[0],
        constraints[1],
      );
    },
  })
  location: string;

  @ApiProperty()
  @IsDateString()
  goal: Date;

  @Equals(undefined)
  @IsOptional()
  imageUrl?: string;
}
