# 09 | 有状态的Response：实现Session传递与Keep-alive

你好，我是郭屹。今天我们继续手写 MiniTomcat。

上节课我们已经实现对 URI 里路径的解析，用于适配 GET 请求时，将参数代入请求地址的情况，而且在请求参数中引入了 Cookie 与 Session，为 HTTP 引入状态，存储用户的相关信息。但我也提到了，我们暂未在 Response 返回参数中回写 Session 信息，所以客户端程序没办法接受这个信息，自然也无法再回传给 Server，这是我们接下来要改造的方向。

此外，现在我们对一个 Socket 的管理是这样的：建立一个 Socket，交给 Processor 处理，当Processor 处理完毕后随即把这个 Socket 关闭。这样也引出一个问题：一个网页的页面上可能有很多模块，每次都需要访问服务器拿到相应资源，导致本可以使用同一个 Socket 解决的问题，却需要创建多个 Socket，这是对资源的浪费，所以这节课我们也来探讨一下用什么技术来解决这个问题。

接下来我们一起来动手实现。

## 项目结构

这节课我们先只引入了一个工具类 CookieTools，用来处理 Cookie，其余项目结构并没有发生改变，你可以参考我给出的目录。

```
MiniTomcat
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  ├─ server
│  │  │  │  ├─ CookieTools.java
│  │  │  │  ├─ DefaultHeaders.java
│  │  │  │  ├─ HttpConnector.java
│  │  │  │  ├─ HttpHeader.java
│  │  │  │  ├─ HttpProcessor.java
│  │  │  │  ├─ HttpRequest.java
│  │  │  │  ├─ HttpRequestFacade.java
│  │  │  │  ├─ HttpRequestLine.java
│  │  │  │  ├─ HttpResponse.java
│  │  │  │  ├─ HttpResponseFacade.java
│  │  │  │  ├─ HttpServer.java
│  │  │  │  ├─ Request.java
│  │  │  │  ├─ Response.java
│  │  │  │  ├─ ServletProcessor.java
│  │  │  │  ├─ Session.java
│  │  │  │  ├─ SessionFacade.java
│  │  │  │  ├─ SocketInputStream.java
│  │  │  │  ├─ StatisResourceProcessor.java
│  │  ├─ resources
│  ├─ test
│  │  ├─ java
│  │  │  ├─ test
│  │  │  │  ├─ HelloServlet.java
│  │  │  │  ├─ TestServlet.java
│  │  ├─ resources
├─ webroot
│  ├─ test
│  │  ├─ HelloServlet.class
│  │  ├─ TestServlet.class
│  ├─ hello.txt
├─ pom.xml
```

## 有状态的 Response

上节课我们已经构造了 Session，但我们没把它存放到 Response 返回参数里。所以客户端获取不到这个信息，也就没法再回传给 Server。接下来我们开始一步步改造，让 Response 也拥有状态。

首先是添加 CookieTools.java 类，这个类主要用于提供 Cookie 处理工具类。你可以看一下示例代码。

```java
public class CookieTools {
   public static String getCookieHeaderName(Cookie cookie) {
       return "Set-Cookie";
   }
   public static void getCookieHeaderValue(Cookie cookie, StringBuffer buf) {
       String name = cookie.getName();
       if (name == null)
           name = "";
       String value = cookie.getValue();
       if (value == null)
           value = "";
       buf.append(name);
       buf.append("=");
       buf.append(value);
   }
   static void maybeQuote (int version, StringBuffer buf,String value){
       if (version == 0 || isToken (value))
           buf.append (value);
       else {
           buf.append ('"');
           buf.append (value);
           buf.append ('"');
       }
   }
   private static final String tspecials = "()<>@,;:\\\"/[]?={} \t";
   private static boolean isToken (String value) {
       int len = value.length ();
       for (int i = 0; i < len; i++) {
           char c = value.charAt (i);
           if (c < 0x20 || c >= 0x7f || tspecials.indexOf (c) != -1)
               return false;
       }
       return true;
   }
}
```

通过代码可以知道，这个工具类主要是用来快速获取 Cookie 对应的取值，这里我就不多说了。

