import { Injectable, Inject } from '@nestjs/common';
import { Place } from '../domain/model/place.model';
import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';

@Injectable()
export class GetPlaceByIdService {
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run(id: string): Promise<Place> {
    const result = await this.placesRepository.findOneById(id);
    return new Place(result);
  }
}
