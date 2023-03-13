import { makeString, makeDate } from '@utils/data.generate';
import { isSorted } from '@utils/data.validate';

import { MockPlacesRepository } from '../repositories/mock-places.repository';

import { ListPlacesService } from './list-places.service';

import { Place } from '../infra/nest/typeorm/entities/place.entity';

let listPlacesService: ListPlacesService;
let mockPlacesRepository: MockPlacesRepository;

describe('List places', () => {
  beforeAll(() => {
    mockPlacesRepository = new MockPlacesRepository();
    listPlacesService = new ListPlacesService(mockPlacesRepository);
  });

  let places: Place[];

  beforeEach(async () => {
    for (let i = 0; i < 20; i++) {
      try {
        const place = await mockPlacesRepository.create({
          country: makeString(5),
          location: makeString(5),
          goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
          imageUrl: `http://${makeString(5)}.com.br`,
        });
        places.push(place);
      } catch (error) {
        // do nothing
      }
    }
  });

  it('should be list places sorted', async () => {
    const test = await listPlacesService.run();
    expect(isSorted(test, 'goal', 'ASC')).toBeTruthy();
  });

  it('should list places sorted with field', async () => {
    const test = await listPlacesService.run({
      order: [
        {
          field: 'createdAt',
          order: 'DESC',
        },
      ],
    });
    expect(isSorted(test, 'createdAt', 'DESC')).toBeTruthy();
    expect(isSorted(test, 'goal', 'ASC')).toBeFalsy();
  });

  it('should not list places', async () => {
    const spyFind = jest
      .spyOn(mockPlacesRepository, 'findAll')
      .mockImplementationOnce(() => {
        throw new Error('some error');
      });
    await expect(listPlacesService.run()).rejects.toBeInstanceOf(Error);
    expect(spyFind).toHaveBeenCalledWith([
      {
        field: 'goal',
        order: 'ASC',
      },
    ]);
  });
});
