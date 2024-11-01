import { Expose } from 'class-transformer';
import { transformToObjectHelper } from './transform-to-array.helper';

class TestClass {
  @Expose()
  publicField!: string;

  @Expose()
  adminField!: string;

  privateField!: string;
}

describe('transformToObjectHelper', () => {
  it('should transform plain object to an instance of the provided class and then to plain object according to options', () => {
    const item = {
      publicField: 'public',
      adminField: 'admin',
      privateField: 'private',
    };

    const result = transformToObjectHelper(item, TestClass);

    expect(result).toEqual({
      adminField: 'admin',
      publicField: 'public',
    });

    expect(result).not.toHaveProperty('privateField');
  });
});