为了更好地适配对 HTTP 协议的解析，DefaultHeaders 类和 HttpRequest 类中的代码也要一并调整。首先是调整 DefaultHeaders 类中，COOKIE_NAME 与 JSESSIONID_NAME 的值。

```java
package server;
public class DefaultHeaders {
   static final String COOKIE_NAME = "cookie";
   static final String JSESSIONID_NAME = "jsessionid";
}
```

对应 HttpRequest 类中 parseRequestLine 方法也要进行调整。

```java
package server;
public class HttpRequest implements HttpServletRequest {
   private void parseRequestLine() {
       int question = requestLine.indexOf("?");
       if (question >= 0) {
           queryString = new String(requestLine.uri, question + 1, requestLine.u
           uri = new String(requestLine.uri, 0, question);
           String tmp = ";" + DefaultHeaders.JSESSIONID_NAME + "=";
           int semicolon = uri.indexOf(tmp);
           if (semicolon >= 0) {
               sessionid = uri.substring(semicolon+tmp.length());
               uri = uri.substring(0, semicolon);
           }
       } else {
           queryString = null;
           uri = new String(requestLine.uri, 0, requestLine.uriEnd);
           String tmp = ";" + DefaultHeaders.JSESSIONID_NAME + "=";
           int semicolon = uri.indexOf(tmp);
           if (semicolon >= 0) {
               sessionid = uri.substring(semicolon+tmp.length());
               uri = uri.substring(0, semicolon);
           }
       }
   }
}
```

相比之前，主要调整了下面这段解析。

```
 uri = new String(requestLine.uri, 0, requestLine.uriEnd);
 String tmp = ";" + DefaultHeaders.JSESSIONID_NAME + "=";
 int semicolon = uri.indexOf(tmp);
 if (semicolon >= 0) {
   sessionid = uri.substring(semicolon+tmp.length());
   uri = uri.substring(0, semicolon);
 }
```

还有在 parseHeaders 方法中，获取到 header 的 name 之后，增加两行转换代码，确保header 都以小写字母进行比较处理。

```
String name = new String(header.name,0,header.nameEnd);
String value = new String(header.value, 0, header.valueEnd);
name = name.toLowerCase();
```

上述是我们要做的些许前置准备工作，接下来让我们把目光投向 HttpResponse 类，看看如何将 Request 请求内获取的 Cookie 与 Server 生成的 Session 传入 Response 返回参数内，让Client 也能获取到。

HttpRespose 返回类中需要调整的核心方法是 sendHeaders，通过这个方法把参数设置到Response 返回头内，你可以看一下调整后的代码，未改变的部分没有在这里列举出来。

```java
package server;
public class HttpResponse implements HttpServletResponse {
   ArrayList<Cookie> cookies = new ArrayList<>();
   public void sendHeaders() throws IOException {
       PrintWriter outputWriter = getWriter();
       outputWriter.print(this.getProtocol());
       outputWriter.print(" ");
       outputWriter.print(status);
       if (message != null) {
           outputWriter.print(" ");
           outputWriter.print(message);
       }
       outputWriter.print("\r\n");
       if (getContentType() != null) {
           outputWriter.print("Content-Type: " + getContentType() + "\r\n");
       }
       if (getContentLength() >= 0) {
           outputWriter.print("Content-Length: " + getContentLength() + "\r\n");
       }
       Iterator<String> names = headers.keySet().iterator();
       while (names.hasNext()) {
           String name = names.next();
           String value = headers.get(name);
           outputWriter.print(name);
           outputWriter.print(": ");
           outputWriter.print(value);
           outputWriter.print("\r\n");
       }
       HttpSession session = this.request.getSession(false);
       if (session != null) {
           Cookie cookie = new Cookie(DefaultHeaders.JSESSIONID_NAME, session.ge
           cookie.setMaxAge(-1);
           addCookie(cookie);
       }
       synchronized (cookies) {
           Iterator<Cookie> items = cookies.iterator();
           while (items.hasNext()) {
               Cookie cookie = (Cookie) items.next();
               outputWriter.print(CookieTools.getCookieHeaderName(cookie));
               outputWriter.print(": ");
               StringBuffer sbValue = new StringBuffer();
               CookieTools.getCookieHeaderValue(cookie, sbValue);
               System.out.println("set cookie jsessionid string : "+sbValue.toSt
               outputWriter.print(sbValue.toString());
               outputWriter.print("\r\n");
           }
       }
       outputWriter.print("\r\n");
       outputWriter.flush();
  }
   @Override
   public void addCookie(Cookie cookie) {
     synchronized (cookies) {
         cookies.add(cookie);
     }
}
  // 省略其他 getter 和 setter 方法
```

