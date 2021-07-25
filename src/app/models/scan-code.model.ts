export class StatusModel {
  status: string;
}

export class ScanCodeDataModel {
  apiServer: string;
  password: string;
  username: string;
}

export class ImageResultsModel {
  file: string;
  status: string;
}

export interface IPhoto {
  filepath: string;
  webviewPath: string;
}
