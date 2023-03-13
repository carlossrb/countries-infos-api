import { Place } from './place.model';

describe('Place model', () => {
  it('should create new place model', () => {
    const place = {
      id: '1',
      country: 'Brazil',
      location: 'Salvador',
      goal: new Date(2023, 1, 5),
      imageUrl: 'image.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const pp = new Place(place);
    expect(pp).toMatchObject({
      ...place,
      meta: '02/2023',
    });
  });
  it('should create new place model with invalid goal', () => {
    const place = {
      id: '1',
      country: 'Brazil',
      location: 'Salvador',
      goal: 'invalid date',
      imageUrl: 'image.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(new Place(place).meta).toEqual(place.goal);
  });
});
