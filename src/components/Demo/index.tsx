import React, { useEffect, useState, useRef } from 'react';
import { Toc } from '@/components';
import { Outlet } from 'react-router-dom';
import { code } from './const';
import { CodeHighlight } from '@/components/';

import './index.less';


function Demo() {

  
  return (
    <div className='demo'>
      <div className='demo-left'>left</div>
      <div className='demo-right'>
        <CodeHighlight code={code} language='typescript'/>
      </div>
    </div>
  );
}

export default Demo;