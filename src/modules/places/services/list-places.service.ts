import { Injectable, Inject } from '@nestjs/common';

import { QueryPagination } from '@core/core.model';

import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';
import { Place } from '../domain/model/place.model';

@Injectable()
export class ListPlacesService {
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run(queryPagination?: QueryPagination<Place>): Promise<Place[]> {
    if (
      !queryPagination ||
      !queryPagination.order ||
      (queryPagination.order && queryPagination.order.length === 0)
    ) {
      const places = await this.placesRepository.findAll([
        {
          field: 'goal',
          order: 'ASC',
        },
      ]);
      return places.map(place => new Place(place));
    }

    const places = await this.placesRepository.findAll(queryPagination.order);
    return places.map(place => new Place(place));
  }
}
