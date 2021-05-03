export function voltageToPercentage(voltage: number) {
  switch (true) {
    case voltage > 16.45:
      return 90;
    case voltage > 16.09:
      return 80;
    case voltage > 15.81:
      return 70;
    case voltage > 15.5:
      return 60;
    case voltage > 15.34:
      return 50;
    case voltage > 15.18:
      return 40;
    case voltage > 15.06:
      return 30;
    case voltage > 14.91:
      return 20;
    case voltage > 14.83:
      return 15;
    case voltage > 14.75:
      return 10;
    case voltage > 14.43:
      return 5;
    default:
      return 0;
  }
}
