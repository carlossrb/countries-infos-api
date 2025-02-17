import { Injectable, Inject } from '@nestjs/common';
import { PlacesRepositoryInterface } from '../repositories/places.repository.interface';

@Injectable()
export class DeletePlaceService {
  constructor(
    @Inject('PlacesRepositoryInterface')
    private readonly placesRepository: PlacesRepositoryInterface,
  ) {}

  async run(id: string): Promise<void> {
    await this.placesRepository.remove(id);
  }
}
