// function to add mcq object to display
function addMcq(mcq) {
  const mcqsDisplay = document.querySelector('#mcqs');
  // prepending will allow for submit button to stay at the bottom
  mcqsDisplay.prepend(giveMcqElement(mcq))
}
// show all current posts
function displayCurrentMcqs() {
  // add every post to display
  const mcqsDisplay = document.querySelector('#mcqs');
  const toBeRemoved = document.getElementsByClassName('mcq');

  if (mcqsDisplay.childNodes[0].className === 'mcq') {
    // When rendering, avoid adding the same questions again
    while (toBeRemoved[0]) {
      toBeRemoved[0].parentNode.removeChild(toBeRemoved[0])
    }
  }
  // Filter the list according to the number of questions and chosen subject
  // First get the number of questions and the subject
  const numQuestions = document.querySelector('input[name="sample-num"]:checked').value;
  let chosenSubject = document.querySelector('input[name="sample-post"]:checked').value;
  chosenSubject = chosenSubject.toLowerCase();
  // Filter the mcq's according to subject
  let filteredArray = mcqs.filter(post => {
    return post.subjectId === getSubjectId(chosenSubject);
  });

  // If there are less questions available than requested, show all of them.
  if (numQuestions >= filteredArray.length) {
    filteredArray.forEach(mcq => {
      addMcq(mcq)
    });
  // Otherwise there are more questions available than requested
  } else {
    let newFilteredArray = [];
    for (let i = 0; i < numQuestions; i++) {
      // Create an index to choose a random number
      let randomIndex = Math.floor(Math.random() * filteredArray.length);

      // Remove choice from choice array, choice will be an array (so use choice[0])
      let choice = filteredArray.splice(randomIndex, 1);
      newFilteredArray.push(choice[0]);
    }
    newFilteredArray.forEach(mcq => {
      addMcq(mcq)
    });
  }
}

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // displayCurrentMcqs(); We can display questions after user designs sample questions
  // input for no. of options
  const optionsCountInput = document.getElementById('#options');
  // the div of option input fields
  const options = document.getElementById('options');
  // record of how many options are being shown
  let optionsCount = 2
  // allow the user to control the no of options
  optionsCountInput.addEventListener('change', () => {
    // don't do anything if an integer is not given or input is out of range
    if (optionsCountInput.value % 1 !== 0 || 2 > optionsCountInput.value || 10 < optionsCountInput.value) {
      return
    }
    // add option inputs if option count input is more than options count now
    if (optionsCountInput.value > optionsCount) {
      for (let i = optionsCount; i < optionsCountInput.value; i++) {
        const newOption = document.createElement('input')
        newOption.classList.add('option')
        newOption.setAttribute('type', 'text')
        newOption.setAttribute('placeholder', 'Other Option')
        options.appendChild(newOption)
        optionsCount++
      }
      // and remove option inputs if option count input is less than options count now
    } else if (optionsCountInput.value < optionsCount) {
      const optionInputs = document.querySelectorAll('#options .option')
      for (let i = optionInputs.length - 1; i >= optionsCountInput.value; i--) {
        optionInputs[i].remove()
        optionsCount--;
      }
    }
  });

  // get the input for #tags
  const tagsCounter = document.getElementById('#tag-list');
  // get the tags div
  const tagList = document.getElementById('tag-list');
  // record of how many tags are being shown
  let tagsCount = 2
  // allow the user to control the no of tagss
  tagsCounter.addEventListener('change', () => {
    // don't do anything if an integer is not given or input is out of range
    if (tagsCounter.value % 1 !== 0 || 0 > tagsCounter.value || 5 < tagsCounter.value) {
      return
    }
    // add tag inputs if tagsCounter.value > tagsCount
    if (tagsCounter.value > tagsCount) {
      for (let i = tagsCount; i < tagsCounter.value; i++) {
        const newTag = document.createElement('input');
        newTag.classList.add('tag-item');
        newTag.setAttribute('type', 'text');
        tagList.appendChild(newTag);
        tagsCount++;
      }
      // and remove tag inputs if tagsCounter.value < tagsCount
    } else if (tagsCounter.value < tagsCount) {
      const tagInputs = document.querySelectorAll('#tag-list .tag-item')
      for (let i = tagInputs.length - 1; i >= tagsCounter.value; i--) {
        tagInputs[i].remove()
        tagsCount--;
      }
    }
  });

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
    
    const total = answers.length;
    // answer is correct if answer === '0'
    const score = answers.filter(answer => answer === '0').length;
  
    let myMcqs = document.querySelectorAll('.mcq');
    for (mcq of myMcqs) {
      const answer = document.querySelector(`input[name="${mcq.getAttribute('data-id')}"]:checked`);
      // if any mcq not answered, focus to that mcq and return
      if (answer === null) {
        mcq.focus()
        console.log('answering left')
        return
      }
      // non-strict equal because attribute value is string
      if (answer.getAttribute('value') == mcq.getAttribute('data-rightanswer')) {
        score++;
        console.log('right')
      } else {
        console.log(`It's ${mcq.getAttribute('data-rightanswer')}, not ${answer.value}`)
      }
      total++;
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
  //result.setAttribute('data-rightanswer', rightanswer);
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

// shuffles the options array and returns the position of 0th option (right answer) after shuffle
function shuffle(options) {
  //let rightanswerIndex = 0;
  for (let i = 0; i < options.length; i++) {
    const swapWith = Math.floor(Math.random() * options.length);
    //if (i === rightanswerIndex) {
      //rightanswerIndex = swapWith;
    //} else if (swapWith === rightanswerIndex) {
      //rightanswerIndex = i;
    //}
    [options[i], options[swapWith]] = [options[swapWith], options[i]];
  }
  // return rightanswerIndex;
  /* the commented code below has a bug I can't find
  but it often leaves out option elements from options array ! */

  // let remaining = options.slice(0);
  // // empty array
  // for (let i = 0; i < options.length; i++) {
  //   options.shift();
  // }
  // let rightanswer;
  // for (let i = 0; i < remaining.length; i++) {
  //   let add = Math.floor(Math.random() * remaining.length);
  //   // if rightanswer is being added, record new position of right answer
  //   if (!rightanswer && add === 0) {
  //     rightanswer = options.length;
  //   }
  //   options.push(remaining[add]);
  //   // remove the option just added from remaining
  //   if (add + 1 === remaining.length) {
  //     remaining = remaining.slice(0, add)
  //   } else {
  //     remaining = remaining.slice(0, add).concat(remaining.slice(add + 1))
  //   }
  // }
  // return rightanswer;
}
