# 第9章SpringMVC实践(3)

## 9.4　访问 Web 资源

前面我们都在聊如何编写 Web 服务端的内容，如何发布服务与资源，通过浏览器和一些工具就能访问我们发布的内容。但在一个分布式系统里，我们通常都是编写代码用客户端来进行访问的。这一节里就让我们一起来了解一下如何使用 Spring Framework 提供的

```
RestTemplate 来访问 Web 资源。
```

### 9.4.1　通过 RestTemplate 访问 Web 资源

```sql
RestTemplate 封装了常用的 HTTP 操作，支持 GET、POST、PUT、DELETE、HEAD、
PATCH 和 OPTIONS 方法，表 9-16 罗列了 RestTemplate 的一些常用方法，本节后面还会
聊到 exchange() 等方法。
```

表 9-16　RestTemplate 的一些常用方法

- 对应 HTTP 方法

方法名

- 返回类型说明

```
getForObject()
T
GET
```

- 获取内容并转换为指定

通常，Spring Boot 的自动配置都会为我们提供所需的 Bean，早期的 Spring Boot 的确也提供

```
了一个默认的 RestTemplate Bean，但是在后来的版本中又把它去掉了。不过，
RestTemplateAutoConfiguration 为我们提供了 RestTemplateBuilder Bean，
RestTemplateAutoConfiguration 会将上下文中的 RestTemplateCustomizer 和
RestTemplateRequestCustomizer 收集起来，放到 RestTemplateBuilder 里。而我
们可以直接通过这个 RestTemplateBuilder 的 build() 方法来构造自己的
RestTemplate Bean。
接下来，我们通过一个例子来演示如何通过 RestTemplate 来模拟顾客的操作，访问我们的
```

二进制奶茶店。

- 需求描述　二进制奶茶店准备得差不多了，有了菜单，顾客也可以下订单了，现在该看看来到门店的顾客都有哪些行为了。顾客来到店门口之后，可能会先张望一下，看看有没有开门，没开门的话可能直接走开，也可能稍微等上一会儿，开门的话可能进来瞄一眼菜单。一般人查看菜单可能会有这样一些习惯：先看看菜单上第一项；

- 浏览一下有没有自己喜欢的；

- 把整个菜单看完再说。

- 我们已经有了所需的菜单服务，现在该让顾客出场了。

第 5 章里我们已经写了一个简单的等待开门的 Customer 工程，此处在它的基础上稍作修改。14

- 第一步，调整一下 pom.xml，增加 Spring MVC 等 Web 支持，因为菜单上有金额，所以还

```xml
需要 Joda Money 相关的支持，在 <dependencies/> 中增加如下内容。
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
   <groupId>org.joda</groupId>
   <artifactId>joda-money</artifactId>
   <version>1.0.1</version>
</dependency>
<dependency>
   <groupId>com.fasterxml.jackson.datatype</groupId>
   <artifactId>jackson-datatype-joda-money</artifactId>
   <version>2.13.1</version>
</dependency>
第二步，调整主类 CustomerApplication，因为引入了 spring-boot-starter-web，所以默
```

认会启动 Web 容器，我们目前只希望开发一个命令行运行的程序，所以需要自定义 Spring 应

```
用，使用 WebApplicationType.NONE 将应用指定为非 Web 类型。此外，通过
RestTemplateBuilder 来定义我们自己的 RestTemplate，这里设置一下超时时间。对
于 Money 类型，我们还需要定义 JodaMoneyModule 来处理序列化相关的事宜。具体如代
```

码示例 9-22 所示。

```java
代码示例 9-22　调整后的 CustomerApplication
@SpringBootApplication
public class CustomerApplication {
   public static void main(String[] args) {
       new SpringApplicationBuilder()
            .sources(CustomerApplication.class)
            .web(WebApplicationType.NONE)
            .run(args);
   }
   @Bean
   public RestTemplate restTemplate(RestTemplateBuilder builder) {
       return builder
               .setConnectTimeout(Duration.ofSeconds(1)) // 连接超时
               .setReadTimeout(Duration.ofSeconds(5)) // 读取超时
               .build();
   }
   @Bean
   public JodaMoneyModule jodaMoneyModule() {
       return new JodaMoneyModule();
   }
   @Bean
   public ExitCodeGenerator waitExitCodeGenerator(ApplicationArguments args) {
       return () -> (args.containsOption("wait") ? 0 : 1);
   }
}
第三步，调整原来的 WaitForOpenRunner，本来它只是根据命令行参数来决定是否等待，
```

等完就退出的。现在我们的 BinaryTea 服务端准备好了，可以通过访问服务端来判断是否可以

