# 09 | 分解Dispatcher：如何把专门的事情交给专门的部件去做？

你好，我是郭屹。今天我们继续手写 MiniSpring。

经过上节课的工作，我们已经实现了 IoC 与 MVC 的结合，还定义了 Dispatcher 与WebApplicationContext 两个相对独立又互相关联的结构。

这节课我们计划在已有的 ApplicationConfigWebApplicationContext 和 DispatcherServlet 基础上，把功能做进一步地分解，让 Dispatcher 只负责解析 request 请求，用 Context 专门用来管理各个 Bean。

## 两级 ApplicationContext

按照通行的 Web 分层体系，一个程序它在结构上会有 Controller 和 Service 两层。在我们的程序中，Controller 由 DispatcherServlet 负责启动，Service 由 Listener 负责启动。我们计划把这两部分所对应的容器进行进一步地切割，拆分为 XmlWebApplicationContext 和AnnotationConfigWebApplicationContext。

首先在 DispatcherServlet 这个类里，增加一个对 WebApplicationContext 的引用，命名为parentApplicationContext。这样，当前这个类里就有了两个对 WebApplicationContext 的引用。

```
private WebApplicationContext webApplicationContext;
private WebApplicationContext parentApplicationContext;
```

新增 parentApplicationContext 的目的是，把 Listener 启动的上下文和 DispatcherServlet 启动的上下文两者区分开来。按照时序关系，Listener 启动在前，对应的上下文我们把它叫作parentApplicationContext。

我们调整一下 init() 方法。

```java
public void init(ServletConfig config) throws ServletException {
   super.init(config);
   this.parentApplicationContext = (WebApplicationContext)
this.getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION
_CONTEXT_ATTRIBUTE);
   sContextConfigLocation =
config.getInitParameter("contextConfigLocation");
   URL xmlPath = null;
 try {
   xmlPath = this.getServletContext().getResource(sContextConfigLocation);
 } catch (MalformedURLException e) {
   e.printStackTrace();
 }
   this.packageNames = XmlScanComponentHelper.getNodeValue(xmlPath);
   this.webApplicationContext = new
AnnotationConfigWebApplicationContext(sContextConfigLocation,
this.parentApplicationContext);
   Refresh();
}
```

初始化的时候先从 ServletContext 里拿属性WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE，得到的是前一步 Listener 存放在这里的那个 parentApplicationContext。然后通过 contextConfigLocation配置文件，创建一个新的 WebApplicationContext。

从上述代码，我们可以发现，里面构建了一个 AnnotationConfigWebApplicationContext 对象，这个对象的构造函数需要两个参数，一个是配置文件路径，另一个是父上下文。但以前AnnotationConfigWebApplicationContext 只有一个参数为 String 的构造函数。所以这里我们需要扩展改造一下，把 DispatcherServlet 里一部分和扫描包相关的代码移到AnnotationConfigWebApplicationContext 里。你可以看一下修改后的AnnotationConfigWebApplicationContext 代码。

