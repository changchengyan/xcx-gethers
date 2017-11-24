let _methods = {
  _cancel: function (e) {
    this._modal.hide()
    this._modal.cancelFn(e)
    console.log('cancel')
  },
  _submit: function (e) {
    this._modal.hide()
    this._modal.successFn(e)
    console.log('submit')
  }
}

export default class Modal {
  constructor() {
    let pages = getCurrentPages()
    this._modal = {
      show: true,
      title: '确认当前操作吗？',
      cancel: '取消',
      submit: '确认'
    }
    this._curPage = pages[pages.length - 1]
    this._curPage._modal = this
    Object.assign(this._curPage, _methods)
  }

  refreshSetting() {
    this._curPage.setData({ _modal: this._modal })
  }

  show(options) {
    this._modal.show = true;
    this._modal.title = options.title || this._modal.title
    this._modal.cancel = options.cancel || this._modal.cancel
    this._modal.submit = options.submit || this._modal.submit
    this.successFn = options.success
    this.cancelFn = options.fail
    this.refreshSetting()
  }
  
  hide() {
    this._modal.show = false;
    this.refreshSetting()
  }


}