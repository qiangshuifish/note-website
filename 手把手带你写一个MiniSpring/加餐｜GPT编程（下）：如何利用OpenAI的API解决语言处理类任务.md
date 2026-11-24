# 加餐 | GPT编程（下）：如何利用OpenAI的API解决语言处理类任务

你好，我是郭屹。

上一节课我们一起学习了如何使用 ChatGPT 来辅助我们编程，通过问答它给出了我们想要的答案。这个过程实际上还是以手工的方式来对话，不过好在 OpenAI 还提供一些 API 供程序调用。现在微软的搜索引擎 Bing 和 Quora 网站推出的 Poe 都使用了它。所以今天我们一起看看这些 API。

## API 入门

OpenAI 给开发者提供 API 来访问它的模型，帮助开发者解决语言处理类任务。

它提供多种基础功能，包括：

- 内容生成 Content generation

- 摘要 Summarization

- 分类及语义分析 Classification, categorization, and sentiment analysis

- 翻译 Translation

- …

最主要的 API 访问入口是 Completions。开发者输入一些文本，API 会根据你在文本中的意图返回另一段文本。你可以以 HTTP Request 的方式与 API 进行交互，然后通过 API key进行身份认证。

格式如下：

```bash
curl https://api.openai.com/v1/chat/completions \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $OPENAI_API_KEY" \
 -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Say this is a test!"}],
    "temperature": 0.7
  }'
```

支持的模型有 7 个。

- GPT-4 Limited beta：GPT-3.5 之上的改进，对自然语言的理解和处理更强。

- GPT-3.5：在 GPT-3 基础上改进的，对自然语言的理解和处理更强。

- DALL·E Beta：图像处理。

- Whisper Beta：音频转文本。

- Embeddings：将文本转成嵌入向量。

- Moderation：检测敏感信息和非安全内容。

- GPT-3：自然语言理解和处理的模型。

有了这些 API，在我们的程序中就可以使用它们，也可以用这些 API 做出我们自己的插件来。

## 程序中调用 OpenAI 的 API

在 Spring 中用 HTTPClient 直接调用 OpenAI 的 API。我们从 /v1/chat/completions、/v1/completions、/v1/edits 与 /v1/images/generations 四个 API 入手，一步步进行封装。

先定义一个基础请求实体类，供 service 使用，参考如下：

```java
package com.example.chatgptdemo.api.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class BaseRequest {
   @NotBlank(message = "openai_apiKey cannot be blank")
   private String apiKey;
}
```

再按照我们示例的几种 API，定义多种请求实体类。

```java
package com.example.chatgptdemo.api.request;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ChatCompletionRequest extends BaseRequest{
   private String content;
}
```

```java
package com.example.chatgptdemo.api.request;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CompletionRequest extends BaseRequest{
   private String prompt;
}
package com.example.chatgptdemo.api.request;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class EditRequest extends BaseRequest{
   private String input;
   private String instruction;
}
package com.example.chatgptdemo.api.request;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ImageGenerationRequest extends BaseRequest {
   private String prompt;
   private Integer n;
}
```

然后定义返回给调用方的 Response 类。

```java
package com.example.chatgptdemo.api.response;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ChatCompletionResponse {
   private String content;
}
package com.example.chatgptdemo.api.response;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CompletionResponse {
   private String text;
}
package com.example.chatgptdemo.api.response;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class EditResponse {
   private String text;
}
package com.example.chatgptdemo.api.response;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
public class ImageGenerationResponse {
   private List<String> urls;
}
```

接下来则定义 Service 层，这也是我们进行核心业务定制的部分。定义 ChatgptDemoService接口和 ChatgptDemoServiceImpl 实现类。

```java
package com.example.chatgptdemo.service;
public interface ChatgptDemoService {
   ChatCompletionResponse chatCompletions(ChatCompletionRequest request);
   CompletionResponse completions(CompletionRequest request);
   EditResponse edits(EditRequest request);
   ImageGenerationResponse imageGenerations(ImageGenerationRequest request);
}
```