```java
package com.minis.web;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;
import com.minis.beans.BeansException;
import com.minis.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor;
import com.minis.beans.factory.config.BeanDefinition;
import com.minis.beans.factory.config.BeanFactoryPostProcessor;
import com.minis.beans.factory.config.ConfigurableListableBeanFactory;
import com.minis.beans.factory.support.DefaultListableBeanFactory;
import com.minis.context.AbstractApplicationContext;
import com.minis.context.ApplicationEvent;
import com.minis.context.ApplicationEventPublisher;
import com.minis.context.ApplicationListener;
import com.minis.context.SimpleApplicationEventPublisher;
public class AnnotationConfigWebApplicationContext
         extends AbstractApplicationContext implements WebApplicationContext{
 private WebApplicationContext parentApplicationContext;
 private ServletContext servletContext;
 DefaultListableBeanFactory beanFactory;
 private final List<BeanFactoryPostProcessor> beanFactoryPostProcessors =
     new ArrayList<BeanFactoryPostProcessor>();
 public AnnotationConfigWebApplicationContext(String fileName) {
   this(fileName, null);
 }
 public AnnotationConfigWebApplicationContext(String fileName, WebApplicationCon
   this.parentApplicationContext = parentApplicationContext;
   this.servletContext = this.parentApplicationContext.getServletContext();
       URL xmlPath = null;
   try {
     xmlPath = this.getServletContext().getResource(fileName);
   } catch (MalformedURLException e) {
     e.printStackTrace();
   }
       List<String> packageNames = XmlScanComponentHelper.getNodeValue(xmlPath);
       List<String> controllerNames = scanPackages(packageNames);
     DefaultListableBeanFactory bf = new DefaultListableBeanFactory();
       this.beanFactory = bf;
       this.beanFactory.setParent(this.parentApplicationContext.getBeanFactory()
       loadBeanDefinitions(controllerNames);
       if (true) {
           try {
       refresh();
     } catch (Exception e) {
       e.printStackTrace();
     }
       }
 }
 public void loadBeanDefinitions(List<String> controllerNames) {
       for (String controller : controllerNames) {
           String beanID=controller;
           String beanClassName=controller;
           BeanDefinition beanDefinition=new BeanDefinition(beanID,beanClassName
           this.beanFactory.registerBeanDefinition(beanID,beanDefinition);
       }
 }
   private List<String> scanPackages(List<String> packages) {
     List<String> tempControllerNames = new ArrayList<>();
     for (String packageName : packages) {
       tempControllerNames.addAll(scanPackage(packageName));
     }
     return tempControllerNames;
   }
   private List<String> scanPackage(String packageName) {
     List<String> tempControllerNames = new ArrayList<>();
       URL url  =this.getClass().getClassLoader().getResource("/"+packageName.re
       File dir = new File(url.getFile());
       for (File file : dir.listFiles()) {
           if(file.isDirectory()){
             scanPackage(packageName+"."+file.getName());
           }else{
               String controllerName = packageName +"." +file.getName().replace(
               tempControllerNames.add(controllerName);
           }
       }
       return tempControllerNames;
   }
 public void setParent(WebApplicationContext parentApplicationContext) {
   this.parentApplicationContext = parentApplicationContext;
   this.beanFactory.setParent(this.parentApplicationContext.getBeanFactory());
 }
 public ServletContext getServletContext() {
   return this.servletContext;
 }
 public void setServletContext(ServletContext servletContext) {
   this.servletContext = servletContext;
 }
 public void publishEvent(ApplicationEvent event) {
   this.getApplicationEventPublisher().publishEvent(event);
 }
 public void addApplicationListener(ApplicationListener listener) {
   this.getApplicationEventPublisher().addApplicationListener(listener);
 }
 public void registerListeners() {
   ApplicationListener listener = new ApplicationListener();
   this.getApplicationEventPublisher().addApplicationListener(listener);
 }
 public void initApplicationEventPublisher() {
   ApplicationEventPublisher aep = new SimpleApplicationEventPublisher();
   this.setApplicationEventPublisher(aep);
 }
 public void postProcessBeanFactory(ConfigurableListableBeanFactory bf) {
 }
 public void registerBeanPostProcessors(ConfigurableListableBeanFactory bf) {
   this.beanFactory.addBeanPostProcessor(new AutowiredAnnotationBeanPostProcesso
 }
 public void onRefresh() {
   this.beanFactory.refresh();
 }
 public void finishRefresh() {
 }
 public ConfigurableListableBeanFactory getBeanFactory() throws IllegalStateExce
   return this.beanFactory;
 }
}
```

这段代码的核心是扩充原有的构造方法。通过下面两行代码得到 parentApplicationContext 和servletContext 的引用。

```
this.parentApplicationContext = parentApplicationContext;
this.servletContext = this.parentApplicationContext.getServletContext();
```

为了兼容原有构造方法，在只有 1 个参数的时候，给 WebApplicationContext 传入了一个null。可以看到，修改后的 AnnotationConfigWebApplicationContext 继承自抽象类AbstractApplicationContext，所以也具备了上下文的通用功能，例如注册监听器、发布事件等。

其次是改造 DefaultListableBeanFactory，因为 AnnotationConfigWebApplicationContext 里调用了 DefaultListableBeanFactory 的 setParent 方法，所以我们需要提供相应的实现方法，你可以看一下相关代码。

```java
   ConfigurableListableBeanFactory parentBeanFactory;
   public void setParent(ConfigurableListableBeanFactory beanFactory) {
       this.parentBeanFactory = beanFactory;
   }
```

接下来我们还要改造 XmlWebApplicationContext，在继承 ClassPathXmlApplicationContext的基础上实现 WebApplicationContext 接口，基本上我们可以参考AnnotationConfigWebApplicationContext 来实现。

