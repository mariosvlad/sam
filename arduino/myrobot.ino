#include <NewPing.h>
#include "CytronMotorDriver.h"
#include<Wire.h>

#define SONAR_NUM 2
#define LASTCOMMSAFEGUARD 500
#define SENSORINTERVAL 200

CytronMD motorL(PWM_DIR, 5, 8); // 5 pwm
CytronMD motorR(PWM_DIR, 11, 13);  // 11 pwm

NewPing sonars[SONAR_NUM] = {
  NewPing(12, 6, 200),
  NewPing(7, 3, 200),
};

unsigned long lastSensorCheck;

const int MPU = 0x68;
int16_t AcX, AcY, AcZ, Tmp, GyX, GyY, GyZ;

int speed = 255;
int turnSpeed = 255;

const byte DATA_MAX_SIZE = 32;
char data[DATA_MAX_SIZE];

unsigned long lastEventTime = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("setting up");
  lastEventTime = millis();
  lastSensorCheck = millis();
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  stop();
}

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];        // temporary array for use when parsing

char messageFromPC[numChars] = {0};
int speedL = 0;
int speedR = 0;

boolean newData = false;

void loop() {
  receiveWithStartEndMarkers();
  if (newData == true) {
    lastEventTime = millis();
    strcpy(tempChars, receivedChars);
    parseData();
    actOnParsedData();
    newData = false;
  }
  if (millis() - lastEventTime > LASTCOMMSAFEGUARD) {
    stop();
  }
  if (millis() > lastSensorCheck + SENSORINTERVAL) {
    measureBatteryVoltage();
    sonarMeasure();
    // MPUMeasures();
    lastSensorCheck = millis();
  }
}

void measureBatteryVoltage() {
  float vout = ((analogRead(A0) - 10) * 5.0) / 1024.0 ;
  float vin = vout / (7500.0 / (30000.0 + 7500.0));
  Serial.println((String)"B" + "," + vin);
}

void MPUMeasures() {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 12, true);
  AcX = Wire.read() << 8 | Wire.read();
  AcY = Wire.read() << 8 | Wire.read();
  AcZ = Wire.read() << 8 | Wire.read();
  GyX = Wire.read() << 8 | Wire.read();
  GyY = Wire.read() << 8 | Wire.read();
  GyZ = Wire.read() << 8 | Wire.read();

  Serial.print("Accelerometer: ");
  Serial.print("X = "); Serial.print(AcX);
  Serial.print(" | Y = "); Serial.print(AcY);
  Serial.print(" | Z = "); Serial.println(AcZ);

  Serial.print("Gyroscope: ");
  Serial.print("X = "); Serial.print(GyX);
  Serial.print(" | Y = "); Serial.print(GyY);
  Serial.print(" | Z = "); Serial.println(GyZ);
  Serial.println(" ");
}

void sonarMeasure() {
  for (uint8_t i = 0; i < SONAR_NUM; i++) {
    Serial.println((String)"S" + i + "," + sonars[i].ping_cm());
  }
}

void receiveWithStartEndMarkers() {
  static boolean recvInProgress = false;
  static byte ndx = 0;
  char startMarker = '<';
  char endMarker = '>';
  char rc;

  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();

    if (recvInProgress == true) {
      if (rc != endMarker) {
        receivedChars[ndx] = rc;
        ndx++;
        if (ndx >= numChars) {
          ndx = numChars - 1;
        }
      }
      else {
        receivedChars[ndx] = '\0'; // terminate the string
        recvInProgress = false;
        ndx = 0;
        newData = true;
      }
    }

    else if (rc == startMarker) {
      recvInProgress = true;
    }
  }
}

void parseData() {

  char * strtokIndx;

  strtokIndx = strtok(tempChars, ",");
  strcpy(messageFromPC, strtokIndx);

  strtokIndx = strtok(NULL, ",");
  speedL = atoi(strtokIndx);

  strtokIndx = strtok(NULL, ",");
  speedR = atoi(strtokIndx);

}

void actOnParsedData() {
  if (strcmp(messageFromPC, "S1") == 0) {
    updateMotors();
  }
}

void updateMotors() {
  motorL.setSpeed(speedL);
  motorR.setSpeed(speedR);
}

void increaseSpeed() {
  speed += 20;
  if (speed > 255) {
    speed = 255;
  }
}


void decreaseSpeed() {
  speed -= 20;
  if (speed < 30) {
    speed = 30;
  }
}

void stop() {
  motorL.setSpeed(0);
  motorR.setSpeed(0);
}

void forward() {
  motorL.setSpeed(speed);
  motorR.setSpeed(speed);
}

void reverse() {
  motorL.setSpeed(-speed);
  motorR.setSpeed(-speed);
}

void turnLeft() {
  motorL.setSpeed(0);
  motorR.setSpeed(turnSpeed);
}

void turnRight() {
  motorR.setSpeed(0);
  motorL.setSpeed(turnSpeed);
}

void hardTurnLeft() {
  motorL.setSpeed(-turnSpeed);
  motorR.setSpeed(turnSpeed);
}

void hardTurnRight() {
  motorR.setSpeed(-turnSpeed);
  motorL.setSpeed(turnSpeed);
}
