var OpenReviseMaster = {
  swapAppTheme: function (selectedTheme) {
    switch (selectedTheme) {
      case 'bulma':
        $('#master-theme').attr('href', 'page-res/global/bulma/bulmaswatch-bulma.min.css')
        $('#master-logo').addClass('master-logo-light')
        break
      case 'cyborg':
        $('#master-theme').attr('href', 'page-res/global/bulma/bulmaswatch-cyborg.min.css')
        $('#master-logo').removeClass('master-logo-light')
        break
      case 'slate':
        $('#master-theme').attr('href', 'page-res/global/bulma/bulmaswatch-slate.min.css')
        $('#master-logo').removeClass('master-logo-light')
        break
      case 'superhero':
        $('#master-theme').attr('href', 'page-res/global/bulma/bulmaswatch-superhero.min.css')
        $('#master-logo').removeClass('master-logo-light')
        break
      case 'litera':
        $('#master-theme').attr('href', 'page-res/global/bulma/bulmaswatch-litera.min.css')
        $('#master-logo').addClass('master-logo-light')
        break
      case 'spacelab':
        $('#master-theme').attr('href', 'page-res/global/bulma/bulmaswatch-spacelab.min.css')
        $('#master-logo').addClass('master-logo-light')
        break
    }
  },
  navigatePage: function (page) {
    $('.navbar-burger').removeClass('is-active')
    $('.navbar-menu').removeClass('is-active')
    $('.master-loading').css('display', 'block')
    $('.master-main').load(page + '.html', function () {
      $('.master-loading').css('display', 'none')
    })
  }
}

$(document).ready(function () {
  OpenReviseMaster.navigatePage('home')
  var currentPage = 'home'
  $('.navbar-burger').click(function () {
    $('.navbar-burger').toggleClass('is-active')
    $('.navbar-menu').toggleClass('is-active')
  })
  $('#master-navbar-item-home').click(function () {
    if (currentPage !== 'home') {
      $('#master-navbar-item-home').addClass('is-active')
      $('#master-navbar-item-revision').removeClass('is-active')
      $('#master-navbar-item-settings').removeClass('is-active')
      $('#master-navbar-item-calculator').removeClass('is-active')
      $('#master-navbar-item-player').removeClass('is-active')
      currentPage = 'home'
      OpenReviseMaster.navigatePage('home')
    }
  })
  $('#master-navbar-item-revision').click(function () {
    if (currentPage !== 'revision') {
      $('#master-navbar-item-home').removeClass('is-active')
      $('#master-navbar-item-revision').addClass('is-active')
      $('#master-navbar-item-settings').removeClass('is-active')
      $('#master-navbar-item-calculator').removeClass('is-active')
      $('#master-navbar-item-player').removeClass('is-active')
      currentPage = 'revision'
      OpenReviseMaster.navigatePage('revision')
    }
  })
  $('#master-navbar-item-settings').click(function () {
    if (currentPage !== 'settings') {
      $('#master-navbar-item-home').removeClass('is-active')
      $('#master-navbar-item-revision').removeClass('is-active')
      $('#master-navbar-item-settings').addClass('is-active')
      $('#master-navbar-item-calculator').removeClass('is-active')
      $('#master-navbar-item-player').removeClass('is-active')
      currentPage = 'settings'
      OpenReviseMaster.navigatePage('settings')
    }
  })
  $('#master-navbar-item-calculator').click(function () {
    if (currentPage !== 'calculator') {
      $('#master-navbar-item-home').removeClass('is-active')
      $('#master-navbar-item-revision').removeClass('is-active')
      $('#master-navbar-item-settings').removeClass('is-active')
      $('#master-navbar-item-calculator').addClass('is-active')
      $('#master-navbar-item-player').removeClass('is-active')
      currentPage = 'calculator'
      OpenReviseMaster.navigatePage('calculator')
    }
  })
  if (localStorage.getItem('OpenRevise2.selectedTheme') === null) {
    localStorage.setItem('OpenRevise2.selectedTheme', 'bulma')
  } else {
    OpenReviseMaster.swapAppTheme(localStorage.getItem('OpenRevise2.selectedTheme'))
  }
})
