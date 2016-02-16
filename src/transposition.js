import Rx from 'rx'
import {isTemplate} from './util'

function createVTree(vTree, children) {
  return {
    tag: vTree.tag,
    attrs: vTree.attrs,
    children,
  }
}

function transposeVTree(vTree) { // eslint-disable-line
  if (!vTree) {
    return null
  } else if (isTemplate(vTree)) {
    return Rx.Observable.just(vTree)
  } else if (typeof vTree.subscribe === `function`) {
    return vTree.flatMapLatest(transposeVTree)
  } else if (typeof vTree === `string`) {
    return Rx.Observable.just(vTree)
  } else if (typeof vTree === `object`) {
    if (!vTree.children || vTree.children.length === 0) {
      return Rx.Observable.just(vTree)
    }

    const vTreeChildren = vTree.children
      .map(transposeVTree).filter(x => x !== null)

    return vTreeChildren.length === 0 ?
      Rx.Observable.just(createVTree(vTree, vTreeChildren)) :
      Rx.Observable.combineLatest(
        vTreeChildren,
        (...children) => createVTree(vTree, children)
      )
  } else {
    throw new Error(`Unhandled vTree Value`)
  }
}

export {transposeVTree}
