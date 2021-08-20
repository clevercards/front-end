// function to add mcq object to display
function addMcq(mcq) {
  const mcqsDisplay = document.querySelector('#mcqs');
  // prepending will allow for submit button to stay at the bottom
  mcqsDisplay.prepend(giveMcqElement(mcq))
}
// show specified mcqs
function displayMcqs(mcqs) {
  const toBeRemoved = document.getElementsByClassName('mcq');
  // remove all mcqs already displayed
  for (let i = 0, n = toBeRemoved.length; i < n; i++) {
    toBeRemoved[0].remove();
    console.log('remove');
  }

  mcqs.forEach(mcq => {
    addMcq(mcq)
    console.log('added')
  });
}


// return all or limited number of random mcqs that are on the specified subject, the 'limit' parameter is optional
function filterMcqsBySubject(subject, limit) {
  /* request to view */
  let filteredArray = mcqs.filter(post => post.subjectId === getSubjectId(subject));
  shuffle(filteredArray);

  // If there are less questions available than requested, show all of them.
  if (limit === undefined || limit >= filteredArray.length) {
    return filteredArray;
    // Otherwise there are more questions available than requested
  } else {
    return filteredArray.slice(0, limit);
  }
}


// when page loads
document.addEventListener("DOMContentLoaded", () => {

  // populate subjects in subject selector
  const subjectChooser = document.querySelector('#sample-subject');
  /* request to view */
  for (subject of subjects) {
    const option = document.createElement('option');
    option.setAttribute('value', subject.name);
    option.innerHTML = subject.name[0].toUpperCase() + subject.name.slice(1);
    subjectChooser.appendChild(option);
  }

  // allow the user to control the no of options
  // input for no. of options
  const optionsCountInput = document.getElementById('#options');
  // the div of option input fields
  const options = document.getElementById('options');
  // new option template
  const newOption = document.createElement('input')
  newOption.classList.add('option')
  newOption.setAttribute('type', 'text')
  newOption.setAttribute('placeholder', 'Other Option')
  // associate input and div
  associateCountInputToElement(optionsCountInput, options, newOption, 2, 10);

  // allow the user to control the no of tags         */
  // input for no. of tags
  const tagsCounter = document.getElementById('#tag-list');
  // the div of tag input fields
  const tagList = document.getElementById('tag-list');
  // new tag template
  const newTag = document.createElement('input');
  newTag.classList.add('tag-item');
  newTag.setAttribute('type', 'text');
  // associate input to div 
  associateCountInputToElement(tagsCounter, tagList, newTag, 0, 10);

  // On new question submit, create question elements and render qustion to screen
  handleNewQuestionForm();

  // On submit of introductoryForm render question to screen
  handleSampleTestCreatorForm();

  // mark the test
  handleTestForm();
});

function giveMcqElement(mcq) {
  // create the element to return
  const result = document.createElement('article')
  result.classList.add('mcq')
  result.setAttribute('id', mcq.id);

  // create question element
  const question = document.createElement('p')
  question.innerHTML = mcq.question
  // create option tagElements
  const options = []
  for (let i = 0; i < mcq.options.length; i++) {
    const option = mcq.options[i];
    const radio = document.createElement('input')
    radio.setAttribute('type', 'radio')
    radio.setAttribute('id', `option-${option}`)
    radio.setAttribute('value', i)
    radio.setAttribute('name', mcq.id)
    const label = document.createElement('label')
    label.setAttribute('for', `option-${option}`)
    label.innerHTML = option
    // wrap radio and label in final option element
    const optionElement = document.createElement('div')
    optionElement.appendChild(radio)
    optionElement.appendChild(label)
    options.push(optionElement)
  }
  shuffle(options);
  const rightanswer = mcq.rightAnswer;
  // create subject element
  const subject = document.createElement('p')
  subject.innerHTML = capitalize(getSubjectName(mcq.subjectId))
  // create tag list
  const tagList = document.createElement('ul')
  tagList.classList.add('tags')
  const tagElements = getTagNames(mcq.tags).map(tag => {
    const element = document.createElement('li')
    element.classList.add('tag')
    element.innerHTML = tag
    return element
  })
  tagElements.forEach(tag => {
    tagList.appendChild(tag)
  })

  // add everything
  result.appendChild(question)
  options.forEach(option => {
    result.appendChild(option)
  })
  result.appendChild(document.createElement('hr'))
  result.appendChild(subject)
  result.appendChild(tagList)
  result.setAttribute('data-rightanswer', rightanswer);
  //result.setAttribute('data-id', mcq.id);
  return result
}

function capitalize(str) {
  if (str.length === 0) {
    return str;
  }
  let result = str[0].toUpperCase();
  for (let i = 1; i < str.length; i++) {
    result = result + str[i].toLowerCase();
  }
  return result;
}

