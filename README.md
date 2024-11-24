# virtual-list-down-up
[![npm](https://badgen.net/npm/v/virtual-list-down-up)](https://www.npmjs.com/package/virtual-list-down-up)
[![last-commit](https://badgen.net/github/last-commit/chao31/virtual-list-down-up)](https://www.npmjs.com/package/virtual-list-down-up)
[![license](https://badgen.net/github/license/chao31/virtual-list-down-up)](https://www.npmjs.com/package/virtual-list-down-up)

⚡ A high speed react component for virtual list with pull-up loading and pull-down loading.

## Install

```
npm i virtual-list-down-up
```
## Demo

[Live Demo](https://chao31.github.io/virtual-list-down-up-examaples)

## Use

```js
import { VariableSizeList as List } from 'virtual-list-down-up';

const Row = ({ item, index }) => <div key={index}>{item}</div>;

const Example = () => (
  <List
    listData={listData}
    estimatedItemSize={90}
  >
    {Row}
  </List>
);
```

You need to pass in two required parameters：

-  `listData`： List data 
-  `estimatedItemSize`：Estimated height of each row of the list. If you don't know how high each row is, whether this height is accurate or not is not important and does not affect the rendering of the virtual list. If you still hesitate to set the appropriate height, then set the minimum height

## Other Props

|                           Name                            |               Description                | 
|        :-----------------------------------------:        |    :-------------------------:    |
|        **listData**                |       List data 
|        **estimatedItemSize**                |      Estimated height of each row of the list
|        **bufferScale**                |       Buffer height ratio
|        **pullDownCallback**                |       Pull down refresh callback
|        **pullUpCallback**                |       Pull up refresh callback
|        **hasMoreTopData**                |       Pull down refresh to see if there is more data
|        **hasMoreBottomData**                |       Pull up refresh to see if there is more data
|        **loaderAtTop**                |       Custom loading component at the top
|        **loaderAtBottom**                |       Custom loading component at the bottom


## Features

- Real virtual scrolling 😍.
- Row supports variable heights 🎉.
- Supports loading more 🔥.
- Supports pull down to load more 🌐.
- Supports pull up to load more 😍.
- Responsive component.
- Simple configuration, ready to use out of the box.
- Thorough documentation .
- High speed .

