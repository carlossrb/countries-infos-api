import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export enum ExceptionCodes {
  GenericException = '000',
  EntityNotFound = '001',
  Unauthorized = '002',
  TextLengthNotSatisfied = '003',
  ResourceNotFound = '004',
  FieldIsRequired = '005',
  EntityOut = '006',
  PropertyDoesNotExist = '007',
  UnauthorizedAccess = '008',
  RepeatedEntity = '009',
}

export class BaseException extends Error {
  @ApiProperty() code: ExceptionCodes;
  @ApiProperty() message: string;
  statusCode: number;

  constructor(
    public exceptionCode: ExceptionCodes,
    private exceptionMessage: string,
    private exceptionStatusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super(exceptionMessage);
    this.code = exceptionCode;
    this.message = exceptionMessage;
    this.statusCode = exceptionStatusCode;
  }
}

export class GenericException extends BaseException {
  constructor(error: any) {
    if (error instanceof Error) {
      super(ExceptionCodes.GenericException, error.message);
    } else {
      super(ExceptionCodes.GenericException, error);
    }
  }
}

export class PropertyDoesNotExist extends BaseException {
  constructor(field: string, entity?: string) {
    super(
      ExceptionCodes.PropertyDoesNotExist,
      `Propriedade "${field.toLowerCase()}" inexistente ${
        entity ? `na "${entity.toLowerCase()}"` : '.'
      }`,
    );
  }
}

export class EntityOut extends BaseException {
  constructor(entity: string) {
    super(
      ExceptionCodes.EntityOut,
      `${entity} não se encontra no sistema`,
      HttpStatus.GONE,
    );
  }
}

export class FieldIsRequired extends BaseException {
  constructor(field: string) {
    super(
      ExceptionCodes.FieldIsRequired,
      `"${field}" é necessário e obrigatório`,
    );
  }
}

export class ResourceNotFound extends BaseException {
  constructor() {
    super(ExceptionCodes.ResourceNotFound, 'Recurso indisponível');
  }
}

export class TextLengthNotSatisfied extends BaseException {
  constructor(
    public field: string,
    public minLength: number,
    public maxLength: number,
  ) {
    super(
      ExceptionCodes.TextLengthNotSatisfied,
      `"${field}" tem no min ${minLength} char(s) e máx ${maxLength} char(s)`,
    );
  }
}

export class Unauthorized extends BaseException {
  constructor() {
    super(
      ExceptionCodes.Unauthorized,
      `Você não possui autorização para isso!`,
    );
  }
}

export class EntityNotFound extends BaseException {
  constructor(type: string) {
    super(
      ExceptionCodes.EntityNotFound,
      `${type.toLowerCase()} inexistente ou não localizado`,
    );
  }
}

export class UnauthorizedAccess extends BaseException {
  constructor(exceptionMessage: string) {
    super(ExceptionCodes.UnauthorizedAccess, exceptionMessage);
  }
}

export class RepeatedEntity extends BaseException {
  constructor(entity: string) {
    super(
      ExceptionCodes.EntityOut,
      `${entity} já se encontra na base. Item duplicado`,
    );
  }
}
