import { useLayoutEffect, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';

import './index.less';

function CodeHighlight({language = 'typescript', code = ''}) {
  const [codeHighlight, setCodeHighlight] = useState(code);

  useLayoutEffect(() => {
    setCodeHighlight(hljs.highlight(code, {language}).value);
    hljs.highlightAll();
  }, []);

  
  return <pre><code className="code-highlight language-typescript" dangerouslySetInnerHTML={{ __html: codeHighlight }}></code></pre>;
}

export default CodeHighlight;