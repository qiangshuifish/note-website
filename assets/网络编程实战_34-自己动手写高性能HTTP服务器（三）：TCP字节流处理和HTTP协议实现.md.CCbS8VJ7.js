import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"34 | 自己动手写高性能HTTP服务器（三）：TCP字节流处理和HTTP协议实现","description":"","frontmatter":{},"headers":[{"level":2,"title":"buffer对象","slug":"buffer对象","link":"#buffer对象","children":[]},{"level":2,"title":"套接字接收数据处理","slug":"套接字接收数据处理","link":"#套接字接收数据处理","children":[]},{"level":2,"title":"套接字发送数据处理","slug":"套接字发送数据处理","link":"#套接字发送数据处理","children":[]},{"level":2,"title":"HTTP协议实现","slug":"http协议实现","link":"#http协议实现","children":[]},{"level":2,"title":"完整的HTTP服务器例子","slug":"完整的http服务器例子","link":"#完整的http服务器例子","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/34-自己动手写高性能HTTP服务器（三）：TCP字节流处理和HTTP协议实现.md","filePath":"网络编程实战/34-自己动手写高性能HTTP服务器（三）：TCP字节流处理和HTTP协议实现.md","lastUpdated":1779821786000}'),t={name:"网络编程实战/34-自己动手写高性能HTTP服务器（三）：TCP字节流处理和HTTP协议实现.md"};function l(i,n,c,r,o,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_34-自己动手写高性能http服务器-三-tcp字节流处理和http协议实现" tabindex="-1">34 | 自己动手写高性能HTTP服务器（三）：TCP字节流处理和HTTP协议实现 <a class="header-anchor" href="#_34-自己动手写高性能http服务器-三-tcp字节流处理和http协议实现" aria-label="Permalink to &quot;34 | 自己动手写高性能HTTP服务器（三）：TCP字节流处理和HTTP协议实现&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战第34讲，欢迎回来。</p><p>这一讲，我们延续第33讲的话题，继续解析高性能网络编程框架的字节流处理部分，并为网络编程框架增加HTTP相关的功能，在此基础上完成HTTP高性能服务器的编写。</p><h2 id="buffer对象" tabindex="-1">buffer对象 <a class="header-anchor" href="#buffer对象" aria-label="Permalink to &quot;buffer对象&quot;">​</a></h2><p>你肯定在各种语言、各种框架里面看到过不同的buffer对象，buffer，顾名思义，就是一个缓冲区对象，缓存了从套接字接收来的数据以及需要发往套接字的数据。</p><p>如果是从套接字接收来的数据，事件处理回调函数在不断地往buffer对象增加数据，同时，应用程序需要不断把buffer对象中的数据处理掉，这样，buffer对象才可以空出新的位置容纳更多的数据。</p><p>如果是发往套接字的数据，应用程序不断地往buffer对象增加数据，同时，事件处理回调函数不断调用套接字上的发送函数将数据发送出去，减少buffer对象中的写入数据。</p><p>可见，buffer对象是同时可以作为输入缓冲（input buffer）和输出缓冲（output buffer）两个方向使用的，只不过，在两种情形下，写入和读出的对象是有区别的。</p><p>这张图描述了buffer对象的设计。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/44eaf37e860212a5c6c9e7f8dc2560bb.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/44eaf37e860212a5c6c9e7f8dc2560bb.png" alt=""></a></p><p>下面是buffer对象的数据结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//数据缓冲区</span></span>
<span class="line"><span>struct buffer {</span></span>
<span class="line"><span>    char *data;          //实际缓冲</span></span>
<span class="line"><span>    int readIndex;       //缓冲读取位置</span></span>
<span class="line"><span>    int writeIndex;      //缓冲写入位置</span></span>
<span class="line"><span>    int total_size;      //总大小</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>buffer对象中的writeIndex标识了当前可以写入的位置；readIndex标识了当前可以读出的数据位置，图中红色部分从readIndex到writeIndex的区域是需要读出数据的部分，而绿色部分从writeIndex到缓存的最尾端则是可以写出的部分。</p><p>随着时间的推移，当readIndex和writeIndex越来越靠近缓冲的尾端时，前面部分的front_space_size区域变得会很大，而这个区域的数据已经是旧数据，在这个时候，就需要调整一下整个buffer对象的结构，把红色部分往左侧移动，与此同时，绿色部分也会往左侧移动，整个缓冲区的可写部分就会变多了。</p><p>make_room函数就是起这个作用的，如果右边绿色的连续空间不足以容纳新的数据，而最左边灰色部分加上右边绿色部分一起可以容纳下新数据，就会触发这样的移动拷贝，最终红色部分占据了最左边，绿色部分占据了右边，右边绿色的部分成为一个连续的可写入空间，就可以容纳下新的数据。下面的一张图解释了这个过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/638e76a9f926065a72de9116192ef780.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/638e76a9f926065a72de9116192ef780.png" alt=""></a></p><p>下面是make_room的具体实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void make_room(struct buffer *buffer, int size) {</span></span>
<span class="line"><span>    if (buffer_writeable_size(buffer) &amp;gt;= size) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果front_spare和writeable的大小加起来可以容纳数据，则把可读数据往前面拷贝</span></span>
<span class="line"><span>    if (buffer_front_spare_size(buffer) + buffer_writeable_size(buffer) &amp;gt;= size) {</span></span>
<span class="line"><span>        int readable = buffer_readable_size(buffer);</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; readable; i++) {</span></span>
<span class="line"><span>            memcpy(buffer-&amp;gt;data + i, buffer-&amp;gt;data + buffer-&amp;gt;readIndex + i, 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buffer-&amp;gt;readIndex = 0;</span></span>
<span class="line"><span>        buffer-&amp;gt;writeIndex = readable;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //扩大缓冲区</span></span>
<span class="line"><span>        void *tmp = realloc(buffer-&amp;gt;data, buffer-&amp;gt;total_size + size);</span></span>
<span class="line"><span>        if (tmp == NULL) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buffer-&amp;gt;data = tmp;</span></span>
<span class="line"><span>        buffer-&amp;gt;total_size += size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，如果红色部分占据过大，可写部分不够，会触发缓冲区的扩大操作。这里我通过调用realloc函数来完成缓冲区的扩容。</p><p>下面这张图对此做了解释。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/9f66d628572b0ef5b7d9d5989c7a14ba.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/9f66d628572b0ef5b7d9d5989c7a14ba.png" alt=""></a></p><h2 id="套接字接收数据处理" tabindex="-1">套接字接收数据处理 <a class="header-anchor" href="#套接字接收数据处理" aria-label="Permalink to &quot;套接字接收数据处理&quot;">​</a></h2><p>套接字接收数据是在tcp_connection.c中的handle_read来完成的。在这个函数里，通过调用buffer_socket_read函数接收来自套接字的数据流，并将其缓冲到buffer对象中。之后你可以看到，我们将buffer对象和tcp_connection对象传递给应用程序真正的处理函数messageCallBack来进行报文的解析工作。这部分的样例在HTTP报文解析中会展开。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int handle_read(void *data) {</span></span>
<span class="line"><span>    struct tcp_connection *tcpConnection = (struct tcp_connection *) data;</span></span>
<span class="line"><span>    struct buffer *input_buffer = tcpConnection-&amp;gt;input_buffer;</span></span>
<span class="line"><span>    struct channel *channel = tcpConnection-&amp;gt;channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (buffer_socket_read(input_buffer, channel-&amp;gt;fd) &amp;gt; 0) {</span></span>
<span class="line"><span>        //应用程序真正读取Buffer里的数据</span></span>
<span class="line"><span>        if (tcpConnection-&amp;gt;messageCallBack != NULL) {</span></span>
<span class="line"><span>            tcpConnection-&amp;gt;messageCallBack(input_buffer, tcpConnection);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        handle_connection_closed(tcpConnection);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在buffer_socket_read函数里，调用readv往两个缓冲区写入数据，一个是buffer对象，另外一个是这里的additional_buffer，之所以这样做，是担心buffer对象没办法容纳下来自套接字的数据流，而且也没有办法触发buffer对象的扩容操作。通过使用额外的缓冲，一旦判断出从套接字读取的数据超过了buffer对象里的实际最大可写大小，就可以触发buffer对象的扩容操作，这里buffer_append函数会调用前面介绍的make_room函数，完成buffer对象的扩容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int buffer_socket_read(struct buffer *buffer, int fd) {</span></span>
<span class="line"><span>    char additional_buffer[INIT_BUFFER_SIZE];</span></span>
<span class="line"><span>    struct iovec vec[2];</span></span>
<span class="line"><span>    int max_writable = buffer_writeable_size(buffer);</span></span>
<span class="line"><span>    vec[0].iov_base = buffer-&amp;gt;data + buffer-&amp;gt;writeIndex;</span></span>
<span class="line"><span>    vec[0].iov_len = max_writable;</span></span>
<span class="line"><span>    vec[1].iov_base = additional_buffer;</span></span>
<span class="line"><span>    vec[1].iov_len = sizeof(additional_buffer);</span></span>
<span class="line"><span>    int result = readv(fd, vec, 2);</span></span>
<span class="line"><span>    if (result &amp;lt; 0) {</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    } else if (result &amp;lt;= max_writable) {</span></span>
<span class="line"><span>        buffer-&amp;gt;writeIndex += result;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        buffer-&amp;gt;writeIndex = buffer-&amp;gt;total_size;</span></span>
<span class="line"><span>        buffer_append(buffer, additional_buffer, result - max_writable);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="套接字发送数据处理" tabindex="-1">套接字发送数据处理 <a class="header-anchor" href="#套接字发送数据处理" aria-label="Permalink to &quot;套接字发送数据处理&quot;">​</a></h2><p>当应用程序需要往套接字发送数据时，即完成了read-decode-compute-encode过程后，通过往buffer对象里写入encode以后的数据，调用tcp_connection_send_buffer，将buffer里的数据通过套接字缓冲区发送出去。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_connection_send_buffer(struct tcp_connection *tcpConnection, struct buffer *buffer) {</span></span>
<span class="line"><span>    int size = buffer_readable_size(buffer);</span></span>
<span class="line"><span>    int result = tcp_connection_send_data(tcpConnection, buffer-&amp;gt;data + buffer-&amp;gt;readIndex, size);</span></span>
<span class="line"><span>    buffer-&amp;gt;readIndex += size;</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果发现当前channel没有注册WRITE事件，并且当前tcp_connection对应的发送缓冲无数据需要发送，就直接调用write函数将数据发送出去。如果这一次发送不完，就将剩余需要发送的数据拷贝到当前tcp_connection对应的发送缓冲区中，并向event_loop注册WRITE事件。这样数据就由框架接管，应用程序释放这部分数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//应用层调用入口</span></span>
<span class="line"><span>int tcp_connection_send_data(struct tcp_connection *tcpConnection, void *data, int size) {</span></span>
<span class="line"><span>    size_t nwrited = 0;</span></span>
<span class="line"><span>    size_t nleft = size;</span></span>
<span class="line"><span>    int fault = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct channel *channel = tcpConnection-&amp;gt;channel;</span></span>
<span class="line"><span>    struct buffer *output_buffer = tcpConnection-&amp;gt;output_buffer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //先往套接字尝试发送数据</span></span>
<span class="line"><span>    if (!channel_write_event_registered(channel) &amp;&amp; buffer_readable_size(output_buffer) == 0) {</span></span>
<span class="line"><span>        nwrited = write(channel-&amp;gt;fd, data, size);</span></span>
<span class="line"><span>        if (nwrited &amp;gt;= 0) {</span></span>
<span class="line"><span>            nleft = nleft - nwrited;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            nwrited = 0;</span></span>
<span class="line"><span>            if (errno != EWOULDBLOCK) {</span></span>
<span class="line"><span>                if (errno == EPIPE || errno == ECONNRESET) {</span></span>
<span class="line"><span>                    fault = 1;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!fault &amp;&amp; nleft &amp;gt; 0) {</span></span>
<span class="line"><span>        //拷贝到Buffer中，Buffer的数据由框架接管</span></span>
<span class="line"><span>        buffer_append(output_buffer, data + nwrited, nleft);</span></span>
<span class="line"><span>        if (!channel_write_event_registered(channel)) {</span></span>
<span class="line"><span>            channel_write_event_add(channel);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return nwrited;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="http协议实现" tabindex="-1">HTTP协议实现 <a class="header-anchor" href="#http协议实现" aria-label="Permalink to &quot;HTTP协议实现&quot;">​</a></h2><p>下面，我们在TCP的基础上，加入HTTP的功能。</p><p>为此，我们首先定义了一个http_server结构，这个http_server本质上就是一个TCPServer，只不过暴露给应用程序的回调函数更为简单，只需要看到http_request和http_response结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef int (*request_callback)(struct http_request *httpRequest, struct http_response *httpResponse);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct http_server {</span></span>
<span class="line"><span>    struct TCPserver *tcpServer;</span></span>
<span class="line"><span>    request_callback requestCallback;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在http_server里面，重点是需要完成报文的解析，将解析的报文转化为http_request对象，这件事情是通过http_onMessage回调函数来完成的。在http_onMessage函数里，调用的是parse_http_request完成报文解析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// buffer是框架构建好的，并且已经收到部分数据的情况下</span></span>
<span class="line"><span>// 注意这里可能没有收到全部数据，所以要处理数据不够的情形</span></span>
<span class="line"><span>int http_onMessage(struct buffer *input, struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    yolanda_msgx(&quot;get message from tcp connection %s&quot;, tcpConnection-&amp;gt;name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct http_request *httpRequest = (struct http_request *) tcpConnection-&amp;gt;request;</span></span>
<span class="line"><span>    struct http_server *httpServer = (struct http_server *) tcpConnection-&amp;gt;data;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (parse_http_request(input, httpRequest) == 0) {</span></span>
<span class="line"><span>        char *error_response = &quot;HTTP/1.1 400 Bad Request\\r\\n\\r\\n&quot;;</span></span>
<span class="line"><span>        tcp_connection_send_data(tcpConnection, error_response, sizeof(error_response));</span></span>
<span class="line"><span>        tcp_connection_shutdown(tcpConnection);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //处理完了所有的request数据，接下来进行编码和发送</span></span>
<span class="line"><span>    if (http_request_current_state(httpRequest) == REQUEST_DONE) {</span></span>
<span class="line"><span>        struct http_response *httpResponse = http_response_new();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //httpServer暴露的requestCallback回调</span></span>
<span class="line"><span>        if (httpServer-&amp;gt;requestCallback != NULL) {</span></span>
<span class="line"><span>            httpServer-&amp;gt;requestCallback(httpRequest, httpResponse);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //将httpResponse发送到套接字发送缓冲区中</span></span>
<span class="line"><span>        struct buffer *buffer = buffer_new();</span></span>
<span class="line"><span>        http_response_encode_buffer(httpResponse, buffer);</span></span>
<span class="line"><span>        tcp_connection_send_buffer(tcpConnection, buffer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (http_request_close_connection(httpRequest)) {</span></span>
<span class="line"><span>            tcp_connection_shutdown(tcpConnection);</span></span>
<span class="line"><span>            http_request_reset(httpRequest);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>还记得 <a href="https://time.geekbang.org/column/article/132443" target="_blank" rel="noreferrer">第16讲中</a> 讲到的HTTP协议吗？我们从16讲得知，HTTP通过设置回车符、换行符作为HTTP报文协议的边界。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/6d91c7c2a0224f5d4bad32a0f488765a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/6d91c7c2a0224f5d4bad32a0f488765a.png" alt=""></a></p><p>parse_http_request的思路就是寻找报文的边界，同时记录下当前解析工作所处的状态。根据解析工作的前后顺序，把报文解析的工作分成REQUEST_STATUS、REQUEST_HEADERS、REQUEST_BODY和REQUEST_DONE四个阶段，每个阶段解析的方法各有不同。</p><p>在解析状态行时，先通过定位CRLF回车换行符的位置来圈定状态行，进入状态行解析时，再次通过查找空格字符来作为分隔边界。</p><p>在解析头部设置时，也是先通过定位CRLF回车换行符的位置来圈定一组key-value对，再通过查找冒号字符来作为分隔边界。</p><p>最后，如果没有找到冒号字符，说明解析头部的工作完成。</p><p>parse_http_request函数完成了HTTP报文解析的四个阶段:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int parse_http_request(struct buffer *input, struct http_request *httpRequest) {</span></span>
<span class="line"><span>    int ok = 1;</span></span>
<span class="line"><span>    while (httpRequest-&amp;gt;current_state != REQUEST_DONE) {</span></span>
<span class="line"><span>        if (httpRequest-&amp;gt;current_state == REQUEST_STATUS) {</span></span>
<span class="line"><span>            char *crlf = buffer_find_CRLF(input);</span></span>
<span class="line"><span>            if (crlf) {</span></span>
<span class="line"><span>                int request_line_size = process_status_line(input-&amp;gt;data + input-&amp;gt;readIndex, crlf, httpRequest);</span></span>
<span class="line"><span>                if (request_line_size) {</span></span>
<span class="line"><span>                    input-&amp;gt;readIndex += request_line_size;  // request line size</span></span>
<span class="line"><span>                    input-&amp;gt;readIndex += 2;  //CRLF size</span></span>
<span class="line"><span>                    httpRequest-&amp;gt;current_state = REQUEST_HEADERS;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else if (httpRequest-&amp;gt;current_state == REQUEST_HEADERS) {</span></span>
<span class="line"><span>            char *crlf = buffer_find_CRLF(input);</span></span>
<span class="line"><span>            if (crlf) {</span></span>
<span class="line"><span>                /**</span></span>
<span class="line"><span>                 *    &amp;lt;start&amp;gt;-------&amp;lt;colon&amp;gt;:-------&amp;lt;crlf&amp;gt;</span></span>
<span class="line"><span>                 */</span></span>
<span class="line"><span>                char *start = input-&amp;gt;data + input-&amp;gt;readIndex;</span></span>
<span class="line"><span>                int request_line_size = crlf - start;</span></span>
<span class="line"><span>                char *colon = memmem(start, request_line_size, &quot;: &quot;, 2);</span></span>
<span class="line"><span>                if (colon != NULL) {</span></span>
<span class="line"><span>                    char *key = malloc(colon - start + 1);</span></span>
<span class="line"><span>                    strncpy(key, start, colon - start);</span></span>
<span class="line"><span>                    key[colon - start] = &#39;\\0&#39;;</span></span>
<span class="line"><span>                    char *value = malloc(crlf - colon - 2 + 1);</span></span>
<span class="line"><span>                    strncpy(value, colon + 1, crlf - colon - 2);</span></span>
<span class="line"><span>                    value[crlf - colon - 2] = &#39;\\0&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    http_request_add_header(httpRequest, key, value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    input-&amp;gt;readIndex += request_line_size;  //request line size</span></span>
<span class="line"><span>                    input-&amp;gt;readIndex += 2;  //CRLF size</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    //读到这里说明:没找到，就说明这个是最后一行</span></span>
<span class="line"><span>                    input-&amp;gt;readIndex += 2;  //CRLF size</span></span>
<span class="line"><span>                    httpRequest-&amp;gt;current_state = REQUEST_DONE;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ok;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>处理完了所有的request数据，接下来进行编码和发送的工作。为此，创建了一个http_response对象，并调用了应用程序提供的编码函数requestCallback，接下来，创建了一个buffer对象，函数http_response_encode_buffer用来将http_response中的数据，根据HTTP协议转换为对应的字节流。</p><p>可以看到，http_response_encode_buffer设置了如Content-Length等http_response头部，以及http_response的body部分数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void http_response_encode_buffer(struct http_response *httpResponse, struct buffer *output) {</span></span>
<span class="line"><span>    char buf[32];</span></span>
<span class="line"><span>    snprintf(buf, sizeof buf, &quot;HTTP/1.1 %d &quot;, httpResponse-&amp;gt;statusCode);</span></span>
<span class="line"><span>    buffer_append_string(output, buf);</span></span>
<span class="line"><span>    buffer_append_string(output, httpResponse-&amp;gt;statusMessage);</span></span>
<span class="line"><span>    buffer_append_string(output, &quot;\\r\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (httpResponse-&amp;gt;keep_connected) {</span></span>
<span class="line"><span>        buffer_append_string(output, &quot;Connection: close\\r\\n&quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        snprintf(buf, sizeof buf, &quot;Content-Length: %zd\\r\\n&quot;, strlen(httpResponse-&amp;gt;body));</span></span>
<span class="line"><span>        buffer_append_string(output, buf);</span></span>
<span class="line"><span>        buffer_append_string(output, &quot;Connection: Keep-Alive\\r\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (httpResponse-&amp;gt;response_headers != NULL &amp;&amp; httpResponse-&amp;gt;response_headers_number &amp;gt; 0) {</span></span>
<span class="line"><span>        for (int i = 0; i &amp;lt; httpResponse-&amp;gt;response_headers_number; i++) {</span></span>
<span class="line"><span>            buffer_append_string(output, httpResponse-&amp;gt;response_headers[i].key);</span></span>
<span class="line"><span>            buffer_append_string(output, &quot;: &quot;);</span></span>
<span class="line"><span>            buffer_append_string(output, httpResponse-&amp;gt;response_headers[i].value);</span></span>
<span class="line"><span>            buffer_append_string(output, &quot;\\r\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    buffer_append_string(output, &quot;\\r\\n&quot;);</span></span>
<span class="line"><span>    buffer_append_string(output, httpResponse-&amp;gt;body);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="完整的http服务器例子" tabindex="-1">完整的HTTP服务器例子 <a class="header-anchor" href="#完整的http服务器例子" aria-label="Permalink to &quot;完整的HTTP服务器例子&quot;">​</a></h2><p>现在，编写一个HTTP服务器例子就变得非常简单。</p><p>在这个例子中，最主要的部分是onRequest callback函数，这里，onRequest方法已经在parse_http_request之后，可以根据不同的http_request的信息，进行计算和处理。例子程序里的逻辑非常简单，根据http request的URL path，返回了不同的http_response类型。比如，当请求为根目录时，返回的是200和HTML格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;lib/acceptor.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;lib/http_server.h&amp;gt;</span></span>
<span class="line"><span>#include &quot;lib/common.h&quot;</span></span>
<span class="line"><span>#include &quot;lib/event_loop.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//数据读到buffer之后的callback</span></span>
<span class="line"><span>int onRequest(struct http_request *httpRequest, struct http_response *httpResponse) {</span></span>
<span class="line"><span>    char *url = httpRequest-&amp;gt;url;</span></span>
<span class="line"><span>    char *question = memmem(url, strlen(url), &quot;?&quot;, 1);</span></span>
<span class="line"><span>    char *path = NULL;</span></span>
<span class="line"><span>    if (question != NULL) {</span></span>
<span class="line"><span>        path = malloc(question - url);</span></span>
<span class="line"><span>        strncpy(path, url, question - url);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        path = malloc(strlen(url));</span></span>
<span class="line"><span>        strncpy(path, url, strlen(url));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (strcmp(path, &quot;/&quot;) == 0) {</span></span>
<span class="line"><span>        httpResponse-&amp;gt;statusCode = OK;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;statusMessage = &quot;OK&quot;;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;contentType = &quot;text/html&quot;;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;body = &quot;&amp;lt;html&amp;gt;&amp;lt;head&amp;gt;&amp;lt;title&amp;gt;This is network programming&amp;lt;/title&amp;gt;&amp;lt;/head&amp;gt;&amp;lt;body&amp;gt;&amp;lt;h1&amp;gt;Hello, network programming&amp;lt;/h1&amp;gt;&amp;lt;/body&amp;gt;&amp;lt;/html&amp;gt;&quot;;</span></span>
<span class="line"><span>    } else if (strcmp(path, &quot;/network&quot;) == 0) {</span></span>
<span class="line"><span>        httpResponse-&amp;gt;statusCode = OK;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;statusMessage = &quot;OK&quot;;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;contentType = &quot;text/plain&quot;;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;body = &quot;hello, network programming&quot;;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        httpResponse-&amp;gt;statusCode = NotFound;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;statusMessage = &quot;Not Found&quot;;</span></span>
<span class="line"><span>        httpResponse-&amp;gt;keep_connected = 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    //主线程event_loop</span></span>
<span class="line"><span>    struct event_loop *eventLoop = event_loop_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始tcp_server，可以指定线程数目，如果线程是0，就是在这个线程里acceptor+i/o；如果是1，有一个I/O线程</span></span>
<span class="line"><span>    //tcp_server自己带一个event_loop</span></span>
<span class="line"><span>    struct http_server *httpServer = http_server_new(eventLoop, SERV_PORT, onRequest, 2);</span></span>
<span class="line"><span>    http_server_start(httpServer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // main thread for acceptor</span></span>
<span class="line"><span>    event_loop_run(eventLoop);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这个程序之后，我们可以通过浏览器和curl命令来访问它。你可以同时开启多个浏览器和curl命令，这也证明了我们的程序是可以满足高并发需求的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$curl -v http://127.0.0.1:43211/</span></span>
<span class="line"><span>*   Trying 127.0.0.1...</span></span>
<span class="line"><span>* TCP_NODELAY set</span></span>
<span class="line"><span>* Connected to 127.0.0.1 (127.0.0.1) port 43211 (#0)</span></span>
<span class="line"><span>&amp;gt; GET / HTTP/1.1</span></span>
<span class="line"><span>&amp;gt; Host: 127.0.0.1:43211</span></span>
<span class="line"><span>&amp;gt; User-Agent: curl/7.54.0</span></span>
<span class="line"><span>&amp;gt; Accept: */*</span></span>
<span class="line"><span>&amp;gt;</span></span>
<span class="line"><span>&amp;lt; HTTP/1.1 200 OK</span></span>
<span class="line"><span>&amp;lt; Content-Length: 116</span></span>
<span class="line"><span>&amp;lt; Connection: Keep-Alive</span></span>
<span class="line"><span>&amp;lt;</span></span>
<span class="line"><span>* Connection #0 to host 127.0.0.1 left intact</span></span>
<span class="line"><span>&amp;lt;html&amp;gt;&amp;lt;head&amp;gt;&amp;lt;title&amp;gt;This is network programming&amp;lt;/title&amp;gt;&amp;lt;/head&amp;gt;&amp;lt;body&amp;gt;&amp;lt;h1&amp;gt;Hello, network programming&amp;lt;/h1&amp;gt;&amp;lt;/body&amp;gt;&amp;lt;/html&amp;gt;%</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/719804f279f057a9a12b5904a39e06a5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/155273/719804f279f057a9a12b5904a39e06a5.png" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这一讲我们主要讲述了整个编程框架的字节流处理能力，引入了buffer对象，并在此基础上通过增加HTTP的特性，包括http_server、http_request、http_response，完成了HTTP高性能服务器的编写。实例程序利用框架提供的能力，编写了一个简单的HTTP服务器程序。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>和往常一样，给你布置两道思考题：</p><p>第一道， 你可以试着在HTTP服务器中增加MIME的处理能力，当用户请求/photo路径时，返回一张图片。</p><p>第二道，在我们的开发中，已经有很多面向对象的设计，你可以仔细研读代码，说说你对这部分的理解。</p><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,62)])])}const d=s(t,[["render",l]]);export{h as __pageData,d as default};