// shuffle an array
function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    const swapWith = Math.floor(Math.random() * array.length); // If swapWith === i, there will be no swapping.
    [array[i], array[swapWith]] = [array[swapWith], array[i]];
  }
}

function associateCountInputToElement(countInput, container, newElement, min, max) {
  // record of how many container are being shown
  let elementsCount = container.childElementCount;
  // allow the user to control the no of options
  countInput.addEventListener('change', () => {
    // don't do anything if an integer is not given or input is out of range
    if (countInput.value % 1 !== 0 || (min > countInput.value && min !== undefined) || (max !== undefined && max < countInput.value)) {
      return
    }
    // add new elements if elements count input is more than element count now
    if (countInput.value > elementsCount) {
      for (let i = elementsCount; i < countInput.value; i++) {
        container.appendChild(newElement.cloneNode(true));
        elementsCount++
      }
      // and remove elements if elements count input is less than elements count now
    } else if (countInput.value < elementsCount) {
      const elements = container.querySelectorAll(newElement.tagName)
      while (elementsCount > countInput.value) {
        elements[elements.length - 1].remove()
        elementsCount--;
      }
    }
  });
}

function handleNewQuestionForm() {
  const mcqForm = document.getElementById('mcq_input');
  mcqForm.addEventListener('submit', e => {
    // add new question via form
    // prevent reload
    e.preventDefault();
    // don't do anything if no new question is typed
    const question = document.getElementById('question').value
    if (!question) {
      console.log('didn\'t find question')
      return
    }
    // don't do anything if any option is missing
    const optionInputs = document.querySelectorAll('.option')
    let options = []
    for (input of optionInputs) {
      if (!input.value) {
        console.log('didn\'n find an option')
        return
      }
      options.push(input.value);
    }
    // Get the subject from the input
    const subjectName = document.getElementById('subject').value.toLowerCase();
    /* request to view */
    let subjectId = getSubjectId(subjectName);
    // Allow user to add subject not in database
    if (subjectId === null) {
      const newSubject = new Subject(subjectName);
      /* request to view */
      subjects.push(newSubject);
      subjectId = newSubject.id;
    }

    // Get the tag values from the inputs
    const tagInputs = document.querySelectorAll('.tag-item');
    let tagArray = [];
    tagInputs.forEach(tag => {
      tagArray.push(tag.value.toLowerCase())
    });
    // Allow user to add tags not in database
    tagArray.forEach(tag => {
      // const tagId = getTagId(tag);
      if (!getTagId(tag)) {
        const newTag = new Tag(tag);
        /* request to view */
        tags.push(newTag);
      }
    });

    // create a post object and add it to existing array
    const newMcq = new Mcq(question, options, 0, getSubjectId(subjectName), getTagIds(tagArray));
    /* request to view */
    mcqs.push(newMcq);
    // add new post to display
    addMcq(newMcq);
    // Clear the input fields after submit 
    document.getElementById('mcq_input').reset();
  });
}

function handleSampleTestCreatorForm() {
  const introForm = document.getElementById('introduction');
  introForm.addEventListener('submit', e => {
    // prevent reload
    e.preventDefault();

    // Filter the list according to the number of questions and chosen subject
    // First get the number of questions and the subject
    const numQuestions = document.querySelector('input[name="sample-num"]:checked').value;
    let chosenSubject = document.querySelector('#sample-subject').value;
    if (!chosenSubject) {
      console.log('Choose a subject');
      return;
    }
    chosenSubject = chosenSubject.toLowerCase();
    /* request to view */
    // Filter the mcq's according to subject
    let filteredArray = filterMcqsBySubject(chosenSubject, numQuestions);
    displayMcqs(filteredArray);
    document.getElementById('mcqs').style.display = 'flex'
  });
}

function handleTestForm() {
  // Get the evaluation div
  const evaluation = document.getElementById('evaluation');
  // evaluate answers
  const answerSheet = document.getElementById('mcqs')
  answerSheet.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(answerSheet);

    const answers = []
    for (answer of data.values()) {
      answers.push(answer)
    }
    // don't do anything if any question is unanswered
    let totalQuestions = document.querySelectorAll('.mcq').length;
    if (totalQuestions > answers.length) {
      window.alert('Please answer all questions!');
      return
    }
    // maximum obtainable score
    let total = answers.length;
    // answer is correct if answer === '0'
    const score = answers.filter(answer => answer === '0').length;
    // show score
    const marks = document.createElement('p');
    marks.innerHTML = `You scored ${score}/${total}!`;
    evaluation.appendChild(marks);
    evaluation.focus();
  })
}