```java
package com.minis.web;
import javax.servlet.ServletContext;
import com.minis.context.ClassPathXmlApplicationContext;
public class XmlWebApplicationContext
         extends ClassPathXmlApplicationContext implements WebApplicationContext
 private ServletContext servletContext;
 public XmlWebApplicationContext(String fileName) {
   super(fileName);
 }
 public ServletContext getServletContext() {
   return this.servletContext;
 }
 public void setServletContext(ServletContext servletContext) {
   this.servletContext = servletContext;
 }
}
```

到这里，我们就进一步拆解了 DispatcherServlet，拆分出两级 ApplicationContext，当然启动过程还是由 Listener 来负责。所以最后 ContextLoaderListener 初始化时是创建XmlWebApplicationContext 对象。

```
WebApplicationContext wac = new XmlWebApplicationContext(sContextLocation);
```

到这里，Web 环境下的两个 ApplicationContext 都构建完毕了，WebApplicationContext 持有对 parentApplicationContext 的单向引用。当调用 getBean() 获取 Bean 时，先从WebApplicationContext 中获取，若为空则通过 parentApplicationContext 获取，你可以看一下代码。

```
   public Object getBean(String beanName) throws BeansException {
       Object result = super.getBean(beanName);
       if (result == null) {
           result = this.parentBeanFactory.getBean(beanName);
       }
       return result;
   }
```

## 抽取调用方法

拆解的工作还要继续进行，基本的思路是将专业事情交给不同的专业部件来做，我们来看看还有哪些工作是可以分出来的。从代码可以看到现在 doGet() 方法是这样实现的。

```
 Method method = this.mappingMethods.get(sPath);
 obj = this.mappingObjs.get(sPath);
 objResult = method.invoke(obj);
 response.getWriter().append(objResult.toString());
```

这个程序就是简单地根据 URL 找到对应的方法和对象，然后通过反射调用方法，最后把方法执行的返回值写到 response 里。我们考虑把通过 URL 映射到某个实例方法的过程抽取出来，还要考虑把对方法的调用也单独抽取出来。仿照 Spring 框架，我们新增RequestMappingHandlerMapping 与 RequestMappingHandlerAdapter，分别对应这两个独立的部件。

首先将 HandlerMapping 与 HandlerAdapter 抽象出来，定义接口，然后基于接口来编程。

```java
package com.minis.web.servlet;
import javax.servlet.http.HttpServletRequest;
public interface HandlerMapping {
 HandlerMethod getHandler(HttpServletRequest request) throws Exception;
}
package com.minis.web.servlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public interface HandlerAdapter {
 void handle(HttpServletRequest request, HttpServletResponse response, Object ha
}
```

其中可以看到，HandlerMapping 中定义的 getHandler 方法参数是 http request，返回一个HandlerMethod 对象，这个地方就是封装的这种映射关系。你可以看一下 HandlerMethod 对象的定义。

```java
package com.minis.web.servlet;
import java.lang.reflect.Method;
public class HandlerMethod {
 private  Object bean;
 private  Class<?> beanType;
 private  Method method;
 private  MethodParameter[] parameters;
 private  Class<?> returnType;
 private  String description;
 private  String className;
 private  String methodName;
 public HandlerMethod(Method method, Object obj) {
   this.setMethod(method);
   this.setBean(obj);
 }
 public Method getMethod() {
   return method;
 }
 public void setMethod(Method method) {
   this.method = method;
 }
 public Object getBean() {
   return bean;
 }
 public void setBean(Object bean) {
   this.bean = bean;
 }
}
```

接下来增加一个 MappingRegistry 类，这个类有三个属性：urlMappingNames、mappingObjs和 mappingMethods，用来存储访问的 URL 名称与对应调用方法及 Bean 实例的关系。你可以看一下相关定义。

