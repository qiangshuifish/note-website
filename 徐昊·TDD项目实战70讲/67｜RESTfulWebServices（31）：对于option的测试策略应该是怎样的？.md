# 67 | RESTfulWebServices（31）：对于option的测试策略应该是怎样的？

你好，我是徐昊。今天我们继续使用 TDD 的方式实现 RESTful Web Services。

## 回顾架构愿景与任务列表

![](images/67/1.png)

![](images/67/2.png)

目前的任务列表：

- Resource/RootResource/ResourceMethods

- 当 HEAD 方法映射到 GET 方法时，忽略 GET 的返回值

- 当没有 OPTIONS 方法时，提供默认实现

代码为：

```java
package geektime.tdd.rest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.container.ResourceContext;
import jakarta.ws.rs.core.GenericEntity;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import java.lang.reflect.Method;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
interface ResourceRouter {
   OutboundResponse dispatch(HttpServletRequest request, ResourceContext resourc
   interface Resource extends UriHandler {
       Optional<ResourceMethod> match(UriTemplate.MatchResult result, String htt
   }
   interface ResourceMethod extends UriHandler {
       String getHttpMethod();
       GenericEntity<?> call(ResourceContext resourceContext, UriInfoBuilder bui
   }
}
class DefaultResourceRouter implements ResourceRouter {
   private Runtime runtime;
   private List<Resource> rootResources;
   public DefaultResourceRouter(Runtime runtime, List<Resource> rootResources) {
       this.runtime = runtime;
       this.rootResources = rootResources;
   }
   @Override
   public OutboundResponse dispatch(HttpServletRequest request, ResourceContext
       String path = request.getServletPath();
       UriInfoBuilder uri = runtime.createUriInfoBuilder(request);
       Optional<ResourceMethod> method = UriHandlers.mapMatched(path, rootResour
       if (method.isEmpty()) return (OutboundResponse) Response.status(Response.
       return (OutboundResponse) method.map(m -> m.call(resourceContext, uri)).m
               .orElseGet(() -> Response.noContent().build());
   }
   private Optional<ResourceMethod> findResourceMethod(HttpServletRequest reques
       return handler.match(matched.get(), request.getMethod(),
               Collections.list(request.getHeaders(HttpHeaders.ACCEPT)).toArray(
   }
}
class DefaultResourceMethod implements ResourceRouter.ResourceMethod {
   private String httpMethod;
   private UriTemplate uriTemplate;
   private Method method;
   public DefaultResourceMethod(Method method) {
       this.method = method;
       this.uriTemplate = new PathTemplate(Optional.ofNullable(method.getAnnotat
       this.httpMethod = Arrays.stream(method.getAnnotations()).filter(a -> a.an
               .findFirst().get().annotationType().getAnnotation(HttpMethod.clas
   }
   @Override
   public String getHttpMethod() {
       return httpMethod;
   }
   @Override
   public UriTemplate getUriTemplate() {
       return uriTemplate;
   }
   @Override
   public GenericEntity<?> call(ResourceContext resourceContext, UriInfoBuilder
       return null;
   }
   @Override
   public String toString() {
       return method.getDeclaringClass().getSimpleName() + "." + method.getName(
   }
}
class   ResourceMethods {
   private Map<String, List<ResourceRouter.ResourceMethod>> resourceMethods;
   public ResourceMethods(Method[] methods) {
       this.resourceMethods = getResourceMethods(methods);
   }
   private static Map<String, List<ResourceRouter.ResourceMethod>> getResourceMe
       return Arrays.stream(methods).filter(m -> Arrays.stream(m.getAnnotations(
                       .anyMatch(a -> a.annotationType().isAnnotationPresent(Htt
               .map(DefaultResourceMethod::new)
               .collect(Collectors.groupingBy(ResourceRouter.ResourceMethod::get
   }
   public Optional<ResourceRouter.ResourceMethod> findResourceMethods(String pat
       return findMethod(path, method).or(() -> findAlternative(path, method));
   }
   private Optional<ResourceRouter.ResourceMethod> findAlternative(String path,
       return "HEAD".equals(method) ? findMethod(path, "GET").map(HeadResourceMe
   }
   private Optional<ResourceRouter.ResourceMethod> findMethod(String path, Strin
       return Optional.ofNullable(resourceMethods.get(method)).flatMap(methods -
   }
}
class HeadResourceMethod implements ResourceRouter.ResourceMethod {
   ResourceRouter.ResourceMethod method;
   public HeadResourceMethod(ResourceRouter.ResourceMethod method) {
       this.method = method;
   }
   @Override
   public String getHttpMethod() {
       return method.getHttpMethod();
   }
   @Override
   public GenericEntity<?> call(ResourceContext resourceContext, UriInfoBuilder
       method.call(resourceContext, builder);
       return null;
   }
   @Override
   public UriTemplate getUriTemplate() {
       return method.getUriTemplate();
   }
}
class SubResourceLocators {
   private final List<ResourceRouter.Resource> subResourceLocators;
   public SubResourceLocators(Method[] methods) {
       subResourceLocators = Arrays.stream(methods).filter(m -> m.isAnnotationPr
                       Arrays.stream(m.getAnnotations()).noneMatch(a -> a.annota
               .map((Function<Method, ResourceRouter.Resource>) SubResourceLocat
   }
   public Optional<ResourceRouter.ResourceMethod> findSubResourceMethods(String
       return UriHandlers.mapMatched(path, subResourceLocators, (result, locator
   }
   static class SubResourceLocator implements ResourceRouter.Resource {
       private PathTemplate uriTemplate;
       private Method method;
       public SubResourceLocator(Method method) {
           this.method = method;
           this.uriTemplate = new PathTemplate(method.getAnnotation(Path.class).
       }
       @Override
       public UriTemplate getUriTemplate() {
           return uriTemplate;
       }
       @Override
       public String toString() {
           return method.getDeclaringClass().getSimpleName() + "." + method.getN
       }
       @Override
       public Optional<ResourceRouter.ResourceMethod> match(UriTemplate.MatchRes
           Object resource = builder.getLastMatchedResource();
           try {
               Object subResource = method.invoke(resource);
               return new ResourceHandler(subResource, uriTemplate).match(result
           } catch (Exception e) {
               throw new RuntimeException(e);
           }
       }
   }
}
class ResourceHandler implements ResourceRouter.Resource {
   private UriTemplate uriTemplate;
   private ResourceMethods resourceMethods;
   private SubResourceLocators subResourceLocators;
   private Function<ResourceContext, Object> resource;
   public ResourceHandler(Class<?> resourceClass) {
       this(resourceClass, new PathTemplate(getTemplate(resourceClass)), rc -> r
   }
   private static String getTemplate(Class<?> resourceClass) {
       if (!resourceClass.isAnnotationPresent(Path.class)) throw new IllegalArgu
       return resourceClass.getAnnotation(Path.class).value();
   }
   public ResourceHandler(Object resource, UriTemplate uriTemplate) {
       this(resource.getClass(), uriTemplate, rc -> resource);
   }
   private ResourceHandler(Class<?> resourceClass, UriTemplate uriTemplate, Func
       this.uriTemplate = uriTemplate;
       this.resourceMethods = new ResourceMethods(resourceClass.getMethods());
       this.subResourceLocators = new SubResourceLocators(resourceClass.getMetho
       this.resource = resource;
   }
   @Override
   public Optional<ResourceRouter.ResourceMethod> match(UriTemplate.MatchResult
       builder.addMatchedResource(resource.apply(resourceContext));
       String remaining = Optional.ofNullable(result.getRemaining()).orElse("");
       return resourceMethods.findResourceMethods(remaining, httpMethod)
               .or(() -> subResourceLocators.findSubResourceMethods(remaining, h
   }
   @Override
   public UriTemplate getUriTemplate() {
       return uriTemplate;
   }
}
```

## 视频演示

进入今天的环节：

![](images/67/3.jpeg)

## 思考题

今天的问题比较有意思：目前的代码中，有个重大的 Bug，请思考这个 Bug 是什么？

欢迎把你的思路和想法分享出来，我们下节课再见！