Service 的实现如下：

```java
package com.example.chatgptdemo.service.impl;
@Service
public class ChatgptDemoServiceImpl implements ChatgptDemoService {
   final private ChatgptNetworkService networkService;
   @Autowired
   public ChatgptDemoServiceImpl(ChatgptNetworkService networkService) {
       this.networkService = networkService;
   }
   @Override
   public ChatCompletionResponse chatCompletions(ChatCompletionRequest request)
       MessageObject message = new MessageObject();
       message.setContent(request.getContent());
       message.setRole("user");
       ChatCompletionModel model = new ChatCompletionModel();
       model.setModel("gpt-3.5-turbo");
       model.setMessages(Collections.singletonList(message));
       model.setTemperature(0.7);
       ChatCompletionResult result = networkService.ChatCompletions(model, reque
       Optional<ChoiceResult> firstResultOptional = result.getChoices().stream()
       ChatCompletionResponse response = new ChatCompletionResponse();
       if (firstResultOptional.isEmpty()) {
           return response;
       }
       ChoiceResult choiceResult = firstResultOptional.get();
       response.setContent(choiceResult.getMessage().getContent());
       return response;
   }
   @Override
   public CompletionResponse completions(CompletionRequest request) {
       CompletionModel model = new CompletionModel();
       model.setModel("text-davinci-003");
       model.setPrompt(request.getPrompt());
       model.setMaxTokens(7);
       model.setN(1);
       model.setTopP(1);
       model.setStream(false);
       CompletionResult result = networkService.completions(model, request.getAp
       Optional<ChoiceResult> firstResultOptional = result.getChoices().stream()
       CompletionResponse response = new CompletionResponse();
       if (firstResultOptional.isEmpty()) {
           return response;
       }
       ChoiceResult choiceResult = firstResultOptional.get();
       response.setText(choiceResult.getText());
       return response;
   }
   @Override
   public EditResponse edits(EditRequest request) {
       EditModel model = new EditModel();
       model.setInput(request.getInput());
       model.setInstruction(request.getInstruction());
       EditResult result = networkService.edits(model, request.getApiKey());
       Optional<ChoiceResult> firstResultOptional = result.getChoices().stream()
       EditResponse response = new EditResponse();
       if (firstResultOptional.isEmpty()) {
           return response;
       }
       ChoiceResult choiceResult = firstResultOptional.get();
       response.setText(choiceResult.getText());
       return response;
   }
   @Override
   public ImageGenerationResponse imageGenerations(ImageGenerationRequest reques
       ImageGenerationModel model = new ImageGenerationModel();
       model.setPrompt(request.getPrompt());
       model.setN(request.getN());
       model.setSize("1024x1024");
       ImageGenerationResult result = networkService.imageGenerations(model, req
       List<ImageGenerationResult.ImageGenerationData> resultList =
               result.getData().stream().toList();
       List<String> urls = new ArrayList<>(resultList.size());
       resultList.forEach(r -> urls.add(r.getUrl()));
       ImageGenerationResponse response = new ImageGenerationResponse();
       response.setUrls(urls);
       return response;
   }
}
```

通过实现类的代码可以看出，基本是围绕构造 OpenAI 提供的 API 调用参数作文章，只不过为了验证，我们写死了很多参数，在实际实操过程中我们可以依据自身业务情况，进行动态调整。

我们使用了 ChatgptNetworkService 这样一个 Bean 作为通讯基础，而这个 Bean 的功能正是对 OpenAI 的 API 进行调用。我们直接使用 RestTemplate 访问的 API。

为了构造 API 调用，我们定义了 xxxModel 作为 API 调用的请求参数实体类，还定义了xxxResult 作为 API 接口返回值。

Model 实体类：

