import Rx from 'rx'
import {createTemplate} from 'inferno'
import {renderToString} from 'inferno-server'
import {transposeVTree} from './transposition'
import {isTemplate} from './util'

function makeBogusSelect() {
  return function select() {
    return {
      observable: Rx.Observable.empty(),
      events() {
        return Rx.Observable.empty()
      },
    }
  }
}

function toHTML(vTree) {
  const shape = isTemplate(vTree) ?
    vTree :
    createTemplate(() => vTree)(`cycle-inferno`)
  return renderToString(shape)
}

function makeHTMLDriver() {
  return function htmlDriver(vtree$) {
    let output$ = vtree$
      .flatMapLatest(transposeVTree)
      .last()
      .map(toHTML)
    output$.select = makeBogusSelect()
    return output$
  }
}

export {makeHTMLDriver}