```
提供服务，所以这里就用 RestTemplate 来发起 GET 请求，能获得 200 OK 的响应码就说
```

明奶茶店开门了。具体如代码示例 9-23 所示。

```java
代码示例 9-23　调整后的 WaitForOpenRunner
@Component
@Slf4j
@Order(2)
public class WaitForOpenRunner implements ApplicationRunner, ApplicationContextAw
   @Setter
   private ApplicationContext applicationContext;
   @Autowired
   private RestTemplate restTemplate;
   @Value("$")
   private String binarytea;
   @Override
   public void run(ApplicationArguments args) throws Exception {
       boolean flag = isOpen(); // 开门了吗？
       flag = flag ? true : (waitForOpen(args) && isOpen()); // 没开门，等一下再看看
       if (!flag) { // 没开门就退出
           log.info("店没开门，走了");
           System.exit(SpringApplication.exit(applicationContext));
       } else {
           log.info("店开门了，进去看看");
       }
   }
   private boolean waitForOpen(ApplicationArguments args) throws InterruptedExce
       boolean needWait = args.containsOption("wait");
       if (!needWait) {
           log.info("如果没开门，就不用等了。");
       } else {
           List<String> waitSeconds = args.getOptionValues("wait");
           if (!waitSeconds.isEmpty()) {
               int seconds = NumberUtils.parseNumber(waitSeconds.get(0), Integer
               log.info("还没开门，先等{}秒。", seconds);
               Thread.sleep(seconds * 1000);
           }
       }
       return needWait;
   }
   private boolean isOpen() {
       ResponseEntity<String> entity = null;
       try {
           entity = restTemplate.getForEntity(binarytea + "/menu", String.class)
           return entity.getStatusCode().is2xxSuccessful();
       } catch (Exception e) {
           log.warn("应该还没开门，访问出错：{}", e.getMessage());
       }
       return false;
   }
}
代码示例 9-26 中的 waitForOpen() 就是从原来的 run() 方法里抽取出来的，专门判断是
否要等待，以及要等多久。isOpen() 方法向服务端发起一个 GET 请求，这里访问的是
http://localhost:8080/menu，返回的是 JSON，暂时先用 String 来处理，反正也不用这个返
回值，只需要判断响应码即可。在 application.properties 中加上 binarytea.url
```

配置，这是我们要访问的服务器地址和端口：

```
binarytea.url=http://localhost:8080
```

- 15

```
如果命令行上传入 --wait=5，也就是等待 5 秒
```

- ，在不启动服务端的情况下，我们得到的

输出大概是下面这样的：

```
2020-12-13 23:40:16.586 INFO 24352 --- [main] l.spring.customer.ArgsPrinterRunner
分别是：--wait=5
2020-12-13 23:40:16.609 WARN 24352 --- [main] l.spring.customer.WaitForOpenRunner
访问出错：I/O error on GET request for "http://localhost:8080/menu": Connection ref
2020-12-13 23:40:16.610 INFO 24352 --- [main] l.spring.customer.WaitForOpenRunner
2020-12-13 23:40:21.613 WARN 24352 --- [main] l.spring.customer.WaitForOpenRunner
访问出错：I/O error on GET request for "http://localhost:8080/menu": Connection ref
2020-12-13 23:40:21.613 INFO 24352 --- [main] l.spring.customer.WaitForOpenRunner
```

最后，来实现查看菜单内容的功能。先要在 Customer 工程中也定义一个菜单的模型，基本与BinaryTea 中的一样，但不需要增加 JPA 的注解，为了简单，也不需要表示杯型大小的枚举了，具体如代码示例 9-24 所示。

```java
代码示例 9-24　Customer 工程中的 MenuItem
@Getter
@Setter
@ToString
public class MenuItem {
   private Long id;
   private String name;
   private String size;
   private Money price;
   private Date createTime;
   private Date updateTime;
}
编写一个 MenuRunner 类，其中包含了需求中提到的三种查看菜单的动作，都是用的
getForObject() 方法，不过这里会演示三种不同的用法，具体如代码示例 9-25 所示。
返回类型指定为具体的类 MenuItem，同时，传入的 URL 中包含占位符 ﻿，这里根据占位
```

- 符的顺序选择参数中的值。

```
返回列表，暂时还用 String 来做返回值，但占位符替换不再用可变参数，而是使用
Map<String, ?>，其中的键与占位符对应。
```

- URL 中没有占位符需要替换，最简单的调用。

