import { Injectable, Inject } from '@nestjs/common';

import { RepeatedEntity } from '@core/exception/exception.types';

import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';

interface IRequest {
  id?: string;
  location: string;
  country?: string;
}

@Injectable()
export class RepeatedPlaceService {
  private message = 'Localização';
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run({ id, location, country }: IRequest): Promise<void> {
    if (id) {
      const place = await this.placesRepository.findOneById(id);
      const existDuplicate = await this.placesRepository.findByCondition({
        country: place.country,
        location,
      });
      if (existDuplicate && existDuplicate.id !== place.id) {
        throw new RepeatedEntity(this.message);
      }
    }

    if (country) {
      const place = await this.placesRepository.findByCondition({
        country,
        location,
      });
      if (place) {
        throw new RepeatedEntity(this.message);
      }
    }
  }
}
