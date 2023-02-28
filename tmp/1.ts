const animals = [
  { species: 'cat', name: 'Fluffy' },
  { species: 'dog', name: 'Fido' },
  { species: 'mouse', name: 'Trevor' }
] as const

type Animal = typeof animals[number]['species']
let a: Animal = 'cat'