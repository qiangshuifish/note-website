import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"04｜内置 Hooks（2）：为什么要避免重复定义回调函数？","description":"","frontmatter":{},"headers":[],"relativePath":"ReactHooks核心原理与实战/04｜内置Hooks（2）：为什么要避免重复定义回调函数？.md","filePath":"ReactHooks核心原理与实战/04｜内置Hooks（2）：为什么要避免重复定义回调函数？.md","lastUpdated":1779816222000}'),t={name:"ReactHooks核心原理与实战/04｜内置Hooks（2）：为什么要避免重复定义回调函数？.md"};function l(o,s,i,c,u,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_04-内置-hooks-2-为什么要避免重复定义回调函数" tabindex="-1">04｜内置 Hooks（2）：为什么要避免重复定义回调函数？ <a class="header-anchor" href="#_04-内置-hooks-2-为什么要避免重复定义回调函数" aria-label="Permalink to &quot;04｜内置 Hooks（2）：为什么要避免重复定义回调函数？&quot;">​</a></h1><p>你好，我是王沛。这节课我们来继续学习内置 Hooks 的用法。</p><p>在上节课你已经看到了 useState 和 useEffect 这两个最为核心的 Hooks 的用法。理解了它们，你基本上就掌握了 React 函数组件的开发思路。</p><p>但是还有一些细节问题，例如事件处理函数会被重复定义、数据计算过程没有缓存等，还都需要一些机制来处理。所以在这节课，你会看到其它四个最为常用的内置 Hooks （包括useCallback、useMemo、useRef和useContext）的作用和用法，以及如何利用这些 Hooks 进行功能开发。</p><h1 id="usecallback-缓存回调函数" tabindex="-1">useCallback：缓存回调函数 <a class="header-anchor" href="#usecallback-缓存回调函数" aria-label="Permalink to &quot;useCallback：缓存回调函数&quot;">​</a></h1><p>在 React 函数组件中，每一次 UI 的变化，都是通过重新执行整个函数来完成的，这和传统的 Class 组件有很大区别：函数组件中并没有一个直接的方式在多次渲染之间维持一个状态。</p><p>比如下面的代码中，我们在加号按钮上定义了一个事件处理函数，用来让计数器加1。但是因为定义是在函数组件内部，因此在多次渲染之间，是无法重用 handleIncrement 这个函数的，而是每次都需要创建一个新的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function Counter() {</span></span>
<span class="line"><span>  const [count, setCount] = useState(0);</span></span>
<span class="line"><span>  const handleIncrement = () =&amp;gt; setCount(count + 1);</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>  return &amp;lt;button onClick={handleIncrement}&amp;gt;+&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你不妨思考下这个过程。每次组件状态发生变化的时候，函数组件实际上都会重新执行一遍。在每次执行的时候，实际上都会创建一个新的事件处理函数 handleIncrement。这个事件处理函数中呢，包含了 count 这个变量的闭包，以确保每次能够得到正确的结果。</p><p>这也意味着，即使 count 没有发生变化，但是函数组件因为其它状态发生变化而重新渲染时，这种写法也会每次创建一个新的函数。创建一个新的事件处理函数，虽然不影响结果的正确性，但其实是没必要的。因为这样做不仅增加了系统的开销，更重要的是： <strong>每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染</strong>。</p><p>比如这个例子中的 button 组件，接收了 <code>handleIncrement</code> ，并作为一个属性。如果每次都是一个新的，那么这个 React 就会认为这个组件的 props 发生了变化，从而必须重新渲染。因此，我们需要做到的是： <strong>只有当 count 发生变化时，我们才需要重新定一个回调函数。而</strong> 这正是 useCallback 这个 Hook 的作用。</p><p>它的 API 签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>useCallback(fn, deps)</span></span></code></pre></div><p>这里fn是定义的回调函数，deps是依赖的变量数组。只有当某个依赖变量发生变化时，才会重新声明 fn这个回调函数。那么对于上面的例子，我们可以把 handleIncrement这个事件处理函数通过 useCallback 来进行性能的优化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React, { useState, useCallback } from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function Counter() {</span></span>
<span class="line"><span>  const [count, setCount] = useState(0);</span></span>
<span class="line"><span>  const handleIncrement = useCallback(</span></span>
<span class="line"><span>    () =&amp;gt; setCount(count + 1),</span></span>
<span class="line"><span>    [count], // 只有当 count 发生变化时，才会重新创建回调函数</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>  return &amp;lt;button onClick={handleIncrement}&amp;gt;+&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，我们把 count 这个 state ，作为一个依赖传递给 useCallback。这样，只有 count 发生变化的时候，才需要重新创建一个回调函数，这样就保证了组件不会创建重复的回调函数。而接收这个回调函数作为属性的组件，也不会频繁地需要重新渲染。</p><p>除了useCallback，useMemo也是为了缓存而设计的。只不过，useCallback缓存的是一个函数，而useMemo缓存的是计算的结果。那么接下来，我们就一起学习下useMemo的用法吧。</p><h1 id="usememo-缓存计算的结果" tabindex="-1">useMemo：缓存计算的结果 <a class="header-anchor" href="#usememo-缓存计算的结果" aria-label="Permalink to &quot;useMemo：缓存计算的结果&quot;">​</a></h1><p>useMemo 的 API 签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>useMemo(fn, deps);</span></span></code></pre></div><p>这里的fn是产生所需数据的一个计算函数。通常来说，fn会使用 deps 中声明的一些变量来生成一个结果，用来渲染出最终的 UI。</p><p>这个场景应该很容易理解： <strong>如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算</strong>。</p><p>举个例子，对于一个显示用户信息的列表，现在需要对用户名进行搜索，且 UI 上需要根据搜索关键字显示过滤后的用户，那么这样一个功能需要有两个状态：</p><ol><li>用户列表数据本身：来自某个请求。</li><li>搜索关键字：用户在搜索框输入的数据。</li></ol><p>无论是两个数据中的哪一个发生变化，都需要过滤用户列表以获得需要展示的数据。那么如果不使用 useMemo 的话，就需要用这样的代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React, { useState, useEffect } from &quot;react&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function SearchUserList() {</span></span>
<span class="line"><span>  const [users, setUsers] = useState(null);</span></span>
<span class="line"><span>  const [searchKey, setSearchKey] = useState(&quot;&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  useEffect(() =&amp;gt; {</span></span>
<span class="line"><span>    const doFetch = async () =&amp;gt; {</span></span>
<span class="line"><span>      // 组件首次加载时发请求获取用户数据</span></span>
<span class="line"><span>      const res = await fetch(&quot;https://reqres.in/api/users/&quot;);</span></span>
<span class="line"><span>      setUsers(await res.json());</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    doFetch();</span></span>
<span class="line"><span>  }, []);</span></span>
<span class="line"><span>  let usersToShow = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (users) {</span></span>
<span class="line"><span>    // 无论组件为何刷新，这里一定会对数组做一次过滤的操作</span></span>
<span class="line"><span>    usersToShow = users.data.filter((user) =&amp;gt;</span></span>
<span class="line"><span>      user.first_name.includes(searchKey),</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;div&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;input</span></span>
<span class="line"><span>        type=&quot;text&quot;</span></span>
<span class="line"><span>        value={searchKey}</span></span>
<span class="line"><span>        onChange={(evt) =&amp;gt; setSearchKey(evt.target.value)}</span></span>
<span class="line"><span>      /&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;ul&amp;gt;</span></span>
<span class="line"><span>        {usersToShow &amp;&amp;</span></span>
<span class="line"><span>          usersToShow.length &amp;gt; 0 &amp;&amp;</span></span>
<span class="line"><span>          usersToShow.map((user) =&amp;gt; {</span></span>
<span class="line"><span>            return &amp;lt;li key={user.id}&amp;gt;{user.first_name}&amp;lt;/li&amp;gt;;</span></span>
<span class="line"><span>          })}</span></span>
<span class="line"><span>      &amp;lt;/ul&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个例子中，无论组件为何要进行一次重新渲染，实际上都需要进行一次过滤的操作。但其实你只需要在 users 或者 searchKey 这两个状态中的某一个发生变化时，重新计算获得需要展示的数据就行了。那么，这个时候，我们就可以用 useMemo 这个 Hook 来实现这个逻辑，缓存计算的结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//...</span></span>
<span class="line"><span>// 使用 userMemo 缓存计算的结果</span></span>
<span class="line"><span>const usersToShow = useMemo(() =&amp;gt; {</span></span>
<span class="line"><span>    if (!users) return null;</span></span>
<span class="line"><span>    return users.data.filter((user) =&amp;gt; {</span></span>
<span class="line"><span>      return user.first_name.includes(searchKey));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }, [users, searchKey]);</span></span>
<span class="line"><span>//...</span></span></code></pre></div><p>可以看到，通过 useMemo 这个 Hook，可以避免在用到的数据没发生变化时进行的重复计算。虽然例子展示的是一个很简单的场景，但如果是一个复杂的计算，那么对于提升性能会有很大的帮助。这也是userMemo的一大好处：避免重复计算。</p><p>除了避免重复计算之外，useMemo 还有一个很重要的好处： <strong>避免子组件的重复渲染</strong>。比如在例子中的 usersToShow 这个变量，如果每次都需要重新计算来得到，那么对于 UserList 这个组件而言，就会每次都需要刷新，因为它将 usersToShow 作为了一个属性。而一旦能够缓存上次的结果，就和 useCallback 的场景一样，可以避免很多不必要的组件刷新。</p><p>这个时候，如果我们结合 useMemo 和 useCallback 这两个 Hooks 一起看，会发现一个有趣的特性，那就是 <strong>useCallback 的功能其实是可以用 useMemo 来实现的。</strong> 比如下面的代码就是利用 useMemo 实现了 useCallback 的功能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> const myEventHandler = useMemo(() =&amp;gt; {</span></span>
<span class="line"><span>   // 返回一个函数作为缓存结果</span></span>
<span class="line"><span>   return () =&amp;gt; {</span></span>
<span class="line"><span>     // 在这里进行事件处理</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }, [dep1, dep2]);</span></span></code></pre></div><p>理解了这一点，相信你一下子会对这两个 Hooks 的机制有更进一步的认识，也就不用死记硬背两个 API 都是干嘛的了，因为从本质上来说，它们只是做了同一件事情： <strong>建立了一个绑定某个结果到依赖数据的关系。只有当依赖变了，这个结果才需要被重新得到</strong>。</p><h1 id="useref-在多次渲染之间共享数据" tabindex="-1">useRef：在多次渲染之间共享数据 <a class="header-anchor" href="#useref-在多次渲染之间共享数据" aria-label="Permalink to &quot;useRef：在多次渲染之间共享数据&quot;">​</a></h1><p>函数组件虽然非常直观，简化了思考 UI 实现的逻辑，但是比起 Class 组件，还缺少了一个很重要的能力： <strong>在多次渲染之间共享数据。</strong></p><p>在类组件中，我们可以定义类的成员变量，以便能在对象上通过成员属性去保存一些数据。但是在函数组件中，是没有这样一个空间去保存数据的。因此，React 让useRef 这样一个 Hook 来提供这样的功能。</p><p>useRef 的API签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const myRefContainer = useRef(initialValue);</span></span></code></pre></div><p>我们可以把useRef看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。</p><p>你可能会有疑问，useRef 的这个功能具体有什么用呢？我们可以看一个例子。</p><p>假设你要去做一个计时器组件，这个组件有开始和暂停两个功能。很显然，你需要用 window.setInterval 来提供计时功能；而为了能够暂停，你就需要在某个地方保存这个 window.setInterval 返回的计数器的引用，确保在点击暂停按钮的同时，也能用 window.clearInterval 停止计时器。那么，这个保存计数器引用的最合适的地方，就是 useRef，因为它可以存储跨渲染的数据。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React, { useState, useCallback, useRef } from &quot;react&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function Timer() {</span></span>
<span class="line"><span>  // 定义 time state 用于保存计时的累积时间</span></span>
<span class="line"><span>  const [time, setTime] = useState(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 定义 timer 这样一个容器用于在跨组件渲染之间保存一个变量</span></span>
<span class="line"><span>  const timer = useRef(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 开始计时的事件处理函数</span></span>
<span class="line"><span>  const handleStart = useCallback(() =&amp;gt; {</span></span>
<span class="line"><span>    // 使用 current 属性设置 ref 的值</span></span>
<span class="line"><span>    timer.current = window.setInterval(() =&amp;gt; {</span></span>
<span class="line"><span>      setTime((time) =&amp;gt; time + 1);</span></span>
<span class="line"><span>    }, 100);</span></span>
<span class="line"><span>  }, []);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 暂停计时的事件处理函数</span></span>
<span class="line"><span>  const handlePause = useCallback(() =&amp;gt; {</span></span>
<span class="line"><span>    // 使用 clearInterval 来停止计时</span></span>
<span class="line"><span>    window.clearInterval(timer.current);</span></span>
<span class="line"><span>    timer.current = null;</span></span>
<span class="line"><span>  }, []);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;div&amp;gt;</span></span>
<span class="line"><span>      {time / 10} seconds.</span></span>
<span class="line"><span>      &amp;lt;br /&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={handleStart}&amp;gt;Start&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={handlePause}&amp;gt;Pause&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里可以看到，我们使用了 useRef 来创建了一个保存 window.setInterval 返回句柄的空间，从而能够在用户点击暂停按钮时清除定时器，达到暂停计时的目的。</p><p>同时你也可以看到，使用 useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方。</p><p>除了存储跨渲染的数据之外，useRef还有一个重要的功能，就是 <strong>保存某个 DOM 节点的引用</strong>。我们知道，在React 中，几乎不需要关心真实的 DOM 节点是如何渲染和修改的。但是在某些场景中，我们必须要获得真实 DOM 节点的引用，所以结合 React 的 ref属性和 useRef 这个 Hook，我们就可以获得真实的 DOM 节点，并对这个节点进行操作。</p><p>比如说，你需要在点击某个按钮时让某个输入框获得焦点，可以通过下面的代码来实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function TextInputWithFocusButton() {</span></span>
<span class="line"><span>  const inputEl = useRef(null);</span></span>
<span class="line"><span>  const onButtonClick = () =&amp;gt; {</span></span>
<span class="line"><span>    // current 属性指向了真实的 input 这个 DOM 节点，从而可以调用 focus 方法</span></span>
<span class="line"><span>    inputEl.current.focus();</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;input ref={inputEl} type=&quot;text&quot; /&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={onButtonClick}&amp;gt;Focus the input&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码是 React 官方文档提供的一个例子，可以看到ref 这个属性提供了获得 DOM 节点的能力，并利用 useRef 保存了这个节点的应用。这样的话，一旦 input 节点被渲染到界面上，那我们通过 inputEl.current 就能访问到真实的 DOM 节点的实例了。</p><h1 id="usecontext-定义全局状态" tabindex="-1">useContext：定义全局状态 <a class="header-anchor" href="#usecontext-定义全局状态" aria-label="Permalink to &quot;useContext：定义全局状态&quot;">​</a></h1><p>在第2节课中你已经知道了，React 组件之间的状态传递只有一种方式，那就是通过 props。这就意味着这种传递关系只能在父子组件之间进行。</p><p>看到这里你肯定会问，如果要跨层次，或者同层的组件之间要进行数据的共享，那应该如何去实现呢？这其实就涉及到一个新的命题： <strong>全局状态管理</strong>。</p><p>为此，React 提供了 Context 这样一个机制，能够让所有在某个组件开始的组件树上创建一个 Context。这样这个组件树上的所有组件，就都能访问和修改这个 Context了。那么在函数组件里，我们就可以使用 useContext 这样一个 Hook 来管理 Context。</p><p>useContext 的API 签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const value = useContext(MyContext);</span></span></code></pre></div><p>正如刚才提到的，一个 Context 是从某个组件为根组件的组件树上可用的，所以我们需要有 API 能够创建一个 Context，这就是 <strong>React.createContext API，</strong> 如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const MyContext = React.createContext(initialValue);</span></span></code></pre></div><p>这里的 MyContext 具有一个 Provider 的属性，一般是作为组件树的根组件。这里我仍然以 React 官方文档的例子来讲解，即：一个主题的切换机制。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const themes = {</span></span>
<span class="line"><span>  light: {</span></span>
<span class="line"><span>    foreground: &quot;#000000&quot;,</span></span>
<span class="line"><span>    background: &quot;#eeeeee&quot;</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  dark: {</span></span>
<span class="line"><span>    foreground: &quot;#ffffff&quot;,</span></span>
<span class="line"><span>    background: &quot;#222222&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>// 创建一个 Theme 的 Context</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const ThemeContext = React.createContext(themes.light);</span></span>
<span class="line"><span>function App() {</span></span>
<span class="line"><span>  // 整个应用使用 ThemeContext.Provider 作为根组件</span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    // 使用 themes.dark 作为当前 Context</span></span>
<span class="line"><span>    &amp;lt;ThemeContext.Provider value={themes.dark}&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;Toolbar /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/ThemeContext.Provider&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 在 Toolbar 组件中使用一个会使用 Theme 的 Button</span></span>
<span class="line"><span>function Toolbar(props) {</span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;div&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;ThemedButton /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 在 Theme Button 中使用 useContext 来获取当前的主题</span></span>
<span class="line"><span>function ThemedButton() {</span></span>
<span class="line"><span>  const theme = useContext(ThemeContext);</span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;button style={​{</span></span>
<span class="line"><span>      background: theme.background,</span></span>
<span class="line"><span>      color: theme.foreground</span></span>
<span class="line"><span>    }​}&amp;gt;</span></span>
<span class="line"><span>      I am styled by theme context!</span></span>
<span class="line"><span>    &amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到这里你也许会有点好奇，Context 看上去就是一个全局的数据，为什么要设计这样一个复杂的机制，而不是直接用一个全局的变量去保存数据呢？</p><p>答案其实很简单，就是 <strong>为了能够进行数据的绑定</strong>。当这个 Context 的数据发生变化时，使用这个数据的组件就能够自动刷新。但如果没有 Context，而是使用一个简单的全局变量，就很难去实现了。</p><p>不过刚才我们看到的其实是一个静态的使用 Context 的例子，直接用了 thems.dark 作为 Context 的值。那么如何让它变得动态呢？</p><p>比如说常见的切换黑暗或者明亮模式的按钮，用来切换整个页面的主题。事实上，动态 Context 并不需要我们学习任何新的 API，而是利用 React 本身的机制，通过这么一行代码就可以实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;ThemeContext.Provider value={themes.dark}&amp;gt;</span></span></code></pre></div><p>可以看到，themes.dark 是作为一个属性值传给 Provider 这个组件的，如果要让它变得动态，其实只要用一个 state 来保存，通过修改 state，就能实现动态的切换Context 的值了。而且这么做，所有用到这个Context 的地方都会自动刷新。比如这样的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function App() {</span></span>
<span class="line"><span>  // 使用 state 来保存 theme 从而可以动态修改</span></span>
<span class="line"><span>  const [theme, setTheme] = useState(&quot;light&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 切换 theme 的回调函数</span></span>
<span class="line"><span>  const toggleTheme = useCallback(() =&amp;gt; {</span></span>
<span class="line"><span>    setTheme((theme) =&amp;gt; (theme === &quot;light&quot; ? &quot;dark&quot; : &quot;light&quot;));</span></span>
<span class="line"><span>  }, []);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    // 使用 theme state 作为当前 Context</span></span>
<span class="line"><span>    &amp;lt;ThemeContext.Provider value={themes[theme]}&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={toggleTheme}&amp;gt;Toggle Theme&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;Toolbar /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/ThemeContext.Provider&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段代码中，我们使用 state 来保存 theme，从而达到可以动态调整的目的。</p><p>可以看到，Context 提供了一个方便在多个组件之间共享数据的机制。不过需要注意的是，它的灵活性也是一柄双刃剑。你或许已经发现，Context 相当于提供了一个定义 React 世界中全局变量的机制，而全局变量则意味着两点：</p><ol><li>会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。</li><li>让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。</li></ol><p>所以在 React 的开发中，除了像 Theme、Language 等一目了然的需要全局设置的变量外，我们很少会使用 Context 来做太多数据的共享。需要再三强调的是，Context 更多的是 <strong>提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力</strong>。</p><p>此外，很多状态管理框架，比如 Redux，正是利用了 Context 的机制来提供一种更加可控的组件之间的状态管理机制。因此，理解 Context 的机制，也可以让我们更好地去理解 Redux 这样的框架实现的原理。</p><h1 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h1><p>最后来总结一下今天的所学。在这节课，你看到了4个常用的 React内置 Hooks 的用法，包括：useCallback、useMemo、useRef 和 useContext。事实上，每一个 Hook 都是 <strong>为了解决函数组件中遇到的特定问题</strong>。</p><p>因为函数组件首先定义了一个简单的模式来创建组件，但与此同时也暴露出了一定的问题。所以这些问题就要通过 Hooks 这样一个统一的机制去解决，可以称得上是一个非常完美的设计了。</p><p>有了这节课介绍的 4 个 Hooks，加上上节课我们学习的 useState 和 useEffect 这两个 核心Hooks，你几乎就能完成所有 React 功能的开发了。</p><p>当然，可能仍然会有一些边缘且复杂的特别场景，我们在这两节课中学习的 Hooks 并不能完全覆盖，那么我建议你可以去参考官方的 <a href="https://reactjs.org/docs/hooks-reference.html" target="_blank" rel="noreferrer">API 文档</a>，先知道 React Hooks 还有哪些能力，以便在需要的时候能够查阅文档并使用。</p><h1 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h1><p>useState 其实也是能够在组件的多次渲染之间共享数据的，那么在 useRef 的计时器例子中，我们能否用 state 去保存 window.setInterval() 返回的 timer 呢？</p><p>欢迎把你的想法和思考分享在留言区，我们一起交流讨论。下节课再见！</p>`,78)])])}const h=n(t,[["render",l]]);export{m as __pageData,h as default};
