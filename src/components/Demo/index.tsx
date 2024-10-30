import React, { useEffect, useState, useRef } from 'react';
import { Toc } from '@/components';
import { Outlet } from 'react-router-dom';
import { code } from './const';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';

import './index.less';


function Demo() {
  const highlightedCode = hljs.highlight(code, {language: 'typescript'}).value;

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  
  return (
    <div className='demo'>
      <div className='demo-left'>left</div>
      <div className='demo-right'>
        <pre><code className="language-typescript" dangerouslySetInnerHTML={{ __html: highlightedCode }}></code></pre>
      </div>
    </div>
  );
}

export default Demo;