根据 Servlet 规范，Response 的 Header 中 Set-Cookie 需要满足下面的格式，任选一种即可。

- Set-Cookie: <cookie-name>=<cookie-value>

- Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>

- Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>

- Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>

- Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>

- Set-Cookie: <cookie-name>=<cookie-value>; Secure

```xml
在当前的 Server 中，我们就使用了最基本的格式：Set-Cookie: <cookie-name>=
<cookie-value>。参考设置如下：
Set-Cookie: jsessionid=FA73014B317A489994D0B394F4EBF4EA
```

就像上述 sendHeaders 方法里代码展示的，我们增加了一段代码，在 Set-Cookie 中把Session 信息带入进去。

```java
HttpSession session = this.request.getSession(false);
if (session != null) {
   Cookie cookie = new Cookie(DefaultHeaders.JSESSIONID_NAME, session.getId());
   cookie.setMaxAge(-1);
   addCookie(cookie);
}
synchronized (cookies) {
   Iterator<Cookie> items = cookies.iterator();
   while (items.hasNext()) {
       Cookie cookie = (Cookie) items.next();
       outputWriter.print(CookieTools.getCookieHeaderName(cookie));
       outputWriter.print(": ");
       StringBuffer sbValue = new StringBuffer();
       CookieTools.getCookieHeaderValue(cookie, sbValue);
       System.out.println("set cookie jsessionid string : "+sbValue.toString());
       outputWriter.print(sbValue.toString());
       outputWriter.print("\r\n");
   }
}
```

这样，我们就做到了在返回给客户端的信息中带有用户相关信息，之后如果客户端再发请求，就可以把这些用户信息再回传，后端处理的时候就不再需要重新获取用户相关信息，而是可以直接拿到，这样就可以把多次没有上下文关联的 HTTP 访问打包成同一个用户访问。

## Socket 重复使用

接下来我们再粗浅地探讨一下另外一个问题，就像前面提到的，我们目前对 Socket 的使用比较简单，Processor 处理完毕后随即就关闭，这样在页面请求资源比较多的时候，就会成为系统的性能瓶颈。因为这需要每次访问中打开连接和关闭连接。

在 HTTP 协议 1.1 版本中支持了可持续的连接，而且是默认的方式，在 Request 请求头中可以展现。

```
connection: keep-alive
```

在持续的连接中，服务器不会关闭 Socket，这样一个网页的相关资源在发请求时可以共用一个 Socket。所以在客户端和服务器端之间会有多次的请求流和返回流的交互，这样又会产生一个新的问题，就是我们怎么知道什么时候应该关闭它呢？答案是传输完毕后，通过一个头信息告知对方可以关闭了。

```
connection: close
```

还有，对一次请求和返回的交互，对于动态生成的内容我们也无法获取 Content-Length 的数值，客户端怎么知道服务器返回的数据传完了呢？之前把这个值固定写死只适用于简单的返回固定内容的场景。

HTTP 协议也考虑到了这一点，在 1.1 版本中，采用了一个特殊的头部信息 transfer-encoding，来表明数据流采用分块（chunk）的方式进行发送传输。

```
Transfer-Encoding: chunked
```

你可以看一下传输的数据格式的定义。

```
[chunk size][\r\n][chunk data][\r\n][chunk size][\r\n][chunk data][\r\n] …… [chun
```

这种格式我们在这里简单解释一下。

```
编码是由若干个块组成，由一个标明长度为 0 的块结束，也就是说，检测到 chunk size
= 0 表示数据流已传输完毕。
```

