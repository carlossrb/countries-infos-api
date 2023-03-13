import { makeString, makeDate } from '@core/utils/data.generate';

import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { CreatePlaceService } from './create-place.service';

let mockPlacesRepository: MockPlacesRepository;
let createPlaceService: CreatePlaceService;
describe('Create places', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    createPlaceService = new CreatePlaceService(mockPlacesRepository);
  });

  it('should be create a new place', async () => {
    const place = await createPlaceService.run({
      country: makeString(5),
      location: makeString(5),
      goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
      imageUrl: `http://${makeString(5)}.com.br`,
    });
    const test = await mockPlacesRepository.findOneById(place.id);
    expect(test).toBeDefined();
  });

  it('should not create a new place', async () => {
    jest.spyOn(mockPlacesRepository, 'create').mockImplementationOnce(() => {
      throw new Error('some error');
    });
    await expect(
      createPlaceService.run({
        country: makeString(5),
        location: makeString(5),
        goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
        imageUrl: `http://${makeString(5)}.com.br`,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