```java
package com.minis.web.servlet;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
public class MappingRegistry {
   private List<String> urlMappingNames = new ArrayList<>();
   private Map<String,Object> mappingObjs = new HashMap<>();
   private Map<String,Method> mappingMethods = new HashMap<>();
 public List<String> getUrlMappingNames() {
   return urlMappingNames;
 }
 public void setUrlMappingNames(List<String> urlMappingNames) {
   this.urlMappingNames = urlMappingNames;
 }
 public Map<String,Object> getMappingObjs() {
   return mappingObjs;
 }
 public void setMappingObjs(Map<String,Object> mappingObjs) {
   this.mappingObjs = mappingObjs;
 }
 public Map<String,Method> getMappingMethods() {
   return mappingMethods;
 }
 public void setMappingMethods(Map<String,Method> mappingMethods) {
   this.mappingMethods = mappingMethods;
 }
}
```

通过上面的代码可以看出，这三个属性以前其实都已经存在了，是定义在 DispatcherServlet里的，现在换一个位置，通过 MappingRegistry 这个单独的部件来存放和管理这个映射关系。

好了，有了这些准备之后，我们来看 RequestMappingHandlerMapping 的实现，它要实现HandlerMapping 接口，初始化过程就是遍历 WAC 中已经注册的所有的 Bean，并处理带有@RequestMapping 注解的类，使用 mappingRegistry 存储 URL 地址与方法和实例的映射关系。对外它要实现 getHandler() 方法，通过 URL 拿到 method 的调用。

相关源代码如下：

```java
package com.minis.web.servlet;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;
import com.minis.beans.BeansException;
import com.minis.web.RequestMapping;
import com.minis.web.WebApplicationContext;
public class RequestMappingHandlerMapping implements HandlerMapping{
   WebApplicationContext wac;
   private final MappingRegistry mappingRegistry = new MappingRegistry();
   public RequestMappingHandlerMapping(WebApplicationContext wac) {
       this.wac = wac;
       initMapping();
   }
   //建立URL与调用方法和实例的映射关系，存储在mappingRegistry中
   protected void initMapping() {
       Class<?> clz = null;
       Object obj = null;
       String[] controllerNames = this.wac.getBeanDefinitionNames();
       //扫描WAC中存放的所有bean
       for (String controllerName : controllerNames) {
           try {
               clz = Class.forName(controllerName);
               obj = this.wac.getBean(controllerName);
           } catch (Exception e) {
       e.printStackTrace();
     }
           Method[] methods = clz.getDeclaredMethods();
           if (methods != null) {
               //检查每一个方法声明
               for (Method method : methods) {
                   boolean isRequestMapping =
method.isAnnotationPresent(RequestMapping.class);
                   //如果该方法带有@RequestMapping注解,则建立映射关系
                   if (isRequestMapping) {
                       String methodName = method.getName();
                       String urlmapping =
method.getAnnotation(RequestMapping.class).value();
                       this.mappingRegistry.getUrlMappingNames().add(urlmapping)
                       this.mappingRegistry.getMappingObjs().put(urlmapping,
obj);
                       this.mappingRegistry.getMappingMethods().put(urlmapping,
method);
                   }
               }
           }
       }
   }
   //根据访问URL查找对应的调用方法
   public HandlerMethod getHandler(HttpServletRequest request) throws Exception
{
       String sPath = request.getServletPath();
   if (!this.mappingRegistry.getUrlMappingNames().contains(sPath)) {
     return null;
   }
       Method method = this.mappingRegistry.getMappingMethods().get(sPath);
       Object obj = this.mappingRegistry.getMappingObjs().get(sPath);
       HandlerMethod handlerMethod = new HandlerMethod(method, obj);
       return handlerMethod;
   }
}
```

这样我们就得到了独立的 RequestMappingHandlerMapping 部件，把以前写在DispatcherServlet 里的代码移到这里来了。

接下来就轮到 RequestMappingHandlerAdapter 的实现了，它要实现 HandlerAdapter 接口，主要就是实现 handle() 方法，基本过程是接受前端传 request、 response 与 handler，通过反射中的 invoke 调用方法并处理返回数据。

相关源代码如下：

```java
package com.minis.web.servlet;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.minis.web.WebApplicationContext;
public class RequestMappingHandlerAdapter implements HandlerAdapter {
 WebApplicationContext wac;
 public RequestMappingHandlerAdapter(WebApplicationContext wac) {
   this.wac = wac;
 }
 public void handle(HttpServletRequest request, HttpServletResponse response, Ob
     throws Exception {
   handleInternal(request, response, (HandlerMethod) handler);
 }
 private void handleInternal(HttpServletRequest request, HttpServletResponse res
     HandlerMethod handler) {
   Method method = handler.getMethod();
   Object obj = handler.getBean();
   Object objResult = null;
   try {
     objResult = method.invoke(obj);
   } catch (Exception e) {
     e.printStackTrace();
   }
   try {
     response.getWriter().append(objResult.toString());
   } catch (IOException e) {
     e.printStackTrace();
   }
 }
}
```

