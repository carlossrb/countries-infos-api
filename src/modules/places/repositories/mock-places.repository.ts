import { MockGenericAbstractRepository } from '@core/repositories/mock-generic-abstract.repository';

import { Place } from '../infra/nest/typeorm/entities/place.entity';
import { PlacesRepositoryInterface } from './places.repository.interface';

export class MockPlacesRepository
  extends MockGenericAbstractRepository<Place>
  implements PlacesRepositoryInterface {}
