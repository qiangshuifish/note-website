# 75 | RESTfulWebServices（39）：如何使用继承的方式来复用测试？

你好，我是徐昊。今天我们继续使用 TDD 的方式实现 RESTful Web Services。

## 回顾架构愿景与任务列表

![](images/75/1.png)

![](images/75/2.png)

目前的任务列表：

- Resource/RootResource/ResourceMethods

- 使用默认构造函数转换 matrix, form, header, cookie

- 使用默认构造函数转换 List, Set, SortSet, Arrary

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
import static java.util.Arrays.stream;
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
       return (OutboundResponse) method.map(m -> m.call(resourceContext, uri))
               .map(entity -> (entity.getEntity() instanceof OutboundResponse) ?
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
       this.httpMethod = stream(method.getAnnotations()).filter(a -> a.annotatio
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
       Object result = MethodInvoker.invoke(method, resourceContext, builder);
       return result != null ? new GenericEntity<>(result, method.getGenericRetu
   }
   @Override
   public String toString() {
       return method.getDeclaringClass().getSimpleName() + "." + method.getName(
   }
}
class ResourceMethods {
   private Map<String, List<ResourceRouter.ResourceMethod>> resourceMethods;
   public ResourceMethods(Method[] methods) {
       this.resourceMethods = getResourceMethods(methods);
   }
   private static Map<String, List<ResourceRouter.ResourceMethod>> getResourceMe
       return stream(methods).filter(m -> stream(m.getAnnotations())
                       .anyMatch(a -> a.annotationType().isAnnotationPresent(Htt
               .map(DefaultResourceMethod::new)
               .collect(Collectors.groupingBy(ResourceRouter.ResourceMethod::get
   }
   public Optional<ResourceRouter.ResourceMethod> findResourceMethods(String pat
       return findMethod(path, method).or(() -> findAlternative(path, method));
   }
   private Optional<ResourceRouter.ResourceMethod> findAlternative(String path,
       if (HttpMethod.HEAD.equals(method)) return findMethod(path, HttpMethod.GE
       if (HttpMethod.OPTIONS.equals(method)) return Optional.of(new OptionResou
       return Optional.empty();
   }
   private Optional<ResourceRouter.ResourceMethod> findMethod(String path, Strin
       return Optional.ofNullable(resourceMethods.get(method)).flatMap(methods -
   }
   class OptionResourceMethod implements ResourceRouter.ResourceMethod {
       private String path;
       public OptionResourceMethod(String path) {
           this.path = path;
       }
       @Override
       public String getHttpMethod() {
           return HttpMethod.OPTIONS;
       }
       @Override
       public GenericEntity<?> call(ResourceContext resourceContext, UriInfoBuil
           return new GenericEntity<>(Response.noContent().allow(findAllowedMeth
       }
       private Set<String> findAllowedMethods() {
           Set<String> allowed = List.of(HttpMethod.GET, HttpMethod.HEAD, HttpMe
                           HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH)
                   .filter(method -> findMethod(path, method).isPresent()).colle
           allowed.add(HttpMethod.OPTIONS);
           if (allowed.contains(HttpMethod.GET)) allowed.add(HttpMethod.HEAD);
           return allowed;
       }
       @Override
       public UriTemplate getUriTemplate() {
           return new PathTemplate(path);
       }
   }
}
class HeadResourceMethod implements ResourceRouter.ResourceMethod {
   ResourceRouter.ResourceMethod method;
   public HeadResourceMethod(ResourceRouter.ResourceMethod method) {
       this.method = method;
   }
   @Override
   public String getHttpMethod() {
       return HttpMethod.HEAD;
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
       subResourceLocators = stream(methods).filter(m -> m.isAnnotationPresent(P
                       stream(m.getAnnotations()).noneMatch(a -> a.annotationTyp
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
           try {
               Object subResource = MethodInvoker.invoke(method, resourceContext
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

![](images/75/3.jpeg)

## 思考题

除了我们演示的使用继承的方式，还有什么方法可以复用测试？

欢迎把你的思考和想法分享在留言区，咱们下节课再见！
