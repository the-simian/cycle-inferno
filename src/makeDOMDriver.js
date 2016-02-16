import {createTemplate} from 'inferno'
import {render} from 'inferno-dom'

import {transposeVTree} from './transposition'
import {isolateSink, isolateSource} from './isolate'
import {makeElementSelector} from './select'
import {makeEventsSelector} from './events'
import {domSelectorParser, isTemplate} from './util'

function makeRenderVTree(rootElement) {
  return function renderVTree(vTree) {
    const shape = isTemplate(vTree) ?
      vTree :
      createTemplate(() => vTree)(`cycle-inferno`)
    render(shape, rootElement)
    return rootElement
  }
}

function DOMDriverInputGuard(vtree$) {
  if (!vtree$ || typeof vtree$.subscribe !== `function`) {
    throw new Error(`The DOM driver function expects as input an ` +
      `Observable of virtual DOM elements`)
  }
}

function defaultOnErrorFn(msg) {
  if (console && console.error) {
    console.error(msg)
  } else {
    console.log(msg)
  }
}

const defaults = {
  onError: defaultOnErrorFn,
}

function makeDOMDriver(container, {onError = defaultOnErrorFn} = defaults) {
  const rootElement = domSelectorParser(container)

  if (typeof onError !== `function`) {
    throw new Error(`You provided an \`onError\` to makeDOMDriver but it was ` +
      `not a function. It should be a callback function to handle errors.`)
  }
  return function DOMDriver(vtree$) {
    DOMDriverInputGuard(vtree$)

    const rootElement$ = vtree$
      .flatMapLatest(transposeVTree)
      .map(makeRenderVTree(rootElement))
      .doOnError(onError)
      .replay(null, 1)

    const disposable = rootElement$.connect()

    return {
      observable: rootElement$,
      namespace: [],
      select: makeElementSelector(rootElement$),
      events: makeEventsSelector(rootElement$),
      dispose: () => disposable.dispose(),
      isolateSink,
      isolateSource,
    }
  }
}

export {makeDOMDriver}
