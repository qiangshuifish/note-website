import{_ as a,H as i,f as n,i as l}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"25｜表格：如何设计一个表格组件？","description":"","frontmatter":{},"headers":[{"level":2,"title":"表格组件","slug":"表格组件","link":"#表格组件","children":[]},{"level":2,"title":"表格组件的扩展","slug":"表格组件的扩展","link":"#表格组件的扩展","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"玩转Vue3全家桶/25｜表格：如何设计一个表格组件？.md","filePath":"玩转Vue3全家桶/25｜表格：如何设计一个表格组件？.md","lastUpdated":1779821260000}'),p={name:"玩转Vue3全家桶/25｜表格：如何设计一个表格组件？.md"};function t(h,s,e,k,E,r){return i(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="_25-表格-如何设计一个表格组件" tabindex="-1">25｜表格：如何设计一个表格组件？ <a class="header-anchor" href="#_25-表格-如何设计一个表格组件" aria-label="Permalink to &quot;25｜表格：如何设计一个表格组件？&quot;">​</a></h1><p>你好，我是大圣。</p><p>上一讲我们实现了树形组件，树形组件的主要难点就是对无限嵌套数据的处理。今天我们来介绍组件库中最复杂的表格组件，表格组件在项目中负责列表数据的展示，尤其是在管理系统中，比如用户信息、课程订单信息的展示，都需要使用表格组件进行渲染。</p><p>关于表单的具体交互形式和复杂程度，你可以访问 <a href="https://element-plus.gitee.io/zh-CN/component/table.html" target="_blank" rel="noreferrer">ElementPlus</a>、 <a href="https://www.naiveui.com/zh-CN/os-theme/components/data-table" target="_blank" rel="noreferrer">NaiveUi</a>、 <a href="https://www.antdv.com/components/table-cn" target="_blank" rel="noreferrer">AntDesignVue</a> 这三个主流组件库中的表格组件去体验，并且社区还提供了单独的 <a href="https://surely.cool" target="_blank" rel="noreferrer">复杂表格组件</a>，这一讲我就给你详细说说一个复杂表格组件如何去实现。</p><h2 id="表格组件" tabindex="-1">表格组件 <a class="header-anchor" href="#表格组件" aria-label="Permalink to &quot;表格组件&quot;">​</a></h2><p>大部分组件库都会内置表格组件，这是总后台最常用的组件之一，用于展示大量的结构化的数据。html也提供了内置的表格标签，由 &lt;table&gt; 、&lt;thead&gt; 、&lt;tbody&gt; 、&lt;tr&gt; 、&lt;th&gt; 、&lt;td&gt; 这些标签来组成一个最简单的表格标签。</p><p>我们先研究一下html的table标签。下面的代码中，table 标签负责表格的容器，thead负责表头信息的容器，tbody负责表格的主体，tr标签负责表格的每一行，th和td分别负责表头和主体的单元格。</p><p>其实标准的表格系列标签，跟 div+css 实现是有很大区别的。比如表格在做单元格合并时，要提供原生属性，这时候用 div 就很麻烦了。另外，它们的渲染原理上也有一定的区别，每一列的宽度会保持一致。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">table</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">thead</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">th</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">课程</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/th</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">th</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">价格</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/th</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/tr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/thead</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tbody</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">重学前端</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">129</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/tr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">玩转Vue3全家桶</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">129</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/td</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/tr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/tbody</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/table</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span></code></pre></div><p>简单的表格数据渲染并不需要组件，我们直接使用标准的 table 系列标签就可以。但有的时候，除了呈现数据，也会带有一些额外的功能要求，比如嵌套列、性能优化等。这时候组件的好处就很明显了，它能帮我们省去这些基础的工作。</p><p>表格组件的使用风格，从设计上说也分为了两个方向。一个方向是完全由数据驱动，这里我们可以参考Naive Ui的使用方式，n-data-table标签负责容器，直接通过data属性传递数据，通过columns传递表格的表头配置。</p><p>下面的代码中，我们在colums中去配置每行需要显示的属性，通过render函数可以返回定制化的结果，再使用h函数返回Button，渲染出对应的按钮。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n-data-table :columns=&quot;columns&quot; :data=&quot;data&quot; :pagination=&quot;pagination&quot; /</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/template</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { h, defineComponent } from &#39;vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { NTag, NButton, useMessage } from &#39;naive-ui&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const createColumns = ({ sendMail }) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      title: &#39;Name&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      key: &#39;name&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      align: &#39;center&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      title: &#39;Age&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      key: &#39;age&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      title: &#39;Action&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      key: &#39;actions&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      render (row) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        return h(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          NButton,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            size: &#39;small&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            onClick: () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> sendMail(row)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          { default: () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &#39;Send Email&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const createData = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    key: 0,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    name: &#39;John Brown&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    age: 32,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    tags: [&#39;nice&#39;, &#39;developer&#39;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    key: 1,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    name: &#39;Jim Green&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    age: 42,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    key: 2,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    name: &#39;Joe Black&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    age: 32</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">export default defineComponent({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  setup () {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const message = useMessage()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      data: createData(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      columns: createColumns({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        sendMail (rowData) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          message.info(&#39;send mail to &#39; + rowData.name)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      pagination: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        pageSize: 10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span></code></pre></div><p>还有一种是Element3现在使用的风格，配置数据之后，具体数据的展现形式交给子元素来决定，把columns当成组件去使用，我们仍然通过例子来加深理解。</p><p>下面的代码中，我们配置完data后，使用el-table-colum组件去渲染组件的每一列，通过slot的方式去实现定制化的渲染。这两种风格各有优缺点，我们后面还会结合Element3的源码进行讲解。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table :data=&quot;tableData&quot; border style=&quot;width: 100%&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column fixed prop=&quot;date&quot; label=&quot;日期&quot; width=&quot;150&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column prop=&quot;name&quot; label=&quot;姓名&quot; width=&quot;120&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column prop=&quot;province&quot; label=&quot;省份&quot; width=&quot;120&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column prop=&quot;city&quot; label=&quot;市区&quot; width=&quot;120&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column prop=&quot;address&quot; label=&quot;地址&quot; width=&quot;300&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column prop=&quot;zip&quot; label=&quot;邮编&quot; width=&quot;120&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-table-column fixed=&quot;right&quot; label=&quot;操作&quot; width=&quot;100&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template v-slot=&quot;scope&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-button </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;#64;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">click=&quot;handleClick(scope.row)&quot; type=&quot;text&quot; size=&quot;small&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">查看</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-button</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">el-button type=&quot;text&quot; size=&quot;small&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">编辑</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-button</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/template</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table-column</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/el-table</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  export default {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    methods: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleClick(row) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        console.log(row)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    data() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        tableData: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            date: &#39;2016-05-02&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            name: &#39;王小虎&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            province: &#39;上海&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            city: &#39;普陀区&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            address: &#39;上海市普陀区金沙江路 1518 弄&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            zip: 200333</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            date: &#39;2016-05-04&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            name: &#39;王小虎&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            province: &#39;上海&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            city: &#39;普陀区&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            address: &#39;上海市普陀区金沙江路 1517 弄&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            zip: 200333</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            date: &#39;2016-05-01&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            name: &#39;王小虎&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            province: &#39;上海&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            city: &#39;普陀区&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            address: &#39;上海市普陀区金沙江路 1519 弄&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            zip: 200333</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            date: &#39;2016-05-03&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            name: &#39;王小虎&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            province: &#39;上海&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            city: &#39;普陀区&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            address: &#39;上海市普陀区金沙江路 1516 弄&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            zip: 200333</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span></code></pre></div><h2 id="表格组件的扩展" tabindex="-1">表格组件的扩展 <a class="header-anchor" href="#表格组件的扩展" aria-label="Permalink to &quot;表格组件的扩展&quot;">​</a></h2><p>复杂的表格组件需要对表格的显示和操作进行扩展。</p><p>首先是从表格的显示上扩展，我们可以支持表头或者某一列的锁定，在滚动的时候锁定列不受影响。一个table标签很难实现这个效果，这时候我们就需要分为table-head和table-body两个组件进行维护，通过colgroup组件限制每一列的宽度实现表格的效果，而且表头还需要支持表头嵌套。</p><p>下面的示意图中，表头就是被分组显示的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%A9%E8%BD%ACVue3%E5%85%A8%E5%AE%B6%E6%A1%B6/images/468917/f60dac2bf267c10d5f230e8cb03b744a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%A9%E8%BD%ACVue3%E5%85%A8%E5%AE%B6%E6%A1%B6/images/468917/f60dac2bf267c10d5f230e8cb03b744a.png" alt="图片"></a></p><p>我们还是先分析一下需求。对于表格的操作来说，首先要和树组件一样，每一样支持复选框进行选中，方便进行批量的操作。另外，表头还需要支持点击事件，点击后对当前这一列实现排序的效果，同时每一列还可能会有详情数据的展开，甚至表格内部还会有树形组件的嵌套、底部的数据显示等等。</p><p>把这些需求组合在一起，表格就成了组件库中最复杂的组件。我们需要先分解需求，把组件内部拆分成table、table-column、table-body、table-header组件，我们挨个来看一下。</p><p>首先，在table组件的内部，我们使用table-body和table-header构成组件。table提供了整个表格的标签容器；hidden-columns负责隐藏列的显示，并且通过table-store进行表格内部的状态管理。每当table中的table-store被修改后，table-header、table-body都需要重新渲染。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;el-table&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;hidden-columns&quot; ref=&quot;hiddenColumns&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">slot</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/slot</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;el-table__header-wrapper&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         ref=&quot;headerWrapper&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">table-header ref=&quot;tableHeader&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    :store=&quot;store&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/table-header</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;el-table__body-wrapper&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         ref=&quot;bodyWrapper&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">table-body :context=&quot;context&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                  :store=&quot;store&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/table-body</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/template</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span></code></pre></div><p>然后在table组件的初始化过程中，我们首先使用createStore创建表格的store数据管理，并且通过TableLayout创建表格的布局，然后把store通过属性的方式传递给table-header和table-body。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">let table = getCurrentInstance()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const store = createStore(table, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      rowKey: props.rowKey,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      defaultExpandAll: props.defaultExpandAll,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      selectOnIndeterminate: props.selectOnIndeterminate,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // TreeTable 的相关配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      indent: props.indent,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      lazy: props.lazy,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      lazyColumnIdentifier: props.treeProps.hasChildren || &#39;hasChildren&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      childrenColumnName: props.treeProps.children || &#39;children&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      data: props.data</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    table.store = store</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const layout = new TableLayout({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      store: table.store,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      table,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      fit: props.fit,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      showHeader: props.showHeader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    table.layout = layout</span></span></code></pre></div><p>再接着，table-header组件内部会接收传递的store，并且提供监听的事件，包括click，mousedown等鼠标操作后，计算出当前表头的宽高等数据进行显示。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const instance = getCurrentInstance()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const parent = instance.parent</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const storeData = parent.store.states</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const filterPanels = ref({})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      tableLayout,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      onColumnsChange,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      onScrollableChange</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } = useLayoutObserver(parent)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const hasGutter = computed(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return !props.fixed </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> tableLayout.gutterWidth</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    onMounted(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      nextTick(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const { prop, order } = props.defaultSort</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const init = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        parent.store.commit(&#39;sort&#39;, { prop, order, init })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleHeaderClick,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleHeaderContextMenu,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleMouseDown,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleMouseMove,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleMouseOut,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleSortClick,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      handleFilterClick</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } = useEvent(props, emit)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      getHeaderRowStyle,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      getHeaderRowClass,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      getHeaderCellStyle,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      getHeaderCellClass</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } = useStyle(props)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    const { isGroup, toggleAllSelection, columnRows } = useUtils(props)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    instance.state = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      onColumnsChange,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      onScrollableChange</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // eslint-disable-next-line</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    instance.filterPanels = filterPanels</span></span></code></pre></div><p>在table-body中，也是类似的实现方式和效果。不过table-body和table-header中的定制需求较多，我们需要用render函数来实现定制化的需求。</p><p>下面的代码中，我们利用h函数返回el-table__body的渲染，通过state中读取的columns数据依次进行数据的显示。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">render() {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    return h(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &#39;table&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        class: &#39;el-table__body&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        cellspacing: &#39;0&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        cellpadding: &#39;0&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        border: &#39;0&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        hColgroup(this.store.states.columns.value),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        h(&#39;tbody&#39;, {}, [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          data.reduce((acc, row) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            return acc.concat(this.wrappedRowRender(row, acc.length))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          }, []),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          h(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ElTooltip,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              modelValue: this.tooltipVisible,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              content: this.tooltipContent,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              manual: true,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              effect: this.$parent.tooltipEffect,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              placement: &#39;top&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              default: () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> this.tooltipTrigger</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span></code></pre></div><p>整体表格组件的渲染逻辑和过程比较复杂。为了帮你抽丝剥茧，这节课我重点给你说说Element3中table标签的渲染过程，至于具体的表格实现代码，你可以课后参考Element3的源码。</p><p>表格组件除了显示的效果非常复杂、交互非常复杂之外，还有一个非常棘手的性能问题。由于表格是二维渲染，而且表格组件如果想支持表头或者某一列锁定的定制效果，内部需要渲染不止一个table标签。一旦数据量庞大之后，表格就成了最容易导致性能瓶颈的组件，那这种场景如何去做优化呢？</p><p>这里我们要快速回顾一下性能优化那一讲的思路：性能优化主要的思路就是如何能够减少计算量。比如我们的表格如果有1000行要显示，但是我们浏览器最多只能显示100条，其他的需要通过滚动条的方式进行滚动显示，屏幕之外，成千上万个dom元素就成了性能消耗的主要原因。</p><p>针对这种情况，我们可以考虑类似图片懒加载的方案，对屏幕之外的dom元素做懒渲染，也就是非常常见的 <strong>虚拟列表解决方案</strong>。</p><p>在虚拟列表解决方案中，我们首先要获取窗口的高度、元素的高度以及当前滚动的距离，通过这些数据计算出当前屏幕显示出来的数据。然后创建这些元素标签，设置元素的transform属性模拟滚动效果。这样表面看是1000条数据在表格里显示，实际只渲染了屏幕中间的这100行数据，当我们滚动鼠标的同时，去维护这100个数据列表，这样就完成了标签过多的性能问题。</p><p>如果表格内部每一行的高度不同的话，我们就需要对每一个元素的高度进行估计。具体操作时，先进行渲染，然后等待渲染完毕之后获取高度并且缓存下来，即可实现虚拟列表元素高度的自适应。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我们学习了表格组件如何实现，我给你做个总结吧。</p><p>表格组件是组件库中最复杂的组件，核心的难点除了 <strong>数据的嵌套渲染</strong> 和 <strong>复杂的交互</strong> 之外， <strong>复杂的dom节点</strong> 也是表格的特点之一。我们通过对table-header、table-body和table-footer的组件分析，掌握了表格组件设计思路的实现细节。</p><p>除此之外，表格也是最容易导致页面卡顿的组件，所以我们除了数据驱动渲染之外，还需要考虑通过虚拟滚动的方式进行渲染的优化，这也是列表数据常见的优化策略，属于懒渲染的解决方案。</p><p>无论数据有多少行，我们只渲染用户可视窗口之内的，控制top的属性来模拟滚动效果，通过computed计算出需要渲染的数据。最后，我还想提醒你注意，虚拟滚动也是面试的热门解决方案，你一定要手敲一遍才能加深理解。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后留个思考题吧，你现在基础的复杂项目或者组件库中，有哪些组件适合用虚拟滚动做性能优化呢？欢迎你在评论区分享你的答案，也欢迎你把这一讲分享给你的同事和朋友们，我们下一讲再见!</p>`,45)])])}const y=a(p,[["render",t]]);export{g as __pageData,y as default};
