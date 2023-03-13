import { ApiProperty } from '@nestjs/swagger';

import { TextLengthNotSatisfied } from '@core/exception/exception.types';
import {
  Length,
  ValidationArguments,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreatePlaceDTO {
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
  country: string;

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

  @ApiProperty()
  @IsUrl()
  @Length(2, 200, {
    message: ({ property, constraints }: ValidationArguments) => {
      throw new TextLengthNotSatisfied(
        property,
        constraints[0],
        constraints[1],
      );
    },
  })
  imageUrl: string;
}
