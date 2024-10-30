import React, { useEffect, useState } from 'react';
import { Toc } from '@/components';
import { Outlet } from 'react-router-dom';

import './index.less';

function Layout() {
  
  return (
    <div className='layout'>
      <div className='layout-left'><Toc /></div>
      <div className='layout-right'><Outlet /></div>
    </div>
  );
}

export default Layout;