```java
代码示例 9-25　包含三种查看菜单动作的 MenuRunner
@Component
@Slf4j
@Order(3)
public class MenuRunner implements ApplicationRunner {
   @Autowired
   private RestTemplate restTemplate;
   @Value("$")
   private String binarytea;
   @Override
   public void run(ApplicationArguments args) throws Exception {
       MenuItem item = restTemplate.getForObject(binarytea + "/menu/", MenuItem.
       log.info("菜单上的第一项是{}", item);
       String coffee = restTemplate.getForObject(binarytea + "/menu?name=", Stri
               Collections.singletonMap("name", "Java咖啡"));
       log.info("有Java咖啡吗？{}", coffee);
       String menuJson = restTemplate.getForObject(binarytea + "/menu", String.c
       log.info("完整菜单：{}", menuJson);
   }
}
```

- 需求描述　顾客在看完菜单之后，就要开始点单了。之前在 Web 页面上有个下单的功能，现在是时候把这个功能挪到客户端来实现了。

```java
在上一节的例子里，OrderController 只能处理表单请求，而我们暂时还无法用
RestTemplate 来发起表单请求（后面会介绍如何发送带有请求头的 HTTP 请求），所以在
第 9 章的 binarytea-rest-controller 例子中，我们简单修改一下 OrderController，增加一
个处理 REST 请求的新建订单方法，如代码示例 9-26 所示。新增的 createNewOrder() 方
法仅处理 application/json 的请求，使用同样的表单对象，但增加了 @RequestBody 注
解，将整个请求正文转换为 NewOrderForm，并进行了校验，其他的逻辑和之前处理表单的
createNewOrder() 别无二致，最后返回一个 Optional<Order>。
代码示例 9-26　增加了 REST 接口的 OrderController 类
@Controller
@RequestMapping("/order")
@Slf4j
public class OrderController {
   // 省略其他内容
   @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
   @ResponseBody
   public Optional<Order> createNewOrder(@RequestBody @Valid NewOrderForm form,
                                         HttpServletResponse response) {
       if (result.hasErrors()) {
           log.warn("参数不正确，[{}]", result.getAllErrors());
           response.setStatus(HttpStatus.BAD_REQUEST.value());
           return Optional.empty();
       }
       response.setStatus(HttpStatus.CREATED.value());
       return Optional.ofNullable(createNewOrderWithForm(form));
   }
   private Order createNewOrderWithForm(NewOrderForm form) {
       List<MenuItem> itemList = form.getItemIdList().stream()
               .map(i -> NumberUtils.toLong(i)).collect(Collectors.collectingAnd
               list -> menuService.getByIdList(list)));
       Order order = orderService.createOrder(itemList, form.getDiscount());
       log.info("创建新订单，Order={}", order);
       return order;
   }
}
在客户端上，我们新建一个 OrderRunner，其中使用
restTemplate.postForObject() 来发送 POST 请求。请求的正文是一个
NewOrderForm 对象，这个类的内容与服务端一致，只是在注解上稍作调整，去掉了校验相
关的注解，增加了一个 @Builder，方便创建对象。@NoArgsConstructor 和
@AllArgsConstructor 是为了在序列化和反序列化时能有合适的构造方法，如代码示例 9-
```

27 所示。

```java
代码示例 9-27　客户端里调整后的 NewOrderForm
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewOrderForm {
   private List<String> itemIdList;
   private int discount;
}
而 OrderRunner 则如代码示例 9-28 所示，它的逻辑很简单，创建一个 NewOrderForm，
其中只有一个编号为 1 的饮料，折扣为 90，用 POST 方法发送到服务端，返回的内容先以
```

JSON 字符串输出。

```java
代码示例 9-28　用来创建订单的 OrderRunner
@Component
@Order(5)
@Setter
@Slf4j
public class OrderRunner implements ApplicationRunner {
   @Autowired
   private RestTemplate restTemplate;
   @Value("$")
   private String binarytea;
   @Override
   public void run(ApplicationArguments args) throws Exception {
       callForObject();
   }
   protected String callForObject() {
       NewOrderForm form = NewOrderForm.builder().itemIdList(Arrays.asList("1"))
       String response = restTemplate.postForObject(binarytea + "/order", form,
       log.info("下订单：{}", response);
       return response;
   }
}
```

程序运行后的效果大概是下面这样的：

```
2020-12-15 00:50:10.022 INFO 37900 --- [main] learning.spring.customer.OrderRunne
"maker":null,"items":[{"id":1,"name":"Java咖啡","size":"MEDIUM","price":{"amount":
"CNY"},"createTime":"2020-12-14T16:49:48.918+00:00","updateTime":"2020-12-14T16:4
"amount":{"discount":90,"totalAmount":{"amount":12.00,"currency":"CNY"},"payAmoun
"currency":"CNY"}},"status":"ORDERED","createTime":"2020-12-14T16:50:09.987+00:00
"2020-12-14T16:50:09.987+00:00"}
```

