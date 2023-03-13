import { makeString, makeDate } from '@core/utils/data.generate';

import { Place } from '../infra/nest/typeorm/entities/place.entity';
import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { GetPlaceByIdService } from './get-place-by-id.service';

let getPlaceByIdService: GetPlaceByIdService;
let mockPlacesRepository: MockPlacesRepository;

describe('Get place by id', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    getPlaceByIdService = new GetPlaceByIdService(mockPlacesRepository);
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

  it('should be get place by id', async () => {
    const test = await getPlaceByIdService.run(place.id);
    expect(test).toBeDefined();
  });

  it('should not be get place by id', async () => {
    jest
      .spyOn(mockPlacesRepository, 'findOneById')
      .mockImplementationOnce(() => {
        throw new Error('some error');
      });
    await expect(getPlaceByIdService.run(place.id)).rejects.toBeInstanceOf(
      Error,
    );
  });
});
