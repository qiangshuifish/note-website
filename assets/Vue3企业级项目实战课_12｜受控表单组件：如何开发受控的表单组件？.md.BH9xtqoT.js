import{_ as i,H as a,f as n,i as l}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"12 | 受控表单组件：如何开发受控的表单组件？","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是受控组件和非受控组件？","slug":"什么是受控组件和非受控组件","link":"#什么是受控组件和非受控组件","children":[]},{"level":2,"title":"受控表单组件和非受控表单组件各有什么优劣？","slug":"受控表单组件和非受控表单组件各有什么优劣","link":"#受控表单组件和非受控表单组件各有什么优劣","children":[]},{"level":2,"title":"怎么封装 Vue.js3.x 的受控表单组件？","slug":"怎么封装-vue-js3-x-的受控表单组件","link":"#怎么封装-vue-js3-x-的受控表单组件","children":[]},{"level":2,"title":"如何给封装的受控表单组件做统一提交校验？","slug":"如何给封装的受控表单组件做统一提交校验","link":"#如何给封装的受控表单组件做统一提交校验","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Vue3企业级项目实战课/12｜受控表单组件：如何开发受控的表单组件？.md","filePath":"Vue3企业级项目实战课/12｜受控表单组件：如何开发受控的表单组件？.md","lastUpdated":1795535737000}'),t={name:"Vue3企业级项目实战课/12｜受控表单组件：如何开发受控的表单组件？.md"};function p(e,s,E,h,k,r){return a(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="_12-受控表单组件-如何开发受控的表单组件" tabindex="-1">12 | 受控表单组件：如何开发受控的表单组件？ <a class="header-anchor" href="#_12-受控表单组件-如何开发受控的表单组件" aria-label="Permalink to &quot;12 | 受控表单组件：如何开发受控的表单组件？&quot;">​</a></h1><p>你好，我是杨文坚。今天我们为自研组件库增加表单组件。</p><p>表单技术，日常业务运用非常广泛，除了常见的用户注册和登录场景，信息填写操作、信息编辑操作和上传文件图片等操作都是基于表单技术的。所以很多前端组件库都会实现相关的表单组件，提供给开发者使用，尽量减少表单的开发工作量。</p><p>而表单组件的实现，都是基于“受控组件”的技术概念来实现的。那什么是受控组件和非受控组件呢？</p><h2 id="什么是受控组件和非受控组件" tabindex="-1">什么是受控组件和非受控组件？ <a class="header-anchor" href="#什么是受控组件和非受控组件" aria-label="Permalink to &quot;什么是受控组件和非受控组件？&quot;">​</a></h2><p>“受控组件”和“非受控组件”，是谁最先提出来的，目前无从得知，比较流行的描述来自 React官方官网。</p><p>受控组件，按照 React 官网的描述，就是用 React.js 内部 state 来管理 HTML 表单的数据状态，同时也控制用户操作表单时的数据输入。这类被 React.js 以这种方式控制取值的表单输入元素就叫做“受控组件”。</p><p>非受控组件，React 官网的描述是这样的，“在大多数情况下，我们推荐使用受控组件来处理表单数据。在一个受控组件中，表单数据是由 React 组件来管理的。另一种替代方案是使用非受控组件，这时表单数据将交由 DOM 节点来处理”。</p><p>从描述可以得知，“受控组件”和“非受控组件”的技术概念，跟 React.js 等框架的关系耦合不大。简单来讲，“受控组件”就是通过内置统一状态或者数据管理来控制表单操作，而“非受控组件”就是使用原生 HTML 的表单特性来实现表操作。</p><p>因为这个技术概念，主要应用场景是表单场景，所以为了统一语义，避免产生歧义，我们对“受控组件”和“非受控组件”统一称为“受控表单组件”和“非受控表单组件”。而“受控组件”的理念，可以更优雅地设计实现表单组件的功能，也是业界 Vue.js 和 React.js 开发表单组件的首选技术方案，所以今天要实现的“表单组件”都是“受控表单组件”类型。</p><p>知道了两种表单组件的技术概念，那么两种组件各有什么优劣呢？在日常工作开发中又要怎么选择使用呢？</p><h2 id="受控表单组件和非受控表单组件各有什么优劣" tabindex="-1">受控表单组件和非受控表单组件各有什么优劣？ <a class="header-anchor" href="#受控表单组件和非受控表单组件各有什么优劣" aria-label="Permalink to &quot;受控表单组件和非受控表单组件各有什么优劣？&quot;">​</a></h2><p>我们直接看代码案例，用 Vue.js 3.x 实现一个注册表单的功能代码，做个实际的效果对比。</p><p>先用 Vue.js 3.x 基于非受控表单组件的概念实现一个注册表单：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​h1&gt;这是一个非受控表单组件&lt;​/h1&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​form @submit=&quot;onSubmit&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span&gt;用户名称：&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​input ref=&quot;inputUserName&quot; name=&quot;username&quot; type=&quot;text&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span&gt;密码：&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​input ref=&quot;inputPassword&quot; name=&quot;password&quot; type=&quot;password&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span&gt;确认密码：&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​input</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       ref=&quot;inputConfirmPassword&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       name=&quot;confirmPassword&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       type=&quot;password&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​button&gt;提交注册&lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/form&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { ref } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const inputUserName = ref&lt;​HTMLInputElement&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const inputPassword = ref&lt;​HTMLInputElement&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const inputConfirmPassword = ref&lt;​HTMLInputElement&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const onSubmit = (e: Event) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.preventDefault();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const formData = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   userName: inputUserName?.value?.value,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   password: inputPassword?.value?.value,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   confirmPassword: inputConfirmPassword?.value?.value</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> window.alert(\`提交数据：\${JSON.stringify(formData)}\`);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>然后再用 Vue.js 3.x 基于受控表单组件概念，实现一个注册表单：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​h1&gt;这是一个受控表单组件&lt;​/h1&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​form @submit=&quot;onSubmit&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span&gt;用户名称：&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​input v-model=&quot;state.userName&quot; type=&quot;text&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span&gt;密码：&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​input v-model=&quot;state.password&quot; type=&quot;password&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span&gt;确认密码：&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​input v-model=&quot;state.confirmPassword&quot; type=&quot;password&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​button&gt;提交注册&lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/form&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { reactive, toRaw } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const state = reactive({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> userName: &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> password: &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> confirmPassword: &#39;&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const onSubmit = (e: Event) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.preventDefault();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const formData = toRaw(state);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> window.alert(\`提交数据：\${JSON.stringify(formData)}\`);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>以上就是“非受控表单组件”和“受控表单组件”这两种表单组件的 Vue.js 3.x 代码实现方式，我们简单对比一下代码实现的复杂度和代码量：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/1.png" alt=""></a></p><p>如果我们在 Vue.js 3.x 环境里，再加上“数据监听”和“数据校验”这两个功能维度，会是怎样呢？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/2.png" alt=""></a></p><p>实现同样的注册表单的功能代码，受控表单组件的实现方式，明显比非受控表单组件更简单，而且更加方便数据字段的扩展。所以一般在开发组件库里的表单组件时，我们都基于“受控组件”的技术理念来开发“受控表单组件”。</p><p>但是，开发组件库的表单组件，使用“受控组件”的概念是远远不够的，组件库，一个很重要的优势是复用性，实际工作开发需求时，表单的功能需求是多种多样的。</p><p>举个例子，注册表单需要账号密码，输入框的表单要实现字段布局、数据定义和数据校验的操作，如果再加上一个协议同意的选择框，是不是表单布局需要改一下？表单校验函数也需要改一下？以此类推，每添加一个表单字段内容，都需要重复做一堆开发琐碎工作。</p><p>所以想要开发组件库里的表单组件，我们需要将“重复工作”抽象成组件库里的组件，提升表单开发的复用性和易用性，也就是要抽象表单通用逻辑，封装成统一受控的表单组件。那么，如何封装 Vue.js 3.x 的受控表单组件呢？</p><h2 id="怎么封装-vue-js3-x-的受控表单组件" tabindex="-1">怎么封装 Vue.js3.x 的受控表单组件？ <a class="header-anchor" href="#怎么封装-vue-js3-x-的受控表单组件" aria-label="Permalink to &quot;怎么封装 Vue.js3.x 的受控表单组件？&quot;">​</a></h2><p>首先，我们要明白，传统表单是由一个个数据字段组成的，承载这些数据的显示和输入的是HTML 里的 &lt;​input&gt;、&lt;​select&gt; 和 &lt;​option&gt; 等元素。</p><p>这些元素，在组件库里承载表单字段里数据操作，通常有很多种称呼，例如“表单数据组件”“数据输入组件”“数据录入组件”，为了避免歧义，表单里类似 &lt;​input&gt;、&lt;​select&gt; 等承载表单数据功能的组件，我们就统一称为“表单数据组件”。同时，承载表单提交的能力的组件，比如HTML 里 &lt;​form&gt; 标签类似功能组件，我们就称为“表单组件”。</p><p>统一好组件库里各类组件的称呼，接下来，我们就开始分析如何封装 Vue.js 3.x 的受控表单组件，主要为三步。</p><p>第一步，梳理出表单操作中可复用的逻辑。表单操作可以复用的逻辑是什么呢？</p><p>我们先来看看表单的主要操作，“数据显示”“数据输入”“数据校验”和“数据提交”这四个操作逻辑。</p><p>数据显示和输入，不同表单数据组件的操作会有差异。比如，&lt;​input&gt; 是输入内容，类似“填空题”，&lt;​select&gt; 是选择数据内容，类似“选择题”。这相当于两种不同类型“题目”，它们的“答题卷”都是分开的，无法统一。但，我们可以从这两种操作中抽象出一个共性，定义数据的字段名称，也就是在表单数据里定义这个数据的名称。</p><p>因此，这里我们就梳理出了第一个可复用逻辑，数据字段名称。</p><p>接下来是表单里的“数据校验”操作逻辑。数据校验的核心就是数据在“改变”和“提交”这两个时间点做处理，不受不同类型表单数据组件的用户使用方式差异的影响。那么我们可以再抽象出一个复用逻辑，就是数据校验。</p><p>小结一下，表单场景里，我们可以复用的逻辑是“数据字段名称”和“数据校验”，那接下来就要实现这个逻辑复用的实际功能组件了。</p><p>第二步，把可以复用的逻辑功能封装成通用表单逻辑功能组件。“数据字段名称”和“数据校验”操作，都是跟着作用于每个表单里的“数据字段”的。通常在英文语境里，我们称呼这个表单的数据字段为“Field”，在此我们就统一用中文描述为“表单字段”。</p><p>现在要做什么就清晰了，我们要实现一个通用的“表单字段组件”，来统一管理“表单数据组件”里的“字段名称”和“数据校验”，同时也要“辅助”支持“表单组件”提交数据时候做统一的数据字段收集和统一的提交前校验，这个“辅助操作”我们后面再详讲。</p><p>第三步，也就是实现代码的阶段。我们先画图设计一下实现流程，“表单字段组件”其实就是“表单数据组件”和“表单组件”之间的“桥梁”：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/3.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/3.jpeg" alt=""></a></p><p>那我们再进一步细化“表单字段组件”发挥的具体的桥梁作用：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/4.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/4.jpeg" alt=""></a></p><p>表单字段组件，给表单数据组件传递“字段名称”和“字段校验规则”，给表单组件也是传递“字段名称”和“字段校验规则”。</p><p>通过两张图，我们可以总结出一个实现代码的要素，需要一个“上下文”来给整个表单共享“字段名称”和“字段校验规则”的内容，而“表单字段组件”只是作为一个入口，在使用时帮忙把“字段名称”和“字段校验规则”注册到这个共享内容的“上下文”里。</p><p>那么，要在 Vue.js 3.x 里实现跨组件的数据共享，有哪些方式呢？</p><p>还记得前面我们讲过的内容不？在 Vue.js 3.x 里实现跨组件的数据共享，有 Props 结合 Emits组件间数据通信、有用共享响应式数据文件方式，还有引入 Pinia 这个数据状态管理库等多种方式，但是实现起来太麻烦了。</p><p>我这里选择了 Vue.js 3.x 的新特性， provide 和 inject。我们可以在父级组件用 provide 定义一个“共享数据”及其名称，在子组件里用 inject，通过这个数据名称拿到这个父级组件的“共享数据”。如果这个“共享数据”是“响应式数据”类型，我们在子组件里修改这个“共享数据”就可以触发响应式特性，影响到父组件和其他子组件的操作。反之，如果“共享数据”是“普通变量数据”，子组件里是无法修改影响父组件的。</p><p>好，我们现在就来实现具体的代码。</p><p>先定义各种数据类型：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 表单组件</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例的数据类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface FormInstance {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> addField(field:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> FormItemContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): void;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 表单字段组件</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例的数据类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface FormItemInstance {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> validateField</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">​ValidateResul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">t</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 表单字段组件</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 内置数据类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface FormItemContext extends FormItemInstance {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> label?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> name?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> rule?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ValidateRule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 表单组件</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 共享数据类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface FormContext extends FormInstance {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> model?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   [key: string]</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> formInstance?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> FormInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 校验结果数据类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface ValidateResult {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> hasError:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> name?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> value?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> message?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 校验规则数据类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface ValidateRule {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 字段校验方法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> validator?:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (value: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ValidateResult </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​ValidateResult&gt;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>然后实现表单组件的代码，也是父级组件，用 provide 提供了一个“共享数据”：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​form :class=&quot;{ [className]: true }&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​slot /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/form&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script lang=&quot;ts&quot; setup&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { reactive, provide } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { FORM_CONTEXT_KEY } from &#39;./common&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import type { FormInstance, FormContext, FormItemContext } from &#39;./types&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const className = \`\${prefixName}-form\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const props = defineProps&lt;{ model?: FormContext[&#39;model&#39;] }&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const fieldList: FormItemContext[] = [];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const addField = (field: FormItemContext) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fieldList.push(field);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 共享数据 (共享上下文)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const formContext = reactive&lt;​FormContext&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> model: props.model,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> addField</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">provide&lt;​FormContext&gt;(FORM_CONTEXT_KEY, formContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">defineExpose&lt;​FormInstance&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> addField</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>现在我们再来实现“表单字段组件”：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Row</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;{ [baseClassName]: true }&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Row</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;labelClassName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Col</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :span</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;labelCol&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​span&gt;{​{ props.label }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Col</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​Col :span=&quot;wrapperCol&quot;&gt;&lt;​slot /&gt;&lt;​/Col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Row</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Row</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;wrapperClassName&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> v-if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;props.name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​Col :span=&quot;labelCol&quot;&gt;&lt;​/Col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Col</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :span</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;wrapperCol&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​span v-if=&quot;errorTip&quot; :style=&quot;{ fontSize: 12, color: &#39;red&#39; }&quot;&gt;{​{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         errorTip</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Col</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Row</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Row</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script lang=&quot;ts&quot; setup&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { inject, onMounted, ref, toRaw, watch } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import Col from &#39;../col&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import Row from &#39;../row&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { FORM_CONTEXT_KEY } from &#39;./common&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import type {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> FormItemInstance,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> FormContext,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ValidateRule,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ValidateResult</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} from &#39;./types&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const labelCol = 8;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const wrapperCol = 16;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const baseClassName = \`\${prefixName}-form-item\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const labelClassName = \`\${baseClassName}-label\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const wrapperClassName = \`\${baseClassName}-wrapper\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const errorTip = ref&lt;​string&gt;(&#39;&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const formContext: FormContext | undefined =</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> inject&lt;​FormContext&gt;(FORM_CONTEXT_KEY);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const props = defineProps&lt;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name?: string;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> label?: string;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rule?: ValidateRule;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">async function validateFieldValue(val: unknown): Promise&lt;​ValidateResult&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (props.rule?.validator) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   const result = await props.rule?.validator?.(val);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   if (result.hasError </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> result.message) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     errorTip.value = result.message;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     errorTip.value = &#39;&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   return { ...result, ...{ name: props.name, value: toRaw(val) } };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   hasError: false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">async function validateField(): Promise&lt;​ValidateResult&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (props.rule?.validator </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> props.name) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   const result = await validateFieldValue(formContext?.model?.[props?.name]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   if (result.hasError </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> result.message) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     errorTip.value = result.message;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     errorTip.value;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   return result;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   hasError: false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">onMounted(() =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (formContext?.model </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> props.name </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> formContext?.model?.[props?.name]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   formContext?.addField({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     name: props.name,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     rule: props.rule,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     validateField</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   watch([() =&gt; formContext?.model?.[props.name as string]], ([newValue]) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     validateFieldValue(newValue);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">defineExpose&lt;​FormItemInstance&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> validateField</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>可以看出，这个表单字段组件，作为表单里子组件的身份使用时，将“字段名称”和“字段校验规则”存入统一上下文的“共享数据” （formContext）。</p><p>表单字段组件里，能根据字段名称，从共享数据里拿到当前管理的“字段数据”，就是包裹在表单数据组件里的数据。拿到这个字段数据和字段数据校验规则，我们可以在表单字段组件内部，监听这个数据变化，实现实时校验和提醒用户是否数据填写正确。</p><p>现在我们实现一个表单字段校验功能效果：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​div class=&quot;example&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Form</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;formRef&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;model&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">FormItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> label</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;数据1(数字校验)&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data1&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :rule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;rule1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​input v-model=&quot;model.data1&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">FormItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">FormItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> label</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;数据2(字母校验)&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data2&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> :rule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;rule2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​input v-model=&quot;model.data2&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">FormItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Form</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { ref, reactive } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { Form } from &#39;../src&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { FormInstance } from &#39;../src&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const { FormItem } = Form;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const formRef = ref&lt;​FormInstance&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const model = reactive&lt;{ data1: string; data2: string }&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data1: &#39;123&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data2: &#39;abc&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const rule1 = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> validator: (val: string) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   const hasError = /^[0-9]{1,}$/gi.test(\`\${val || &#39;&#39;}\`) !== true;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     hasError,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     message: hasError ? &#39;仅支持0-9的数字&#39; : &#39;&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const rule2 = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> validator: (val: string) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   const hasError = /^[a-z]{1,}$/gi.test(\`\${val || &#39;&#39;}\`) !== true;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     hasError,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     message: hasError ? &#39;仅支持a-z的大小写字母&#39; : &#39;&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>代码是用表单组件、表单字段组件集合表单数据组件（原生 HTML 的 &lt;​input&gt; 标签）实现的一个表单的实时数据校验，最终实现效果如动图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/12/5.png" alt=""></a></p><p>好了，我们已经用表单组件里通用的“表单字段组件”，来管理每个“表单数据组件”，也就是实现了“桥梁”的一端，接下来就是要连接“桥梁”的另一端，也就是“表单组件”的提交数据的统一校验。</p><h2 id="如何给封装的受控表单组件做统一提交校验" tabindex="-1">如何给封装的受控表单组件做统一提交校验？ <a class="header-anchor" href="#如何给封装的受控表单组件做统一提交校验" aria-label="Permalink to &quot;如何给封装的受控表单组件做统一提交校验？&quot;">​</a></h2><p>在 HTML 里，原生的表单标签 &lt;​form&gt; 是支持统一的 submit 事件的。我们现在要做的是，拦截这个表单事件，在提交数据前，从“共享数据”里拿到校验规则和所有数据来做数据校验，校验不通过就阻断表单提交。</p><p>具体代码如下：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​form :class=&quot;{ [className]: true }&quot; @submit=&quot;handleSubmit&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​slot /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/form&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script lang=&quot;ts&quot; setup&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { reactive, provide, toRaw } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { FORM_CONTEXT_KEY } from &#39;./common&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import type { FormInstance, FormContext, FormItemContext } from &#39;./types&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const className = \`\${prefixName}-form\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const props = defineProps&lt;{ model?: FormContext[&#39;model&#39;] }&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const fieldList: FormItemContext[] = [];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const addField = (field: FormItemContext) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fieldList.push(field);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const resetFields = () =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fieldList.forEach((field) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   field?.resetField();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const formContext = reactive&lt;​FormContext&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> model: props.model,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> addField,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> resetFields</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">provide&lt;​FormContext&gt;(FORM_CONTEXT_KEY, formContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">defineExpose&lt;​FormInstance&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> addField,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> resetFields</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const emits = defineEmits&lt;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (event: &#39;submit&#39;, e: Event): void;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (event: &#39;finish&#39;, e: unknown): void;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (event: &#39;finishFail&#39;, e: unknown): void;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const validateFields = async () =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const errorList = [];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> for (let i = 0; i &lt; fieldList.length; i++) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   const field = fieldList[i];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   const result = await field?.validateField();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   if (result?.hasError) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     errorList.push(result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> return errorList;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 统一处理表单提交</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const handleSubmit = (e: Event) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.stopPropagation();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.preventDefault();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> emits(&#39;submit&#39;, e);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (props.model) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   // 表单提交前 处理所有字段校验</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   validateFields()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     .then((errorList) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       if (errorList.length &gt; 0) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         emits(&#39;finishFail&#39;, errorList);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         emits(&#39;finish&#39;, toRaw(props.model));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     .catch((e) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       emits(&#39;finishFail&#39;, e);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>好了，至此我们就实现了一个完整的“受控表单组件”的基本组件内容，更多详细的代码实现细节，你可以查看完整代码案例。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课我们主要学习了如何在 Vue.js 自研组件库场景下实现“受控表单组件”，有两个掌握重点。</p><p>第一个重点“什么是受控组件和非受控组件”，我们了解了“受控组件”的技术概念，同时如何在Vue.js 3.x 的框架环境，实现它描述的“受控”能力。</p><p>当然，你也要知道，这个技术概念并不是 React.js 或者 Vue.js 专有的，任何 Web 框架，只要能以统一的“数据状态”来代替 HTML 原生能力管理表单，就可以算是“受控组件”概念的技术实现。</p><p>第二个重点“如何抽象表单组件的复用逻辑”。这里你会发现最终抽选出来的逻辑核心就是“表单数据校验”。没错，表单最复杂、最核心的一个逻辑就是“数据校验”，如果以后你遇到要实现表单场景的功能，我希望你把数据校验操作作为首要的技术考虑点。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>表单组件除了劫持代理“submit”事件，还有其它的方式来管理表单提交数据的操作吗？</p><p>欢迎你留言参与讨论，如果有疑问也欢迎评论，下一讲见。</p><p>完整的代码在这里</p>`,74)])])}const o=i(t,[["render",p]]);export{d as __pageData,o as default};
