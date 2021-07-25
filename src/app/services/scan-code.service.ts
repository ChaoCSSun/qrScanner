import { Injectable } from '@angular/core';
import {
  Camera,
  Photo,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';
import {
  ImageResultsModel,
  IPhoto,
  ScanCodeDataModel,
  StatusModel,
} from '../models/scan-code.model';

@Injectable({
  providedIn: 'root',
})
export class ScanCodeService {
  public photos: IPhoto[] = [];
  baseUrl: string;
  constructor(private restService: HttpClient) {}

  // check server status
  public async checkServerStatus(
    params: ScanCodeDataModel
  ): Promise<StatusModel> {
    const subUrl = 'api/v1.0/status';
    this.baseUrl = params.apiServer;
    try {
      return await this.restService
        .get<StatusModel>(params.apiServer + subUrl)
        .toPromise();
    } catch (error) {
      throw error;
    }
  }

  // get uploaded image
  public async getImage() {
    const subUrl = 'api/v1.0/image/';
    try {
      return await this.restService.get<Photo>(this.baseUrl + subUrl);
    } catch (error) {
      throw error;
    }
  }

  // upload Image
  public async upLoadImage(imageData) {
    const subUrl = 'api/v1.0/ranking/';
    const data = {
      picture: imageData,
      username: 'admin',
      password: 'secret',
    };
    try {
      return await this.restService.post<ImageResultsModel>(
        this.baseUrl + subUrl,
        data
      );
    } catch (error) {
      throw error;
    }
  }
  // handel photo
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    this.photos.unshift({
      filepath: 'soon...',
      webviewPath: capturedPhoto.webPath,
    });
  }

  private async savePicture(cameraPhoto: Photo) {
    // Convert photo to base64 format
    const base64Data = await this.readAsBase64(cameraPhoto);

    // upload to server
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await this.upLoadImage({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
    };
  }

  private async readAsBase64(cameraPhoto: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
