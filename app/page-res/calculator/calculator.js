(function () {
  'use strict'
  var mode = 'standard'
  var input = document.querySelector('.calculator-input')
  var output = document.querySelector('.calculator-result')
  var parser = math.parser()
  var x = ''
  var result = ''

  $('#calculator-buttons-calculate').click(function () {
    console.log('clicked')
    $('.calculator-input').trigger($.Event( 'keydown', {
      which: 13,
      keyCode: 13
    }))
  })

  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      $('#calculator-buttons-calculate').addClass('is-loading')
      $('#calculator-buttons-restorehistory').prop('disabled', true)
      $('#calculator-buttons-clearoutput').prop('disabled', true)
      switch (mode) {
        case 'standard':
        case 'calculus':
          calculate(input.value)
          //history()
          break
        case 'algebra':
          output.value += ('Function:  ' + output.value + '\n')
          input.value = 'x = '
          input.addEventListener("keyup", function (event) {
            if(event.key) x = parser.evaluate(input.value)
          })
          calculate(input.value)
          //history()
          break
      }
    }
  })

  function calculate(inputtedText) {
    let expression = inputtedText

    // Nature Typing Identifier

    let letters = /^[A-Za-z]+$/

    let userOperator = ''

    let operator = []

    let array = expression.split(' ')

    let position = 0

    for(let i = 0; i < array.length; i++) {
      if(array[i].match(letters)) {
          userOperator = array[i]
          switch(userOperator) {
            case 'plus':
            case 'add':
              operator.push('+')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'minus':
            case 'subtract':
              operator.push('-')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'times':
            case 'multiply':
              operator.push('*')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'divide':
            case 'over':
              operator.push('/')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'power':
            case 'caret':
            case 'to the power of':
              operator.push('^')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'one':
              operator.push('1')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'two':
              operator.push('2')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'three':
              operator.push('3')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'four':
              operator.push('4')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'five':
              operator.push('5')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'six':
              operator.push('6')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'seven':
              operator.push('7')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'eight':
              operator.push('8')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'nine':
              operator.push('9')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'ten':
              operator.push('10')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'eleven':
              operator.push('11')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'twelve':
              operator.push('12')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'thirteen':
              operator.push('13')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'forteen':
              operator.push('14')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'fifteen':
              operator.push('15')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'sixteen':
              operator.push('16')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'seventeen':
              operator.push('17')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'eighteen':
              operator.push('18')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'nineteen':
              operator.push('19')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'twenty':
              operator.push('20')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'thirty':
              operator.push('30')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'forty':
              operator.push('40')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'fifty':
              operator.push('50')
              array.splice(i,1, operator[position])
              position++
              break
            case 'sixty':
              operator.push('60')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'seventy':
              operator.push('70')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'eighty':
              operator.push('80')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'ninety':
              operator.push('90')
              array.splice(i, 1, operator[position])
              position++
              break
            case 'percent':
              operator.push('%')
              array.splice(i, 1, operator[position])
              position++
              break  
            default:
              operator.push(userOperator)
              array.splice(i, 1, operator[position])
              position++
              break
        }
      }
    }

    // Function identifier (e.g f(x), g(x)).
    let userFunc = array[0]

    switch(userFunc) {
      case 'f(x)':
          funcOp = 'f('
          break
      case 'g(x)':
          funcOp = 'g('
          break
      case 'h(x)':
          funcOp = 'h('
          break
    }

    expression = (array.join(' '))
    // Use different mathemtical methods for each mode
    try {
      switch (mode) {
        case 'standard':
          input.value = ''
          result = math.compile(expression).evaluate()
          output.value += ('Input:  ' + expression + '\n' + result + '\n' + '\n')
          break
        case 'algebra':
          // Hey! This is  what i have been working on for 2 hours!!!!! :( 
          input.value = 'x = '
          parser.evaluate(expression)
          result = parser.evaluate(funcOp + x + ')') // example: f(2) if x = 2.
          output.value += ( 'Result:  ' + result + '\n' + '\n')
          break
        case 'calculus':
          input.value = '' // Everytime the user click 'Enter', the value in <input> reset
          result = math.derivative(expression, 'x').toString()
          output.value += ('Input:  ' + expression + '\n' + result + '\n' + '\n') 
          break
      }
    } catch (err) {
      output.value += ('Input:  ' + expression + '\n' + '❌: '+err + '\n\n')
    }
    output.scrollTop = output.scrollHeight
    setTimeout(function () {
      $('#calculator-buttons-calculate').removeClass('is-loading')
      $('#calculator-buttons-restorehistory').prop('disabled', false)
      $('#calculator-buttons-clearoutput').prop('disabled', false)
    }, 400)

    if(result == undefined) result = "no answer"
  }


  $('#calculator-type-select').change(function () {
    switch (this.value) {
      case 'standard':
        $('#calculator-type-select-icons').removeClass('fa-percentage fa-square-root-alt')
        $('#calculator-type-select-icons').addClass('fa-plus')
        mode = 'standard'
        break
      case 'algebra':
        $('#calculator-type-select-icons').removeClass('fa-plus fa-square-root-alt')
        $('#calculator-type-select-icons').addClass('fa-percentage')
        mode = 'algebra'
        break
      case 'calculus':
        $('#calculator-type-select-icons').removeClass('fa-plus fa-percentage')
        $('#calculator-type-select-icons').addClass('fa-square-root-alt')
        mode = 'calculus'
        break
    }
    $('.calculator-input').val('')
  })

  $('#calculator-type-tabs-standard').click(function () {
    $('#calculator-type-tabs-standard').addClass('is-active')
    $('#calculator-type-tabs-algebra').removeClass('is-active')
    $('#calculator-type-tabs-calculus').removeClass('is-active')
    mode = 'standard'
    $('.calculator-input').val('')
  })

  $('#calculator-type-tabs-algebra').click(function () {
    $('#calculator-type-tabs-standard').removeClass('is-active')
    $('#calculator-type-tabs-algebra').addClass('is-active')
    $('#calculator-type-tabs-calculus').removeClass('is-active')
    mode = 'algebra'
    $('.calculator-input').val('')
  })

  $('#calculator-type-tabs-calculus').click(function () {
    $('#calculator-type-tabs-standard').removeClass('is-active')
    $('#calculator-type-tabs-algebra').removeClass('is-active')
    $('#calculator-type-tabs-calculus').addClass('is-active')
    mode = 'calculus'
    $('.calculator-input').val('')
  })

  var modals = {
    about: new BulmaModal('#calculator-modal-about'),
    tutorial: new BulmaModal('#calculator-modal-tutorial'),
    warnClearOutput: new BulmaModal('#calculator-modal-warndeleteoutput'),
    warnRestoreHistory: new BulmaModal('#calculator-modal-warnrestorehistory')
  }

  $('#calculator-buttons-clearoutput').click(function () {
    modals.warnClearOutput.show()
  })

  $('#calculator-buttons-restorehistory').click(function () {
    modals.warnRestoreOutput.show()
  })

  $('#calculator-modal-warndeleteoutput-button-delete').click(function () {
    $('.calculator-result').val('')
    modals.warnClearOutput.close()
  })

  $('#calculator-buttons-about').click(function () {
    modals.about.show()
  })

  $('#calculator-buttons-tutorial').click(function () {
    modals.tutorial.show()
  })


})()