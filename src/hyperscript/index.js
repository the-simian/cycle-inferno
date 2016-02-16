import {selectorParser} from './selectorParser'

const isObservable = x => typeof x.subscribe === `function`
const isPrimitive = x => typeof x === `string` || typeof x === `number`

function isChildren(x) {
  return x && (isPrimitive(x) || Array.isArray(x) || isObservable(x))
}

const addNSToObservable = vNode => {
  addNS(vNode.data, vNode.children) // eslint-disable-line
}

function addNS(attrs, children) {
  attrs[`namespace`] = `http://www.w3.org/2000/svg`
  if (typeof children !== `undefined` && Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      if (isObservable(children[i])) {
        children[i] = children[i].tap(addNSToObservable)
      } else {
        addNS(children[i].data, children[i].children)
      }
    }
  }
}

function h(tagName, props, childVNodes) { // eslint-disable-line
  let tag = `DIV`
  let children = []
  let attrs = {}

  if (arguments.length === 3) {
    attrs = props
    if (isPrimitive(childVNodes)) {
      children = [childVNodes]
    } else {
      children.concat(childVNodes)
    }
  }

  if (arguments.length === 2) {
    if (isChildren(props)) {
      children = props
    } else {
      attrs = props
    }
  }

  if (typeof tagName === `string`) {
    const {tagName: _tagName, id, className} = selectorParser(tagName)
    tag = _tagName.toUpperCase()
    if (id) {attrs[`id`] = id}
    if (className) {attrs[`className`] = className}
  }

  if (tag.trim() === `SVG`) {
    addNS(attrs, children)
  }

  return {
    tag,
    attrs,
    children: [].concat(children),
  }
}

export {h}
