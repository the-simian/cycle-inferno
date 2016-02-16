import {SCOPE_PREFIX} from './util'

const isolateSource =
  (source_, scope) =>
    source_.select(`.${SCOPE_PREFIX}${scope}`)

function isolateSink(sink, scope) {
  return sink.map(vtree => {
    const {className: vtreeClass = ``} = vtree.attrs
    if (vtreeClass.indexOf(`cycle-scope-${scope}`) === -1) {
      const c = `${vtreeClass} cycle-scope-${scope}`.trim()
      vtree.attrs.className = c
    }
    return vtree
  })
}

export {isolateSink, isolateSource}
