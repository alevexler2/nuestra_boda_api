export class EventSettingsResponseDto {
  ID: string;
  EventName: string;
  title?: string;
  Subtitle?: string;
  EventDate: Date;
  OwnerEmail1: string;
  OwnerEmail2?: string;
  Theme?: {
    background: string;
    backgroundSecondary: string;
    font: string;
    fontSecondary: string;
  };
}
