import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
const TIME = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  address: string;

  @Matches(TIME)
  opens_at: string;

  @Matches(TIME)
  closes_at: string;
}