### 9.4.2　RestTemplate 的进阶用法

面对简单的 HTTP 操作时，上一小节提到的方法就已经绰绰有余了，但现实中往往会有很多复杂的情况，例如，要在请求中传递多个请求头，需要判断应答中的 HTTP 响应码。如果结果复

```
杂一些，例如包含 List、Map 等数据结构，还要把泛型类型用起来……这些事情
RestTemplate 都可以帮我们轻松搞定。
```

1. 通过 HttpEntity<T> 进行复杂操作HTTP 头是 HTTP 请求和应答中的重要部分，根据 HTTP 响应码和 HTTP 头可以做很多处理，在发送请求时也可以在 HTTP 头里带入很多信息。在之前的内容中，我们的代码并没

```
有对 HTTP 头做太多处理，只是在使用 Postman 时做了些简单修改。在 RestTemplate
中，可以用 RequestEntity<T> 和 ResponseEntity<T> 分别表示请求和响应，它们
都继承了 HttpEntity<T>，其中包含了 HTTP 头和正文，正文会被转换为给定的类型
T。
我们可以将上一节的例子稍作调整，用 postForEntity() 代替 postForObject()，
```

- 重新写一个请求方法，打印出 HTTP 头和正文，如代码示例 9-29 所示。

```java
代码示例 9-29　用来演示 ResponseEntity<T> 的 OrderRunner 类
@Component
1
@Order(5)
2
@Setter
3
@Slf4j
4
public class OrderRunner implements ApplicationRunner {
5
   @Autowired
6
   private RestTemplate restTemplate;
7
   @Value("$")
8
   private String binarytea;
9
10
   @Override
11
   public void run(ApplicationArguments args) throws Exception {
12
       callForEntity();
13
   }
14
15
   protected ResponseEntity<String> callForEntity() {
16
       NewOrderForm form = NewOrderForm.builder().itemIdList(Arrays.asList("1
17
18
       ResponseEntity<String> response = restTemplate.postForEntity(binarytea
19
       log.info("HTTP Status: {}, Headers: ", response.getStatusCode());
20
       response.getHeaders().entrySet().forEach(e -> log.info("{}: {}", e.getK
21
       log.info("Body: {}", response.getBody());
22
       return response;
23
   }
24
   // 省略其他内容
25
}
26
```

- 上面的代码运行后的效果大概会是下面这样的，包含 HTTP 响应码、响应中的所有 HTTP头以及响应正文：

```java
2020-12-16 00:28:17.866 INFO 44944 --- [main] learning.spring.customer.OrderRun
1
201 CREATED, Headers:
2
2020-12-16 00:28:17.868 INFO 44944 --- [main] learning.spring.customer.OrderRun
3
[application/json]
4
2020-12-16 00:28:17.868 INFO 44944 --- [main] learning.spring.customer.OrderRun
5
[436]
6
2020-12-16 00:28:17.868 INFO 44944 --- [main] learning.spring.customer.OrderRun
7
Dec 2020 16:28:17 GMT]
8
2020-12-16 00:28:17.868 INFO 44944 --- [main] learning.spring.customer.OrderRun
9
[timeout=60]
10
2020-12-16 00:28:17.868 INFO 44944 --- [main] learning.spring.customer.OrderRun
11
[keep-alive]
12
2020-12-16 00:28:17.868 INFO 44944 --- [main] learning.spring.customer.OrderRun
13
"maker":null,"items":[{"id":1,"name":"Java咖啡","size":"MEDIUM","price":{"amoun
14
"CNY"},"createTime":"2020-12-15T16:28:08.084+00:00","updateTime":"2020-12-15T16
15
"amount":{"discount":90,"totalAmount":{"amount":12.00,"currency":"CNY"},"payAmo
16
"currency":"CNY"}},"status":"ORDERED","createTime":"2020-12-15T16:28:17.835+00
17
"2020-12-15T16:28:17.835+00:00"}
18
postForXxx() 方法中传递的请求对象也可以直接传入一个 HttpEntity<T> 对象（严
格说起来这里的请求，应该是 RequestEntity<T>，里面可以对 HTTP 头做各种控制）。
可以像代码示例 9-30 这样把 callForEntity() 稍微修改一下。
代码示例 9-30　请求对象改为 RequestEntity<T>
@Component
1
@Order(5)
2
@Setter
3
@Slf4j
4
public class OrderRunner implements ApplicationRunner {
5
   @Autowired
6
   private RestTemplate restTemplate;
7
   @Value("$")
8
   private String binarytea;
9
10
   @Override
11
   public void run(ApplicationArguments args) throws Exception {
12
       callWithEntity();
13
   }
14
15
   protected ResponseEntity<String> callWithEntity() {
16
       NewOrderForm form = NewOrderForm.builder().itemIdList(Arrays.asList("1
17
       URI uri = UriComponentsBuilder.fromUriString(binarytea + "/order").buil
18
       RequestEntity<NewOrderForm> request = RequestEntity.post(uri).contentTy
19
           .APPLICATION_JSON).body(form);
20
       ResponseEntity<String> response = restTemplate.postForEntity(binarytea
21
           String.class);
22
       log.info("HTTP Status: {}, Headers: ", response.getStatusCode());
23
       response.getHeaders().entrySet().forEach(e -> log.info("{}: {}", e.getK
24
       log.info("Body: {}", response.getBody());
25
       return response;
26
   }
27
   // 省略其他内容
28
}
29
```

