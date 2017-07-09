import { Component } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { errorObject } from 'rxjs/util/errorObject';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private deviceMotion: DeviceMotion,
    private gyroscope: Gyroscope,
    private deviceOrientation: DeviceOrientation,
    private bluetoothSerial: BluetoothSerial,
    private ble: BLE,
    private barcodeScanner: BarcodeScanner) {

  }
  money: number = 0
  getDeviceMotion() {
    // Get the device current acceleration
    this.deviceMotion.getCurrentAcceleration().then(
      (acceleration: DeviceMotionAccelerationData) => console.log(acceleration),
      (error: any) => console.log(error)
    );

    // Watch device acceleration
    var subscription = this.deviceMotion.watchAcceleration({
      frequency: 1000
    }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      console.log('============acceleration============')
      console.log(acceleration.x);
      console.log(acceleration.y);
    });
  }

  getGyroscope() {
    let options: GyroscopeOptions = {
      frequency: 1000
    };

    this.gyroscope.getCurrent(options)
      .then((orientation: GyroscopeOrientation) => {
        console.log('Start');
      })
      .catch()


    this.gyroscope.watch(options)
      .subscribe((orientation: GyroscopeOrientation) => {
        console.log('=================orientation================')
        console.log(orientation.x);
        console.log(orientation.y);
        console.log(orientation.z);
        console.log(orientation.timestamp);
      });
  }
  sendWord() {
    var data = new Uint8Array(4);
    data[0] = 0x41;
    data[1] = 0x42;
    data[2] = 0x43;
    data[3] = 0x44;
    this.bluetoothSerial.write(data.buffer).then(() => {
      console.log('OK!')
    }, (err) => {
      console.log(errorObject)
    });
  }
  readRSSI() {
    // BLE.readRSSI('00:1B:10:30:57:40').then((rssi) => {
    //   console.log(rssi)
    // })
    this.bluetoothSerial.readRSSI().then((rssi) => {
      console.log(rssi)
    })
  }
  isConnected() {
    this.bluetoothSerial.isConnected().then(status => {
      console.log(status)
    })
  }
  QRScan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log(barcodeData.text)
      this.money += 5
    }, (err) => {
        // An error occurred
    });
  }
  scan() {
    // this.ble.startScan([]).subscribe(device => {
    //   console.log(JSON.stringify(device))
    // })
    this.bluetoothSerial.discoverUnpaired().then((data) => {
        console.log(JSON.stringify(data))
        data.forEach(item => {
          console.log(item.address)
        })
    })
  }
  enable() {
    this.bluetoothSerial.enable().then(result => {
      console.log(result)
    })
  }
  connect() {
    // 4C:32:75:8A:E0:58 macbook
    // 00:1B:10:30:56:40 makeblock
    // new: 00:1B:10:60:2E:26
    this.bluetoothSerial.connect('00:1B:10:60:2E:26').subscribe(
      (data) => {
        console.log(data)
      }
    )
  }
  getCompass() {
    // Get the device current compass heading
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => console.log(data),
      (error: any) => console.log(error)
    );

    // Watch the device compass heading change
    var subscription = this.deviceOrientation.watchHeading({
      frequency: 1000
    }).subscribe(
      (data: DeviceOrientationCompassHeading) => console.log(data.magneticHeading)
    );
  }
  isEnable() {
    this.bluetoothSerial.isEnabled().then((result) => {
      console.log(result)
    })
  }
}
