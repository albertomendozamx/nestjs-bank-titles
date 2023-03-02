import { Description } from './description.enum';
import { IDTitle } from './title.enum';

export interface Title {
  id: number;
  idtitulo: IDTitle;
  titulo: Description;
  clasificacion: string;
  valor: number;
  fecha_creacion: string;
  fecha_vencimiento: string;
  pagocuota: string;
}

export type TitleDto = Omit<Title, 'id'>;

export type TitleUpdateDto = Partial<TitleDto>;

export type MoveDto = {
  from: string;
  to: string;
};