2. 处理响应中的泛型在上面的所有例子里，我们都只是简单地指定了请求和返回对象的类型，那如果我们希望返

```
回的类型带有泛型又该怎么办呢？以 MenuController 的 getAll() 方法为例，返回的
是 JSON 字符串，内容是一个列表，我们该怎么将它还原为 List<MenuItem> 呢？这时
就该轮到 RestTemplate 的 exchange() 方法登场了，它在指定返回类型时，不仅可以
简单地给出一个 Class<T>，也可以传入一个 ParameterizedTypeReference<T>，通
```

- 过这个对象来指定泛型类型。具体如代码示例 9-31 所示。

```java
代码示例 9-31　通过 exchange() 方法查询菜单
@Component
1
@Slf4j
2
@Order(3)
3
public class MenuRunner implements ApplicationRunner {
4
   @Autowired
5
   private RestTemplate restTemplate;
6
   @Value("$")
7
   private String binarytea;
8
9
   @Override
10
   public void run(ApplicationArguments args) throws Exception {
11
       // 省略其他内容
12
       getAllMenu();
13
   }
14
15
   private void getAllMenu() {
16
       ParameterizedTypeReference<List<MenuItem>>typeReference =
17
               new ParameterizedTypeReference<List<MenuItem>>() {};
18
       URI uri = UriComponentsBuilder.fromUriString(binarytea + "/menu").build
19
       RequestEntity<Void> request = RequestEntity.get(uri).accept(MediaType.A
20
       ResponseEntity<List<MenuItem>> response = restTemplate.exchange(request
21
       log.info("响应码：{}", response.getStatusCode());
22
       response.getBody().forEach( menuItem -> log.info("条目：{}", menuItem))
23
   }
24
}
25
```

3. HTTP 客户端的单元测试在日常的开发工作中，服务端与客户端的代码通常是由不同人编写的，而且会出现两者并行开发的情况。这时没办法向真实的服务端发起请求，又或者开发者希望能在自己的电脑上运行单元测试，而不依赖任何其他组件。一般这类情况下会有两种做法：

- 将发起 HTTP 请求的客户端代码剥离出来，写成单独的类，通过 Mockito 等工具，模拟出这个对象，上层业务代码通过模拟的类进行测试；16通过 MockWebServer等工具模拟出一个服务端，它能接收请求并作出响应。

- 显然，相比第一种方式，第二种方式有一个好处，就是它能覆盖具体发起 HTTP 请求的代码，所以，在这里我们来演示一下如何通过 MockWebServer 编写一个单元测试，大概分成下面几个步骤：

```
(1) 引入 com.squareup.okhttp3:mockwebserver 依赖；
(2) 在测试类中构造并启动 MockWebServer；
(3) 获取 MockWebServer 的端口，设置到客户端；
```

- (4) 构造模拟的请求应答；

- (5) 客户端发起 HTTP 调用；

- (6) 验证客户端收到应答后的处理情况；

- (7) 验证模拟服务器收到的请求信息。

- 我们就以代码示例 9-29 为例，为它编写一个单元测试，先在 pom.xml 中增加如下依赖：