```java
package com.example.chatgptdemo.network.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CompletionModel {
   private String model;
   private String prompt;
   @JsonProperty("max_tokens")
   private Integer maxTokens;
   private Integer n;
   @JsonProperty("top_p")
   private Integer topP;
   private Boolean stream;
}
package com.example.chatgptdemo.network.model;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class MessageObject {
   private String role;
   private String content;
}
package com.example.chatgptdemo.network.model.chat;
import com.example.chatgptdemo.network.model.MessageObject;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
public class ChatCompletionModel {
   private String model;
   private List<MessageObject> messages;
   private Double temperature;
}
package com.example.chatgptdemo.network.model;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class EditModel {
   private String model;
   private String input;
   private String instruction;
}
package com.example.chatgptdemo.network.model;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ImageGenerationModel {
   private String prompt;
   private Integer n;
   private String size;
}
```

Result 实体类：

```java
package com.example.chatgptdemo.network.result;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CreatedResult {
   private Long created;
}
package com.example.chatgptdemo.network.result;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ObjectResult extends CreatedResult{
   private String id;
   private String object;
   private String model;
}
package com.example.chatgptdemo.network.result;
import com.example.chatgptdemo.network.model.MessageObject;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ChoiceResult {
   private MessageObject message;
   private String text;
   @JsonProperty("finish_reason")
   private String finishReason;
   private Integer index;
}
package com.example.chatgptdemo.network.result;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UsageResult {
   @JsonProperty("prompt_tokens")
   private Integer promptTokens;
   @JsonProperty("completion_tokens")
   private Integer completionTokens;
   @JsonProperty("total_tokens")
   private Integer totalTokens;
}
package com.example.chatgptdemo.network.result;
@Getter
@Setter
public class CompletionResult {
   private UsageResult usage;
   private List<ChoiceResult> choices;
}
package com.example.chatgptdemo.network.result.chat;
@Getter
@Setter
public class ChatCompletionResult extends CompletionResult {
}
```

```java
package com.example.chatgptdemo.network.result;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class EditResult extends CompletionResult {
}
package com.example.chatgptdemo.network.result;
import com.example.chatgptdemo.api.response.ImageGenerationResponse;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
public class ImageGenerationResult extends CreatedResult{
   private List<ImageGenerationData> data;
   @Getter
   @Setter
   public static class ImageGenerationData {
       private String url;
   }
}
```

在实体类定义完毕之后，接下来我们着手实现 ChatGptNetworkService，看看 Spring 中如何通过 RestTemplate 调用 OpenAI 的 API。

