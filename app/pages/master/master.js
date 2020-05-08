var MasterManager = {}

MasterManager.swapAppTheme = function (selectedTheme) {
  function invertMasterLogo (selectedIcon) {
    var MASTER_LOGO_INVERTED_CLASS = 'master-logo-light'
    var logo = $('#master-navbar-logo')
    switch (selectedIcon) {
      case true:
        logo.addClass(MASTER_LOGO_INVERTED_CLASS)
        break
      case false:
        logo.removeClass(MASTER_LOGO_INVERTED_CLASS)
    }
  }
  const THEME_PATH = 'master/bulma/bulmaswatch-%1$s.min.css'
  if (jQuery.inArray(selectedTheme, THEMES) !== -1) {
    $('#master-theme').attr('href', sprintf(THEME_PATH, selectedTheme))
    switch (selectedTheme) {
      case 'bulma':
        invertMasterLogo(true)
        break
      case 'cyborg':
        invertMasterLogo(false)
        break
      case 'slate':
        invertMasterLogo(false)
        break
      case 'superhero':
        invertMasterLogo(false)
        break
      case 'litera':
        invertMasterLogo(true)
        break
      case 'spacelab':
        invertMasterLogo(true)
        break
    }
  } else {
    var selectedThemeTypeError = new TypeError('selectedTheme is not a value of: ' + THEMES)
    console.error(selectedThemeTypeError)
    console.log('Resetting theme to bulma.')
    SettingsManager.set('selectedTheme', 'bulma').then(() => {
      console.log('Resetted theme to bulma!')
    })
    throw selectedThemeTypeError
  }
}

MasterManager.popupCounter = 0

MasterManager.openPopupPage = function (selectedPage) {
  window.open('master-popup.html#' + selectedPage, MasterManager.popupCounter++, 'width:800,height:600,resizable=1')
}

MasterManager.exitSubpage = function (rootPage) {
  if (jQuery.inArray(rootPage, PAGES) !== -1) {
    $('#master-main').empty()
    $('#master-main-loading-bar').css('display', 'block')
    $('#master-main').load(rootPage + '.html', function () {
      $('#master-main-loading-bar').css('display', 'none')
    })
  } else {
    throw new TypeError('rootPage is not a value of: ' + PAGES)
  }
}

MasterManager.openSubpage = function (subPage, rootPage) {
  var rootPageIndex = jQuery.inArray(rootPage, PAGES)
  if (rootPageIndex !== -1) {
    $('#master-main-loading-bar').css('display', 'block')
    if (jQuery.inArray(subPage, SUB_PAGES[rootPageIndex]) !== -1) {
      $('#master-main').empty()
      $('#master-main').load(rootPage + '/sub-pages/' + subPage + '/' + subPage + '.html', function () {
        $('#master-main-loading-bar').css('display', 'none')
      })
    } else {
      $('#master-main-loading-bar').css('display', 'none')
      throw new TypeError('subPage is not a value of: ' + SUB_PAGES[rootPageIndex])
    }
  } else {
    $('#master-main-loading-bar').css('display', 'none')
    throw new TypeError('rootPage is not a value of: ' + PAGES)
  }
}

MasterManager.showNavBar = function () {
  var masterNavbar = $('#master-navbar')
  masterNavbar.removeClass('is-hidden')
  masterNavbar.addClass('is-fixed-top')
  $('body').addClass('has-navbar-fixed-top')
  masterNavbar.css('display', 'flex')
}

MasterManager.hideNavBar = function () {
  var masterNavbar = $('#master-navbar')
  masterNavbar.addClass('is-hidden')
  masterNavbar.removeClass('is-fixed-top')
  $('body').removeClass('has-navbar-fixed-top')
  masterNavbar.css('display', 'none')
}

$(document).ready(function () {
  SettingsManager.get('selectedTheme').then(function (selectedTheme) {
    if (selectedTheme === null) {
      SettingsManager.set('selectedTheme', 'bulma')
      MasterManager.swapAppTheme('bulma')
    } else {
      MasterManager.swapAppTheme(selectedTheme)
    }
  })

  const TAB_ID_PREFIX = '#master-navbar-item-'
  var currentPage = ''

  function switchPage (selectedPage) {
    if (selectedPage !== currentPage) {
      var pages = Array.from(PAGES)
      if (jQuery.inArray(selectedPage, pages) !== -1) {
        $('#master-main').empty()
        $(TAB_ID_PREFIX + selectedPage).addClass('is-active')
        pages.splice(pages.indexOf(selectedPage), 1)
        $(pages).each((index, page) => {
          $(TAB_ID_PREFIX + page).removeClass('is-active')
        })
        $('#master-navbar-burger').removeClass('is-active')
        $('#master-navbar-menu').removeClass('is-active')
        $('#master-main-loading-bar').css('display', 'block')
        $('#master-main').load(selectedPage + '.html', () => {
          $('#master-main-loading-bar').css('display', 'none')
          currentPage = selectedPage
        })
      } else {
        throw new TypeError('selectedPage "' + selectedPage + '" not a value of: ' + PAGES)
      }
    } else {
      console.warn('selectedPage "' + selectedPage + '" is already selected!')
    }
  }

  switchPage('home')
  $('#master-navbar-burger').click(() => {
    $('#master-navbar-burger').toggleClass('is-active')
    $('#master-navbar-menu').toggleClass('is-active')
  })
  $(TAB_ID_PREFIX + 'home').click(function () { switchPage('home') })
  $(TAB_ID_PREFIX + 'revision').click(function () { switchPage('revision') })
  $(TAB_ID_PREFIX + 'settings').click(function () { switchPage('settings') })
  $(TAB_ID_PREFIX + 'calculator').click(function () { switchPage('calculator') })

  MasterManager.showNavBar()
})
