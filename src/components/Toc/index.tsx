import React, { useEffect, useState } from 'react';
import './index.less';

function Index() {
  
  return (
    <div className='toc'>
      <h1>virtual-list-down-up</h1>
      <div className='toc-column'>
        <div className='toc-title-1'>
          Examples
        </div>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>Variable Size List</a></li>
      </div>
      <div className='toc-column'>
        <div className='toc-title-1'>
          Features
        </div>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>Pull Load for More</a></li>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>Dropdown Load for More</a></li>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>Both pull-up and pull-down Loading</a></li>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>Custom Loading</a></li>
      </div>
      <div className='toc-column'>
        <div className='toc-title-1'>
          Methods
        </div>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>delItem</a></li>
        <li className='toc-item'><a className='toc-link' href='#variable-size-list'>getListData</a></li>
      </div>
    </div>
  );
}

export default Index;