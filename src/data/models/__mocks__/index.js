export const Planet = {
  hasMany: () => jest.fn(),
  belongsToMany: () => jest.fn(),
  create: () => jest.fn(),
  findOne: () => new Promise(resolve => resolve({ addResidents: jest.fn() })),
  addScope: () => jest.fn()
};
export const Person = {
  hasMany: () => jest.fn(),
  create: () => jest.fn(),
  count: () => new Promise(resolve => resolve(2)),
  findOne: () => new Promise(resolve => resolve({ setHomeworld: jest.fn() })),
  belongsTo: () => jest.fn(),
  findAll: () => jest.fn(),
  addScope: () => jest.fn()
};
