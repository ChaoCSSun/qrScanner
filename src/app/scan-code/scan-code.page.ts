import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { promise } from 'protractor';
import {
  IPhoto,
  ScanCodeDataModel,
  StatusModel,
} from '../models/scan-code.model';
import { ScanCodeService } from '../services/scan-code.service';
@Component({
  selector: 'app-scan-code',
  templateUrl: './scan-code.page.html',
  styleUrls: ['./scan-code.page.scss'],
})
export class ScanCodePage implements OnInit {
  apiServer: string;
  data: ScanCodeDataModel;
  serverStatus: StatusModel;
  photo: IPhoto;
  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanCodeService: ScanCodeService
  ) {}

  ngOnInit() {
    // api link not work
    //https://be-app-hiring-bixinf-test.22ad.bi-x.openshiftapps.com/;user:admin;password:secret
    // this.apiServer =
    //   'https://be-app-hiring-bixinf-test.22ad.bi-x.openshiftapps.com/';
    this.serverStatus = {
      status: null,
    };
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then((barCodeData) => {
        this.apiServer = barCodeData.text;
        this.convertToJson(barCodeData.text);
      })
      .catch((err) => {
        console.log('some error happens', err);
      });
  }

  //ds
  convertToJson(apiServer) {
    const arr = apiServer.split(';');
    const apiUrlServer = arr[0];
    const username = arr[1].split(':')[1];
    const password = arr[2].split(':')[2];

    this.data = {
      apiServer: apiUrlServer,
      username: username,
      password: password,
    } as ScanCodeDataModel;
  }

  // check server status
  async checkServerStatus(): Promise<Boolean> {
    //temp mock
    // const apiText =
    //   'https://be-app-hiring-bixinf-test.22ad.bi-x.openshiftapps.com/;user:admin;password:secret';
    // this.convertToJson(apiText);
    this.serverStatus = await this.scanCodeService.checkServerStatus(this.data);
    return this.serverStatus.status === 'ok' ? true : false;
  }

  // action take photo and Upload
  async takePhotoAndUpload() {
    await this.scanCodeService.addNewToGallery();
    const photo = await (await this.scanCodeService.getImage()).toPromise();
    this.photo = {
      webviewPath: photo.webPath,
      filepath: photo.path,
    };
  }
}
