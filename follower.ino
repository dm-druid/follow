#include "MeMegaPi.h"

MeMegaPiDCMotor direction_motor(PORT1B);
MeMegaPiDCMotor stepper1_motor(PORT2B);
MeMegaPiDCMotor stepper2_motor(PORT3B);

MeUltrasonicSensor ultrasonic(5);

boolean first = false;
boolean second = false;

uint8_t motorSpeed = 100;
uint8_t degree = 0;

void setup() {
  Serial.begin(9600);
}

float distance() {
  float distance = 0;
  int tried = 5;
  for (int i = 1; i <= 3; ++i) {
    float res = ultrasonic.distanceCm();
    if ((res <= 400 && res >= 300) or (res <= 6)) {
      --i;
      --tried;
      continue;
    }
    if (tried == 0) {
      break;
    }
    distance += res;
  }
  return distance / 3;
}

void turnDegree(int d) {
  if (d > 0) {
    direction_motor.run(255);
    delay(d / 5 * 100);
  }
  else {
    direction_motor.run(-255);
    delay((-d) / 5 * 100);
  }
  direction_motor.stop();
}

void goFurther(int d) {
  stepper1_motor.run(d * 2 > 255 ? 255 : d * 2);
  stepper2_motor.run(-d * 2 < -255 ? -255 : -d * 2);
  delay(100);
}

void turnWithGoing(int deg, int dis) {
  stepper1_motor.run(dis * 2 > 255 ? 255 : dis * 2);
  stepper2_motor.run(-dis * 2 < -255 ? -255 : -dis * 2);
  if (deg > 0) {
    direction_motor.run(255);
    delay(deg / 5 * 100);
  }
  else {
    direction_motor.run(-255);
    delay(-deg / 5 * 100);
  }
  direction_motor.stop();
  delay(500);
}

void loop() {
  if (!first && !second) {
    turnWithGoing(5, distance());
    first = true;
    delay(1000);
  }
  else if (first && !second) {
    turnWithGoing(-10, distance());
    second = true;
    delay(1000);
  }
  else {
    if (distance() > 100) {
      degree += 5;
    }
    goFurther(distance());
  }
}