2. 每个 chunk 有两部分组成，第一部分是这个分块的长度，第二部分则是前一部分指定长度对应的内容，每个部分用 CRLF 换行符隔开。

3. 结束时只标识 CRLF。

我们用下面这个示意图可以更好地展示数据传输的格式。

```
分块的长度 —— chunk size ｜ CRLF
分块的数据 —— chunk data ｜ CRLF
分块的长度 —— chunk size ｜ CRLF
分块的数据 —— chunk data ｜ CRLF
      ……  // 此处省略
分块的长度 —— chunk size ｜ CRLF
分块的数据 —— chunk data ｜ CRLF
分块的长度 —— 0 ｜ CRLF
结束标识符 —— CRLF
```

有了固定格式之后，就可以按照规定，一部分一部分地发送数据了。也因为分块的存在，我们今后就不需要考虑 content length 这个值了。

这里我给出了一个响应包的参考示例，你可以看一下。

```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked
35
This is the data in the first chunk
26
and this is the second one
3
con
8
sequence
0
```

其中的道理我们理解了之后，接下来我们就可以开始着手改造代码了。在代码里面，我们只是在 Processor 中加上 Keep-alive 的判断，决定是否关闭 Socket。因为是一个粗浅的探讨，所以我们没有真的按照 chunk 的模式回送 response。后面我们也没有实现，探讨这一部分内容主要是为了了解原理。

你可以看一下需要调整的代码。

```java
package server;
public class HttpProcessor implements Runnable{
   private Socket socket;
   private boolean available = false;
   private HttpConnector connector;
   private int serverPort = 0;
   private boolean keepAlive = false;
   private boolean http11 = true;
   public void process(Socket socket) {
       InputStream input = null;
       OutputStream output = null;
       try {
           input = socket.getInputStream();
           output = socket.getOutputStream();
           keepAlive = true;
           while (keepAlive) {
               // create Request object and parse
               HttpRequest request = new HttpRequest(input);
               request.parse(socket);
               // handle session
               if (request.getSessionId() == null || request.getSessionId().equa
                   request.getSession(true);
               }
               // create Response object
               HttpResponse response = new HttpResponse(output);
               response.setRequest(request);
//               response.sendStaticResource();
               request.setResponse(response);
               try {
                   response.sendHeaders();
               } catch (IOException e1) {
                   e1.printStackTrace();
               }
               // check if this is a request for a servlet or a static resource
               // a request for a servlet begins with "/servlet/"
               if (request.getUri().startsWith("/servlet/")) {
                   ServletProcessor processor = new ServletProcessor();
                   processor.process(request, response);
               }
               else {
                   StaticResourceProcessor processor = new StaticResourceProcess
                   processor.process(request, response);
               }
               finishResponse(response);
               System.out.println("response header connection------"+response.ge
               if ("close".equals(response.getHeader("Connection"))) {
                   keepAlive = false;
               }
           }
           // Close the socket
           socket.close();
           socket = null;
       } catch (Exception e) {
           e.printStackTrace();
       }
   }
   private void finishResponse(HttpResponse response) {
       response.finishResponse();
   }
}
```

我们来分析一下这段代码，一个小变动在于新增了 serverPort、keepAlive 与 http11 三个域，而且为了更好的安全性，都用 private 关键字修饰。而核心改动在于 process 方法，把里面的多数方法放置在 while 循环之中，使用 keepAlive 变量控制，如果检测到 response 的头部信息是 close，那么就把 keepAlive 设置成 false，退出循环，关闭 Socket。

而客户端也可以在请求头中加上 Connection: close 指定要关闭连接，因此 HttpRequest 的parseHeaders 方法内也可以进行调整，现在 HttpRequest 中将 parseHeaders 方法调整成下面这个样子了。

```
else if (name.equals(DefaultHeaders.CONNECTION_NAME)) {
   headers.put(name, value);
   if (value.equals("close")) {
       response.setHeader("Connection", "close");
   }
```

增加了是否为 close 的判断，用来设置请求头。

