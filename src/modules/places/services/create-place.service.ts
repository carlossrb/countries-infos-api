import { Injectable, Inject } from '@nestjs/common';
import { CreatePlaceDTO } from '../domain/dto/create-place.dto';
import { Place } from '../domain/model/place.model';
import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';

@Injectable()
export class CreatePlaceService {
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run(createPlaceDto: CreatePlaceDTO): Promise<Place> {
    const place = await this.placesRepository.create(createPlaceDto);
    return new Place(place);
  }
}
