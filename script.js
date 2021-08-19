// function to add mcq object to display
function addMcq(mcq) {
  const mcqsDisplay = document.querySelector('#mcqs');
  // prepending will allow for submit button to stay at the bottom
  mcqsDisplay.prepend(giveMcqElement(mcq))
}
// show specified mcqs
function displayCurrentMcqs() {
  // add every post to display
  const mcqsDisplay = document.querySelector('#mcqs');
  const toBeRemoved = document.getElementsByClassName('mcq');
  // remove all mcqs already displayed
  for (let i = 0, n = toBeRemoved.length; i < n; i++) {
    toBeRemoved[0].remove();
    console.log('remove');
  }
  // Filter the list according to the number of questions and chosen subject
  // First get the number of questions and the subject
  const numQuestions = document.querySelector('input[name="sample-num"]:checked').value;
  let chosenSubject = document.querySelector('input[name="sample-post"]:checked').value;
  chosenSubject = chosenSubject.toLowerCase();
  // Filter the mcq's according to subject
  let filteredArray = filterMcqsBySubject(chosenSubject, numQuestions);
  filteredArray.forEach(mcq => {
    addMcq(mcq)
    console.log('added')
  });
}

// return all or limited number of random mcqs that are on the specified subject, the 'limit' parameter is optional
function filterMcqsBySubject(subject, limit) {
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
  // displayCurrentMcqs(); We can display questions after user designs sample questions

  // input for no. of options
  const optionsCountInput = document.getElementById('#options');
  // the div of option input fields
  const options = document.getElementById('options');
  // new option template
  const newOption = document.createElement('input')
  newOption.classList.add('option')
  newOption.setAttribute('type', 'text')
  newOption.setAttribute('placeholder', 'Other Option')
  /*      *****         allow the user to control the no of options         */
  associateCountInputToElement(optionsCountInput, options, newOption, 2, 10);


  // get the input for #tags
  const tagsCounter = document.getElementById('#tag-list');
  // get the tags div
  const tagList = document.getElementById('tag-list');
  // record of how many tags are being shown
  let tagsCount = 2
  // new tag template
  const newTag = document.createElement('input');
  newTag.classList.add('tag-item');
  newTag.setAttribute('type', 'text');
  /*      *****         allow the user to control the no of tags         */
  associateCountInputToElement(tagsCounter, tagList, newTag, 0, 10);

  // On submit create question elements and render qustion to screen
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
    optionInputs.forEach(input => {
      options.push(input.value)
    })
    for (option of options) {
      if (!option) {
        console.log('didn\'n find an option')
        return
      }
    }

    // Get the subject from the input
    const subjectName = document.getElementById('subject').value.toLowerCase();
    let subjectId = getSubjectId(subjectName);
    if (subjectId === null) {
      const newSubject = new Subject(subjectName);
      subjects.push(newSubject);
      subjectId = newSubject.id;
    }

    // Get the tag values from the inputs
    const tagInputs = document.querySelectorAll('.tag-item');
    let tagArray = [];
    tagInputs.forEach(tag => {
      tagArray.push(tag.value)
    });
    // Allow user to add their own tags
    tagArray.forEach(tag => {
      // const tagId = getTagId(tag);
      if (!getTagId(tag)) {
        const newTag = new Tag(tag);
        tags.push(newTag);
      }
    });

    // create a post object and add it to existing array
    const newMcq = new Mcq(question, options, 0, getSubjectId(subjectName), getTagIds(tagArray));
    mcqs.push(newMcq);
    // add new post to display
    addMcq(newMcq); 
    // Clear the input fields after submit 
    document.getElementById('mcq_input').reset();
  });

  // On submit of introductoryForm render question to screen
  const introForm = document.getElementById('introduction');
  introForm.addEventListener('submit', e => {
    // prevent reload
    e.preventDefault();
    document.getElementById('mcqs').style.display = 'flex'
    displayCurrentMcqs();
  });

  // Get the evaluation div
  const evaluation = document.getElementById('evaluation');
  // evaluate answers
  const answerSheet = document.getElementById('mcqs')
  answerSheet.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(answerSheet);

    const answers = []
    for (answer of data.entries()) {
      answers.push(answer[1])
    }
    // don't do anything if any question is unanswered
    let totalQuestions = document.querySelector('input[name="sample-num"]:checked').value;
    if (totalQuestions > answers.length) {
      window.alert('Please answer all questions!');
      return
    }

    let total = answers.length;
    // answer is correct if answer === '0'
    // const score = answers.filter(answer => answer === '0').length;
    let score = 0;

    let myMcqs = document.querySelectorAll('.mcq');
    for (mcq of myMcqs) {
      const answer = document.querySelector(`input[name="${mcq.getAttribute('id')}"]:checked`);
      // if any mcq not answered, focus to that mcq and return
      if (answer === null) {
        mcq.focus()
        console.log('answering left')
        return
      }
      // non-strict equal because attribute value is string
      let rightAnswer;
      for (mcqElement of mcqs) {
        if (mcq.getAttribute('id') == mcqElement.id) {
          rightAnswer = mcqElement.rightAnswer;
        }
      }
      if (answer.getAttribute('id') == `option-${rightAnswer}`) { // compare answer values
        score++;
        console.log('right')
      } else {
        console.log(`It's ${rightAnswer}, not ${answer.getAttribute('id').slice(7)}`)
      }
      // total++; No need to increment total.
    }

    const marks = document.createElement('p');
    marks.innerHTML = `You scored ${score}/${total}!`;
    evaluation.appendChild(marks);
    evaluation.focus();
  })
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
  // revactored below code above
  // const options = mcq.options.map(option => {
  //   const radio = document.createElement('input')
  //   radio.setAttribute('type', 'radio')
  //   radio.setAttribute('id', `option-${option}`)
  //   radio.setAttribute('value', value)
  //   radio.setAttribute('name', mcq.id)
  //   const label = document.createElement('label')
  //   label.setAttribute('for', `option-${option}`)
  //   label.innerHTML = option
  //   // wrap radio and label in final option element
  //   const optionElement = document.createElement('div')
  //   optionElement.appendChild(radio)
  //   optionElement.appendChild(label)
  //   return optionElement
  // })
  //const rightanswer = shuffle(options)
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

// shuffles an array
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
