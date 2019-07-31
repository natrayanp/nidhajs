import { base_circle_leaf } from '../leafshape';

test('My Greeter', () => {
  expect(typeof (new base_circle_leaf(100,200,null,20))).toBe('base_circle_leaf');
});