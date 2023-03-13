import { EntityOut } from '@core/exception/exception.types';
import { makeString, makeDate } from '@core/utils/data.generate';

import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { PlaceOutService } from './place-out.service';

import { Place } from '../infra/nest/typeorm/entities/place.entity';

let placeGoneService: PlaceOutService;
let mockPlacesRepository: MockPlacesRepository;

describe('Place gone', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    placeGoneService = new PlaceOutService(mockPlacesRepository);
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

  it('should be able to throw EntityOut if place dont exists', async () => {
    await expect(placeGoneService.run('test')).rejects.toBeInstanceOf(
      EntityOut,
    );
  });

  it('should not be able to throw EntityOut if place exists', async () => {
    await expect(placeGoneService.run(place.id)).resolves.toBeUndefined();
  });

  it('should not be able to throw EntityOut if some error occur', async () => {
    const spyFindOneById = jest
      .spyOn(mockPlacesRepository, 'findOneById')
      .mockImplementationOnce(() => {
        throw new Error('some error');
      });
    await expect(placeGoneService.run(place.id)).rejects.toThrow('some error');
    expect(spyFindOneById).toHaveBeenCalledWith(place.id);
  });
});
