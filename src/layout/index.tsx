import React, { useEffect, useState } from 'react';
import { Toc } from '@/components';
import './index.less';

function Layout() {
  
  return (
    <div className='layout'>
      <div className='layout-left'><Toc /></div>
      <div className='layout-right'></div>
    </div>
  );
}

export default Layout;