```java
package com.example.chatgptdemo.network;
@Service
public class ChatgptNetworkService {
   Gson gson = new Gson();
   private static final Logger logger = LoggerFactory.getLogger(ChatgptNetworkSe
   final private RestTemplate restTemplate;
   @Autowired
   public ChatgptNetworkService(RestTemplate restTemplate) {
       this.restTemplate = restTemplate;
   }
   public ChatCompletionResult ChatCompletions(ChatCompletionModel model, String
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(MediaType.APPLICATION_JSON);
       headers.setBearerAuth(apiKey);
       HttpEntity<?> entity = new HttpEntity<>(model, headers);
       URI uri = UriComponentsBuilder.newInstance()
               .scheme("https")
               .host("api.openai.com")
               .path("/v1/chat/completions")
               .build()
               .toUri();
       logger.info("The parameters for request API {}: {}", uri, gson.toJson(ent
       ResponseEntity<ChatCompletionResult> response = restTemplate.postForEntit
       logger.info("The response result from API {}: {}", uri, gson.toJson(respo
       if (response.getStatusCode().isError()) {
           throw new RuntimeException(gson.toJson(response.getBody()));
       }
       return response.getBody();
   }
   public CompletionResult completions(CompletionModel model, String apiKey) {
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(MediaType.APPLICATION_JSON);
       headers.setBearerAuth(apiKey);
       HttpEntity<?> entity = new HttpEntity<>(model, headers);
       URI uri = UriComponentsBuilder.newInstance()
               .scheme("https")
               .host("api.openai.com")
               .path("/v1/completions")
               .build()
               .toUri();
       logger.info("The parameters for request API {}: {}", uri, gson.toJson(ent
       ResponseEntity<CompletionResult> response = restTemplate.postForEntity(ur
       logger.info("The response result from API {}: {}", uri, gson.toJson(respo
       if (response.getStatusCode().isError()) {
           throw new RuntimeException(gson.toJson(response.getBody()));
       }
       return response.getBody();
   }
   public EditResult edits(EditModel model, String apiKey) {
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(MediaType.APPLICATION_JSON);
       headers.setBearerAuth(apiKey);
       HttpEntity<?> entity = new HttpEntity<>(model, headers);
       URI uri = UriComponentsBuilder.newInstance()
               .scheme("https")
               .host("api.openai.com")
               .path("/v1/edits")
               .build()
               .toUri();
       logger.info("The parameters for request API {}: {}", uri, gson.toJson(ent
       ResponseEntity<EditResult> response = restTemplate.postForEntity(uri, ent
       logger.info("The response result from API {}: {}", uri, gson.toJson(respo
       if (response.getStatusCode().isError()) {
           throw new RuntimeException(gson.toJson(response.getBody()));
       }
       return response.getBody();
   }
   public ImageGenerationResult imageGenerations(ImageGenerationModel model, Str
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(MediaType.APPLICATION_JSON);
       headers.setBearerAuth(apiKey);
       HttpEntity<?> entity = new HttpEntity<>(model, headers);
       URI uri = UriComponentsBuilder.newInstance()
               .scheme("https")
               .host("api.openai.com")
               .path("/v1/images/generations")
               .build()
               .toUri();
       logger.info("The parameters for request API {}: {}", uri, gson.toJson(ent
       ResponseEntity<ImageGenerationResult> response = restTemplate.postForEnti
       logger.info("The response result from API {}: {}", uri, gson.toJson(respo
       if (response.getStatusCode().isError()) {
           throw new RuntimeException(gson.toJson(response.getBody()));
       }
       return response.getBody();
   }
}
```

代码一点都不复杂，就是按照 API 的规定进行常规的 HTTP REST 请求。

有了这个 service，再定义 Controller 层。这层是整个系统与外部调用 API 的门户。我们先定义 ChatgptDemoController 类。

```java
package com.example.chatgptdemo.controller;
@RestController
public class ChatgptDemoController {
   final private ChatgptDemoService chatgptDemoService;
   @Autowired
   public ChatgptDemoController(ChatgptDemoService chatgptDemoService) {
       this.chatgptDemoService = chatgptDemoService;
   }
   @PostMapping("/v1/chat/completions")
   public ChatCompletionResponse chatCompletions(@Validated @RequestBody ChatCom
       return chatgptDemoService.chatCompletions(request);
   }
   @PostMapping("/v1/completions")
   public CompletionResponse completions(@Validated @RequestBody CompletionReque
       return chatgptDemoService.completions(request);
   }
   @PostMapping("/v1/edits")
   public EditResponse edits(@Validated @RequestBody EditRequest request) {
       return chatgptDemoService.edits(request);
   }
   @PostMapping("/v1/images/generations")
   public ImageGenerationResponse imageGenerations(@Validated @RequestBody Image
       return chatgptDemoService.imageGenerations(request);
   }
}
```

在这里，我们用的接口路径，依然和 OpenAI 的 API 保持一致，便于我们的理解。

接下来，基于封装好的框架，我们用几个常见的例子，来实际调用一下。

1. 把自然语言转换成程序代码：我们利用 API 来编写“hello world”程序。

请求参数如下：

```
POST http://localhost:8080/v1/chat/completions
Content-Type: application/json
{
   "apiKey": "sk-xxxxxx",
   "content": "Please output helloworld in Java"
}
```

在这里我们本地启动 Springboot 项目，传入 apiKey（填入在 OpenAI 官网上申请的Open_API_KEY，均为 sk 前缀开头）。content 字段则敲入自然语言表达我们的意图。

返回结果如下：

