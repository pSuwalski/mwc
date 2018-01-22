export function myParser(value: any): Date | null {

  if ((typeof value === 'string') && (value.indexOf('.') > -1) && value.split('.').length === 3) {
    const str = value.split('.');
    if (str[2].split('').length === 4) {
      return new Date(Number(str[2]), Number(str[1]) - 1, Number(str[0]));
    } else {
      return new Date(2017, Number(str[1]) - 1, Number(str[0]));
    }
  }
  const timestamp = typeof value === 'number' ? null : Date.parse(value);
  return isNaN(timestamp) ? null : new Date(timestamp);

}
