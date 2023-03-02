import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  Length,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

import { Description } from './description.enum';
import { IDTitle } from './title.enum';
import { Pago } from './pago.enum';

export class Title {
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsEnum(IDTitle)
  readonly idtitulo: IDTitle;

  @IsNotEmpty()
  @IsEnum(Description)
  readonly titulo: Description;

  @IsNotEmpty()
  @IsString()
  readonly clasificacion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly valor: number;

  @IsNotEmpty()
  @IsDateString()
  readonly fecha_creacion: string;

  @IsNotEmpty()
  @IsDateString()
  readonly fecha_vencimiento: string;

  @IsNotEmpty()
  @IsEnum(Pago)
  @Length(1)
  readonly pagocuota: Pago;
}

export class TitleDto extends OmitType(Title, ['id']) {}

export class TitleUpdateDto extends PartialType(TitleDto) {}

export class MoveDto {
  @IsNotEmpty()
  @IsDateString()
  from: string;

  @IsNotEmpty()
  @IsDateString()
  to: string;
}
