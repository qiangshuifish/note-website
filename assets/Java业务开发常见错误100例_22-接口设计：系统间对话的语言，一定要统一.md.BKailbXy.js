import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"22 | 接口设计：系统间对话的语言，一定要统一","description":"","frontmatter":{},"headers":[{"level":2,"title":"接口的响应要明确表示接口的处理结果","slug":"接口的响应要明确表示接口的处理结果","link":"#接口的响应要明确表示接口的处理结果","children":[]},{"level":2,"title":"要考虑接口变迁的版本控制策略","slug":"要考虑接口变迁的版本控制策略","link":"#要考虑接口变迁的版本控制策略","children":[]},{"level":2,"title":"接口处理方式要明确同步还是异步","slug":"接口处理方式要明确同步还是异步","link":"#接口处理方式要明确同步还是异步","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/22-接口设计：系统间对话的语言，一定要统一.md","filePath":"Java业务开发常见错误100例/22-接口设计：系统间对话的语言，一定要统一.md","lastUpdated":1779815815000}'),l={name:"Java业务开发常见错误100例/22-接口设计：系统间对话的语言，一定要统一.md"};function t(i,s,o,c,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_22-接口设计-系统间对话的语言-一定要统一" tabindex="-1">22 | 接口设计：系统间对话的语言，一定要统一 <a class="header-anchor" href="#_22-接口设计-系统间对话的语言-一定要统一" aria-label="Permalink to &quot;22 | 接口设计：系统间对话的语言，一定要统一&quot;">​</a></h1><p>你好，我是朱晔。今天，我要和你分享的主题是，在做接口设计时一定要确保系统之间对话的语言是统一的。</p><p>我们知道，开发一个服务的第一步就是设计接口。接口的设计需要考虑的点非常多，比如接口的命名、参数列表、包装结构体、接口粒度、版本策略、幂等性实现、同步异步处理方式等。</p><p>这其中，和接口设计相关比较重要的点有三个，分别是包装结构体、版本策略、同步异步处理方式。今天，我就通过我遇到的实际案例，和你一起看看因为接口设计思路和调用方理解不一致所导致的问题，以及相关的实践经验。</p><h2 id="接口的响应要明确表示接口的处理结果" tabindex="-1">接口的响应要明确表示接口的处理结果 <a class="header-anchor" href="#接口的响应要明确表示接口的处理结果" aria-label="Permalink to &quot;接口的响应要明确表示接口的处理结果&quot;">​</a></h2><p>我曾遇到过一个处理收单的收单中心项目，下单接口返回的响应体中，包含了success、code、info、message等属性，以及二级嵌套对象data结构体。在对项目进行重构的时候，我们发现真的是无从入手，接口缺少文档，代码一有改动就出错。</p><p>有时候，下单操作的响应结果是这样的：success是true、message是OK，貌似代表下单成功了；但info里却提示订单存在风险，code是一个5001的错误码，data中能看到订单状态是Cancelled，订单ID是-1，好像又说明没有下单成功。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>	&quot;success&quot;: true,</span></span>
<span class="line"><span>	&quot;code&quot;: 5001,</span></span>
<span class="line"><span>	&quot;info&quot;: &quot;Risk order detected&quot;,</span></span>
<span class="line"><span>	&quot;message&quot;: &quot;OK&quot;,</span></span>
<span class="line"><span>	&quot;data&quot;: {</span></span>
<span class="line"><span>		&quot;orderStatus&quot;: &quot;Cancelled&quot;,</span></span>
<span class="line"><span>		&quot;orderId&quot;: -1</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有些时候，这个下单接口又会返回这样的结果：success是false，message提示非法用户ID，看上去下单失败；但data里的orderStatus是Created、info是空、code是0。那么，这次下单到底是成功还是失败呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>	&quot;success&quot;: false,</span></span>
<span class="line"><span>	&quot;code&quot;: 0,</span></span>
<span class="line"><span>	&quot;info&quot;: &quot;&quot;,</span></span>
<span class="line"><span>	&quot;message&quot;: &quot;Illegal userId&quot;,</span></span>
<span class="line"><span>	&quot;data&quot;: {</span></span>
<span class="line"><span>		&quot;orderStatus&quot;: &quot;Created&quot;,</span></span>
<span class="line"><span>		&quot;orderId&quot;: 0</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样的结果，让我们非常疑惑：</p><ul><li>结构体的code和HTTP响应状态码，是什么关系？</li><li>success到底代表下单成功还是失败？</li><li>info和message的区别是什么？</li><li>data中永远都有数据吗？什么时候应该去查询data？</li></ul><p>造成如此混乱的原因是：这个收单服务本身并不真正处理下单操作，只是做一些预校验和预处理；真正的下单操作，需要在收单服务内部调用另一个订单服务来处理；订单服务处理完成后，会返回订单状态和ID。</p><p>在一切正常的情况下，下单后的订单状态就是已创建Created，订单ID是一个大于0的数字。而结构体中的message和success，其实是收单服务的处理异常信息和处理成功与否的结果，code、info是调用订单服务的结果。</p><p>对于第一次调用，收单服务自己没问题，success是true，message是OK，但调用订单服务时却因为订单风险问题被拒绝，所以code是5001，info是Risk order detected，data中的信息是订单服务返回的，所以最终订单状态是Cancelled。</p><p>对于第二次调用，因为用户ID非法，所以收单服务在校验了参数后直接就返回了success是false，message是Illegal userId。因为请求没有到订单服务，所以info、code、data都是默认值，订单状态的默认值是Created。因此，第二次下单肯定失败了，但订单状态却是已创建。</p><p>可以看到，如此混乱的接口定义和实现方式，是无法让调用者分清到底应该怎么处理的。 <strong>为了将接口设计得更合理，我们需要考虑如下两个原则：</strong></p><ul><li>对外隐藏内部实现。虽然说收单服务调用订单服务进行真正的下单操作，但是直接接口其实是收单服务提供的，收单服务不应该“直接”暴露其背后订单服务的状态码、错误描述。</li><li>设计接口结构时，明确每个字段的含义，以及客户端的处理方式。</li></ul><p>基于这两个原则，我们调整一下返回结构体，去掉外层的info，即不再把订单服务的调用结果告知客户端：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class APIResponse&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span>    private boolean success;</span></span>
<span class="line"><span>    private T data;</span></span>
<span class="line"><span>    private int code;</span></span>
<span class="line"><span>    private String message;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>并明确接口的设计逻辑：</p><ul><li>如果出现非200的HTTP响应状态码，就代表请求没有到收单服务，可能是网络出问题、网络超时，或者网络配置的问题。这时，肯定无法拿到服务端的响应体，客户端可以给予友好提示，比如让用户重试，不需要继续解析响应结构体。</li><li>如果HTTP响应码是200，解析响应体查看success，为false代表下单请求处理失败，可能是因为收单服务参数验证错误，也可能是因为订单服务下单操作失败。这时，根据收单服务定义的错误码表和code，做不同处理。比如友好提示，或是让用户重新填写相关信息，其中友好提示的文字内容可以从message中获取。</li><li>success为true的情况下，才需要继续解析响应体中的data结构体。data结构体代表了业务数据，通常会有下面两种情况。 <ul><li>通常情况下，success为true时订单状态是Created，获取orderId属性可以拿到订单号。</li><li>特殊情况下，比如收单服务内部处理不当，或是订单服务出现了额外的状态，虽然success为true，但订单实际状态不是Created，这时可以给予友好的错误提示。</li></ul></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/cd799f2bdb407bcb9ff5ad452376a6ed.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/cd799f2bdb407bcb9ff5ad452376a6ed.jpg" alt=""></a></p><p>明确了接口的设计逻辑，我们就是可以实现收单服务的服务端和客户端来模拟这些情况了。</p><p>首先，实现服务端的逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;server&quot;)</span></span>
<span class="line"><span>public APIResponse&amp;lt;OrderInfo&amp;gt; server(&amp;#64;RequestParam(&quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>    APIResponse&amp;lt;OrderInfo&amp;gt; response = new APIResponse&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    if (userId == null) {</span></span>
<span class="line"><span>        //对于userId为空的情况，收单服务直接处理失败，给予相应的错误码和错误提示</span></span>
<span class="line"><span>        response.setSuccess(false);</span></span>
<span class="line"><span>        response.setCode(3001);</span></span>
<span class="line"><span>        response.setMessage(&quot;Illegal userId&quot;);</span></span>
<span class="line"><span>    } else if (userId == 1) {</span></span>
<span class="line"><span>        //对于userId=1的用户，模拟订单服务对于风险用户的情况</span></span>
<span class="line"><span>        response.setSuccess(false);</span></span>
<span class="line"><span>        //把订单服务返回的错误码转换为收单服务错误码</span></span>
<span class="line"><span>        response.setCode(3002);</span></span>
<span class="line"><span>        response.setMessage(&quot;Internal Error, order is cancelled&quot;);</span></span>
<span class="line"><span>        //同时日志记录内部错误</span></span>
<span class="line"><span>        log.warn(&quot;用户 {} 调用订单服务失败，原因是 Risk order detected&quot;, userId);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //其他用户，下单成功</span></span>
<span class="line"><span>        response.setSuccess(true);</span></span>
<span class="line"><span>        response.setCode(2000);</span></span>
<span class="line"><span>        response.setMessage(&quot;OK&quot;);</span></span>
<span class="line"><span>        response.setData(new OrderInfo(&quot;Created&quot;, 2L));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>客户端代码，则可以按照流程图上的逻辑来实现，同样模拟三种出错情况和正常下单的情况：</p><ul><li>error==1的用例模拟一个不存在的URL，请求无法到收单服务，会得到404的HTTP状态码，直接进行友好提示，这是第一层处理。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/c1ddea0ebf6d86956d68efb0424a6b36.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/c1ddea0ebf6d86956d68efb0424a6b36.png" alt=""></a></p><ul><li>error==2的用例模拟userId参数为空的情况，收单服务会因为缺少userId参数提示非法用户。这时，可以把响应体中的message展示给用户，这是第二层处理。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/f36d21beb95ce0e7ea96dfde96f21847.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/f36d21beb95ce0e7ea96dfde96f21847.png" alt=""></a></p><ul><li>error==3的用例模拟userId为1的情况，因为用户有风险，收单服务调用订单服务出错。处理方式和之前没有任何区别，因为收单服务会屏蔽订单服务的内部错误。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/412c64e66a574d8252ac8dd59b4cfe2c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/412c64e66a574d8252ac8dd59b4cfe2c.png" alt=""></a></p><p>但在服务端可以看到如下错误信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[14:13:13.951] [http-nio-45678-exec-8] [WARN ] [.c.a.d.APIThreeLevelStatusController:36  ] - 用户 1 调用订单服务失败，原因是 Risk order detected</span></span></code></pre></div><ul><li>error==0的用例模拟正常用户，下单成功。这时可以解析data结构体提取业务结果，作为兜底，需要判断订单状态，如果不是Created则给予友好提示，否则查询orderId获得下单的订单号，这是第三层处理。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/f57ae156de7592de167bd09aaadb8348.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/f57ae156de7592de167bd09aaadb8348.png" alt=""></a></p><p>客户端的实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;client&quot;)</span></span>
<span class="line"><span>public String client(&amp;#64;RequestParam(value = &quot;error&quot;, defaultValue = &quot;0&quot;) int error) {</span></span>
<span class="line"><span>   String url = Arrays.asList(&quot;http://localhost:45678/apiresposne/server?userId=2&quot;,</span></span>
<span class="line"><span>        &quot;http://localhost:45678/apiresposne/server2&quot;,</span></span>
<span class="line"><span>        &quot;http://localhost:45678/apiresposne/server?userId=&quot;,</span></span>
<span class="line"><span>        &quot;http://localhost:45678/apiresposne/server?userId=1&quot;).get(error);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //第一层，先看状态码，如果状态码不是200，不处理响应体</span></span>
<span class="line"><span>    String response = &quot;&quot;;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        response = Request.Get(url).execute().returnContent().asString();</span></span>
<span class="line"><span>    } catch (HttpResponseException e) {</span></span>
<span class="line"><span>        log.warn(&quot;请求服务端出现返回非200&quot;, e);</span></span>
<span class="line"><span>        return &quot;服务器忙，请稍后再试！&quot;;</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //状态码为200的情况下处理响应体</span></span>
<span class="line"><span>    if (!response.equals(&quot;&quot;)) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            APIResponse&amp;lt;OrderInfo&amp;gt; apiResponse = objectMapper.readValue(response, new TypeReference&amp;lt;APIResponse&amp;lt;OrderInfo&amp;gt;&amp;gt;() {</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>            //第二层，success是false直接提示用户</span></span>
<span class="line"><span>            if (!apiResponse.isSuccess()) {</span></span>
<span class="line"><span>                return String.format(&quot;创建订单失败，请稍后再试，错误代码： %s 错误原因：%s&quot;, apiResponse.getCode(), apiResponse.getMessage());</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                //第三层，往下解析OrderInfo</span></span>
<span class="line"><span>                OrderInfo orderInfo = apiResponse.getData();</span></span>
<span class="line"><span>                if (&quot;Created&quot;.equals(orderInfo.getStatus()))</span></span>
<span class="line"><span>                    return String.format(&quot;创建订单成功，订单号是：%s，状态是：%s&quot;, orderInfo.getOrderId(), orderInfo.getStatus());</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    return String.format(&quot;创建订单失败，请联系客服处理&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (JsonProcessingException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>相比原来混乱的接口定义和处理逻辑，改造后的代码，明确了接口每一个字段的含义，以及对于各种情况服务端的输出和客户端的处理步骤，对齐了客户端和服务端的处理逻辑</strong>。那么现在，你能回答前面那4个让人疑惑的问题了吗？</p><p>最后分享一个小技巧。为了简化服务端代码，我们可以把包装API响应体APIResponse的工作交由框架自动完成，这样直接返回DTO OrderInfo即可。对于业务逻辑错误，可以抛出一个自定义异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;server&quot;)</span></span>
<span class="line"><span>public OrderInfo server(&amp;#64;RequestParam(&quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>    if (userId == null) {</span></span>
<span class="line"><span>        throw new APIException(3001, &quot;Illegal userId&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (userId == 1) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        //直接抛出异常</span></span>
<span class="line"><span>        throw new APIException(3002, &quot;Internal Error, order is cancelled&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //直接返回DTO</span></span>
<span class="line"><span>    return new OrderInfo(&quot;Created&quot;, 2L);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在APIException中包含错误码和错误消息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class APIException extends RuntimeException {</span></span>
<span class="line"><span>    &amp;#64;Getter</span></span>
<span class="line"><span>    private int errorCode;</span></span>
<span class="line"><span>    &amp;#64;Getter</span></span>
<span class="line"><span>    private String errorMessage;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public APIException(int errorCode, String errorMessage) {</span></span>
<span class="line"><span>        super(errorMessage);</span></span>
<span class="line"><span>        this.errorCode = errorCode;</span></span>
<span class="line"><span>        this.errorMessage = errorMessage;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public APIException(Throwable cause, int errorCode, String errorMessage) {</span></span>
<span class="line"><span>        super(errorMessage, cause);</span></span>
<span class="line"><span>        this.errorCode = errorCode;</span></span>
<span class="line"><span>        this.errorMessage = errorMessage;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，定义一个@RestControllerAdvice来完成自动包装响应体的工作：</p><ol><li>通过实现ResponseBodyAdvice接口的beforeBodyWrite方法，来处理成功请求的响应体转换。</li><li>实现一个@ExceptionHandler来处理业务异常时，APIException到APIResponse的转换。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//此段代码只是Demo，生产级应用还需要扩展很多细节</span></span>
<span class="line"><span>&amp;#64;RestControllerAdvice</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class APIResponseAdvice implements ResponseBodyAdvice&amp;lt;Object&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //自动处理APIException，包装为APIResponse</span></span>
<span class="line"><span>    &amp;#64;ExceptionHandler(APIException.class)</span></span>
<span class="line"><span>    public APIResponse handleApiException(HttpServletRequest request, APIException ex) {</span></span>
<span class="line"><span>        log.error(&quot;process url {} failed&quot;, request.getRequestURL().toString(), ex);</span></span>
<span class="line"><span>        APIResponse apiResponse = new APIResponse();</span></span>
<span class="line"><span>        apiResponse.setSuccess(false);</span></span>
<span class="line"><span>        apiResponse.setCode(ex.getErrorCode());</span></span>
<span class="line"><span>        apiResponse.setMessage(ex.getErrorMessage());</span></span>
<span class="line"><span>        return apiResponse;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //仅当方法或类没有标记&amp;#64;NoAPIResponse才自动包装</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public boolean supports(MethodParameter returnType, Class converterType) {</span></span>
<span class="line"><span>        return returnType.getParameterType() != APIResponse.class</span></span>
<span class="line"><span>                &amp;&amp; AnnotationUtils.findAnnotation(returnType.getMethod(), NoAPIResponse.class) == null</span></span>
<span class="line"><span>                &amp;&amp; AnnotationUtils.findAnnotation(returnType.getDeclaringClass(), NoAPIResponse.class) == null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //自动包装外层APIResposne响应</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class&amp;lt;? extends HttpMessageConverter&amp;lt;?&amp;gt;&amp;gt; selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {</span></span>
<span class="line"><span>        APIResponse apiResponse = new APIResponse();</span></span>
<span class="line"><span>        apiResponse.setSuccess(true);</span></span>
<span class="line"><span>        apiResponse.setMessage(&quot;OK&quot;);</span></span>
<span class="line"><span>        apiResponse.setCode(2000);</span></span>
<span class="line"><span>        apiResponse.setData(body);</span></span>
<span class="line"><span>        return apiResponse;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，我们实现了一个@NoAPIResponse自定义注解。如果某些@RestController的接口不希望实现自动包装的话，可以标记这个注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public &amp;#64;interface NoAPIResponse {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ResponseBodyAdvice的support方法中，我们排除了标记有这个注解的方法或类的自动响应体包装。比如，对于刚才我们实现的测试客户端client方法不需要包装为APIResponse，就可以标记上这个注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;client&quot;)</span></span>
<span class="line"><span>&amp;#64;NoAPIResponse</span></span>
<span class="line"><span>public String client(&amp;#64;RequestParam(value = &quot;error&quot;, defaultValue = &quot;0&quot;) int error)</span></span></code></pre></div><p>这样我们的业务逻辑中就不需要考虑响应体的包装，代码会更简洁。</p><h2 id="要考虑接口变迁的版本控制策略" tabindex="-1">要考虑接口变迁的版本控制策略 <a class="header-anchor" href="#要考虑接口变迁的版本控制策略" aria-label="Permalink to &quot;要考虑接口变迁的版本控制策略&quot;">​</a></h2><p>接口不可能一成不变，需要根据业务需求不断增加内部逻辑。如果做大的功能调整或重构，涉及参数定义的变化或是参数废弃，导致接口无法向前兼容，这时接口就需要有版本的概念。在考虑接口版本策略设计时，我们需要注意的是，最好一开始就明确版本策略，并考虑在整个服务端统一版本策略。</p><p><strong>第一，版本策略最好一开始就考虑。</strong></p><p>既然接口总是要变迁的，那么最好一开始就确定版本策略。比如，确定是通过URL Path实现，是通过QueryString实现，还是通过HTTP头实现。这三种实现方式的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//通过URL Path实现版本控制</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;/v1/api/user&quot;)</span></span>
<span class="line"><span>public int right1(){</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//通过QueryString中的version参数实现版本控制</span></span>
<span class="line"><span>&amp;#64;GetMapping(value = &quot;/api/user&quot;, params = &quot;version=2&quot;)</span></span>
<span class="line"><span>public int right2(&amp;#64;RequestParam(&quot;version&quot;) int version) {</span></span>
<span class="line"><span>    return 2;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//通过请求头中的X-API-VERSION参数实现版本控制</span></span>
<span class="line"><span>&amp;#64;GetMapping(value = &quot;/api/user&quot;, headers = &quot;X-API-VERSION=3&quot;)</span></span>
<span class="line"><span>public int right3(&amp;#64;RequestHeader(&quot;X-API-VERSION&quot;) int version) {</span></span>
<span class="line"><span>    return 3;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，客户端就可以在配置中处理相关版本控制的参数，有可能实现版本的动态切换。</p><p>这三种方式中，URL Path的方式最直观也最不容易出错；QueryString不易携带，不太推荐作为公开API的版本策略；HTTP头的方式比较没有侵入性，如果仅仅是部分接口需要进行版本控制，可以考虑这种方式。</p><p><strong>第二，版本实现方式要统一。</strong></p><p>之前，我就遇到过一个O2O项目，需要针对商品、商店和用户实现REST接口。虽然大家约定通过URL Path方式实现API版本控制，但实现方式不统一，有的是/api/item/v1，有的是/api/v1/shop，还有的是/v1/api/merchant：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;/api/item/v1&quot;)</span></span>
<span class="line"><span>public void wrong1(){</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;/api/v1/shop&quot;)</span></span>
<span class="line"><span>public void wrong2(){</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;/v1/api/merchant&quot;)</span></span>
<span class="line"><span>public void wrong3(){</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>显然，商品、商店和商户的接口开发同学，没有按照一致的URL格式来实现接口的版本控制。更要命的是，我们可能开发出两个URL类似接口，比如一个是/api/v1/user，另一个是/api/user/v1，这到底是一个接口还是两个接口呢？</p><p>相比于在每一个接口的URL Path中设置版本号，更理想的方式是在框架层面实现统一。如果你使用Spring框架的话，可以按照下面的方式自定义RequestMappingHandlerMapping来实现。</p><p>首先，创建一个注解来定义接口的版本。@APIVersion自定义注解可以应用于方法或Controller上：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public &amp;#64;interface APIVersion {</span></span>
<span class="line"><span>    String[] value();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，定义一个APIVersionHandlerMapping类继承RequestMappingHandlerMapping。</p><p>RequestMappingHandlerMapping的作用，是根据类或方法上的@RequestMapping来生成RequestMappingInfo的实例。我们覆盖registerHandlerMethod方法的实现，从@APIVersion自定义注解中读取版本信息，拼接上原有的、不带版本号的URL Pattern，构成新的RequestMappingInfo，来通过注解的方式为接口增加基于URL的版本号：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class APIVersionHandlerMapping extends RequestMappingHandlerMapping {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected boolean isHandler(Class&amp;lt;?&amp;gt; beanType) {</span></span>
<span class="line"><span>        return AnnotatedElementUtils.hasAnnotation(beanType, Controller.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void registerHandlerMethod(Object handler, Method method, RequestMappingInfo mapping) {</span></span>
<span class="line"><span>        Class&amp;lt;?&amp;gt; controllerClass = method.getDeclaringClass();</span></span>
<span class="line"><span>        //类上的APIVersion注解</span></span>
<span class="line"><span>        APIVersion apiVersion = AnnotationUtils.findAnnotation(controllerClass, APIVersion.class);</span></span>
<span class="line"><span>        //方法上的APIVersion注解</span></span>
<span class="line"><span>        APIVersion methodAnnotation = AnnotationUtils.findAnnotation(method, APIVersion.class);</span></span>
<span class="line"><span>        //以方法上的注解优先</span></span>
<span class="line"><span>        if (methodAnnotation != null) {</span></span>
<span class="line"><span>            apiVersion = methodAnnotation;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String[] urlPatterns = apiVersion == null ? new String[0] : apiVersion.value();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        PatternsRequestCondition apiPattern = new PatternsRequestCondition(urlPatterns);</span></span>
<span class="line"><span>        PatternsRequestCondition oldPattern = mapping.getPatternsCondition();</span></span>
<span class="line"><span>        PatternsRequestCondition updatedFinalPattern = apiPattern.combine(oldPattern);</span></span>
<span class="line"><span>        //重新构建RequestMappingInfo</span></span>
<span class="line"><span>        mapping = new RequestMappingInfo(mapping.getName(), updatedFinalPattern, mapping.getMethodsCondition(),</span></span>
<span class="line"><span>                mapping.getParamsCondition(), mapping.getHeadersCondition(), mapping.getConsumesCondition(),</span></span>
<span class="line"><span>                mapping.getProducesCondition(), mapping.getCustomCondition());</span></span>
<span class="line"><span>        super.registerHandlerMethod(handler, method, mapping);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，也是特别容易忽略的一点，要通过实现WebMvcRegistrations接口，来生效自定义的APIVersionHandlerMapping：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;SpringBootApplication</span></span>
<span class="line"><span>public class CommonMistakesApplication implements WebMvcRegistrations {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public RequestMappingHandlerMapping getRequestMappingHandlerMapping() {</span></span>
<span class="line"><span>        return new APIVersionHandlerMapping();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，就实现了在Controller上或接口方法上通过注解，来实现以统一的Pattern进行版本号控制：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(value = &quot;/api/user&quot;)</span></span>
<span class="line"><span>&amp;#64;APIVersion(&quot;v4&quot;)</span></span>
<span class="line"><span>public int right4() {</span></span>
<span class="line"><span>    return 4;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>加上注解后，访问浏览器查看效果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/f8fae105eae532e93e329ae2d3253502.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/f8fae105eae532e93e329ae2d3253502.png" alt=""></a></p><p>使用框架来明确API版本的指定策略，不仅实现了标准化，更实现了强制的API版本控制。对上面代码略做修改，我们就可以实现不设置@APIVersion接口就给予报错提示。</p><h2 id="接口处理方式要明确同步还是异步" tabindex="-1">接口处理方式要明确同步还是异步 <a class="header-anchor" href="#接口处理方式要明确同步还是异步" aria-label="Permalink to &quot;接口处理方式要明确同步还是异步&quot;">​</a></h2><p>看到这个标题，你可能感觉不太好理解，我们直接看一个实际案例吧。</p><p>有一个文件上传服务FileService，其中一个upload文件上传接口特别慢，原因是这个上传接口在内部需要进行两步操作，首先上传原图，然后压缩后上传缩略图。如果每一步都耗时5秒的话，那么这个接口返回至少需要10秒的时间。</p><p>于是，开发同学把接口改为了异步处理，每一步操作都限定了超时时间，也就是分别把上传原文件和上传缩略图的操作提交到线程池，然后等待一定的时间：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private ExecutorService threadPool = Executors.newFixedThreadPool(2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//我没有贴出两个文件上传方法uploadFile和uploadThumbnailFile的实现，它们在内部只是随机进行休眠然后返回文件名，对于本例来说不是很重要</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public UploadResponse upload(UploadRequest request) {</span></span>
<span class="line"><span>    UploadResponse response = new UploadResponse();</span></span>
<span class="line"><span>    //上传原始文件任务提交到线程池处理</span></span>
<span class="line"><span>    Future&amp;lt;String&amp;gt; uploadFile = threadPool.submit(() -&amp;gt; uploadFile(request.getFile()));</span></span>
<span class="line"><span>    //上传缩略图任务提交到线程池处理</span></span>
<span class="line"><span>    Future&amp;lt;String&amp;gt; uploadThumbnailFile = threadPool.submit(() -&amp;gt; uploadThumbnailFile(request.getFile()));</span></span>
<span class="line"><span>    //等待上传原始文件任务完成，最多等待1秒</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        response.setDownloadUrl(uploadFile.get(1, TimeUnit.SECONDS));</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //等待上传缩略图任务完成，最多等待1秒</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        response.setThumbnailDownloadUrl(uploadThumbnailFile.get(1, TimeUnit.SECONDS));</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上传接口的请求和响应比较简单，传入二进制文件，传出原文件和缩略图下载地址：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class UploadRequest {</span></span>
<span class="line"><span>    private byte[] file;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class UploadResponse {</span></span>
<span class="line"><span>    private String downloadUrl;</span></span>
<span class="line"><span>    private String thumbnailDownloadUrl;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，你能看出这种实现方式的问题是什么吗？</p><p>从接口命名上看虽然是同步上传操作，但其内部通过线程池进行异步上传，并因为设置了较短超时所以接口整体响应挺快。但是， <strong>一旦遇到超时，接口就不能返回完整的数据，不是无法拿到原文件下载地址，就是无法拿到缩略图下载地址，接口的行为变得不可预测</strong>：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/8e75863413fd7a01514b47804f0c4a78.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228968/8e75863413fd7a01514b47804f0c4a78.png" alt=""></a></p><p>所以，这种优化接口响应速度的方式并不可取， <strong>更合理的方式是，让上传接口要么是彻底的同步处理，要么是彻底的异步处理</strong>：</p><ul><li>所谓同步处理，接口一定是同步上传原文件和缩略图的，调用方可以自己选择调用超时，如果来得及可以一直等到上传完成，如果等不及可以结束等待，下一次再重试；</li><li>所谓异步处理，接口是两段式的，上传接口本身只是返回一个任务ID，然后异步做上传操作，上传接口响应很快，客户端需要之后再拿着任务ID调用任务查询接口查询上传的文件URL。</li></ul><p>同步上传接口的实现代码如下，把超时的选择留给客户端：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public SyncUploadResponse syncUpload(SyncUploadRequest request) {</span></span>
<span class="line"><span>    SyncUploadResponse response = new SyncUploadResponse();</span></span>
<span class="line"><span>    response.setDownloadUrl(uploadFile(request.getFile()));</span></span>
<span class="line"><span>    response.setThumbnailDownloadUrl(uploadThumbnailFile(request.getFile()));</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的SyncUploadRequest和SyncUploadResponse类，与之前定义的UploadRequest和UploadResponse是一致的。对于接口的入参和出参DTO的命名，我比较建议的方式是，使用接口名+Request和Response后缀。</p><p>接下来，我们看看异步的上传文件接口如何实现。异步上传接口在出参上有点区别，不再返回文件URL，而是返回一个任务ID：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class AsyncUploadRequest {</span></span>
<span class="line"><span>    private byte[] file;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class AsyncUploadResponse {</span></span>
<span class="line"><span>    private String taskId;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在接口实现上，我们同样把上传任务提交到线程池处理，但是并不会同步等待任务完成，而是完成后把结果写入一个HashMap，任务查询接口通过查询这个HashMap来获得文件的URL：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//计数器，作为上传任务的ID</span></span>
<span class="line"><span>private AtomicInteger atomicInteger = new AtomicInteger(0);</span></span>
<span class="line"><span>//暂存上传操作的结果，生产代码需要考虑数据持久化</span></span>
<span class="line"><span>private ConcurrentHashMap&amp;lt;String, SyncQueryUploadTaskResponse&amp;gt; downloadUrl = new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>//异步上传操作</span></span>
<span class="line"><span>public AsyncUploadResponse asyncUpload(AsyncUploadRequest request) {</span></span>
<span class="line"><span>    AsyncUploadResponse response = new AsyncUploadResponse();</span></span>
<span class="line"><span>    //生成唯一的上传任务ID</span></span>
<span class="line"><span>    String taskId = &quot;upload&quot; + atomicInteger.incrementAndGet();</span></span>
<span class="line"><span>    //异步上传操作只返回任务ID</span></span>
<span class="line"><span>    response.setTaskId(taskId);</span></span>
<span class="line"><span>    //提交上传原始文件操作到线程池异步处理</span></span>
<span class="line"><span>    threadPool.execute(() -&amp;gt; {</span></span>
<span class="line"><span>        String url = uploadFile(request.getFile());</span></span>
<span class="line"><span>        //如果ConcurrentHashMap不包含Key，则初始化一个SyncQueryUploadTaskResponse，然后设置DownloadUrl</span></span>
<span class="line"><span>        downloadUrl.computeIfAbsent(taskId, id -&amp;gt; new SyncQueryUploadTaskResponse(id)).setDownloadUrl(url);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    //提交上传缩略图操作到线程池异步处理</span></span>
<span class="line"><span>    threadPool.execute(() -&amp;gt; {</span></span>
<span class="line"><span>        String url = uploadThumbnailFile(request.getFile());</span></span>
<span class="line"><span>        downloadUrl.computeIfAbsent(taskId, id -&amp;gt; new SyncQueryUploadTaskResponse(id)).setThumbnailDownloadUrl(url);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>文件上传查询接口则以任务ID作为入参，返回两个文件的下载地址，因为文件上传查询接口是同步的，所以直接命名为syncQueryUploadTask：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//syncQueryUploadTask接口入参</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;RequiredArgsConstructor</span></span>
<span class="line"><span>public class SyncQueryUploadTaskRequest {</span></span>
<span class="line"><span>    private final String taskId;//使用上传文件任务ID查询上传结果</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//syncQueryUploadTask接口出参</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;RequiredArgsConstructor</span></span>
<span class="line"><span>public class SyncQueryUploadTaskResponse {</span></span>
<span class="line"><span>    private final String taskId; //任务ID</span></span>
<span class="line"><span>    private String downloadUrl; //原始文件下载URL</span></span>
<span class="line"><span>    private String thumbnailDownloadUrl; //缩略图下载URL</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public SyncQueryUploadTaskResponse syncQueryUploadTask(SyncQueryUploadTaskRequest request) {</span></span>
<span class="line"><span>    SyncQueryUploadTaskResponse response = new SyncQueryUploadTaskResponse(request.getTaskId());</span></span>
<span class="line"><span>     //从之前定义的downloadUrl ConcurrentHashMap查询结果</span></span>
<span class="line"><span>response.setDownloadUrl(downloadUrl.getOrDefault(request.getTaskId(), response).getDownloadUrl());</span></span>
<span class="line"><span>    response.setThumbnailDownloadUrl(downloadUrl.getOrDefault(request.getTaskId(), response).getThumbnailDownloadUrl());</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过改造的FileService不再提供一个看起来是同步上传，内部却是异步上传的upload方法，改为提供很明确的：</p><ul><li>同步上传接口syncUpload；</li><li>异步上传接口asyncUpload，搭配syncQueryUploadTask查询上传结果。</li></ul><p>使用方可以根据业务性质选择合适的方法：如果是后端批处理使用，那么可以使用同步上传，多等待一些时间问题不大；如果是面向用户的接口，那么接口响应时间不宜过长，可以调用异步上传接口，然后定时轮询上传结果，拿到结果再显示。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我针对接口设计，和你深入探讨了三个方面的问题。</p><p>第一，针对响应体的设计混乱、响应结果的不明确问题，服务端需要明确响应体每一个字段的意义，以一致的方式进行处理，并确保不透传下游服务的错误。</p><p>第二，针对接口版本控制问题，主要就是在开发接口之前明确版本控制策略，以及尽量使用统一的版本控制策略两方面。</p><p>第三，针对接口的处理方式，我认为需要明确要么是同步要么是异步。如果API列表中既有同步接口也有异步接口，那么最好直接在接口名中明确。</p><p>一个良好的接口文档不仅仅需要说明如何调用接口，更需要补充接口使用的最佳实践以及接口的SLA标准。我看到的大部分接口文档只给出了参数定义，但诸如幂等性、同步异步、缓存策略等看似内部实现相关的一些设计，其实也会影响调用方对接口的使用策略，最好也可以体现在接口文档中。</p><p>最后，我再额外提一下，对于服务端出错的时候是否返回200响应码的问题，其实一直有争论。从RESTful设计原则来看，我们应该尽量利用HTTP状态码来表达错误，但也不是这么绝对。</p><p>如果我们认为HTTP 状态码是协议层面的履约，那么当这个错误已经不涉及HTTP协议时（换句话说，服务端已经收到请求进入服务端业务处理后产生的错误），不一定需要硬套协议本身的错误码。但涉及非法URL、非法参数、没有权限等无法处理请求的情况，还是应该使用正确的响应码来应对。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>在第一节的例子中，接口响应结构体中的code字段代表执行结果的错误码，对于业务特别复杂的接口，可能会有很多错误情况，code可能会有几十甚至几百个。客户端开发人员需要根据每一种错误情况逐一写if-else进行不同交互处理，会非常麻烦，你觉得有什么办法来改进吗？作为服务端，是否有必要告知客户端接口执行的错误码呢？</li><li>在第二节的例子中，我们在类或方法上标记@APIVersion自定义注解，实现了URL方式统一的接口版本定义。你可以用类似的方式（也就是自定义RequestMappingHandlerMapping），来实现一套统一的基于请求头方式的版本控制吗？</li></ol><p>关于接口设计，你还遇到过其他问题吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,112)])])}const h=n(l,[["render",t]]);export{g as __pageData,h as default};
