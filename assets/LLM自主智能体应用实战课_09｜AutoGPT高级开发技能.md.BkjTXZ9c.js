import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"09｜AutoGPT高级开发技能","description":"","frontmatter":{},"headers":[{"level":2,"title":"Block 高级开发技术","slug":"block-高级开发技术","link":"#block-高级开发技术","children":[{"level":3,"title":"Block 的错误处理","slug":"block-的错误处理","link":"#block-的错误处理","children":[]},{"level":3,"title":"带身份认证的 Block","slug":"带身份认证的-block","link":"#带身份认证的-block","children":[]},{"level":3,"title":"Block 的验收测试","slug":"block-的验收测试","link":"#block-的验收测试","children":[]},{"level":3,"title":"使用 Webhook（网络钩子）触发 Block","slug":"使用-webhook-网络钩子-触发-block","link":"#使用-webhook-网络钩子-触发-block","children":[]}]},{"level":2,"title":"Agent 市场简介","slug":"agent-市场简介","link":"#agent-市场简介","children":[]},{"level":2,"title":"Agent Protocol 简介","slug":"agent-protocol-简介","link":"#agent-protocol-简介","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"LLM自主智能体应用实战课/09｜AutoGPT高级开发技能.md","filePath":"LLM自主智能体应用实战课/09｜AutoGPT高级开发技能.md","lastUpdated":1779815961000}'),l={name:"LLM自主智能体应用实战课/09｜AutoGPT高级开发技能.md"};function t(i,s,o,c,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_09-autogpt高级开发技能" tabindex="-1">09｜AutoGPT高级开发技能 <a class="header-anchor" href="#_09-autogpt高级开发技能" aria-label="Permalink to &quot;09｜AutoGPT高级开发技能&quot;">​</a></h1><p>你好，我是李锟。</p><p>在前面课程中我们了解到，AutoGPT 的新版本 AutoGPT Platform 的体系架构比 MetaGPT 更为复杂，这也是我需要 4 节课的篇幅讲解 AutoGPT 的原因。在这节课中，我们以前面三课学习到的知识为基础，继续学习 AutoGPT Platform 的一些高级开发技能。</p><h2 id="block-高级开发技术" tabindex="-1">Block 高级开发技术 <a class="header-anchor" href="#block-高级开发技术" aria-label="Permalink to &quot;Block 高级开发技术&quot;">​</a></h2><p>在上节课中，我们仅仅使用最基础的 Block 开发技术，实现了 24 点游戏智能体应用中的几个自定义 Block。在所有 AutoGPT Platform 官方教程中，最为详尽的就是关于 Block 开发的教程： <a href="https://docs.agpt.co/platform/new_blocks" target="_blank" rel="noreferrer">Contributing to AutoGPT Agent Server: Creating and Testing Blocks</a>，这体现出 Block 在 AutoGPT Platform 中的核心地位。在这篇教程中，还有一些高级的 Block 开发技术，我有必要讲解一下。</p><p>这篇教程中说道：</p><blockquote><p>Block 是可重复使用的组件，它们可以连接起来，形成一个代表智能体行为的图。每个 Block 都有输入、输出和特定的功能。适当的测试对于确保 Block 正确一致地工作至关重要。</p></blockquote><p>在上节课中我们已经在实战层面看到了，可以把多个 Block 组装成 Agent，然后还可以把多个 Agent 和 Block 组装成更复杂的 Agent。就像 MetaGPT 中的那种团队组织一样，Agent 系统可以被划分成很多层，形成一个类似公司或者军队的分层组织架构。</p><p>需要介绍的 Block 高级开发技术是 Block 的错误处理。</p><h3 id="block-的错误处理" tabindex="-1">Block 的错误处理 <a class="header-anchor" href="#block-的错误处理" aria-label="Permalink to &quot;Block 的错误处理&quot;">​</a></h3><p>在 Block 中还需要处理一些异常情况（error handling，错误处理），以下是一个带有错误处理的 Block 的代码片段：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Output(BlockSchema):</span></span>
<span class="line"><span>    summary: str = SchemaField(</span></span>
<span class="line"><span>        description=&quot;summary&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    error: str = SchemaField(</span></span>
<span class="line"><span>        description=&quot;error&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def run(self, input_data: Input, **kwargs) -&amp;gt; BlockOutput:</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        topic = input_data.topic</span></span>
<span class="line"><span>        url = f&quot;https://en.wikipedia.org/api/rest_v1/page/summary/{topic}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        response = self.get_request(url, json=True)</span></span>
<span class="line"><span>        yield &quot;summary&quot;, response[&#39;extract&#39;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except requests.exceptions.HTTPError as http_err:</span></span>
<span class="line"><span>        raise RuntimeError(f&quot;HTTP error occurred: {http_err}&quot;)</span></span></code></pre></div><p>为了实现错误处理，首先需要在 Output 类中添加一个 error 属性。</p><p>在 run() 函数中需要处理 API 请求和数据处理过程中可能出现的各种异常。 我们不需要捕获所有异常，只需要捕获我们预期并能处理的异常。未捕获的异常将自动使用 yield 语句作为 error 输出。任何产生异常（或使用 yield 语句输出 error）的代码块都会被标记为失败。与使用 yield 语句输出 error 相比，教程的作者更倾向于引发异常，因为它会立即停止执行。</p><p>有些 Block 是需要确保安全性的，使用这样的 Block 需要做身份认证。</p><h3 id="带身份认证的-block" tabindex="-1">带身份认证的 Block <a class="header-anchor" href="#带身份认证的-block" aria-label="Permalink to &quot;带身份认证的 Block&quot;">​</a></h3><p>AutoGPT Platform 支持基于 API 密钥（API keys）和基于 OAuth2 授权流程（OAuth2 authorization flows）的身份认证。为 Block 添加 API 密钥身份认证，或者 OAuth2 身份认证都很容易。实现带身份认证的 Block 相当简单，你需要在 Input 模型和 run() 函数中各添加一个 credentials（凭据）参数。</p><p>如果使用基于 API 密钥的身份认证，Block 的样子是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># API Key auth:</span></span>
<span class="line"><span>class BlockWithAPIKeyAuth(Block):</span></span>
<span class="line"><span>    class Input(BlockSchema):</span></span>
<span class="line"><span>        # Note that the type hint below is require or you will get a type error.</span></span>
<span class="line"><span>        # The first argument is the provider name, the second is the credential type.</span></span>
<span class="line"><span>        credentials: CredentialsMetaInput[</span></span>
<span class="line"><span>            Literal[ProviderName.GITHUB], Literal[&quot;api_key&quot;]</span></span>
<span class="line"><span>        ] = CredentialsField(</span></span>
<span class="line"><span>            description=&quot;The GitHub integration can be used with &quot;</span></span>
<span class="line"><span>            &quot;any API key with sufficient permissions for the blocks it is used on.&quot;,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>    # ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def run(</span></span>
<span class="line"><span>        self,</span></span>
<span class="line"><span>        input_data: Input,</span></span>
<span class="line"><span>        *,</span></span>
<span class="line"><span>        credentials: APIKeyCredentials,</span></span>
<span class="line"><span>        **kwargs,</span></span>
<span class="line"><span>    ) -&amp;gt; BlockOutput:</span></span>
<span class="line"><span>        ...</span></span></code></pre></div><p>如果使用基于 OAuth2 的身份认证，Block 的样子是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># OAuth:</span></span>
<span class="line"><span>class BlockWithOAuth(Block):</span></span>
<span class="line"><span>    class Input(BlockSchema):</span></span>
<span class="line"><span>        # Note that the type hint below is require or you will get a type error.</span></span>
<span class="line"><span>        # The first argument is the provider name, the second is the credential type.</span></span>
<span class="line"><span>        credentials: CredentialsMetaInput[</span></span>
<span class="line"><span>            Literal[ProviderName.GITHUB], Literal[&quot;oauth2&quot;]</span></span>
<span class="line"><span>        ] = CredentialsField(</span></span>
<span class="line"><span>            required_scopes={&quot;repo&quot;},</span></span>
<span class="line"><span>            description=&quot;The GitHub integration can be used with OAuth.&quot;,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>    # ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def run(</span></span>
<span class="line"><span>        self,</span></span>
<span class="line"><span>        input_data: Input,</span></span>
<span class="line"><span>        *,</span></span>
<span class="line"><span>        credentials: OAuth2Credentials,</span></span>
<span class="line"><span>        **kwargs,</span></span>
<span class="line"><span>    ) -&amp;gt; BlockOutput:</span></span>
<span class="line"><span>        ...</span></span></code></pre></div><p>对于 GitHub 这样同时支持 API 密钥和 OAuth2 的网站，还可以混合使用 API 密钥和 OAuth2。Block 的样子是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># API Key auth + OAuth:</span></span>
<span class="line"><span>class BlockWithAPIKeyAndOAuth(Block):</span></span>
<span class="line"><span>    class Input(BlockSchema):</span></span>
<span class="line"><span>        # Note that the type hint below is require or you will get a type error.</span></span>
<span class="line"><span>        # The first argument is the provider name, the second is the credential type.</span></span>
<span class="line"><span>        credentials: CredentialsMetaInput[</span></span>
<span class="line"><span>            Literal[ProviderName.GITHUB], Literal[&quot;api_key&quot;, &quot;oauth2&quot;]</span></span>
<span class="line"><span>        ] = CredentialsField(</span></span>
<span class="line"><span>            required_scopes={&quot;repo&quot;},</span></span>
<span class="line"><span>            description=&quot;The GitHub integration can be used with OAuth, &quot;</span></span>
<span class="line"><span>            &quot;or any API key with sufficient permissions for the blocks it is used on.&quot;,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>    # ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def run(</span></span>
<span class="line"><span>        self,</span></span>
<span class="line"><span>        input_data: Input,</span></span>
<span class="line"><span>        *,</span></span>
<span class="line"><span>        credentials: Credentials,</span></span>
<span class="line"><span>        **kwargs,</span></span>
<span class="line"><span>    ) -&amp;gt; BlockOutput:</span></span>
<span class="line"><span>        ...</span></span></code></pre></div><p>从上面三个例子可以看出，与普通不带身份认证的 Block 相比，主要区别是两个地方：在 Input 类中添加一个 credentials 属性，在 run() 函数中同样也添加一个 credentials 参数。</p><p>在 run() 函数内，credentials 参数通常用在发送 HTTP 请求，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># credentials: APIKeyCredentials</span></span>
<span class="line"><span>response = requests.post(</span></span>
<span class="line"><span>    url,</span></span>
<span class="line"><span>    headers={</span></span>
<span class="line"><span>        &quot;Authorization&quot;: f&quot;Bearer {credentials.api_key.get_secret_value()})&quot;,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># credentials: OAuth2Credentials</span></span>
<span class="line"><span>response = requests.post(</span></span>
<span class="line"><span>    url,</span></span>
<span class="line"><span>    headers={</span></span>
<span class="line"><span>        &quot;Authorization&quot;: f&quot;Bearer {credentials.access_token.get_secret_value()})&quot;,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 或者使用以下缩写形式</span></span>
<span class="line"><span># credentials: APIKeyCredentials | OAuth2Credentials</span></span>
<span class="line"><span>response = requests.post(</span></span>
<span class="line"><span>    url,</span></span>
<span class="line"><span>    headers={&quot;Authorization&quot;: credentials.bearer()},</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>上面例子里使用的是 GitHub 的 API 密钥和 OAuth2 token，其实可以用相同的方法支持所有网站的 API 密钥和 OAuth2 token。区别是在 ProviderName 中为新网站创建一个新枚举值，取代这里使用的 ProviderName.GITHUB。</p><p>最后再展示一个使用基于 API 密钥的身份认证的完整 Block 的例子，即课程代码 <a href="https://gitee.com/mozilla88/autonomous_agent/blob/master/lesson_09/backend/blocks/customized/get_wikipedia_summary.py" target="_blank" rel="noreferrer">get_wikipedia_summary.py</a>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import requests</span></span>
<span class="line"><span>import urllib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from typing import Any, Optional, Literal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from backend.blocks.github._auth import TEST_CREDENTIALS_INPUT, TEST_CREDENTIALS</span></span>
<span class="line"><span>from backend.data.block import Block, BlockOutput, BlockSchema</span></span>
<span class="line"><span>from backend.data.model import (</span></span>
<span class="line"><span>    APIKeyCredentials,</span></span>
<span class="line"><span>    OAuth2Credentials,</span></span>
<span class="line"><span>    Credentials,</span></span>
<span class="line"><span>    SchemaField,</span></span>
<span class="line"><span>    CredentialsField,</span></span>
<span class="line"><span>    CredentialsMetaInput</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>from backend.integrations.providers import ProviderName</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyWikipediaSummaryBlock(Block):</span></span>
<span class="line"><span>    class Input(BlockSchema):</span></span>
<span class="line"><span>        topic: str = SchemaField(</span></span>
<span class="line"><span>            description=&quot;topic&quot;,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>        credentials: CredentialsMetaInput[</span></span>
<span class="line"><span>            Literal[ProviderName.GITHUB], Literal[&quot;api_key&quot;]</span></span>
<span class="line"><span>        ] = CredentialsField(</span></span>
<span class="line"><span>            description=&quot;The GitHub integration can be used with &quot;</span></span>
<span class="line"><span>            &quot;any API key with sufficient permissions for the blocks it is used on.&quot;,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class Output(BlockSchema):</span></span>
<span class="line"><span>        summary: str = SchemaField(</span></span>
<span class="line"><span>            description=&quot;summary&quot;</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>        error: str = SchemaField(</span></span>
<span class="line"><span>            description=&quot;error&quot;</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;classmethod</span></span>
<span class="line"><span>    def get_request(</span></span>
<span class="line"><span>        cls, url: str, headers: Optional[dict] = None, json: bool = False</span></span>
<span class="line"><span>    ) -&amp;gt; Any:</span></span>
<span class="line"><span>        if headers is None:</span></span>
<span class="line"><span>            headers = {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        response = requests.get(url, headers=headers)</span></span>
<span class="line"><span>        return response.json() if json else response.text</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __init__(self):</span></span>
<span class="line"><span>        super().__init__(</span></span>
<span class="line"><span>            # Unique ID for the block, used across users for templates</span></span>
<span class="line"><span>            # If you are an AI leave it as is or change to &quot;generate-proper-uuid&quot;</span></span>
<span class="line"><span>            id=&quot;b05aa1e2-2ebc-4a7d-b71c-07802d6642bc&quot;,</span></span>
<span class="line"><span>            input_schema=WikipediaSummaryBlock.Input,  # Assign input schema</span></span>
<span class="line"><span>            output_schema=WikipediaSummaryBlock.Output,  # Assign output schema</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            # Provide sample input, output and test mock for testing the block</span></span>
<span class="line"><span>            test_input={&quot;topic&quot;: &quot;Artificial Intelligence&quot;, &quot;credentials&quot;: TEST_CREDENTIALS_INPUT},</span></span>
<span class="line"><span>            test_output=(&quot;summary&quot;, &quot;summary content&quot;),</span></span>
<span class="line"><span>            test_mock={&quot;get_request&quot;: lambda url, json: {&quot;extract&quot;: &quot;summary content&quot;}​},</span></span>
<span class="line"><span>            test_credentials=TEST_CREDENTIALS,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def run(</span></span>
<span class="line"><span>        self,</span></span>
<span class="line"><span>        input_data: Input,</span></span>
<span class="line"><span>        *,</span></span>
<span class="line"><span>        credentials: APIKeyCredentials,</span></span>
<span class="line"><span>        **kwargs</span></span>
<span class="line"><span>    ) -&amp;gt; BlockOutput:</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            topic = input_data.topic</span></span>
<span class="line"><span>            topic = urllib.parse.quote(topic, safe=&#39;/&#39;, encoding=None, errors=None)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            url = f&quot;https://en.wikipedia.org/api/rest_v1/page/summary/{topic}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            response = self.get_request(url, json=True)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            yield &quot;summary&quot;, response[&#39;extract&#39;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except requests.exceptions.HTTPError as http_err:</span></span>
<span class="line"><span>            raise RuntimeError(f&quot;HTTP error occurred: {http_err}&quot;)</span></span></code></pre></div><p>基于 OAuth2 的身份认证比较复杂。为新的 OAuth2 验证服务添加支持，我们需要添加一个 OAuthHandler。教程中还给出了 GitHub、Google 两个网站 OAuthHandler 的详细例子，以及如何在 Frontend 添加对于新的 OAuthHandler 的 OAuth2 身份认证支持。</p><p>要开发强大的 AutoGPT 应用，依赖于稳定可靠的 Block。Block 是一切 AutoGPT 应用的基石，因此对于 Block 做充分的测试至关重要。</p><h3 id="block-的验收测试" tabindex="-1">Block 的验收测试 <a class="header-anchor" href="#block-的验收测试" aria-label="Permalink to &quot;Block 的验收测试&quot;">​</a></h3><p>Block 可以支持验收测试和 mock。在 Block 的 <strong>init</strong>() 函数内，有三个与验收测试有关的参数：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def __init__(self):</span></span>
<span class="line"><span>    super().__init__(</span></span>
<span class="line"><span>        # Unique ID for the block, used across users for templates</span></span>
<span class="line"><span>        # If you are an AI leave it as is or change to &quot;generate-proper-uuid&quot;</span></span>
<span class="line"><span>        id=&quot;xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&quot;,</span></span>
<span class="line"><span>        input_schema=WikipediaSummaryBlock.Input,  # Assign input schema</span></span>
<span class="line"><span>        output_schema=WikipediaSummaryBlock.Output,  # Assign output schema</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # Provide sample input, output and test mock for testing the block</span></span>
<span class="line"><span>        test_input={&quot;topic&quot;: &quot;Artificial Intelligence&quot;},</span></span>
<span class="line"><span>        test_output=(&quot;summary&quot;, &quot;summary content&quot;),</span></span>
<span class="line"><span>        test_mock={&quot;get_request&quot;: lambda url, json: {&quot;extract&quot;: &quot;summary content&quot;}​},</span></span>
<span class="line"><span>    )</span></span></code></pre></div><p>这三个参数的作用分别是什么呢？</p><ul><li>test_input 是用于测试 Block 的输入示例。它应该是一个符合 Input 类的定义格式的有效输入。</li><li>test_output 是使用 test_input 运行 Block 时的预期输出。它应该与 Output 类的定义格式相匹配。对于非确定性输出或只想对输出类型做断言时，可以使用 Python 类型而不是特定值。在这个例子中，(“summary”, str) 断言输出对象中键为 “summary” 的属性，其值为字符串类型。</li><li>test_mock 对需要进行网络调用的 Block 至关重要。它提供了一个 mock 函数，可以在测试过程中替代实际的网络调用。</li></ul><p>除了这三个参数，我们在前面展示过的 WikipediaSummaryBlock 例子中还看到了一个 test_credentials 参数。这个参数仅用于带身份认证的 Block，如果 Block 不带身份认证，就没有这个参数。</p><p>在上述代码中，我们模拟 get_request 函数，使其始终返回一个带有 “extract” 键的字典，模拟成功的 API 响应。这样，我们就可以在不进行实际网络请求的情况下测试程序块的逻辑，因为实际网络请求可能很慢、不可靠或有速率限制。</p><p>那么如何来执行针对 Block 的验收测试呢？AutoGPT Server (backend) 中提供一个 test_block.py，执行方法如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ~/work/AutoGPT/autogpt_platform/backend</span></span>
<span class="line"><span>poetry run pytest -s test/block/test_block.py</span></span></code></pre></div><p>然而 test_block.py 每次执行时都会跑完所有 Block 的验收测试。如果我们仅仅想针对单个 Block 做验收测试就不大方便了。为此我另外写了一个测试脚本 test_single_block.py，首先需要为这个测试脚本创建一个子目录：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ~/work/AutoGPT/autogpt_platform/backend</span></span>
<span class="line"><span>mkdir test/block/customized</span></span></code></pre></div><p>将 test_single_block.py 保存在刚才创建的 test/block/customized 子目录下，其内容如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from typing import Type</span></span>
<span class="line"><span>import pytest</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from backend.data.block import Block, get_blocks</span></span>
<span class="line"><span>from backend.util.test import execute_block_test</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_available_blocks(block: str):</span></span>
<span class="line"><span>    block_list = get_blocks().values()</span></span>
<span class="line"><span>    for block_class in block_list:</span></span>
<span class="line"><span>        if block_class.__name__ == block:</span></span>
<span class="line"><span>            execute_block_test(block_class())</span></span></code></pre></div><p>另外还需要在 test/block/customized 子目录下创建一个 pytest 的配置脚本 conftest.py。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def pytest_addoption(parser):</span></span>
<span class="line"><span>   parser.addoption(&quot;--block&quot;, action=&quot;append&quot;, help=&quot;block class name&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def pytest_generate_tests(metafunc):</span></span>
<span class="line"><span>   if &quot;block&quot; in metafunc.fixturenames:</span></span>
<span class="line"><span>       metafunc.parametrize(&quot;block&quot;,metafunc.config.getoption(&quot;block&quot;))</span></span></code></pre></div><p>然后就可以对单个 Block 做验收测试了，例如：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>poetry run pytest -s test/block/customized/test_single_block.py --block SearchTheWebBlock</span></span>
<span class="line"><span>poetry run pytest -s test/block/customized/test_single_block.py --block WikipediaSummaryBlock</span></span></code></pre></div><p>这里的 --block 参数是要做验收测试的 Block 的类名。</p><p>针对每个 Block 的测试过程，处理步骤如下：</p><ul><li><p>使用提供的 test_input 调用 Block。</p></li><li><p>如果程序块有 credentials（凭据）字段，则也会传入 test_credentials。</p></li><li><p>如果提供了 test_mock，它就会用 mock 函数临时替换指定的函数。然后，它会断言输出与 test_output 相匹配。</p></li></ul><p>对于前面展示过的 WikipediaSummaryBlock 例子：</p><ul><li><p>测试将调用 topic 设置为 “Artificial Intelligence” 的 Block。</p></li><li><p>它不会调用真正的 API，而是使用 mock 函数，返回 {“extract”，“summary content”}。</p></li><li><p>然后，它会检查输出的键是否为 “summary”，其值是否为字符串。</p></li></ul><p>使用这种方法，使我们能够在不依赖外部服务的情况下全面测试 Block 的逻辑，同时还能适应非确定性输出。</p><p>最后总结一下高效测试 Block 的一些技巧：</p><ol><li><p>提供现实的 test_input： 确保你的测试输入涵盖典型用例。</p></li><li><p>定义适当的 test_output：</p><ul><li><p>对于确定性输出，使用特定的预期值。</p></li><li><p>对于非确定性输出或仅类型重要时，使用 Python 类型（如 str、int、dict）。</p></li><li><p>可以混合使用特定值和类型，如（“key1”, str）、（“key2”, 42）。</p></li></ul></li><li><p>使用 test_mock 进行网络调用：这样可以防止测试因网络问题或 API 更改而失败。</p></li><li><p>对于没有外部依赖的 Block，可以考虑省略 test_mock：如果你的代码块不进行网络调用或使用外部资源，你可能不需要 mock。</p></li><li><p>考虑边缘情况：在 run() 函数中包含针对潜在错误条件的测试。</p></li><li><p>在更改 Block 行为时更新测试：如果你修改了 Block，请确保相应地更新测试。</p></li></ol><h3 id="使用-webhook-网络钩子-触发-block" tabindex="-1">使用 Webhook（网络钩子）触发 Block <a class="header-anchor" href="#使用-webhook-网络钩子-触发-block" aria-label="Permalink to &quot;使用 Webhook（网络钩子）触发 Block&quot;">​</a></h3><p>除了可以使用手工方式启动智能体应用（包括构成智能体应用的 Block）外，还可以通过网络钩子来触发 Block，这允许智能体应用实时响应各种外部事件。这些 Block 由第三方服务传入的网络钩子触发，而不是手动执行。</p><p>创建和运行网络钩子触发的 Block，涉及到三个主要部分：</p><ul><li><p>在 Block 中需要指定供用户选择要订阅的资源和事件的输入 、带有管理网络钩子所需范围的 credentials 输入、必要的逻辑实现，将网络钩子的有效载荷转化为其所触发的 Block 的输出。</p></li><li><p>对应网络钩子服务提供商的 WebhooksManager，用于处理向提供商注册 (或取消注册) 网络钩子、解析和验证传入的网络钩子的有效载荷。</p></li><li><p>对应服务提供商的凭据系统，可能还包括相关的 OAuthHandler。</p></li></ul><p>关于使用网络钩子触发 Block，教程中给出了一个详细的例子： <a href="https://docs.agpt.co/platform/new_blocks/" target="_blank" rel="noreferrer">GitHub Webhook Integration</a>。网络钩子触发的 Block，在引擎盖下还有更多工作要做，目前尚未全部完成。我在这里只做简要介绍，想要了解详情，你可以自己阅读一下官方教程。最后，教程中还介绍了一些预防 SSRF 的安全最佳实践，在需要确保安全性的生产环境，这部分也是必不可少的。</p><h2 id="agent-市场简介" tabindex="-1">Agent 市场简介 <a class="header-anchor" href="#agent-市场简介" aria-label="Permalink to &quot;Agent 市场简介&quot;">​</a></h2><p>2023 年 3 月横空出世的 AutoGPT 老版本（现在称作 AutoGPT Classic）的设计基本上是依靠单 Agent 来搞定一切问题，这条路走了一年时间后彻底走到了头。</p><p>MetaGPT 等等支持多 Agent 协作的开发框架迅速崛起，显示出更强的处理能力、更大的灵活性。于是 Toran Bruce Richards 在 2024 年上半年末尾下决心另起炉灶，设计开发新版本的 AutoGPT，后来被称作 AutoGPT Platform。AutoGPT Platform 全面拥抱了业界广泛采用的多 Agent 协作 + Role Playing 的范式。Toran 在一篇 blog 中说过，开发一个丰富健壮的 Agent 生态系统才是智能体应用的未来，比开发超级强大的单个 Agent 要重要得多。</p><p>因此 AutoGPT Platform 致力于促进此类 Agent 生态系统的繁荣发展，AutoGPT 团队为此专门建立了一个 Agent 市场（Agent Marketplace）。开发者不仅可以开发 Agent 来满足自己的需求，还可以将自己开发的 Agent 上传到 Agent 市场进行销售或者免费分享。</p><p>这个 Agent 市场部署在云端，属于由 AutoGPT 团队运营的商业版 AutoGPT Platform 的一部分，你可以点击 <a href="https://platform.agpt.co/store" target="_blank" rel="noreferrer">链接</a> 查看地址。外部开发者如果希望成为商业版 AutoGPT Platform 以及 Agent 市场的早期用户，可以加入 <a href="https://agpt.co/waitlist" target="_blank" rel="noreferrer">AutoGPT 团队的 Waitlist</a>。</p><p>通过源代码本地部署的 AutoGPT Platform 暂时还没有包括 Agent 市场。不过 AutoGPT 团队的计划是在未来打通云端 AutoGPT Platform 和本地部署的 AutoGPT Platform，让本地部署的 AutoGPT Platform 也能够访问云端 AutoGPT Platform 的 Agent 市场，下载或上传 Agent。这个方向非常值得期待，估计在不远的将来就会实现。</p><h2 id="agent-protocol-简介" tabindex="-1">Agent Protocol 简介 <a class="header-anchor" href="#agent-protocol-简介" aria-label="Permalink to &quot;Agent Protocol 简介&quot;">​</a></h2><p>为了保持统一的标准并确保与许多当前和未来的应用程序无缝兼容，AutoGPT 采用了人工智能工程师基金会（AI Engineer Foundation）制定的智能体协议（ <a href="https://agentprotocol.ai/" target="_blank" rel="noreferrer">agent protocol</a>）标准。 这个标准规范了从智能体应用（例如 AutoGPT Server）到其前端（例如 AutoGPT Frontend）的通信路径，以及对智能体应用如何做基准测试（benchmark test）。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>AutoGPT Platform 正在高速开发的过程中，每周都会有新的变化。体验到 AutoGPT Platform 创新的设计思想和快速的进步，我感觉背后有一股力量在推动自己前进。作为第一位将 AutoGPT Platform 系统介绍给中国开发者的人，我感到很荣幸，同时也感到有很大责任。我会持续跟踪 AutoGPT Platform 的发展过程，及时更新我们的课程，将最新的变化及时反映到课程中。</p><p>在这节课中，我首先介绍了一些 Block 高级开发技术。Block 高级开发技术我重点介绍了 Block 的错误处理、带身份认证的 Block 和 Block 的验收测试，简单介绍了使用网络钩子触发 Block。然后介绍了基于 AutoGPT Platform 的 Agent 市场。最后我简要提及了一个未来可能会很重要的智能体应用行业标准 Agent Protocol。</p><p>通过这 4 节课的学习，你应该可以很好地掌握了 AutoGPT Platform 的开发技术。这 4 节课的学习过程不是很轻松，下节课我们放松一下，学习一个小巧精致但很实用的开发框架 Swarm。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你基于已经学习到的知识，使用 AutoGPT Platform 实现一个自己的智能体应用。欢迎你把你的代码分享到留言区，我们一起交流讨论，如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给需要的朋友，我们下节课再见！</p>`,75)])])}const h=n(l,[["render",t]]);export{k as __pageData,h as default};
