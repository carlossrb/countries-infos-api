import { makeString, makeDate } from '@core/utils/data.generate';
import { Place } from '../infra/nest/typeorm/entities/place.entity';
import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { DeletePlaceService } from './delete-place.service';

let deletePlaceService: DeletePlaceService;
let mockPlacesRepository: MockPlacesRepository;
describe('Delete places', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    deletePlaceService = new DeletePlaceService(mockPlacesRepository);
  });

  let place: Place;

  beforeEach(async () => {
    place = await mockPlacesRepository.create({
      country: makeString(5),
      location: makeString(5),
      goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
      imageUrl: `http://${makeString(5)}.com.br`,
    });
  });

  it('should be delete a place', async () => {
    await deletePlaceService.run(place.id);
    const test = await mockPlacesRepository.findOneById(place.id);
    expect(test).toBeUndefined();
  });

  it('should not be delete a place', async () => {
    jest.spyOn(mockPlacesRepository, 'remove').mockImplementationOnce(() => {
      throw new Error('some error');
    });
    await expect(deletePlaceService.run(place.id)).rejects.toBeInstanceOf(
      Error,
    );
    const test = await mockPlacesRepository.findOneById(place.id);
    expect(test).toBeDefined();
  });
});
