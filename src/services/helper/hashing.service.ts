import * as bcrypt from 'bcrypt';
export const hashIt = async (value: string) => {
  const saltOrRounds = 10;
  return bcrypt.hash(value, saltOrRounds);
};
export const hashCompare = async (enteredValue: string, storedHash: string) => {
  return bcrypt.compare(enteredValue, storedHash);
};