```java
<dependency>
1
   <groupId>com.squareup.okhttp3</groupId>
2
   <artifactId>mockwebserver</artifactId>
3
   <scope>test</scope>
4
</dependency>
5
测试的公共部分如代码示例 9-32 所示，@BeforeAll 是在所有测试运行前执行的，在这里
我们创建并启动了 MockWebServer；@AfterAll 在所有测试运行结束后执行，负责关闭
MockWebServer；@BeforeEach 是在每个测试运行前都会执行的，这里我们直接新建一
个 OrderRunner，设置对应的属性；其实还有 @AfterEach，可以在每个测试运行后进
行一些操作，这个例子里的清理就是把 this.runner 设置为 null，因为我们每次都会
new 一个，所以不用做这步动作，就不用写了。
代码示例 9-32　OrderRunnerTest 测试类的公共部分
class OrderRunnerTest {
1
   private static MockWebServer webServer;
2
   private OrderRunner runner;
3
   private ObjectMapper objectMapper = new ObjectMapper();
4
5
   @BeforeAll
6
   static void setUp() throws IOException {
7
       webServer = new MockWebServer();
8
       webServer.start();
9
   }
10
11
   @AfterAll
12
   static void tearDown() throws IOException {
13
       webServer.shutdown();
14
   }
15
16
   @BeforeEach
17
   void setUpBeforeEach() {
18
       runner = new OrderRunner();
19
       runner.setRestTemplate(new RestTemplate());
20
       runner.setBinarytea("http://localhost:" + webServer.getPort());
21
   }
22
   // 省略具体测试方法
23
}
24
针对 callForEntity() 的测试方法 testCallForEntity() 的具体代码如代码示例 9-
33 所示，我们先构造了一个模拟的应答，设置了 201 Created 响应码、Content-Type
头和应答的正文，通过 enqueue() 方法将其设置到 MockWebServer 里；随后调用
runner.callForEntity() 发起请求，再验证响应和请求的内容。
代码示例 9-33　callForEntity() 的测试方法
class OrderRunnerTest {
1
   // 省略公共部分代码
2
   @Test
3
   void testCallForEntity() throws Exception {
4
       // 构造应答
5
       String body = "{\"id\":1, \"status\":\"ORDERED\"}";
6
       MockResponse response = new MockResponse().setResponseCode(HttpStatus.C
7
               .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON
8
       webServer.enqueue(response);
9
10
       ResponseEntity<String> entity = runner.callForEntity();
11
       // 验证响应
12
       assertEquals(HttpStatus.CREATED, entity.getStatusCode());
13
       assertEquals(MediaType.APPLICATION_JSON_VALUE,entity.getHeaders().getFi
14
       assertEquals(body, entity.getBody());
15
16
       // 验证请求
17
       RecordedRequest request = webServer.takeRequest();
18
       assertEquals("/order", request.getPath());
19
20
       NewOrderForm form = objectMapper.readValue(request.getBody().readUtf8()
21
       assertLinesMatch(Arrays.asList("1"), form.getItemIdList());
22
       assertEquals(90, form.getDiscount());
23
   }
24
}
25
```

- 茶歇时间：模板设计模式模板模式是 GoF 23 种经典设计模式中的一种，它定义了整个程序执行的骨架，允许开发者在不改变大结构的前提下对其中的一些步骤进行定制。在 Spring Framework 中，模板模式的例子随处可见，例如我们之前看到过的

```
JdbcTemplate、TransactionTemplate 和这一节的 RestTemplate。以
TransactionTemplate 为例，常规的事务操作分为如下几个步骤：
```

- (1) 获取连接，并在该连接上开启事务；(2) 执行具体操作；(3) 提交或者回滚事务。

```
其中的第 (2) 步可以通过 TransactionCallback 来传入具体的操作，整个事务操作
```

- 的执行骨架在这个过程中是固定的。

```
RestTemplate 的情况也是类似的，整个过程分为创建请求、执行请求、获得结果和结
果处理（提取内容），各种格式转换和底层的多种客户端都被 RestTemplate 封装了起
```

- 来，可以根据我们的选择进行定制，但这些定制都不影响骨架。通过这两个例子，我们可以看到模板模式提升了代码的复用性和可扩展性。原始的模板模式需要使用抽象类，在 Spring Framework 里并没有这么教条，通过参数、配置、传入匿名类或 Lambda 的方式都可以发挥它的作用。

### 9.4.3　简单定制 RestTemplate

```
虽然直接用 new 关键字创建一个 RestTemplate 就能拿来使用了，但这样的
RestTemplate 使用的全是默认配置。在生产环境中，我们追求的不仅是能用，还要更快、
更稳、更安全。Spring Framework 当然也充分考虑到了这些诉求，RestTemplate 是个模
```

板，在固定的步骤背后有大量可以灵活配置的东西，下面就让我们一起来了解一下。

1. 配置底层实现

```
RestTemplate 在其父类 HttpAccessor 中默认设置了
SimpleClientHttpRequestFactory 作为请求工厂类，其内部使用 Java 内置的
HttpURLConnection 来处理请求。但其实 RestTemplate 支持不少 HTTP 客户端，表
9-17 列出了支持的客户端和对应的 ClientHttpRequestFactory 实现类。
```

