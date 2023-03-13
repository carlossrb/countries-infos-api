import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Place {
  @ApiProperty()
  id: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  goal: Date;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor({ id, country, location, goal, imageUrl, createdAt, updatedAt }) {
    this.id = id;
    this.country = country;
    this.location = location;
    this.goal = goal;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @Expose()
  @ApiProperty()
  get meta(): string {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(this.goal));
    } catch (error) {
      return this.goal.toString();
    }
  }
}
