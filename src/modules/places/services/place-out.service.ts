import { Injectable, Inject } from '@nestjs/common';

import { EntityOut } from '@core/exception/exception.types';

import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';

@Injectable()
export class PlaceOutService {
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run(id: string): Promise<void> {
    const place = await this.placesRepository.findOneById(id);
    if (!place) {
      throw new EntityOut('Local');
    }
  }
}