- 表 9-17　RestTemplate 支持的 HTTP 客户端

```
ClientH
```

- 客户端版本

```
HttpCom
```

- Apache HttpComponents从 Spring Framework 4.0 开始仅支持 4.3 以上版本

```
OkHttp3
```

- OkHttp3.x 版本

```
Reactor
```

- Netty4.x 版本Framewo

```
Netty4C
```

- HttpComponents 和 OkHttp 的实现都是同步的，而 Netty 的实现则是响应式的。要替换底

```
层的客户端，其本质就是替换 ClientHttpRequestFactory 的实现。接下来，我们以
HttpComponents 为例，来做个简单的演示，有三种方法来设置 requestFactory，推荐
```

- 在使用时优先考虑后两种方法。

```
(1) 用 new 来从头创建一个 RestTemplate，通过构造方法或 setRequestFactory()
方法传入 HttpComponentsClientHttpRequestFactory 实例，这种做法无法利用
```

- Spring Boot 提供的各种全局定制配置，不推荐。

```
(2) 依然使用之前用过的 RestTemplateBuilder 来构造 RestTemplate，通过
RestTemplateBuilder 的 requestFactory() 传入
HttpComponentsClientHttpRequestFactory 实例，调用 requestFactory() 会
创建一个新的 RestTemplateBuilder，因此仅对当前要 build() 的 RestTemplate
```

- 有效。

```
(3) 创建一个 RestTemplateCustomizer 的实现类，并注册为 Bean，Spring Boot 自动
配置的 RestTemplateBuilder 会收集上下文中所有的 RestTemplateCustomizer，
在构造 RestTemplate 时，会调用 RestTemplateCustomizer 的 customize() 方
法，我们的 customize() 负责为 RestTemplate 设置
HttpComponentsClientHttpRequestFactory 实例。这种方式会作用于所有的
RestTemplate。
```

- HttpComponents 是个功能强大的 HTTP 客户端，除了基本的功能，还支持 HTTP 代理、连接池管理、连接复用 Keep-Alive、超时重试等功能。在 pom.xml 中引入

```
HttpComponents 的依赖 org.apache.httpcomponents:httpclient，随后通过
HttpClientBuilder 可以很方便地定制 HttpClient，并用它来构建
HttpComponentsClientHttpRequestFactory，再创建 RestTemplate，具体如代
```

- 17码示例 9-34 所示。

```
代码示例 9-34　使用 HttpComponents 作为底层 HTTP 客户端的 RestTemplate 配置
```

```java
@SpringBootApplication
1
2
public class CustomerApplication {
3
   // 省略其他代码
4
   @Bean
5
   public RestTemplate restTemplate(RestTemplateBuilder builder) {
6
       return builder
7
               .requestFactory(this::requestFactory)
8
               .setConnectTimeout(Duration.ofSeconds(1)) // 连接超时
9
               .setReadTimeout(Duration.ofSeconds(5)) // 读取超时
10
               .build();
11
   }
12
13
   @Bean
14
   public ClientHttpRequestFactory requestFactory() {
15
       HttpClientBuilder builder = HttpClientBuilder.create()
16
       .disableAutomaticRetries() // 默认重试是开启的，建议关闭
17
       .evictIdleConnections(10, TimeUnit.MINUTES) // 空闲连接10分钟关闭
18
       .setConnectionTimeToLive(30, TimeUnit.SECONDS) // 连接的TTLS时间
19
       .setMaxConnTotal(200) // 连接池大小
20
       .setMaxConnPerRoute(20); // 每个主机的最大连接数
21
22
       return new HttpComponentsClientHttpRequestFactory(builder.build());
23
   }
24
}
```

- 茶歇时间：HttpComponents 的 Keep-Alive 默认策略优化

```
通过 HttpClientBuilder 构造的 HttpClient 默认会使用
DefaultConnectionKeepAliveStrategy 这个 Keep-Alive 策略，该策略比较简
```

- 单：

```
查找 HTTP 头里的 Keep-Alive 头；
找到 Keep-Alive 头里名称是 timeout（忽略大小写）的那项；
```

- 有给定复用时间，就用给定的时间；

```
除此之外，都返回 - 1，也就是连接永久有效。
```

- 连接永久有效往往不是我们想要的结果，通常都会给一个默认时间，比如 300 秒。可以

