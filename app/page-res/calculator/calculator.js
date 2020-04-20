// This is a huge patchwork from the calculator.js upstream.
// We will try to deprecate this ASAP.

(function () {
  class BulmaModal {
    constructor(selector) {
      this.elem = document.querySelector(selector)
      this.elem.children[1].style.animationDuration = '400ms'
      this.close_data()
    }
    
    show() {
      animateCSS(this.elem.children[1], 'zoomIn')
      this.elem.classList.add('is-active')
      this.on_show()
    }
    
    close() {
      var that = this
      animateCSS(this.elem.children[1], 'zoomOut', function () {
        that.elem.classList.remove('is-active')
        that.on_close()
      })
    }
    
    close_data() {
      var modalClose = this.elem.querySelectorAll("[data-bulma-modal='close'], .modal-background")
      var that = this
      modalClose.forEach(function(e) {
        e.addEventListener("click", function() {
          animateCSS(that.elem.children[1], 'zoomOut', function () {
            that.elem.classList.remove('is-active')
          })
          that.on_close();
        })
      })
    }
    
    on_show() {
      var event = new Event('modal:show')
      this.elem.dispatchEvent(event);
    }
    
    on_close() {
      var event = new Event('modal:close')
      this.elem.dispatchEvent(event);
    }
    
    addEventListener(event, callback) {
      this.elem.addEventListener(event, callback)
    }
  }
  var mode = 'standard'
  var input = document.getElementById('calculator-input')
  var output = document.getElementById('calculator-result')
  var parser = math.parser()
  var x = ''
  var result = ''
  var func = ''

  document.getElementById('calculator-buttons-calculate').onclick = () => {
    input.dispatchEvent(new KeyboardEvent('keyup', {
      code: 13
    }))
  }

  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      document.getElementById('calculator-buttons-calculate').classList.add('is-loading')
      document.getElementById('calculator-buttons-restorehistory').setAttribute('disabled', true)
      document.getElementById('calculator-buttons-clearoutput').setAttribute('disabled', false)
      switch (mode) {
        case 'standard':
        case 'calculus':
          if(input.value.includes('f(x)') || func.includes('g(x)') || func.includes('h(x)') ){
            document.getElementById('calculator-buttons-calculate').classList.remove('is-loading')
            document.getElementById('calculator-buttons-restorehistory').removeAttribute('disabled')
            document.getElementById('calculator-buttons-clearoutput').removeAttribute('disabled')
            input.value = ''
            // Nam, change this to modal window please
            alert("For function evaluation, please select Algebra mode.")
          } else {
            calculate(input.value)
          }
          //history()
          break
        case 'algebra':
          // No need to care about this shit. 
          // Just for preventing stupid errors made by our stupid users.
          if(func == '') {
            func = input.value
            if(func.includes('f(x)') || func.includes('g(x)') || func.includes('h(x)') ){
              output.value += ('Function:  ' + func + '\n')
              input.value = 'x = '
            } else {
              document.getElementById('calculator-buttons-calculate').classList.remove('is-loading')
              document.getElementById('calculator-buttons-restorehistory').removeAttribute('disabled')
              document.getElementById('calculator-buttons-clearoutput').removeAttribute('disabled')
              // Replace this shit with a modal window please
                alert('Your input format is incorrect. Please read the tutorial.')
                func = ''
                input.value = ''
            }
          } else{
              x = parser.evaluate(input.value)
              output.value += ('x =  ' + x + '\n')
              calculate(func)
              //history()
              }
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

    let funcOp = ''

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
            case 'percent':
              operator.push('%')
              array.splice(i, 1, operator[position])
              position++
              break
            default:
              operator.push()
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
          func = ''
          input.value = ''
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
      document.getElementById('calculator-buttons-calculate').classList.remove('is-loading')
      document.getElementById('calculator-buttons-restorehistory').removeAttribute('disabled')
      document.getElementById('calculator-buttons-clearoutput').removeAttribute('disabled')
    }, 100)

    if(result == undefined) result = "no answer"
  }

  document.getElementById('calculator-type-select').onchange = (e) => {
    var iconsContainerClasses = document.getElementById('calculator-type-select-icons').classList
    switch (e.target.value) {
      case 'standard':
        iconsContainerClasses.remove('fa-percentage', 'fa-square-root-alt')
        iconsContainerClasses.add('fa-plus')
        mode = 'standard'
        break
      case 'algebra':
        iconsContainerClasses.remove('fa-plus', 'fa-square-root-alt')
        iconsContainerClasses.add('fa-percentage')
        mode = 'algebra'
        break
      case 'calculus':
        iconsContainerClasses.remove('fa-plus', 'fa-percentage')
        iconsContainerClasses.add('fa-square-root-alt')
        mode = 'calculus'
        break
    }
    input.value = ''
  }

  document.getElementById('calculator-type-tabs-standard').onclick = () => {
    document.getElementById('calculator-type-tabs-standard').classList.add('is-active')
    document.getElementById('calculator-type-tabs-algebra').classList.remove('is-active')
    document.getElementById('calculator-type-tabs-calculus').classList.remove('is-active')
    mode = 'standard'
    input.value = ''
  }

  document.getElementById('calculator-type-tabs-algebra').onclick = () => {
    document.getElementById('calculator-type-tabs-standard').classList.remove('is-active')
    document.getElementById('calculator-type-tabs-algebra').classList.add('is-active')
    document.getElementById('calculator-type-tabs-calculus').classList.remove('is-active')
    mode = 'algebra'
    input.value = ''
  }

  document.getElementById('calculator-type-tabs-calculus').onclick = () => {
    document.getElementById('calculator-type-tabs-standard').classList.remove('is-active')
    document.getElementById('calculator-type-tabs-algebra').classList.remove('is-active')
    document.getElementById('calculator-type-tabs-calculus').classList.add('is-active')
    mode = 'calculus'
    input.value = ''
  }

  var modals = {
    about: new BulmaModal('#calculator-modal-about'),
    tutorial: new BulmaModal('#calculator-modal-tutorial'),
    warnClearOutput: new BulmaModal('#calculator-modal-warndeleteoutput'),
    warnRestoreHistory: new BulmaModal('#calculator-modal-warnrestorehistory')
  }

  document.getElementById('calculator-buttons-clearoutput').onclick = () => {
    modals.warnClearOutput.show()
  }

  document.getElementById('calculator-buttons-restorehistory').onclick = () => {
    modals.warnRestoreHistory.show()
  }

  document.getElementById('calculator-modal-warndeleteoutput-button-delete').onclick = () => {
    $('.calculator-result').val('')
    modals.warnClearOutput.close()
  }

  document.getElementById('calculator-buttons-about').onclick = () => {
    modals.about.show()
  }

  document.getElementById('calculator-buttons-tutorial').onclick = () => {
    modals.tutorial.show()
  }

  document.getElementById('calculator-buttons-github').onclick = () => {
    window.open('https://github.com/OpenStudySystems/OpenRevise2')
  }


})()