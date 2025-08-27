export interface ValidatorType {
  message: string;
  validation: (value: string) => boolean;
}