```
像下面这样通过 Lambda 表达式来实现一个 ConnectionKeepAliveStrategy，传给
HttpClientBuilder：
builder.setKeepAliveStrategy((response, context) ->
1
2
       Arrays.asList(response.getHeaders(HTTP.CONN_KEEP_ALIVE))
3
               .stream()
4
               .filter(h -> StringUtils.equalsIgnoreCase(h.getName(), "time
5
               && StringUtils.isNumeric(h.getValue()))
6
               .findFirst()
7
               .map(h -> NumberUtils.toLong(h.getValue(), 300L))
8
               .orElse(300L) * 1000);
这里用到的 StringUtils 和 NumberUtils 都是 Apache Common Langs3 中的辅助
```

- 类。

2. 配置 SSL 相关选项现在随着大家安全意识的加强（也要感谢各大厂商的强力推动），越来越多的网站开始对外18提供 HTTPS 服务，甚至很多公司的内部服务也强制使用 HTTPS 访问。

- 在访问外部服务时，一般这些目标站点的数字证书都是由专门的机构签发的，Java 内置了大机构的根证书，可以进行证书的校验。针对这种情况，我们无须做什么特殊的处理。

- 在提供内部 HTTPS 时，如果条件允许，当然也推荐购买或者使用免费的正规证书，但往往在很多企业内部会选择自己签发证书，这时 Java 无法验证证书的有效性，出于安全考虑就会让请求失败。这时有以下方案可以选择：

- (1) 将自签证书的根证书导入 Java 的证书链里，这样就能把自己模拟成签发机构；

```
(2) 调整 HttpClient 的设置，忽略证书校验相关的错误。
```

- 这里，我们演示一下第二种方案，具体如代码示例 9-35 所示。

```
代码示例 9-35　不校验证书和主机名的 HttpClientBuilder 代码片段
SSLContext sslContext = null;
1
try {
2
   sslContext = SSLContextBuilder.create()
3
   // 放过所有证书校验
4
   .loadTrustMaterial(null, (certificate, authType) -> true).build();
5
} catch (GeneralSecurityException e) {
6
   log.error("Can NOT create SSLContext", e);
7
}
8
if (sslContext != null) {
9
   builder.setSSLContext(sslContext) // 设置SSLContext
10
           .setSSLHostnameVerifier(NoopHostnameVerifier.INSTANCE); // 不校验主机
11
}
12
如果是希望加载一个证书用于校验，可以在使用 loadTrustMaterial() 时，传入对应
```

- 的证书与密码。最后，还是要强调一下，如果条件允许，无论什么情况，都应该使用正规机构签发的有效数字证书。

## 9.5　小结

本章我们讨论了很多 Spring MVC 相关的内容。Spring MVC 主要用于 Web 开发，是日常开发 Web 应用必不可少的利器。以前的 Web 开发以后端为主，前端为辅；但现在更流行大前

```
端和前后端分离的策略，前端同学挑大梁，后端负责提供 REST 接口。
除了 Spring MVC 最基本的用法，我们还讨论了以 DispatcherServlet 为中心的请求处理
```

流程，详细介绍了请求处理方法的内容。Spring MVC 的视图层支持很多不同的格式，本章介

```
绍了常用于 REST 接口的 JSON 和 XML 格式，还有呈现页面用的 Thymeleaf 模板。虽然
```

Spring MVC 也可以提供静态资源服务，但在生产环境中，我们建议大家使用专门的静态资源服务器，例如 Nginx。

```
最后我们介绍了 RestTemplate 的各种用法和相关配置，有了它就能方便地发起 HTTP 请
求，更确切地说是发起 REST 请求的调用。
```

下一章，我们将聊聊安全那些事儿，有针对性地讨论一下与 Web 安全相关的话题，具体看看Spring Security 是怎么来保护我们的系统的。

- 二进制奶茶店项目开发小结本章中，我们的二进制奶茶店已经有了一个使用 Spring MVC 开发的 Web 界面—服务员可以在浏览器里查看菜单并为顾客下单，还可以以逐条或批量上传的方式来维护菜单。

- 为了方便系统交互，除了 Web 界面，服务端的程序还提供了对应的 REST 接口。而使用这些接口的正是我们为顾客开发的客户端程序，通过它，我们能够方便地与二进制奶茶店的服务端进行交互。

[14]：具体的内容放在 ch9/customer-simple-client 项目中。[15]：这里用 5 秒是为了方便演示，可以通过 传入想要等待的任意时间，让程序在下次重试前一直 在那里。[16]：这是由 Square 开发的一套模拟 Web 服务端的工具，放在 OkHttp 的代码库中。[17]：这部分的例子在 ch9/customer-advanced-client 工程中。[18]：关于服务端如何开启 HTTPS 和 HTTP/2 支持，我们将放在 11.2 节中展开说明。
