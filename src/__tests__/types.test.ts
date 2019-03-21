import 'jest';
import { typeCheckFolder } from '../../testTypes';

describe('types', () => {
  describe('invalid files', () => {
    it('should have type errors', async () => {
      await typeCheckFolder([__dirname, 'invalid'], true);
    });
  });

  describe('valid files', () => {
    it('should not have type errors', async () => {
      await typeCheckFolder([__dirname, 'valid'], false);
    });
  })
});
