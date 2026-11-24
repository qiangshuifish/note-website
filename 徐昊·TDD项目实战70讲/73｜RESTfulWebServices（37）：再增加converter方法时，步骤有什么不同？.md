# 73 | RESTfulWebServices（37）：再增加converter方法时，步骤有什么不同？

你好，我是徐昊。今天我们继续使用 TDD 的方式实现 RESTful Web Services。

## 回顾架构愿景与任务列表

![](images/73/1.png)

![](images/73/2.png)

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
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ResourceContext;
import jakarta.ws.rs.core.GenericEntity;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.Type;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import static geektime.tdd.rest.DefaultResourceMethod.ValueConverter.singeValued;
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
       try {
           UriInfo uriInfo = builder.createUriInfo();
           Object result = method.invoke(builder.getLastMatchedResource(),
                   stream(method.getParameters()).map(parameter ->
                           providers.stream().map(provider -> provider.provide(p
                                   .findFirst()
                                   .flatMap(values -> values.flatMap(v -> conver
                                   .orElse(null)).toArray(Object[]::new));
           return result != null ? new GenericEntity<>(result, method.getGeneric
       } catch (IllegalAccessException | InvocationTargetException e) {
           throw new RuntimeException(e);
       }
   }
   private Optional<Object> convert(Parameter parameter, List<String> values) {
       return PrimitiveConverter.convert(parameter, values)
               .or(() -> ConverterConstructor.convert(parameter.getType(), value
   }
   private static ValueProvider pathParam = (parameter, uriInfo) ->
           Optional.ofNullable(parameter.getAnnotation(PathParam.class))
                   .map(annotation -> uriInfo.getPathParameters().get(annotation
   private static ValueProvider queryParam = (parameter, uriInfo) ->
           Optional.ofNullable(parameter.getAnnotation(QueryParam.class))
                   .map(annotation -> uriInfo.getQueryParameters().get(annotatio
   private static List<ValueProvider> providers = List.of(pathParam, queryParam)
   interface ValueProvider {
       Optional<List<String>> provide(Parameter parameter, UriInfo uriInfo);
   }
   interface ValueConverter<T> {
       T fromString(List<String> values);
       static <T> ValueConverter<T> singeValued(Function<String, T> converter) {
           return values -> converter.apply(values.get(0));
       }
   }
   @Override
   public String toString() {
       return method.getDeclaringClass().getSimpleName() + "." + method.getName(
   }
}
class PrimitiveConverter {
   private static Map<Type, DefaultResourceMethod.ValueConverter<Object>> primit
           int.class, singeValued(Integer::parseInt),
           double.class, singeValued(Double::parseDouble),
           short.class, singeValued(Short::parseShort),
           float.class, singeValued(Float::parseFloat),
           byte.class, singeValued(Byte::parseByte),
           boolean.class, singeValued(Boolean::parseBoolean),
           String.class, singeValued(s -> s));
   public static Optional<Object> convert(Parameter parameter, List<String> valu
       return Optional.ofNullable(primitives.get(parameter.getType()))
               .map(c -> c.fromString(values));
   }
}
class ConverterConstructor {
   public static Optional<Object> convert(Class<?> converter, String value) {
       try {
           return Optional.of(converter.getConstructor(String.class).newInstance
       } catch (InstantiationException | IllegalAccessException | InvocationTarg
                NoSuchMethodException e) {
           return Optional.empty();
       }
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

![](images/73/3.jpeg)

## 思考题

1. 思考：如何提取方法调用部分，交给 sub resource 使用？

2. 分享：对于学习 TDD，你的初衷是什么？驱动力是什么呢？

欢迎把你的思考和想法分享在评论区，我们下节课再见！
