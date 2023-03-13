import { Injectable, Inject } from '@nestjs/common';

import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';
import { Place } from '../domain/model/place.model';

interface Request {
  id: string;
  location: string;
  goal: Date;
}

@Injectable()
export class UpdatePartialPlaceService {
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run(updatePlace: Request): Promise<Place> {
    const place = await this.placesRepository.findOneById(updatePlace.id);
    if (place) {
      const result = await this.placesRepository.save({
        ...place,
        ...updatePlace,
      });
      return new Place(result);
    }
  }
}
