import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"06｜自定义Hooks ：四个典型的使用场景","description":"","frontmatter":{},"headers":[],"relativePath":"ReactHooks核心原理与实战/06｜自定义Hooks：四个典型的使用场景.md","filePath":"ReactHooks核心原理与实战/06｜自定义Hooks：四个典型的使用场景.md","lastUpdated":1779816222000}'),l={name:"ReactHooks核心原理与实战/06｜自定义Hooks：四个典型的使用场景.md"};function t(o,s,i,c,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_06-自定义hooks-四个典型的使用场景" tabindex="-1">06｜自定义Hooks ：四个典型的使用场景 <a class="header-anchor" href="#_06-自定义hooks-四个典型的使用场景" aria-label="Permalink to &quot;06｜自定义Hooks ：四个典型的使用场景&quot;">​</a></h1><p>你好，我是王沛。</p><p>我在开篇词就说过，要用好 React Hooks，很重要的一点，就是要能够从 Hooks 的角度去思考问题。要做到这一点其实也不难，就是在遇到一个功能开发的需求时，首先问自己一个问题： <strong>这个功能中的哪些逻辑可以抽出来成为独立的 Hooks？</strong></p><p>这么问的目的，是为了让我们尽可能地把业务逻辑拆成独立的 Hooks ，这样有助于实现代码的模块化和解耦，同时也方便后面的维护。如果你基础篇的知识掌握得牢固的话，就会发现，这是因为 Hooks 有两个非常核心的优点：</p><ul><li>一是方便进行逻辑复用；</li><li>二是帮助关注分离。</li></ul><p>接下来我就通过一个案例，来带你认识什么是自定义Hooks，以及如何创建。然后，我们再通过其它3个典型案例，来看看自定义Hooks 具体有什么用，从而帮你掌握从 Hooks 角度去解决问题的思考方式。</p><h1 id="如何创建自定义-hooks" tabindex="-1">如何创建自定义 Hooks？ <a class="header-anchor" href="#如何创建自定义-hooks" aria-label="Permalink to &quot;如何创建自定义 Hooks？&quot;">​</a></h1><p>自定义 Hooks 在形式上其实非常简单，就是 <strong>声明一个名字以 use 开头的函数</strong>，比如 useCounter。这个函数在形式上和普通的 JavaScript 函数没有任何区别，你可以传递任意参数给这个 Hook，也可以返回任何值。</p><p>但是要注意，Hooks 和普通函数在语义上是有区别的，就在于 <strong>函数中有没有用到其它 Hooks。</strong></p><p>什么意思呢？就是说如果你创建了一个 useXXX 的函数，但是内部并没有用任何其它 Hooks，那么这个函数就不是一个 Hook，而只是一个普通的函数。但是如果用了其它 Hooks ，那么它就是一个 Hook。</p><p>举一个简单的例子，在第3讲中我们看到过一个简单计数器的实现，当时把业务逻辑都写在了函数组件内部，但其实是可以把业务逻辑提取出来成为一个 Hook。比如下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useState, useCallback }from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function useCounter() {</span></span>
<span class="line"><span>  // 定义 count 这个 state 用于保存当前数值</span></span>
<span class="line"><span>  const [count, setCount] = useState(0);</span></span>
<span class="line"><span>  // 实现加 1 的操作</span></span>
<span class="line"><span>  const increment = useCallback(() =&amp;gt; setCount(count + 1), [count]);</span></span>
<span class="line"><span>  // 实现减 1 的操作</span></span>
<span class="line"><span>  const decrement = useCallback(() =&amp;gt; setCount(count - 1), [count]);</span></span>
<span class="line"><span>  // 重置计数器</span></span>
<span class="line"><span>  const reset = useCallback(() =&amp;gt; setCount(0), []);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 将业务逻辑的操作 export 出去供调用者使用</span></span>
<span class="line"><span>  return { count, increment, decrement, reset };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了这个 Hook，我们就可以在组件中使用它，比如下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function Counter() {</span></span>
<span class="line"><span>  // 调用自定义 Hook</span></span>
<span class="line"><span>  const { count, increment, decrement, reset } = useCounter();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 渲染 UI</span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;div&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={decrement}&amp;gt; - &amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;p&amp;gt;{count}&amp;lt;/p&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={increment}&amp;gt; + &amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={reset}&amp;gt; reset &amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段代码中，我们把原来在函数组件中实现的逻辑提取了出来，成为一个单独的 Hook， <strong>一方面能让这个逻辑得到重用，另外一方面也能让代码更加语义化</strong>， <strong>并且易于理解和维护。</strong></p><p>从这个例子，我们可以看到自定义 Hooks 的两个特点：</p><ol><li>名字一定是以 use 开头的函数，这样 React 才能够知道这个函数是一个 Hook；</li><li>函数内部一定调用了其它的 Hooks，可以是内置的 Hooks，也可以是其它自定义 Hooks。这样才能够让组件刷新，或者去产生副作用。</li></ol><p>当然，这只是一个非常简单的例子，实现了计数器业务逻辑的拆分和重用。不过通过这个例子，你也看到了创建自定义 Hook 是如此之简单，和过去的高阶组件设计模式相比，简直是天上地下的区别。也正因如此，Hooks 出现后就得到了迅速的普及。</p><p>那么，在日常开发的时候，除了解耦业务相关的逻辑，还有哪些场景需要去创建自定义 Hooks 呢？下面我就再给你介绍三个典型的业务场景。</p><h1 id="封装通用逻辑-useasync" tabindex="-1">封装通用逻辑：useAsync <a class="header-anchor" href="#封装通用逻辑-useasync" aria-label="Permalink to &quot;封装通用逻辑：useAsync&quot;">​</a></h1><p>在组件的开发过程中，有一些常用的通用逻辑。过去可能会因为逻辑重用比较繁琐，而经常在每个组件中去自己实现，造成维护的困难。但现在有了 Hooks，就可以将更多的通用逻辑通过 Hooks 的形式进行封装，方便被不同的组件重用。</p><p>比如说，在日常 UI 的开发中，有一个最常见的需求： <strong>发起异步请求获取数据并显示在界面上</strong>。在这个过程中，我们不仅要关心请求正确返回时，UI 会如何展现数据；还需要处理请求出错，以及关注 Loading 状态在 UI 上如何显示。</p><p>我们可以重新看下在第1讲中看到的异步请求的例子，从 Server 端获取用户列表，并显示在界面上：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React from &quot;react&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function UserList() {</span></span>
<span class="line"><span>  // 使用三个 state 分别保存用户列表，loading 状态和错误状态</span></span>
<span class="line"><span>  const [users, setUsers] = React.useState([]);</span></span>
<span class="line"><span>  const [loading, setLoading] = React.useState(false);</span></span>
<span class="line"><span>  const [error, setError] = React.useState(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 定义获取用户的回调函数</span></span>
<span class="line"><span>  const fetchUsers = async () =&amp;gt; {</span></span>
<span class="line"><span>    setLoading(true);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const res = await fetch(&quot;https://reqres.in/api/users/&quot;);</span></span>
<span class="line"><span>      const json = await res.json();</span></span>
<span class="line"><span>      // 请求成功后将用户数据放入 state</span></span>
<span class="line"><span>      setUsers(json.data);</span></span>
<span class="line"><span>    } catch (err) {</span></span>
<span class="line"><span>      // 请求失败将错误状态放入 state</span></span>
<span class="line"><span>      setError(err);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    setLoading(false);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;div className=&quot;user-list&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;button onClick={fetchUsers} disabled={loading}&amp;gt;</span></span>
<span class="line"><span>        {loading ? &quot;Loading...&quot; : &quot;Show Users&quot;}</span></span>
<span class="line"><span>      &amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>      {error &amp;&amp;</span></span>
<span class="line"><span>        &amp;lt;div style={​{ color: &quot;red&quot; }​}&amp;gt;Failed: {String(error)}&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      &amp;lt;br /&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;ul&amp;gt;</span></span>
<span class="line"><span>        {users &amp;&amp; users.length &amp;gt; 0 &amp;&amp;</span></span>
<span class="line"><span>          users.map((user) =&amp;gt; {</span></span>
<span class="line"><span>            return &amp;lt;li key={user.id}&amp;gt;{user.first_name}&amp;lt;/li&amp;gt;;</span></span>
<span class="line"><span>          })}</span></span>
<span class="line"><span>      &amp;lt;/ul&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，我们定义了 users、loading 和 error 三个状态。如果我们在异步请求的不同阶段去设置不同的状态，这样 UI 最终能够根据这些状态展现出来。在每个需要异步请求的组件中，其实都需要重复相同的逻辑。</p><p>事实上，在处理这类请求的时候，模式都是类似的，通常都会遵循下面步骤：</p><ol><li>创建 data，loading，error 这3个 state；</li><li>请求发出后，设置 loading state 为 true；</li><li>请求成功后，将返回的数据放到某个 state 中，并将 loading state 设为 false；</li><li>请求失败后，设置 error state 为 true，并将 loading state 设为 false。</li></ol><p>最后，基于 data、loading、error 这3个 state 的数据，UI 就可以正确地显示数据，或者 loading、error 这些反馈给用户了。</p><p>所以，通过创建一个自定义 Hook，可以很好地将这样的逻辑提取出来，成为一个可重用的模块。比如代码可以这样实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useState } from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const useAsync = (asyncFunction) =&amp;gt; {</span></span>
<span class="line"><span>  // 设置三个异步逻辑相关的 state</span></span>
<span class="line"><span>  const [data, setData] = useState(null);</span></span>
<span class="line"><span>  const [loading, setLoading] = useState(false);</span></span>
<span class="line"><span>  const [error, setError] = useState(null);</span></span>
<span class="line"><span>  // 定义一个 callback 用于执行异步逻辑</span></span>
<span class="line"><span>  const execute = useCallback(() =&amp;gt; {</span></span>
<span class="line"><span>    // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态</span></span>
<span class="line"><span>    setLoading(true);</span></span>
<span class="line"><span>    setData(null);</span></span>
<span class="line"><span>    setError(null);</span></span>
<span class="line"><span>    return asyncFunction()</span></span>
<span class="line"><span>      .then((response) =&amp;gt; {</span></span>
<span class="line"><span>        // 请求成功时，将数据写进 state，设置 loading 为 false</span></span>
<span class="line"><span>        setData(response);</span></span>
<span class="line"><span>        setLoading(false);</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span>      .catch((error) =&amp;gt; {</span></span>
<span class="line"><span>        // 请求失败时，设置 loading 为 false，并设置错误状态</span></span>
<span class="line"><span>        setError(error);</span></span>
<span class="line"><span>        setLoading(false);</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>  }, [asyncFunction]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return { execute, loading, data, error };</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>那么有了这个 Hook，我们在组件中就只需要关心与业务逻辑相关的部分。比如代码可以简化成这样的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React from &quot;react&quot;;</span></span>
<span class="line"><span>import useAsync from &#39;./useAsync&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function UserList() {</span></span>
<span class="line"><span>  // 通过 useAsync 这个函数，只需要提供异步逻辑的实现</span></span>
<span class="line"><span>  const {</span></span>
<span class="line"><span>    execute: fetchUsers,</span></span>
<span class="line"><span>    data: users,</span></span>
<span class="line"><span>    loading,</span></span>
<span class="line"><span>    error,</span></span>
<span class="line"><span>  } = useAsync(async () =&amp;gt; {</span></span>
<span class="line"><span>    const res = await fetch(&quot;https://reqres.in/api/users/&quot;);</span></span>
<span class="line"><span>    const json = await res.json();</span></span>
<span class="line"><span>    return json.data;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    // 根据状态渲染 UI...</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过这个例子可以看到，我们 <strong>利用了 Hooks 能够管理 React 组件状态的能力，将一个组件中的某一部分状态独立出来，从而实现了通用逻辑的重用</strong>。</p><p>不过在这里你可能会有一个疑问：这种类型的封装我写一个工具类不就可以了？为什么一定要通过 Hooks 进行封装呢？</p><p>答案很容易就能想到。因为在 Hooks 中，你可以管理当前组件的 state，从而将更多的逻辑写在可重用的 Hooks 中。但是要知道，在普通的工具类中是无法直接修改组件 state 的，那么也就无法在数据改变的时候触发组件的重新渲染。</p><h1 id="监听浏览器状态-usescroll" tabindex="-1">监听浏览器状态：useScroll <a class="header-anchor" href="#监听浏览器状态-usescroll" aria-label="Permalink to &quot;监听浏览器状态：useScroll&quot;">​</a></h1><p>虽然 React 组件基本上不需要关心太多的浏览器 API，但是有时候却是必须的：</p><ul><li>界面需要根据在窗口大小变化重新布局；</li><li>在页面滚动时，需要根据滚动条位置，来决定是否显示一个“返回顶部”的按钮。</li></ul><p>这都需要用到浏览器的 API 来监听这些状态的变化。那么我们就以滚动条位置的场景为例，来看看应该如何用 Hooks 优雅地监听浏览器状态。</p><p>正如 Hooks 的字面意思是“钩子”，它带来的一大好处就是： <strong>可以让 React 的组件绑定在任何可能的数据源上。这样当数据源发生变化时，组件能够自动刷新</strong>。把这个好处对应到滚动条位置这个场景就是：组件需要绑定到当前滚动条的位置数据上。</p><p>虽然这个逻辑在函数组件中可以直接实现，但是把这个逻辑实现为一个独立的Hooks，既可以达到逻辑重用，在语义上也更加清晰。这个和上面的 useAsync 的作用是非常类似的。</p><p>我们可以直接来看这个 Hooks 应该如何实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { useState, useEffect } from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 获取横向，纵向滚动条位置</span></span>
<span class="line"><span>const getPosition = () =&amp;gt; {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    x: document.body.scrollLeft,</span></span>
<span class="line"><span>    y: document.body.scrollTop,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>const useScroll = () =&amp;gt; {</span></span>
<span class="line"><span>  // 定一个 position 这个 state 保存滚动条位置</span></span>
<span class="line"><span>  const [position, setPosition] = useState(getPosition());</span></span>
<span class="line"><span>  useEffect(() =&amp;gt; {</span></span>
<span class="line"><span>    const handler = () =&amp;gt; {</span></span>
<span class="line"><span>      setPosition(getPosition(document));</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    // 监听 scroll 事件，更新滚动条位置</span></span>
<span class="line"><span>    document.addEventListener(&quot;scroll&quot;, handler);</span></span>
<span class="line"><span>    return () =&amp;gt; {</span></span>
<span class="line"><span>      // 组件销毁时，取消事件监听</span></span>
<span class="line"><span>      document.removeEventListener(&quot;scroll&quot;, handler);</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }, []);</span></span>
<span class="line"><span>  return position;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>有了这个 Hook，你就可以非常方便地监听当前浏览器窗口的滚动条位置了。比如下面的代码就展示了“返回顶部”这样一个功能的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React, { useCallback } from &#39;react&#39;;</span></span>
<span class="line"><span>import useScroll from &#39;./useScroll&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function ScrollTop() {</span></span>
<span class="line"><span>  const { y } = useScroll();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const goTop = useCallback(() =&amp;gt; {</span></span>
<span class="line"><span>    document.body.scrollTop = 0;</span></span>
<span class="line"><span>  }, []);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const style = {</span></span>
<span class="line"><span>    position: &quot;fixed&quot;,</span></span>
<span class="line"><span>    right: &quot;10px&quot;,</span></span>
<span class="line"><span>    bottom: &quot;10px&quot;,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮</span></span>
<span class="line"><span>  if (y &amp;gt; 300) {</span></span>
<span class="line"><span>    return (</span></span>
<span class="line"><span>      &amp;lt;button onClick={goTop} style={style}&amp;gt;</span></span>
<span class="line"><span>        Back to Top</span></span>
<span class="line"><span>      &amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 否则不 render 任何 UI</span></span>
<span class="line"><span>  return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过这个例子，我们看到了如何将浏览器状态变成可被 React 组件绑定的数据源，从而在使用上更加便捷和直观。当然，除了窗口大小、滚动条位置这些状态，还有其它一些数据也可以这样操作，比如 cookies，localStorage, URL，等等。你都可以通过这样的方法来实现。</p><h1 id="拆分复杂组件" tabindex="-1">拆分复杂组件 <a class="header-anchor" href="#拆分复杂组件" aria-label="Permalink to &quot;拆分复杂组件&quot;">​</a></h1><p>函数组件虽然很容易上手，但是当某个组件功能越来越复杂的时候，我发现很多同学会出现一个问题，就是组件代码很容易变得特别长，比如超过500行，甚至1000行。这就变得非常难维护了。</p><p>设想当你接手某个项目，发现一个函数动辄就超过了500行，那会是什么感受？所以 <strong>“保持每个函数的短小”</strong> 这样通用的最佳实践，同样适用于函数组件。只有这样，才能让代码始终易于理解和维护。</p><p>那么现在的关键问题就是，怎么才能让函数组件不会太过冗长呢？做法很简单，就是 <strong>尽量将相关的逻辑做成独立的 Hooks，然后在函数组中使用这些 Hooks，通过参数传递和返回值让 Hooks 之间完成交互</strong>。</p><p>这里可以注意一点，拆分逻辑的目的不一定是为了重用，而可以是仅仅为了业务逻辑的隔离。所以在这个场景下，我们不一定要把 Hooks 放到独立的文件中，而是可以和函数组件写在一个文件中。这么做的原因就在于，这些 Hooks 是和当前函数组件紧密相关的，所以写到一起，反而更容易阅读和理解。</p><p>为了让你对这一点有更直观的感受，我们来看一个例子。设想现在有这样一个需求：我们需要展示一个博客文章的列表，并且有一列要显示文章的分类。同时，我们还需要提供表格过滤功能，以便能够只显示某个分类的文章。</p><p>为了支持过滤功能，后端提供了两个 API：一个用于获取文章的列表，另一个用于获取所有的分类。这就需要我们在前端将文章列表返回的数据分类 ID 映射到分类的名字，以便显示在列表里。</p><p>这时候，如果按照直观的思路去实现，通常都会把逻辑都写在一个组件里，比如类似下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function BlogList() {</span></span>
<span class="line"><span>  // 获取文章列表...</span></span>
<span class="line"><span>  // 获取分类列表...</span></span>
<span class="line"><span>  // 组合文章数据和分类数据...</span></span>
<span class="line"><span>  // 根据选择的分类过滤文章...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 渲染 UI ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以想一下，如果你是在写一个其它的普通函数，会不会将其中一些逻辑写成单独的函数呢？相信答案是肯定的，因为这样做可以隔离业务逻辑，让代码更加清楚。</p><p>但我却发现很多同学在写函数组件时没有意识到 Hooks 就是普通的函数，所以通常不会这么去做隔离，而是习惯于一路写下来，这就会造成某个函数组件特别长。还是老生常谈的那句话， <strong>改变这个状况的关键仍然在于开发思路的转变</strong>。我们要真正 <strong>把 Hooks 就看成普通的函数，能隔离的尽量去做隔离</strong>，从而让代码更加模块化，更易于理解和维护。</p><p>那么针对这样一个功能，我们甚至可以将其拆分成4个 Hooks，每一个 Hook 都尽量小，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import React, { useEffect, useCallback, useMemo, useState } from &quot;react&quot;;</span></span>
<span class="line"><span>import { Select, Table } from &quot;antd&quot;;</span></span>
<span class="line"><span>import _ from &quot;lodash&quot;;</span></span>
<span class="line"><span>import useAsync from &quot;./useAsync&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const endpoint = &quot;https://myserver.com/api/&quot;;</span></span>
<span class="line"><span>const useArticles = () =&amp;gt; {</span></span>
<span class="line"><span>  // 使用上面创建的 useAsync 获取文章列表</span></span>
<span class="line"><span>  const { execute, data, loading, error } = useAsync(</span></span>
<span class="line"><span>    useCallback(async () =&amp;gt; {</span></span>
<span class="line"><span>      const res = await fetch(\`\${endpoint}/posts\`);</span></span>
<span class="line"><span>      return await res.json();</span></span>
<span class="line"><span>    }, []),</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>  // 执行异步调用</span></span>
<span class="line"><span>  useEffect(() =&amp;gt; execute(), [execute]);</span></span>
<span class="line"><span>  // 返回语义化的数据结构</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    articles: data,</span></span>
<span class="line"><span>    articlesLoading: loading,</span></span>
<span class="line"><span>    articlesError: error,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>const useCategories = () =&amp;gt; {</span></span>
<span class="line"><span>  // 使用上面创建的 useAsync 获取分类列表</span></span>
<span class="line"><span>  const { execute, data, loading, error } = useAsync(</span></span>
<span class="line"><span>    useCallback(async () =&amp;gt; {</span></span>
<span class="line"><span>      const res = await fetch(\`\${endpoint}/categories\`);</span></span>
<span class="line"><span>      return await res.json();</span></span>
<span class="line"><span>    }, []),</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>  // 执行异步调用</span></span>
<span class="line"><span>  useEffect(() =&amp;gt; execute(), [execute]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 返回语义化的数据结构</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    categories: data,</span></span>
<span class="line"><span>    categoriesLoading: loading,</span></span>
<span class="line"><span>    categoriesError: error,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>const useCombinedArticles = (articles, categories) =&amp;gt; {</span></span>
<span class="line"><span>  // 将文章数据和分类数据组合到一起</span></span>
<span class="line"><span>  return useMemo(() =&amp;gt; {</span></span>
<span class="line"><span>    // 如果没有文章或者分类数据则返回 null</span></span>
<span class="line"><span>    if (!articles || !categories) return null;</span></span>
<span class="line"><span>    return articles.map((article) =&amp;gt; {</span></span>
<span class="line"><span>      return {</span></span>
<span class="line"><span>        ...article,</span></span>
<span class="line"><span>        category: categories.find(</span></span>
<span class="line"><span>          (c) =&amp;gt; String(c.id) === String(article.categoryId),</span></span>
<span class="line"><span>        ),</span></span>
<span class="line"><span>      };</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }, [articles, categories]);</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>const useFilteredArticles = (articles, selectedCategory) =&amp;gt; {</span></span>
<span class="line"><span>  // 实现按照分类过滤</span></span>
<span class="line"><span>  return useMemo(() =&amp;gt; {</span></span>
<span class="line"><span>    if (!articles) return null;</span></span>
<span class="line"><span>    if (!selectedCategory) return articles;</span></span>
<span class="line"><span>    return articles.filter((article) =&amp;gt; {</span></span>
<span class="line"><span>      console.log(&quot;filter: &quot;, article.categoryId, selectedCategory);</span></span>
<span class="line"><span>      return String(article?.category?.name) === String(selectedCategory);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }, [articles, selectedCategory]);</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const columns = [</span></span>
<span class="line"><span>  { dataIndex: &quot;title&quot;, title: &quot;Title&quot; },</span></span>
<span class="line"><span>  { dataIndex: [&quot;category&quot;, &quot;name&quot;], title: &quot;Category&quot; },</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function BlogList() {</span></span>
<span class="line"><span>  const [selectedCategory, setSelectedCategory] = useState(null);</span></span>
<span class="line"><span>  // 获取文章列表</span></span>
<span class="line"><span>  const { articles, articlesError } = useArticles();</span></span>
<span class="line"><span>  // 获取分类列表</span></span>
<span class="line"><span>  const { categories, categoriesError } = useCategories();</span></span>
<span class="line"><span>  // 组合数据</span></span>
<span class="line"><span>  const combined = useCombinedArticles(articles, categories);</span></span>
<span class="line"><span>  // 实现过滤</span></span>
<span class="line"><span>  const result = useFilteredArticles(combined, selectedCategory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 分类下拉框选项用于过滤</span></span>
<span class="line"><span>  const options = useMemo(() =&amp;gt; {</span></span>
<span class="line"><span>    const arr = _.uniqBy(categories, (c) =&amp;gt; c.name).map((c) =&amp;gt; ({</span></span>
<span class="line"><span>      value: c.name,</span></span>
<span class="line"><span>      label: c.name,</span></span>
<span class="line"><span>    }));</span></span>
<span class="line"><span>    arr.unshift({ value: null, label: &quot;All&quot; });</span></span>
<span class="line"><span>    return arr;</span></span>
<span class="line"><span>  }, [categories]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 如果出错，简单返回 Failed</span></span>
<span class="line"><span>  if (articlesError || categoriesError) return &quot;Failed&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 如果没有结果，说明正在加载</span></span>
<span class="line"><span>  if (!result) return &quot;Loading...&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &amp;lt;div&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;Select</span></span>
<span class="line"><span>        value={selectedCategory}</span></span>
<span class="line"><span>        onChange={(value) =&amp;gt; setSelectedCategory(value)}</span></span>
<span class="line"><span>        options={options}</span></span>
<span class="line"><span>        style={​{ width: &quot;200px&quot; }​}</span></span>
<span class="line"><span>        placeholder=&quot;Select a category&quot;</span></span>
<span class="line"><span>      /&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;Table dataSource={result} columns={columns} /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过这样的方式，我们就把一个较为复杂的逻辑拆分成一个个独立的 Hook 了，不仅隔离了业务逻辑，也让代码在语义上更加明确。比如说有 useArticles、useCategories 这样与业务相关的名字，就非常易于理解。</p><p>虽然这个例子中抽取出来的 Hooks 都非常简单，甚至看上去没有必要。但是实际的开发场景一定是比这个复杂的，比如对于 API 返回的数据需要做一些数据的转换，进行数据的缓存，等等。那么这时就要避免把这些逻辑都放到一起，而是就要拆分到独立的 Hooks，以免产生过于复杂的组件。到时候你也就更能更体会到 Hooks 带给你的惊喜了。</p><h1 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h1><p>好了，这一讲我主要给你介绍了自定义 Hooks 的概念，以及典型的四个使用场景：</p><ol><li>抽取业务逻辑；</li><li>封装通用逻辑；</li><li>监听浏览器状态；</li><li>拆分复杂组件。</li></ol><p>其中，我通过四个案例来帮助你真正理解 Hooks ，并熟练掌握自定义 Hooks 的用法。应始终记得，要用Hooks 的思路去解决问题，发挥 Hooks 的最大价值，就是要经常去思考哪些逻辑应该封装到一个独立的 Hook，保证每个 Hook 的短小精悍，从而让代码更加清晰，易于理解和维护。</p><h1 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h1><p>在 useCounter 这个例子中，我们是固定让数字每次加一。假如要做一个改进，允许灵活配置点击加号时应该加几，比如说每次加10，那么应该如何实现？</p><p>欢迎在留言区分享你的思考和想法，我会和你交流讨论。我们下节课再见！</p>`,68)])])}const m=n(l,[["render",t]]);export{g as __pageData,m as default};
