# 29 | DIContainer（17）：如何重构ContextConfig内部的实现？

- 登录

- 课程介绍

### 下线通知

- 该账号已在其他同类设备登录，如非本人操作，则密码可能已经泄露，建议立即更换密码

- 确定

你好，我是徐昊。今天我们继续使用 TDD 的方式实现注入依赖容器。

## 回顾代码与任务列表

到目前为止，我们的代码是这样的：

```java
InjectProvider.java:
package geektime.tdd.di;
import jakarta.inject.Inject;
import java.lang.reflect.*;
import java.util.*;
import java.util.function.BiFunction;
```

- 新人学习立返50% 购课币

```java
import java.util.stream.Stream;
import static java.util.Arrays.stream;
```

- 立即登录

```python
import static java.util.stream.Stream.concat;
class InjectionProvider<T> implements ContextConfig.ComponentProvider<T> {
   private Constructor<T> injectConstructor;
```

- 登录

```
   private List<Field> injectFields;
   private List<Method> injectMethods;
   public InjectionProvider(Class<T> component) {
       if (Modifier.isAbstract(component.getModifiers())) throw new IllegalCompo
       this.injectConstructor = getInjectConstructor(component);
       this.injectFields = getInjectFields(component);
       this.injectMethods = getInjectMethods(component);
       if (injectFields.stream().anyMatch(f -> Modifier.isFinal(f.getModifiers()
           throw new IllegalComponentException();
       if (injectMethods.stream().anyMatch(m -> m.getTypeParameters().length !=
           throw new IllegalComponentException();
   }
   @Override
   public T get(Context context) {
       try {
           T instance = injectConstructor.newInstance(toDependencies(context, in
           for (Field field : injectFields) field.set(instance, toDependency(con
           for (Method method : injectMethods) method.invoke(instance, toDepende
           return instance;
```

### 下线通知

```
       } catch (InvocationTargetException | InstantiationException | IllegalAcce
           throw new RuntimeException(e);
       }
```

- 该账号已在其他同类设备登录，如非本人

```
   }
```

- 操作，则密码可能已经泄露，建议立即更

```
   @Override
```

- 换密码

```
   public List<Context.Ref> getDependencies() {
       return concat(concat(stream(injectConstructor.getParameters()).map(Parame
```

- 确定

```java
                       injectFields.stream().map(Field::getGenericType)),
               injectMethods.stream().flatMap(m -> stream(m.getParameters()).map
               .map(Context.Ref::of).toList();
   }
   private static <T> List<Method> getInjectMethods(Class<T> component) {
       List<Method> injectMethods = traverse(component, (methods, current) -> in
               .filter(m -> isOverrideByInjectMethod(methods, m))
               .filter(m -> isOverrideByNoInjectMethod(component, m)).toList());
       Collections.reverse(injectMethods);
       return injectMethods;
   }
   private static <T> List<Field> getInjectFields(Class<T> component) {
       return traverse(component, (fields, current) -> injectable(current.getDec
   }
   private static <Type> Constructor<Type> getInjectConstructor(Class<Type> impl
       List<Constructor<?>> injectConstructors = injectable(implementation.getCo
       if (injectConstructors.size() > 1) throw new IllegalComponentException();
```

- 新人学习立返50% 购课币

```
       return (Constructor<Type>) injectConstructors.stream().findFirst().orElse
   }
```

- 立即登录

```java
   private static <Type> Constructor<Type> defaultConstructor(Class<Type> implem
       try {
           return implementation.getDeclaredConstructor();
```

- 登录

```java
       } catch (NoSuchMethodException e) {
           throw new IllegalComponentException();
       }
   }
   private static <T> List<T> traverse(Class<?> component, BiFunction<List<T>, C
       List<T> members = new ArrayList<>();
       Class<?> current = component;
       while (current != Object.class) {
           members.addAll(finder.apply(members, current));
           current = current.getSuperclass();
       }
       return members;
   }
   private static <T extends AnnotatedElement> Stream<T> injectable(T[] declared
       return stream(declaredFields).filter(f -> f.isAnnotationPresent(Inject.cl
   }
   private static boolean isOverride(Method m, Method o) {
       return o.getName().equals(m.getName()) && Arrays.equals(o.getParameterTyp
   }
```

### 下线通知

```java
   private static <T> boolean isOverrideByNoInjectMethod(Class<T> component, Met
       return stream(component.getDeclaredMethods()).filter(m1 -> !m1.isAnnotati
   }
```

- 该账号已在其他同类设备登录，如非本人

