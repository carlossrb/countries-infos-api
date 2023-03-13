import { makeString, makeDate } from '@utils/data.generate';

import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { UpdatePartialPlaceService } from './update-partial-place.service';

import { Place } from '../infra/nest/typeorm/entities/place.entity';

let updatePartialPlaceService: UpdatePartialPlaceService;
let mockPlacesRepository: MockPlacesRepository;
describe('Create places', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    updatePartialPlaceService = new UpdatePartialPlaceService(
      mockPlacesRepository,
    );
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

  it('should be able to update place', async () => {
    const updatePlace = {
      id: place.id,
      location: makeString(5),
      goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
    };
    await updatePartialPlaceService.run(updatePlace);
    const test = await mockPlacesRepository.findOneById(place.id);
    expect(test).toMatchObject({
      id: place.id,
      country: place.country,
      location: updatePlace.location,
      goal: updatePlace.goal,
      imageUrl: place.imageUrl,
    });
    expect(test.updatedAt.getTime()).toBeGreaterThanOrEqual(
      place.updatedAt.getTime(),
    );
  });

  it('should not be able to update place', async () => {
    const updatePlace = {
      id: 'test',
      location: makeString(5),
      goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
    };
    const result = await updatePartialPlaceService.run(updatePlace);
    const test = await mockPlacesRepository.findOneById(place.id);
    expect(test).toMatchObject(place);
    expect(result).toBeUndefined();
  });
});
