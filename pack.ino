#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include <MeOrion.h>

double angle_rad = PI/180.0;
double angle_deg = 180.0/PI;
double count;
double distrance;
MeUltrasonicSensor ultrasonic_3(3);
Me7SegmentDisplay seg7_4(4);



void setup(){
    count = 0;
    distrance = 0;
    
}

void loop(){
    
    distrance = ultrasonic_3.distanceCm();
    if((distrance) < (  30)){
        count += 1;
        seg7_4.display((float)count);
        _delay(1);
    }
    
    _loop();
}

void _delay(float seconds){
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime)_loop();
}

void _loop(){
    
}

