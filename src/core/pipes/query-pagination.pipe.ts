import { Injectable, PipeTransform } from '@nestjs/common';

import { QueryPagination, RepositoryEntity } from '@core/core.model';

@Injectable()
export class QueryPaginationPipe implements PipeTransform {
  transform<E extends RepositoryEntity>(data: any): QueryPagination<E> {
    const queryPagination: any = {};
    if (Object.prototype.hasOwnProperty.call(data, 'order')) {
      if (data.order instanceof Array) {
        queryPagination.order = data.order.map(o => {
          const [field, order] = o.split(':');
          return { field, order };
        });
      } else {
        const [field, order] = data.order.split(':');
        queryPagination.order = [{ field, order }];
      }
    }
    return queryPagination;
  }
}
