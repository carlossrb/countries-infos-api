import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlacesController } from './controllers/places.controller';

import { ListPlacesService } from '@modules/places/services/list-places.service';
import { GetPlaceByIdService } from '@modules/places/services/get-place-by-id.service';
import { CreatePlaceService } from '@modules/places/services/create-place.service';
import { UpdatePartialPlaceService } from '@modules/places/services/update-partial-place.service';
import { DeletePlaceService } from '@modules/places/services/delete-place.service';
import { PlaceOutService } from '@modules/places/services/place-out.service';
import { RepeatedPlaceService } from '@modules/places/services/repeated-place.service';

import { PlacesRepository } from './typeorm/repositories/places.repository';
import { Place } from './typeorm/entities/place.entity';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([Place])],
  controllers: [PlacesController],
  providers: [
    {
      provide: 'PlacesRepositoryInterface',
      useClass: PlacesRepository,
    },
    ListPlacesService,
    GetPlaceByIdService,
    CreatePlaceService,
    UpdatePartialPlaceService,
    DeletePlaceService,
    PlaceOutService,
    RepeatedPlaceService,
  ],
})
export class PlaceModule {}