```
HTTP/1.1 200
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 02 May 2023 00:42:59 GMT
Connection: close
{
 "content": "Here's the code to output \"Hello World\" in Java:\n\n```\npublic c
}
```

通过返回结果可以看出，返回值在一个字段中以字符串形式完整返回，代码是可以正常运行的。

2. 生成 SQL 语句

SQL 也是开发过程中不可绕过的一个话题，同样地，我们可以借助 API 帮我们编写 SQL 语句。在这里我们测试一个简单的场景：在学生表中查询所有学生的姓名。

请求参数如下：

```sql
POST http://localhost:8080/v1/chat/completions
Content-Type: application/json
{
   "apiKey": "sk-xxxxxx",
   "content": "Please select all students' name from Student table in SQL"
}
```

返回结果如下：

```sql
HTTP/1.1 200
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 02 May 2023 00:50:11 GMT
Connection: close
{
 "content": "SELECT name FROM Student;"
}
```

3. 查找图片

我们还可以通过描述查询对应的图片，一般描述越精确，图片准确度越高。你可以看一下这个示例。

请求参数：

```
POST http://localhost:8080/v1/images/generations
Content-Type: application/json
{
   "apiKey": "sk-xxxxxx",
   "prompt": "find a tiger image",
   "n": 1
}
```

返回参数如下：

```
HTTP/1.1 200
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 02 May 2023 04:12:48 GMT
Connection: close
{
 "urls": [
   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-mnyBsdtqxGUtwx
 ]
}
```

可以看到，返回值中返回了 URL 的数组，这个 URL 对应的图片与请求参数中的语义尽可能保持一致，而返回的 URL 个数则取决于请求参数中 n 的值。

4. 拼写检查

拼写错误也是我们经常会遇到的场景，而且总是难以发现。正好有个接口可以帮我们校验拼写错误。

请求参数如下：

```
POST http://8.218.233.184:8080/v1/edits
Content-Type: application/json
{
   "apiKey": "sk-xxxx",
   "input": "It is an rainn day",
   "instruction": "Fix the spell mistakes"
}
```

返回参数如下：

```
HTTP/1.1 200
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 02 May 2023 05:25:38 GMT
Connection: close
{
 "text": "It is a rainy day\n"
}
```

可以看到，这个接口纠正了我们两处拼写错误。

5. 为代码添加注释

我们写的代码，一样可以被分析，下面是一个简单的冒泡排序算法的实现。不过为了解析方便，我们用了很多换行符来把多行代码压缩到一行了。

请求参数：

```java
POST http://localhost:8080/v1/edits
Content-Type: application/json
{
   "apiKey": "sk-xxxxx",
   "input": "public static void sort(int[] arrays) { \nif (arrays.length == 0) {
   "instruction": "Explain this Java code"
}
```

返回参数如下：

```
HTTP/1.1 200
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 02 May 2023 23:45:37 GMT
Connection: close
{
 "text": "/** Java\nI discovered this code from a tutorial from edx from Havard
}
```

可以看到返回内容非常多，不仅给出了测试用例，还详细解释了每一行的功能。给人的感觉就是，它真的读懂了我们的代码。

## 小结

好了，这就是这节课的主要内容，最后我们来总结一下。

这节课我们了解了 OpenAI 的 API 的基础能力，包括内容生成、摘要、分类及语义分析、翻译等等。我也带你一步步实现了在程序中调用 OpenAI 的 API，还用它完成了很多任务，比如写代码、生成 SQL 语句、查找图片、检查拼写等等。利用好这些能力能够帮助我们程序员省去很多繁琐的工作，所以我们要更加积极地去拥抱这个变化。

我们可以将 GPT 作为我们编程的助手来提高工作效率，如编写标准程序单元、测试用例、生成注释说明，之后还可以进一步利用它来构建低代码平台和工具集，基于它训练特定业务领域的大模型。我们一起参与这个过程，会让新时代来得更早、更快。

最后我想用软件大师 Alan Kay 的话来结束这节课的内容，“The best way to predict the futureis to invent it.”。

如果你觉得这节课的内容对你有帮助的话，可以分享给你的朋友，同时也欢迎你把你的感悟和思考分享到评论区和我讨论。
