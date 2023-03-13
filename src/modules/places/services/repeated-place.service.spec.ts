import { RepeatedEntity } from '@core/exception/exception.types';
import { makeString, makeDate } from '@utils/data.generate';

import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { RepeatedPlaceService } from './repeated-place.service';

import { Place } from '../infra/nest/typeorm/entities/place.entity';

let repeatedPlace: RepeatedPlaceService;
let mockPlacesRepository: MockPlacesRepository;

describe('Place duplicated', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    repeatedPlace = new RepeatedPlaceService(mockPlacesRepository);
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

  describe('Throw RepeatedEntity', () => {
    it('should be able to throw RepeatedEntity if place exists with same location and country', async () => {
      await expect(
        repeatedPlace.run({
          location: place.location,
          country: place.country,
        }),
      ).rejects.toBeInstanceOf(RepeatedEntity);
    });

    it('should be able to throw RepeatedEntity if place exists with same location and country by id', async () => {
      const sameCountry = await mockPlacesRepository.create({
        country: place.country,
        location: makeString(5),
        goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
        imageUrl: `http://${makeString(5)}.com.br`,
      });
      await expect(
        repeatedPlace.run({
          location: sameCountry.location,
          id: place.id,
        }),
      ).rejects.toBeInstanceOf(RepeatedEntity);
    });
  });

  describe('Not throw RepeatedEntity', () => {
    it('with location and country', async () => {
      await expect(
        repeatedPlace.run({
          location: 'test2',
          country: place.country,
        }),
      ).resolves.toBeUndefined();
    });

    it('with location and id', async () => {
      await expect(
        repeatedPlace.run({
          location: 'test2',
          id: place.id,
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('should not be able to execute', () => {
    let spyFindByCondition;
    beforeEach(() => {
      spyFindByCondition = jest
        .spyOn(mockPlacesRepository, 'findByCondition')
        .mockImplementationOnce(() => {
          throw new Error('some error');
        });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('with location and country', async () => {
      await expect(
        repeatedPlace.run({
          location: place.location,
          country: place.country,
        }),
      ).rejects.toThrow('some error');
      expect(spyFindByCondition).toHaveBeenCalledWith({
        location: place.location,
        country: place.country,
      });
    });

    it('with location and id', async () => {
      await expect(
        repeatedPlace.run({
          location: 'test2',
          id: place.id,
        }),
      ).rejects.toThrow('some error');
      expect(spyFindByCondition).toHaveBeenCalledWith({
        location: 'test2',
        country: place.country,
      });
      const spyFindOneById = jest
        .spyOn(mockPlacesRepository, 'findOneById')
        .mockImplementationOnce(() => {
          throw new Error('some error in find by id');
        });
      await expect(
        repeatedPlace.run({
          location: 'test2',
          id: place.id,
        }),
      ).rejects.toThrow('some error in find by id');
      expect(spyFindOneById).toHaveBeenCalledWith(place.id);
    });
  });
});