```java
   private static boolean isOverrideByInjectMethod(List<Method> injectMethods, M
```

- 操作，则密码可能已经泄露，建议立即更

```
       return injectMethods.stream().noneMatch(o -> isOverride(m, o));
```

- 换密码

```java
   }
   private static Object[] toDependencies(Context context, Executable executable
```

- 确定

```java
       return stream(executable.getParameters()).map(p -> toDependency(context,
   }
   private static Object toDependency(Context context, Field field) {
       return toDependency(context, field.getGenericType());
   }
   private static Object toDependency(Context context, Type type) {
       return context.get(Context.Ref.of(type)).get();
   }
}
Context.java:
package geektime.tdd.di;
import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Objects;
import java.util.Optional;
```

- 新人学习立返50% 购课币

```java
public interface Context {
   <ComponentType> Optional<ComponentType> get(Ref<ComponentType> ref);
```

- 立即登录

```java
   class Ref<ComponentType> {
       public static <ComponentType> Ref<ComponentType> of(Class<ComponentType>
           return new Ref(component, null);
```

- 登录

```java
       }
       public static <ComponentType> Ref<ComponentType> of(Class<ComponentType>
           return new Ref(component, qualifier);
       }
       public static Ref of(Type type) {
           return new Ref(type, null);
       }
       private Type container;
       private Class<ComponentType> component;
       private Annotation qualifier;
       Ref(Type type, Annotation qualifier) {
          init(type);
          this.qualifier = qualifier;
       }
       protected Ref() {
           Type type = ((ParameterizedType) getClass().getGenericSuperclass()).g
           init(type);
       }
       private void init(Type type) {
```

### 下线通知

```
           if (type instanceof ParameterizedType container) {
               this.container = container.getRawType();
               this.component = (Class<ComponentType>) container.getActualTypeAr
```

- 该账号已在其他同类设备登录，如非本人

```
           } else
```

- 操作，则密码可能已经泄露，建议立即更

```
               this.component = (Class<ComponentType>) type;
```

- 换密码

```
       }
       public Type getContainer() {
```

- 确定

```
           return container;
       }
       public Class<?> getComponent() {
           return component;
       }
       public boolean isContainer() {
           return container != null;
       }
       public Annotation getQualifier() {
           return qualifier;
       }
       @Override
       public boolean equals(Object o) {
           if (this == o) return true;
           if (o == null || getClass() != o.getClass()) return false;
           Ref ref = (Ref) o;
           return Objects.equals(container, ref.container) && component.equals(r
       }
```

- 新人学习立返50% 购课币

```
       @Override
       public int hashCode() {
```

- 立即登录

```
           return Objects.hash(container, component);
       }
   }
```

- 登录

```java
}
ContextConfig.java:
package geektime.tdd.di;
import jakarta.inject.Provider;
import java.lang.annotation.Annotation;
import java.util.*;
public class ContextConfig {
   private Map<Class<?>, ComponentProvider<?>> providers = new HashMap<>();
   private Map<Component, ComponentProvider<?>> components = new HashMap<>();
   public <Type> void bind(Class<Type> type, Type instance) {
       providers.put(type, (ComponentProvider<Type>) context -> instance);
   }
   public <Type> void bind(Class<Type> type, Type instance, Annotation... qualif
       for (Annotation qualifier : qualifiers)
           components.put(new Component(type, qualifier), context -> instance);
   }
   record Component(Class<?> type, Annotation qualifiers) {
```

### 下线通知

```
   }
   public <Type, Implementation extends Type>
   void bind(Class<Type> type, Class<Implementation> implementation) {
```

- 该账号已在其他同类设备登录，如非本人

```
       providers.put(type, new InjectionProvider<>(implementation));
```

- 操作，则密码可能已经泄露，建议立即更

```
   }
```

- 换密码

```
   public <Type, Implementation extends Type>
   void bind(Class<Type> type, Class<Implementation> implementation, Annotation.
```

- 确定

```
       for (Annotation qualifier : qualifiers)
           components.put(new Component(type, qualifier), new InjectionProvider<
   }
   public Context getContext() {
       providers.keySet().forEach(component -> checkDependencies(component, new
       return new Context() {
           @Override
           public <ComponentType> Optional<ComponentType> get(Ref<ComponentType>
               if (ref.getQualifier() != null) {
                   return Optional.ofNullable(components.get(new Component(ref.g
               }
               if (ref.isContainer()) {
                   if (ref.getContainer() != Provider.class) return Optional.emp
                   return (Optional<ComponentType>) Optional.ofNullable(provider
                           .map(provider -> (Provider<Object>) () -> provider.ge
               }
               return Optional.ofNullable(providers.get(ref.getComponent())).map
           }
```