HttpRequest 还有其他调整：新增域和 setter 方法，其他未改动的部分我就不在这里列出了。

```java
package server；
public class HttpRequest implements HttpServletRequest {
   private HttpResponse response;
   public HttpRequest() {
   }
   public void setStream(InputStream input) {
       this.input = input;
       this.sis = new SocketInputStream(this.input, 2048);
   }
   public void setResponse(HttpResponse response) {
       this.response = response;
   }
}
```

再看 HttpResponse 类的调整。

```java
package server；
public class HttpResponse implements HttpServletResponse {
   String characterEncoding = "UTF-8";
   public HttpResponse() {
   }
   public void setStream(OutputStream output) {
       this.output = output;
   }
   //提供这个方法完成输出
   public void finishResponse() {
     try {
         this.getWriter().flush();
     } catch (IOException e) {
         e.printStackTrace();
     }
  }
}
```

而 HttpProcessor 类，就要调用 HttpResponse 中的 finishResponse 方法，这是因为我们修改了一下时序，在 ServletProcessor 中不管 header 头处理了，只调用

```
servlet.service(requestFacade, responseFacade) 这一方法。
```

过去我们在 ServletProcessor 中初始化 ClassLoader，现在把类加载器改写成全局可用的，把初始化放在 HttpConnector 里。

所以接下来我们要改写 ServletProcessor、HttpConnector 两个类。

HttpConnector 主要修改如下：

```java
package server;
public class HttpConnector implements Runnable {
   int minProcessors = 3;
   int maxProcessors = 10;
   int curProcessors = 0;
   Deque<HttpProcessor> processors = new ArrayDeque<>();
   public static Map<String, HttpSession> sessions = new ConcurrentHashMap<>();
   //一个全局的class loader
   public static URLClassLoader loader = null;
   public void run() {
       ServerSocket serverSocket = null;
       int port = 8080;
       try {
           serverSocket = new ServerSocket(port, 1, InetAddress.getByName("127.0
       } catch (IOException e) {
           e.printStackTrace();
           System.exit(1);
       }
       try {
           //class loader初始化
           URL[] urls = new URL[1];
           URLStreamHandler streamHandler = null;
           File classPath = new File(HttpServer.WEB_ROOT);
           String repository = (new URL("file", null, classPath.getCanonicalPath
           urls[0] = new URL(null, repository, streamHandler);
           loader = new URLClassLoader(urls);
       }
       catch (IOException e) {
           System.out.println(e.toString() );
       }
       // initialize processors pool
       for (int i = 0; i < minProcessors; i++) {
           HttpProcessor initprocessor = new HttpProcessor(this);
           initprocessor.start();
           processors.push(initprocessor);
       }
       curProcessors = minProcessors;
       while (true) {
           Socket socket = null;
           try {
               socket = serverSocket.accept();
               HttpProcessor processor = createProcessor();
               if (processor == null) {
                   socket.close();
                   continue;
               }
               processor.assign(socket);
               // Close the socket
//                socket.close();
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }
}
```

HttpConnector 新增了 loader 变量，还将下面这段代码从 ServletProcessor 中移除了。

```java
       try {
           URL[] urls = new URL[1];
           URLStreamHandler streamHandler = null;
           File classPath = new File(HttpServer.WEB_ROOT);
           String repository = (new URL("file", null, classPath.getCanonicalPath
           urls[0] = new URL(null, repository, streamHandler);
           loader = new URLClassLoader(urls);
       }
       catch (IOException e) {
           System.out.println(e.toString());
       }
```

因此 ServletProcessor 的调整就比较简单了，将 servletClass 变量的赋值，直接交由

```
HttpConnector 处理，而且不再需要调用 response.sendHeaders 方法，你可以看一下当
```

前 ServletProcessor 的代码。

