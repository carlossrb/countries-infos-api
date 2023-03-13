import {
  Get,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Query,
  Param,
  Body,
  Patch,
  Delete,
  CacheInterceptor,
} from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { QueryPagination } from '@core/core.model';
import { QueryPaginationPipe } from '@core/pipes/query-pagination.pipe';

import {
  EntityOut,
  EntityNotFound,
  GenericException,
  PropertyDoesNotExist,
} from '@core/exception/exception.types';
import { ControllerDecorator } from '@core/decorators/controller.decorator';

import { Place } from '@modules/places/domain/model/place.model';
import { CreatePlaceDTO } from '@modules/places/domain/dto/create-place.dto';
import { UpdatePartialPlaceDTO } from '@modules/places/domain/dto/update-partial-place.dto';

import { ListPlacesService } from '@modules/places/services/list-places.service';
import { GetPlaceByIdService } from '@modules/places/services/get-place-by-id.service';
import { CreatePlaceService } from '@modules/places/services/create-place.service';
import { UpdatePartialPlaceService } from '@modules/places/services/update-partial-place.service';
import { DeletePlaceService } from '@modules/places/services/delete-place.service';
import { PlaceOutService } from '@modules/places/services/place-out.service';
import { RepeatedPlaceService } from '@modules/places/services/repeated-place.service';

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, GONE, CREATED } =
  HttpStatus;

@ControllerDecorator('places')
@UseInterceptors(CacheInterceptor)
export class PlacesController {
  constructor(
    private readonly listPlaces: ListPlacesService,
    private readonly getPlaceById: GetPlaceByIdService,
    private readonly createPlace: CreatePlaceService,
    private readonly updatePartialPlace: UpdatePartialPlaceService,
    private readonly deletePlace: DeletePlaceService,
    private readonly placeGone: PlaceOutService,
    private readonly repeatedPlace: RepeatedPlaceService,
  ) {}

  //listagem
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ type: QueryPagination<Place>, required: false })
  @ApiResponse({
    status: OK,
    description: 'Locais',
  })
  @ApiResponse({
    status: BAD_REQUEST,
    description: 'Existem alguma informações solicitadas inválidas',
    type: PropertyDoesNotExist,
  })
  @ApiResponse({
    status: INTERNAL_SERVER_ERROR,
    description: 'Erro inesperado!',
    type: GenericException,
  })
  async show(
    @Query(new QueryPaginationPipe())
    queryPagination?: QueryPagination<Place>,
  ): Promise<Place[]> {
    return this.listPlaces.run(queryPagination);
  }

  //get by id
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: OK,
    description: 'Local',
    type: Place,
  })
  @ApiResponse({
    status: NOT_FOUND,
    description: 'O local não existe no sistema',
    type: EntityNotFound,
  })
  @ApiResponse({
    status: GONE,
    description: 'Este local foi excluído',
    type: EntityOut,
  })
  @ApiResponse({
    status: INTERNAL_SERVER_ERROR,
    description: 'Erro inesperado!',
    type: GenericException,
  })
  async index(@Param('id') id: string): Promise<Place> {
    await this.placeGone.run(id);
    return this.getPlaceById.run(id);
  }

  // Criação de local
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: CREATED,
    description: 'Local',
    type: Place,
  })
  @ApiResponse({
    status: INTERNAL_SERVER_ERROR,
    description: 'Erro inesperado!',
    type: GenericException,
  })
  async create(@Body() createPlaceDto: CreatePlaceDTO): Promise<Place> {
    const { country, location } = createPlaceDto;
    await this.repeatedPlace.run({
      country,
      location,
    });
    return this.createPlace.run(createPlaceDto);
  }

  // Update de local
  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: OK,
    description: 'Local',
    type: Place,
  })
  @ApiResponse({
    status: NOT_FOUND,
    description: 'O local não existe no sistema',
    type: EntityNotFound,
  })
  @ApiResponse({
    status: INTERNAL_SERVER_ERROR,
    description: 'Erro inesperado!',
    type: GenericException,
  })
  async updatePartial(
    @Param('id') id: string,
    @Body() updatePartialPlaceDto: UpdatePartialPlaceDTO,
  ): Promise<Place> {
    await this.placeGone.run(id);
    await this.repeatedPlace.run({
      id,
      location: updatePartialPlaceDto.location,
    });
    return this.updatePartialPlace.run({
      id,
      ...updatePartialPlaceDto,
    });
  }

  // Deleta local
  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: OK,
    description: 'Local excluído',
    type: Place,
  })
  @ApiResponse({
    status: NOT_FOUND,
    description: 'O local não existe no sistema',
    type: EntityNotFound,
  })
  @ApiResponse({
    status: INTERNAL_SERVER_ERROR,
    description: 'Erro inesperado!',
    type: GenericException,
  })
  async delete(@Param('id') id: string) {
    await this.placeGone.run(id);
    return this.deletePlace.run(id);
  }
}