- 新人学习立返50% 购课币

```
       };
   }
```

- 立即登录

```java
   private void checkDependencies(Class<?> component, Stack<Class<?>> visiting)
       for (Context.Ref dependency : providers.get(component).getDependencies())
           if (!providers.containsKey(dependency.getComponent()))
```

- 登录

```
               throw new DependencyNotFoundException(component, dependency.getCo
           if (!dependency.isContainer()) {
               if (visiting.contains(dependency.getComponent())) throw new Cycli
               visiting.push(dependency.getComponent());
               checkDependencies(dependency.getComponent(), visiting);
               visiting.pop();
           }
       }
   }
   interface ComponentProvider<T> {
       T get(Context context);
       default List<Context.Ref> getDependencies() {
           return List.of();
       }
   }
}
```

### 下线通知

任务列表的状态为：

- 该账号已在其他同类设备登录，如非本人无需构造的组件——组件实例操作，则密码可能已经泄露，建议立即更换密码如果注册的组件不可实例化，则抛出异常

- 确定抽象类

- 接口

- 构造函数注入

- 无依赖的组件应该通过默认构造函数生成组件实例

- 有依赖的组件，通过 Inject 标注的构造函数生成组件实例

- 如果所依赖的组件也存在依赖，那么需要对所依赖的组件也完成依赖注入

- 如果组件有多于一个 Inject 标注的构造函数，则抛出异常

- 如果组件没有 Inject 标注的构造函数，也没有默认构造函数（新增任务）

- 如果组件需要的依赖不存在，则抛出异常新人学习立返50% 购课币如果组件间存在循环依赖，则抛出异常立即登录

- 字段注入登录通过 Inject 标注将字段声明为依赖组件

- 如果字段为 final 则抛出异常

- 依赖中应包含 Inject Field 声明的依赖

- 方法注入

- 通过 Inject 标注的方法，其参数为依赖组件

- 通过 Inject 标注的无参数方法，会被调用

- 按照子类中的规则，覆盖父类中的 Inject 方法

- 如果方法定义类型参数，则抛出异常

- 依赖中应包含 Inject Method 声明的依赖

### 下线通知

- 对 Provider 类型的依赖

- 从容器中取得组件的 Provider（新增任务）该账号已在其他同类设备登录，如非本人注入构造函数中可以声明对于 Provider 的依赖操作，则密码可能已经泄露，建议立即更换密码注入字段中可以声明对于 Provider 的依赖确定注入方法中可声明对于 Provider 的依赖

- 将构造函数中的 Provider 加入依赖（新增任务）

- 将字段中的 Provider 加入依赖（新增任务）

- 将方法中的 Provider 加入依赖（新增任务）

- 自定义 Qualifier 的依赖

- 注册组件时，可额外指定 Qualifier

- 针对 instance 指定一个 Qualifieri（新增任务）

- 针对组件指定一个 Qualiifer（新增任务）

- 针对 instance 指定多个 Qualifieri（新增任务）新人学习立返50% 购课币针对组件指定多个 Qualiifer（新增任务）立即登录

- 注册组件时，如果不是合法的 Qualifier，则不接受组件注册（新增任务）登录寻找依赖时，需同时满足类型与自定义 Qualifier 标注

- 在检查依赖时使用 Qualifier（新增任务）

- 在检查循环依赖时使用 Qualifier（新增任务）

- 构造函数注入可以使用 Qualifier 声明依赖（新增任务）

- 如果不是合法的 Qualifier，则组件非法

- 字段注入可以使用 Qualifier 声明依赖（新增任务）

- 如果不是合法的 Qualifier，则组件非法

- 函数注入可以使用 Qualifier 声明依赖（新增任务）

- 如果不是合法的 Qualifier，则组件非法

### 下线通知

- 支持默认 Qualifier——Named（不需要）

- 注册组件时，可从类对象上提取 Qualifier（不需要）该账号已在其他同类设备登录，如非本人Singleton 生命周期操作，则密码可能已经泄露，建议立即更换密码注册组件时，可额外指定是否为 Singleton确定注册组件时，可从类对象上提取 Singleton 标注

- 对于包含 Singleton 标注的组件，在容器范围内提供唯一实例

- 容器组件默认不是 Single 生命周期

- 自定义 Scope 标注

- 可向容器注册自定义 Scope 标注的回调

- 新人学习立返50% 购课币
