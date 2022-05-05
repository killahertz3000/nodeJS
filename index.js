const colors = require('colors/safe');

try {
  let [start, end] = process.argv.splice(2, 2).map((string) => Number(string));

  if (isNaN(start) || isNaN(end))
    throw new Error(
      `Некорректный диапазон значений! start=${start}, end=${end}`
    );

  if (start < 0 || end < 0) throw new Error('Отрицательное значение не допустимо!');

  if (start > end) start = [end, (end = start)][0];

  const numberRange = new Array(end + 1).fill(true, start <= 1 ? 2 : start);
  const divisor = Math.trunc(Math.sqrt(end));

  for (let i = 2; i <= divisor; i++) {
    numberRange.forEach((isPrimeNumber, index, array) => {
      if (isPrimeNumber && index > i && !(index % i)) {
        array[index] = false;
      }
    });
  }

  if (numberRange.find((isPrimeNumber) => isPrimeNumber)) {
    let colorSwitcher = 1;

    numberRange.forEach((isPrimeNumber, number) => {
      if (isPrimeNumber) {
        switch (colorSwitcher) {
          case 1:
            console.log(colors.yellow(number));
            colorSwitcher++;
            break;
          case 2:
            console.log(colors.red(number));
            colorSwitcher++;
            break;
          case 3:
            console.log(colors.green(number));
            colorSwitcher = 1;
            break;
          default:
        }
      }
    });
  } else {
    console.log(colors.red('Нет простых чисел!'));
  }
} catch (error) {
  console.warn(colors.red(error.message));
}