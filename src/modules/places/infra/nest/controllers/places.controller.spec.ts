/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { makeString, makeDate } from '@core/utils/data.generate';

import { ListPlacesService } from '@modules/places/services/list-places.service';
import { GetPlaceByIdService } from '@modules/places/services/get-place-by-id.service';
import { CreatePlaceService } from '@modules/places/services/create-place.service';
import { UpdatePartialPlaceService } from '@modules/places/services/update-partial-place.service';
import { DeletePlaceService } from '@modules/places/services/delete-place.service';
import { PlaceOutService } from '@modules/places/services/place-out.service';
import { RepeatedPlaceService } from '@modules/places/services/repeated-place.service';

import { PlacesController } from './places.controller';
import { MockPlacesRepository } from '@modules/places/repositories/mock-places.repository';
import { Place } from '../typeorm/entities/place.entity';

describe('PlacesController', () => {
  let placesController: PlacesController;
  let listPlacesService: ListPlacesService;
  let getPlaceByIdService: GetPlaceByIdService;
  let createPlaceService: CreatePlaceService;
  let updatePartialPlaceService: UpdatePartialPlaceService;
  let deletePlaceService: DeletePlaceService;
  let placeGoneService: PlaceOutService;
  let repeatedPlace: RepeatedPlaceService;
  let mockPlacesRepository: MockPlacesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register({})],
      controllers: [PlacesController],
      providers: [
        {
          provide: 'PlacesRepositoryInterface',
          useClass: MockPlacesRepository,
        },
        ListPlacesService,
        GetPlaceByIdService,
        CreatePlaceService,
        UpdatePartialPlaceService,
        DeletePlaceService,
        PlaceOutService,
        RepeatedPlaceService,
      ],
    }).compile();
    listPlacesService = moduleRef.get<ListPlacesService>(ListPlacesService);
    getPlaceByIdService =
      moduleRef.get<GetPlaceByIdService>(GetPlaceByIdService);
    createPlaceService = moduleRef.get<CreatePlaceService>(CreatePlaceService);
    updatePartialPlaceService = moduleRef.get<UpdatePartialPlaceService>(
      UpdatePartialPlaceService,
    );
    deletePlaceService = moduleRef.get<DeletePlaceService>(DeletePlaceService);
    placeGoneService = moduleRef.get<PlaceOutService>(PlaceOutService);
    repeatedPlace = moduleRef.get<RepeatedPlaceService>(RepeatedPlaceService);
    placesController = moduleRef.get<PlacesController>(PlacesController);
  });
  let place: Place;

  beforeEach(async () => {
    place = await placesController.create({
      country: makeString(5),
      location: makeString(5),
      goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
      imageUrl: `http://${makeString(5)}.com.br`,
    });
  });

  describe('show', () => {
    it('should return an array of places', async () => {
      const result = await placesController.show();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('index', () => {
    it('should return a place by id', async () => {
      const result = await placesController.index(place.id);
      expect(result).toBeDefined();
    });
  });

  describe('update partial', () => {
    it('should update place', async () => {
      const updatePlace = {
        location: 'test2',
        goal: new Date(2022, 1, 1),
      };
      const result = await placesController.updatePartial(
        place.id,
        updatePlace,
      );
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        ...updatePlace,
      });
    });

    it('should update same place', async () => {
      const sameCountry = await placesController.create({
        country: place.country,
        location: makeString(5),
        goal: makeDate(new Date(2022, 0, 1), new Date(2030, 11, 1)),
        imageUrl: `http://${makeString(5)}.com.br`,
      });
      const updatePlace = {
        location: sameCountry.location,
        goal: place.goal,
      };
      expect(
        placesController.updatePartial(place.id, updatePlace),
      ).rejects.toBeInstanceOf(Error);
    });

    it('should not update place', async () => {
      const updatePlace = {
        location: 'test2',
        goal: new Date(2022, 1, 1),
      };
      const result = await placesController.updatePartial(
        place.id,
        updatePlace,
      );
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        ...updatePlace,
      });
    });
  });

  describe('delete', () => {
    it('should delete place by id', async () => {
      const result = await placesController.delete(place.id);
      expect(result).toBeUndefined();
    });
  });
});
