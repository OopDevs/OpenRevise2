var OpenReviseCalculator = {
  currentSelectedMode: 'standard',
  modals: {
    about: new BulmaModal('#calculator-modal-about'),
    tutorial: new BulmaModal('#calculator-modal-tutorial')
  }
}

$('#calculator-type-select').change(function () {
  switch (this.value) {
    case 'standard':
      $('#calculator-type-select-icons').removeClass('fa-percentage fa-square-root-alt')
      $('#calculator-type-select-icons').addClass('fa-plus')
      OpenReviseCalculator.currentSelectedMode = 'standard'
      break
    case 'algebra':
      $('#calculator-type-select-icons').removeClass('fa-plus fa-square-root-alt')
      $('#calculator-type-select-icons').addClass('fa-percentage')
      OpenReviseCalculator.currentSelectedMode = 'algebra'
      break
    case 'calculus':
      $('#calculator-type-select-icons').removeClass('fa-plus fa-percentage')
      $('#calculator-type-select-icons').addClass('fa-square-root-alt')
      OpenReviseCalculator.currentSelectedMode = 'calculus'
      break
  }
})

$('#calculator-type-tabs-standard').click(function () {
  $('#calculator-type-tabs-standard').addClass('is-active')
  $('#calculator-type-tabs-algebra').removeClass('is-active')
  $('#calculator-type-tabs-calculus').removeClass('is-active')
  OpenReviseCalculator.currentSelectedMode = 'standard'
})

$('#calculator-type-tabs-algebra').click(function () {
  $('#calculator-type-tabs-standard').removeClass('is-active')
  $('#calculator-type-tabs-algebra').addClass('is-active')
  $('#calculator-type-tabs-calculus').removeClass('is-active')
  OpenReviseCalculator.currentSelectedMode = 'algebra'
})

$('#calculator-type-tabs-calculus').click(function () {
  $('#calculator-type-tabs-standard').removeClass('is-active')
  $('#calculator-type-tabs-algebra').removeClass('is-active')
  $('#calculator-type-tabs-calculus').addClass('is-active')
  OpenReviseCalculator.currentSelectedMode = 'calculus'
})

$('#calculator-help-buttons-about').click(function () {
  OpenReviseCalculator.modals.about.show()
})

$('#calculator-help-buttons-tutorial').click(function () {
  OpenReviseCalculator.modals.tutorial.show()
})