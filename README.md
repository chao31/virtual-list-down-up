## Install

```
npm i virtual-list-down-up
```

[Demo](https://chao31.github.io/virtual-list-down-up-examaples)

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

## Features

- virtual lists
- loading more
- pull down to load more
- pull up to load more
- easy to use

