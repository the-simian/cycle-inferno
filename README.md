# cycle-inferno [![Build Status](https://travis-ci.org/TylorS/cycle-inferno.svg?branch=master)](https://travis-ci.org/TylorS/cycle-inferno)
Alternative DOM driver utilizing the [inferno](https://github.com/trueadm/inferno) library.

# Install (not on npm yet sorry!)
```js
$ npm install cycle-inferno
```
## API

##### makeDOMDriver(container: string|Element, {onError?: onErrorFn})

```js
import {makeDOMDriver} from 'cycle-inferno'
```

##### makeHTMLDriver()
```js
import {makeHTMLDriver} from 'cycle-inferno'
```
##### h - hyperscript-helpers
Shorcuts to `snabbdom/h`, `snabbdom/thunk` and `hyperscript-helpers`
```js
import {h, div, span, h4} from 'cycle-inferno'
```

##### mockDOMSource()
A testing utility which aids in creating a queryable collection of Observables. Call mockDOMSource giving it an object specifying selectors, eventTypes and their Observables, and get as output an object following the same format as the DOM Driver's source.

Example:
```js
const userEvents = mockDOMSource({
 '.foo': {
   'click': Rx.Observable.just({target: {}}),
   'mouseover': Rx.Observable.just({target: {}})
 },
 '.bar': {
   'scroll': Rx.Observable.just({target: {}})
 }
});

// Usage
const click$ = userEvents.select('.foo').events('click');
```
Arguments:

mockedSelectors :: Object an object where keys are selector strings and values are objects. Those nested objects have eventType strings as keys and values are Observables you created.
Return:

(Object) fake DOM source object, containing a function select() which can be used just like the DOM Driver's source. Call select(selector).events(eventType) on the source object to get the Observable you defined in the input of mockDOMSource.
