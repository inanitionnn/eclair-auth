import { Expose } from 'class-transformer';
import { transformToArrayHelper } from './transform-to-object.helper';

class TestClass {
  @Expose()
  publicField!: string;

  @Expose()
  adminField!: string;

  privateField!: string;
}

describe('transformToArrayHelper', () => {
  it('should transform an array of plain objects to an array of transformed objects', () => {
    const data = [
      {
        publicField: 'public1',
        adminField: 'admin1',
        privateField: 'private1',
      },
      {
        publicField: 'public2',
        adminField: 'admin2',
        privateField: 'private2',
      },
    ];

    const result = transformToArrayHelper(data, TestClass);

    expect(result).toEqual([
      { publicField: 'public1', adminField: 'admin1' },
      { publicField: 'public2', adminField: 'admin2' },
    ]);

    result.forEach((item) => {
      expect(item).not.toHaveProperty('privateField');
    });
  });
});
