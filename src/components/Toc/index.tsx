import React, { useEffect, useState } from 'react';

import './index.less';

const tocData = [
  {
    title: 'Examples',
    children: [
      {
        title: 'Variable Size List',
        link: '#/variable-size-list',
      },
    ],
  },
  {
    title: 'Features',
    children: [
      {
        title: 'Pull Load for More',
        link: '#/pull-load-for-more',
      },
      {
        title: 'Dropdown Load for More',
        link: '#/dropdown-load-for-more',
      },
      {
        title: 'Both pull-up and pull-down Loading',
        link: '#/both-pull-up-and-pull-down-loading',
      },
      {
        title: 'Custom Loading',
        link: '#/custom-loading',
      },
    ],
  },
  {
    title: 'Methods',
    children: [
      {
        title: 'delItem',
        link: '#/delItem',
      },
      {
        title: 'getListData',
        link: '#/getListData',
      },
    ],
  },
];

function Index() {
  const [active, setActive] = useState('#/variable-size-list');

  const clickHander = (link: string) => {
    setActive(link);
  }
  
  return (
    <div className='toc'>
      <h1>virtual-list-down-up</h1>
      {
        tocData.map((item, index) => {
          return (
            <div className='toc-column' key={index} >
              <div className='toc-title-1'>
                {item.title}
              </div>
              {
                item.children.map((child, index) => {
                  return (
                    <li className={`toc-item ${active === child.link ? 'active' : ''}`} key={index} data-index={index} onClick={() =>clickHander(child.link)}>
                      <a className='toc-link' href={child.link}>{child.title}</a>
                    </li>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  );
}

export default Index;