const generateRandomId = () => Math.floor(Math.random() * 1000000);

class Subject {
  constructor(name) {
    this.name = name
    this.id = generateRandomId();
  }
}

class Tag {
  constructor(name) {
    this.name = name
    this.id = generateRandomId()
  }
}

class Mcq {
  constructor(question, options, rightAnswerIndex, subjectId, tags) {
    this.question = question;
    this.options = options;
    this.rightAnswerIndex = rightAnswerIndex;
    this.subjectId = subjectId;
    this.tags = tags;
    this.id = generateRandomId();
    this.rightAnswer = options[rightAnswerIndex]; // this will be used to evaluate answer
  }
}

const subjects = [new Subject('mathematics'), new Subject('chemistry'), new Subject('physics'), new Subject('biology')];

const tags = [
  new Tag('momentum'),
  new Tag('exponentials'),
  new Tag('euler\'s number'),
  new Tag('atomic number'),
  new Tag('waves'),
  new Tag('particle'),
  new Tag('seperation techniques'),
  new Tag('atomic number'),
  new Tag('kinetic theory'),
  new Tag('elements')
]

// Added more questions
const mcqs = [
  new Mcq('Which one of these is Euler\'s number?', ['2.718','1.414', '3.142'], 1, getSubjectId('mathematics'), getTagIds(['exponentials', 'euler\'s number'])),
  new Mcq('Carbon\'s atomic number is-', ['6', '50', '25', '12'], 0, getSubjectId('chemistry'), getTagIds(['atomic number', 'elements'])),
  new Mcq('Choose the correct statement?', ['Light is a wave','Light is a particle', 'Light is both'], 2, getSubjectId('physics'), getTagIds(['waves', 'particle'])),
  new Mcq('Which method is suited for extracting salt (only) from sea water:', ['filtration', 'evaporation', 'fractional distillation', 'simple distillation'], 1, getSubjectId('chemistry'), getTagIds(['seperation techniques'])),
  new Mcq('Choose Avogadro\'s number', ['6.02e23','6.02e-23', '3e8'], 0, getSubjectId('chemistry'), getTagIds(['exponentials', 'euler\'s number'])),
  new Mcq('Calcium\'s proton number is-', ['40', '20', '25', '12'], 1, getSubjectId('chemistry'), getTagIds(['atomic number', 'elements'])),
  new Mcq('Choose the correct statement?', ['solid particles move freely','liquids fill up the room', 'gases expand'], 2, getSubjectId('physics'), getTagIds(['kinetic theory'])),
  new Mcq('Which method is suited for extracting salt and water from sea water:', ['filtration', 'evaporation', 'fractional distillation', 'simple distillation'], 3, getSubjectId('chemistry'), getTagIds(['seperation techniques'])),
  new Mcq('What is the unit of momentum?', ['kg.m/s', 'J.s', 'm/K'], 0, getSubjectId('physics'), getTagIds(['momentum']))
];

// name from id
function getSubjectId(name) {
  for (subject of subjects) {
    if (subject.name === name) {
      return subject.id
    }
  }
  console.log(`couldn't find subject named ${name}`)
  return null
}

function getTagId(name) {
  for (tag of tags) {
    if (tag.name === name) {
      return tag.id
    }
  }
  console.log(`couldn't find tag named ${name}`)
  return null
}

function getTagIds(names) {
  return names.map(name => getTagId(name))
}

// id from name
function getSubjectName(id) {
  for (subject of subjects) {
    if (subject.id === id) {
      return subject.name
    }
  }
  console.log(`couldn't find subject with id ${id}`)
  return null
}

function getTagName(id) {
  for (tag of tags) {
    if (tag.id === id) {
      return tag.name
    }
  }
  console.log(`couldn't find tag with id ${id}`)
  return null
}

function getTagNames(ids) {
  return ids.map(id => getTagName(id))
}