```java
package server;
public class ServletProcessor {
   public void process(HttpRequest request, HttpResponse response) {
       String uri = request.getUri();
       String servletName = uri.substring(uri.lastIndexOf("/") + 1);
       response.setCharacterEncoding("UTF-8");
       Class<?> servletClass = null;
       try {
           servletClass = HttpConnector.loader.loadClass(servletName);
       }
       catch (ClassNotFoundException e) {
           System.out.println(e.toString());
       }
       Servlet servlet = null;
       try {
           servlet = (Servlet) servletClass.newInstance();
           HttpRequestFacade requestFacade = new HttpRequestFacade(request);
           HttpResponseFacade responseFacade = new HttpResponseFacade(response);
           System.out.println("Call Service()");
           servlet.service(requestFacade, responseFacade);
       }
       catch (Exception e) {
           System.out.println(e.toString());
       }
       catch (Throwable e) {
           System.out.println(e.toString());
       }
   }
}
```

可以看到，这个类变简单了。

## 测试

```
这节课我们还是在 src/test/java/test 目录下使用 TestServlet 进行测试，这一次我们改
```

写 doGet 方法。

```java
package test;
public class TestServlet extends HttpServlet{
   static int count = 0;
   private static final long serialVersionUID = 1L;
   @Override
   public void doGet(HttpServletRequest request, HttpServletResponse response)th
       System.out.println("Enter doGet()");
       System.out.println("parameter name : "+request.getParameter("name"));
       TestServlet.count++;
       System.out.println("::::::::call count ::::::::: " + TestServlet.count);
       if (TestServlet.count > 2) {
           response.addHeader("Connection", "close");
       }
       HttpSession session = request.getSession(true);
       String user = (String) session.getAttribute("user");
       System.out.println("get user from session : " + user);
       if (user == null || user.equals("")) {
           session.setAttribute("user", "yale");
       }
       response.setCharacterEncoding("UTF-8");
       String doc = "<!DOCTYPE html> \n" +
               "<html>\n" +
               "<head><meta charset=\"utf-8\"><title>Test</title></head>\n"+
               "<body bgcolor=\"#f0f0f0\">\n" +
               "<h1 align=\"center\">" + "Test 你好" + "</h1>\n";
       System.out.println(doc);
       response.getWriter().println(doc);
   }
   public void doPost(HttpServletRequest request, HttpServletResponse response)t
       System.out.println("Enter doGet()");
       System.out.println("parameter name : "+request.getParameter("name"));
       response.setCharacterEncoding("UTF-8");
       String doc = "<!DOCTYPE html> \n" +
               "<html>\n" +
               "<head><meta charset=\"utf-8\"><title>Test</title></head>\n"+
               "<body bgcolor=\"#f0f0f0\">\n" +
               "<h1 align=\"center\">" + "Test 你好" + "</h1>\n";
       System.out.println(doc);
       response.getWriter().println(doc);
   }
}
```

我们在 TestServlet 里面用一个静态全局计数器，如果是第三次以上，就把头部信息设置为

```
Connection:close 。这样从浏览器里可以看到，第一次第二次访问之后，数据返回但是浏
```

览器连接没有停，第三次后才停下来。这说明 keepAlive 参数生效了。但是我们要知道这些探讨都是粗浅的，代码只是演示了这个概念，我们没有完整实现 Keep-alive 以及 Chunked。

## 小结

这节课我们将无状态的 HTTP 连接改造成了有状态的连接，这是通过 Cookie 和 Session 来实现的。具体来讲，首次访问后，在 Response 返回头信息中就带上 jsessionid 和 Cookie 信息，传到客户浏览器端后，再次提交的时候，浏览器带上 jsessionid 传回给服务器，用同一个jsessionid 代表了同一个会话。这样，从用户来看，浏览器服务器多次往返交互就是在一个会话中，从效果上就是把无状态连接变成有状态连接。

然后我们简单探讨了一下 Keep-alive 和 chunked 模式，让同一个 Socket 可以用于多次访问，减少了 Socket 的连接和关闭。但是我们实际实现中对这个的支持并不充分，后面也没有用到。

本节课完整代码参见：https://gitee.com/yaleguo1/minit-learning-demo/tree/geek_chapter09

## 思考题

学完了这节课的内容，我们可以试着练习一下：写一段代码，按照 chunked 模式返回响应内容。

欢迎你把你写的代码分享到评论区，也欢迎你把这节课的内容分享给其他朋友，我们下节课再见！