重点看一下 handleInternal() 方法就知道了，这里就是简单地通过反射调用某个方法，然后把返回值写到 response 里。这些程序代码以前就有，只不过现在移到单独的这个部件中了。

最后需要修改 DispatcherServlet 中的实现，相关代码移走，放到了上面的两个部件中。所以在 DispatcherServlet 类中需要增加对 HandlerMapping 与 HandlerAdapter 的引用，在初始化方法 refresh() 中增加 initHandlerMapping 与 initHandlerAdapter 两个方法，为引用的HandlerMapping 与 HandlerAdapter 赋值。

你可以看下 DispatcherServlet 的 refresh() 的改造结果。

```
refresh()  {
     initController();
   initHandlerMappings(this.webApplicationContext);
   initHandlerAdapters(this.webApplicationContext);
}
```

初始化这两个部件的代码如下：

```java
   protected void initHandlerMappings(WebApplicationContext wac) {
     this.handlerMapping = new RequestMappingHandlerMapping(wac);
   }
   protected void initHandlerAdapters(WebApplicationContext wac) {
     this.handlerAdapter = new RequestMappingHandlerAdapter(wac);
   }
```

DispatcherServlet 的分发过程也要改造一下，不再通过 doGet() 方法了，而是通过重写的service 方法来实现的，而 service 方法则调用了 doDispatch 方法，这个方法内部通过handlerMapping 获取到对应 handlerMethod，随后通过 HandlerAdapter 进行处理，你可以看一下这个类修改后的源代码。

```java
protected void service(HttpServletRequest request, HttpServletResponse
response) {
   request.setAttribute(WEB_APPLICATION_CONTEXT_ATTRIBUTE,
this.webApplicationContext);
 try {
   doDispatch(request, response);
 } catch (Exception e) {
   e.printStackTrace();
 }
 finally {
 }
}
protected void doDispatch(HttpServletRequest request, HttpServletResponse
response) throws Exception{
   HttpServletRequest processedRequest = request;
   HandlerMethod handlerMethod = null;
   handlerMethod = this.handlerMapping.getHandler(processedRequest);
   if (handlerMethod == null) {
   return;
 }
   HandlerAdapter ha = this.handlerAdapter;
   ha.handle(processedRequest, response, handlerMethod);
}
```

可以看到，经过这么一改造，相比之前 DispatcherServlet 的代码简化了很多，并且当前业务程序不用再固定写死在 doGet() 方法里面，可以按照自身的业务需求随意使用任何方法名，也为今后提供多种请求方式，例如 POST、PUT、DELETE 等提供了便利。

以前，用原始的 Servlet 规范，我们的业务逻辑全部写在 doGet()、doPost() 等方法中，每一个业务逻辑程序都是一个独立的 Servlet。现在经过我们这几节课的操作，整个系统用一个唯一的 DispatcherServlet 来拦截请求，并根据注解，定位需要调用的方法，我们就能够更加专注于本身业务代码的实现。这种我们称之为 Dispatcher 的设计模式也是要用心学习的。

## 小结

这节课我们的主要工作就是拆解 Dispatcher。首先拆解的是 ApplicationContext，现在我们有了两级上下文，一级用于 IoC 容器，我们叫 parent 上下文，一级用于 Web 上下文，WebApplicationContext 持有对 parent 上下文的引用。方便起见，我们还增加了@RequestMapping 注解来声明 URL 映射，然后新增 RequestMappingHandlerMapping 与RequestMappingHandlerAdapter，分别包装 URL 映射关系和映射后的处理过程。

通过这些拆解工作，我们就把 DispatcherServlet 的功能进行了分治，把专门的事情交给专门的部件去完成，有利于今后的扩展。

完整源代码参见 https://github.com/YaleGuo/minis

## 课后题

学完这节课，我也给你留一道思考题。目前，我们只支持了 GET 方法，你能不能尝试自己增加 POST 方法。想一想，需要改变现有的程序结构吗？欢迎你在留言区和我交流讨论，也欢迎你把这节课分享给需要的朋友。我们下节课见！
