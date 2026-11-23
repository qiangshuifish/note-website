# 20 | Wasm编程基础（上）

你好，我是邢云阳。

在上节课，我从理论的角度，为你讲解了 Wasm 相关的一些知识，包括 Wasm、Wasm VM、用于编写 Wasm 的 SDK，以及跨虚机通信等等。让你对于 Wasm 有了一个初步的认识。

那从本节课开始呢，我们就进入到具体的编码部分。我会先用两节课的时间，让你了解一下如何编写 Wasm 程序。之后便会带领你做 AI 插件。

## Higress Wasm

原生的基于 proxy-wasm-go-sdk 的 Wasm 插件开发比较繁琐，因此 Higress 在这之上封装了一层，从而简化插件开发并且可以增强原生 sdk 的功能。打开 Higress Wasm 的代码，可以看到文件结构如下：

```
tree
.
├── matcher
│   ├── rule_matcher.go
│   ├── rule_matcher_test.go
│   └── utils.go
└── wrapper
   ├── cluster_wrapper.go
   ├── cluster_wrapper_test.go
   ├── http_wrapper.go
   ├── log_wrapper.go
   ├── plugin_wrapper.go
   ├── redis_wrapper.go
   └── request_wrapper.go
   └── response_wrapper.go
```

Higress 插件 Go SDK 主要增强功能包括：

- matcher 包提供全局、路由、域名级别配置的解析功能。

- wrapper 包下 log_wrapper.go 封装和简化插件日志的输出功能。

- wrapper 包下 cluster_wrapper.go、redis_wrapper.go、http_wrapper.go 封装 Http 和 RedisHost Function Call。

- wrapper 包下 plugin_wrapper.go 封装 proxy-wasm-go-sdk 的 VMContext、PluginContext、HttpContext、插件配置解析功能。

- wrapper 包下 request_wrapper.go、response_wrapper.go 提供关于请求和响应公共方法。

本节课我们先来介绍一下 plugin_wrapper.go 提供 VMContext、PluginContext、HttpContext、插件配置解析功能。

## Higress Wasm Go SDK 上下文

在原生 Wasm 中，存在 VMContext、PluginContext、HttpContext 3 个上下文结构体，在Higress 中对这三个结构体进行了封装，支持了泛型。封装后的结构体名字为CommonVmCtx、CommonPluginCtx、CommonHttpCtx。

CommonVmCtx 继承了 DefaultVMContext ，并在此基础上扩充了一些通用的工具方法，例如日志工具、解析函数、HTTP 通信的各个阶段的钩子函数等，其结构体如下：

```
type CommonVmCtx[PluginConfig any] struct {
   // proxy-wasm-go-sdk DefaultVMContext 默认实现
   types.DefaultVMContext
   // 插件名称
   pluginName                  string
   // 插件日志工具
   log                         Log
   hasCustomConfig             bool
   // 插件配置解析函数
   parseConfig                 ParseConfigFunc[PluginConfig]
   // 插件路由、域名、服务级别配置解析函数
   parseRuleConfig             ParseRuleConfigFunc[PluginConfig]
   // 以下是自定义插件回调钩子函数
   onHttpRequestHeaders        onHttpHeadersFunc[PluginConfig]
   onHttpRequestBody           onHttpBodyFunc[PluginConfig]
   onHttpStreamingRequestBody  onHttpStreamingBodyFunc[PluginConfig]
   onHttpResponseHeaders       onHttpHeadersFunc[PluginConfig]
   onHttpResponseBody          onHttpBodyFunc[PluginConfig]
   onHttpStreamingResponseBody onHttpStreamingBodyFunc[PluginConfig]
   onHttpStreamDone            onHttpStreamDoneFunc[PluginConfig]
}
```

CommonPluginCtx 则是在 DefaultPluginContext 的基础上提供了更加方便的配置管理等。其结构体如下：

```
type CommonPluginCtx[PluginConfig any] struct {
   // proxy-wasm-go-sdk DefaultPluginContext 默认实现
   types.DefaultPluginContext
   // 解析后保存路由、域名、服务级别配置和全局插件配置
   matcher.RuleMatcher[PluginConfig]
   // 引用 CommonVmCtx
   vm          *CommonVmCtx[PluginConfig]
   // tickFunc 数组
   onTickFuncs []TickFuncEntry
}
```

CommonHttpCtx 则是在 DefaultHttpContext 基础上扩充了一些流程控制元素。其结构体如下：

```
type CommonHttpCtx[PluginConfig any] struct {
 // proxy-wasm-go-sdk DefaultHttpContext 默认实现
 types.DefaultHttpContext
 // 引用 CommonPluginCtx
 plugin                *CommonPluginCtx[PluginConfig]
 // 当前 Http 上下文下匹配插件配置，可能是路由、域名、服务级别配置或者全局配置
 config                *PluginConfig
 // 是否处理请求体
 needRequestBody       bool
 // 是否处理响应体
 needResponseBody      bool
 // 是否处理流式请求体
 streamingRequestBody  bool
 // 是否处理流式响应体
 streamingResponseBody bool
 // 非流式处理缓存请求体大小
 requestBodySize       int
 // 非流式处理缓存响应体大小
 responseBodySize      int
 // Http 上下文 ID
 contextID             uint32
 // 自定义插件设置自定义插件上下文
 userContext           map[string]interface{}
}
```

接下来我们简单看一下这三个上下文的实现。

### 启动入口和 VM 上下文（CommonVmCtx）

CommonVmCtx 的钩子函数在插件中的启动入口如下所示：

```go
func main() {
 wrapper.SetCtx(
   // 插件名称
   "hello-world",
   // 设置自定义函数解析插件配置，这个方法适合插件全局配置和路由、域名、服务级别配置内容规则是一
   wrapper.ParseConfigBy(parseConfig),
   // 设置自定义函数解析插件全局配置和路由、域名、服务级别配置，这个方法适合插件全局配置和路由、
   wrapper.ParseOverrideConfigBy(parseConfig, parseRuleConfig)
   // 设置自定义函数处理请求头
   wrapper.ProcessRequestHeadersBy(onHttpRequestHeaders),
   // 设置自定义函数处理请求体
   wrapper.ProcessRequestBodyBy(onHttpRequestBody),
   // 设置自定义函数处理响应头
   wrapper.ProcessResponseHeadersBy(onHttpResponseHeaders),
   // 设置自定义函数处理响应体
   wrapper.ProcessResponseBodyBy(onHttpResponseBody),
   // 设置自定义函数处理流式请求体
   wrapper.ProcessStreamingRequestBodyBy(onHttpStreamingRequestBody),
   // 设置自定义函数处理流式响应体
   wrapper.ProcessStreamingResponseBodyBy(onHttpStreamingResponseBody),
   // 设置自定义函数处理流式请求完成
   wrappper.ProcessStreamDoneBy(onHttpStreamDone)
 )
}
```

在实际编写插件时，这些不是全必选的，需要根据自己的实际业务来确定需要选哪个钩子。例如，我想拦截 HTTP 请求的 Body，之后针对 Body 的内容做一些操作，就需要通过wrapper.SetCtx 来设置 wrapper.ProcessRequestBodyBy(onHttpRequestBody)。

wrapper.SetCtx 的底层实际上就是调用的 Wasm 原生的接口，代码如下：

```go
func SetCtx[PluginConfig any](pluginName string, setFuncs ...SetPluginFunc[Plugin
 // 调用 proxywasm.SetVMContext 设置 VMContext
 proxywasm.SetVMContext(NewCommonVmCtx(pluginName, setFuncs...))
}
func NewCommonVmCtx[PluginConfig any](pluginName string, setFuncs ...SetPluginFun
 ctx := &CommonVmCtx[PluginConfig]{
   pluginName:      pluginName,
   log:             Log{pluginName},
   hasCustomConfig: true,
 }
 // CommonVmCtx 里设置自定义插件回调钩子函数
 for _, set := range setFuncs {
   set(ctx)
 }
 ...
 return ctx
```

### 插件上下文（CommonPluginCtx）

插件上下文主要是用来解析插件配置的，其核心代码在 OnPluginStart 方法中。我们摘取部分核心代码，大概看一下。

```go
func (ctx *CommonPluginCtx[PluginConfig]) OnPluginStart(int) types.OnPluginStartS
 // 调用 proxywasm.GetPluginConfiguration 获取插件配置
 data, err := proxywasm.GetPluginConfiguration()
 globalOnTickFuncs = nil
 ...
 var jsonData gjson.Result
 // 插件配置转成 json
 jsonData = gjson.ParseBytes(data)
 // 设置 parseOverrideConfig
 var parseOverrideConfig func(gjson.Result, PluginConfig, *PluginConfig) error
 if ctx.vm.parseRuleConfig != nil {
   parseOverrideConfig = func(js gjson.Result, global PluginConfig, cfg *PluginC
     // 解析插件路由、域名、服务级别插件配置
     return ctx.vm.parseRuleConfig(js, global, cfg, ctx.vm.log)
   }
 }
 ...
 // 解析插件配置
 err = ctx.ParseRuleConfig(jsonData,
   func(js gjson.Result, cfg *PluginConfig) error {
     // 解析插件全局或者当 parseRuleConfig 没有设置时候同时解析路由、域名、服务级别插件配置
     return ctx.vm.parseConfig(js, cfg, ctx.vm.log)
   },
   parseOverrideConfig,
 )
 ...
 if globalOnTickFuncs != nil {
   ctx.onTickFuncs = globalOnTickFuncs
   ...
 }
 return types.OnPluginStartStatusOK
}
```

可以发现在解析插件配置过程中有两个回调钩子函数，parseConfig 和 parseRuleConfig。

- parseConfig ：解析插件全局配置，如果 parseRuleConfig 没有设置，那么 parseConfig 会同时解析全局配置和路由、域名、服务级别配置。也就是说插件全局配置和路由、域名、服务级别配置规则是一样的。

- parseRuleConfig: 解析路由、域名、服务级别插件配置。如果设置 parseRuleConfig，也就是说插件全局配置和路由、域名、服务级别配置规则是不同的。

在开发插件时，需要注意全局配置和路由、域名、服务级别配置规则是否一致，如果一致，则只调用 parseConfig 即可，如果不一致，就还需要调用 parseRuleConfig。

### HTTP 上下文（CommonHttpCtx）

HTTP 上下文是 Higress Wasm 插件开发中非常重要的一个部分，它负责处理 HTTP 请求和响应的具体逻辑。通过 CommonHttpCtx，开发者可以访问和操作请求头、请求体、响应头、响应体等关键信息，从而实现各种自定义功能。

HTTP 上下文的核心功能如下：

- 请求和响应的处理：CommonHttpCtx 提供了对 HTTP 请求和响应的全面控制能力。开发者可以通过它读取请求头、请求体、查询参数等信息，并根据需要修改响应头、响应体等内容。例如，可以在 onHttpRequestHeaders 钩子中检查请求头中的认证信息，或者在onHttpResponseBody 钩子中对响应体进行加密或压缩。

- 流式处理：CommonHttpCtx 支持流式处理请求体和响应体。这对于处理大文件或实时数据流非常有用。通过 onHttpStreamingRequestBody 和 onHttpStreamingResponseBody钩子，开发者可以逐块处理请求体或响应体，而不需要一次性加载整个内容。

- 配置管理：CommonHttpCtx 可以访问插件配置，这些配置可以是全局配置，也可以是针对特定路由、域名或服务的配置。通过 config 字段，开发者可以根据不同的配置执行不同的逻辑。例如，某些路由可能需要特殊的认证逻辑，而其他路由则不需要。

- 上下文管理：CommonHttpCtx 提供了 userContext 字段，允许开发者在 HTTP 请求的生命周期内存储和共享自定义数据。这对于需要在多个钩子函数之间传递数据的场景非常有

- 用。例如，可以在 onHttpRequestHeaders 钩子中解析用户信息，并将其存储在userContext 中，以便在后续的钩子中使用。

除此之外，在 Higress Wasm 插件中，HTTP 上下文的钩子函数是开发者实现自定义逻辑的关键。以下是一些常用的钩子函数：

- onHttpRequestHeaders：在接收到请求头时触发。可以用于检查请求头中的认证信息、修改请求头等。

- onHttpRequestBody：在接收到请求体时触发。可以用于解析请求体内容、修改请求体等。

- onHttpResponseHeaders：在接收到响应头时触发。可以用于修改响应头、添加自定义头等。

- onHttpResponseBody：在接收到响应体时触发。可以用于修改响应体内容、加密或压缩响应体等。

- onHttpStreamingRequestBody：在接收到流式请求体时触发。可以用于逐块处理请求体。

- onHttpStreamingResponseBody：在接收到流式响应体时触发。可以用于逐块处理响应体。

- onHttpStreamDone：在流式处理完成时触发。可以用于清理资源或执行最终的处理逻辑。

我们用一个简单的示例，展示一下如何使用 CommonHttpCtx 实现一个检查请求头中是否包含特定字段的插件，代码如下：

```go
package main
import (
   "github.com/alibaba/higress/plugins/wasm-go/pkg/wrapper"
   "github.com/tetratelabs/proxy-wasm-go-sdk/proxywasm"
   "github.com/tetratelabs/proxy-wasm-go-sdk/proxywasm/types"
)
func main() {
   wrapper.SetCtx(
       "check-header",
       wrapper.ParseConfigBy(parseConfig),
       wrapper.ProcessRequestHeadersBy(onHttpRequestHeaders),
   )
}
type PluginConfig struct {
   RequiredHeader string `json:"requiredHeader"`
}
func parseConfig(json gjson.Result, config *PluginConfig, log wrapper.Log) error
   config.RequiredHeader = json.Get("requiredHeader").String()
   return nil
}
func onHttpRequestHeaders(ctx *wrapper.CommonHttpCtx[PluginConfig], numHeaders in
   requiredHeader := ctx.config.RequiredHeader
   value, err := proxywasm.GetHttpRequestHeader(requiredHeader)
   if err != nil || value == "" {
       proxywasm.SendHttpResponse(403, nil, []byte("Missing required header: "+r
       return types.ActionPause
   }
   return types.ActionContinue
}
```

在这个示例中，插件会检查请求头中是否包含配置中指定的字段。如果缺少该字段，插件会返回 403 状态码并终止请求。

### Types.Action

在 Higress Wasm 插件开发中，Types.Action 是一个非常重要的枚举类型，它用于控制 HTTP请求和响应的处理流程。通过返回不同的 Types.Action 值，开发者可以决定是否继续处理请求或者暂停处理。在自定义插件中 onHttpRequestHeaders、onHttpRequestBody、onHttpResponseHeaders、onHttpResponseBody 返回值类型为 types.Action。通过types.Action 枚举值来控制插件的运行流程，常见的返回值有 2 个。

一个是 types.ActionContinue，继续后续处理，比如继续读取请求 body，或者继续读取响应body；另一个是 types.ActionPause，暂停后续处理，比如在 onHttpRequestHeaders 通过Http 或者 Redis 调用外部服务获取认证信息，在调用外部服务回调钩子函数中调用proxywasm.ResumeHttpRequest() 来恢复后续处理 或者调用proxywasm.SendHttpResponseWithDetail() 来返回响应。

## 总结

在本节课中，我们深入探讨了 Higress Wasm 插件的开发，特别是如何通过 Higress 封装的Go SDK 来简化 Wasm 插件的开发流程。我们首先介绍了 Higress Wasm 的代码结构和主要功能，包括 matcher 包和 wrapper 包的作用。接着，我们详细讲解了 Higress 中的三个核心上下文结构体：CommonVmCtx、CommonPluginCtx 和 CommonHttpCtx，它们分别对应Wasm 原生的 VMContext、PluginContext 和 HttpContext，并在其基础上进行了功能增强。

通过 CommonVmCtx，我们可以轻松地管理插件的生命周期，设置各种钩子函数来处理HTTP 请求和响应的不同阶段。CommonPluginCtx 则提供了插件配置的解析功能，支持全局配置和路由、域名、服务级别的配置管理。而 CommonHttpCtx 则是处理 HTTP 请求和响应的核心，开发者可以通过它访问和操作请求头、请求体、响应头、响应体等内容，实现各种自定义逻辑。

我们还通过一个简单的示例，展示了如何使用 CommonHttpCtx 来实现一个检查请求头中是否包含特定字段的插件。这个示例帮助我们理解了如何通过 types.Action 来控制插件的处理流程，以及如何在插件中返回自定义的 HTTP 响应。

在下节课，我会用具体的实际小例子，带你体会完整的 Wasm 插件开发流程。

## 思考题

Higress Wasm 提供了多个钩子函数来处理 HTTP 请求和响应的不同阶段，如onHttpRequestHeaders、onHttpRequestBody、onHttpResponseHeaders 等。假设你需要开发一个插件，要求对请求体进行加密处理，并在响应体中返回加密后的结果。你会选择哪些钩子函数来实现这个功能，为什么？

欢迎你在留言区分享你的感受，我们一起来讨论。如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给其他朋友，我们下节课再见！

小编留言：马上就要到春节假期啦！祝大家新春大吉，春节期间我们的课程暂停更新，到 2 月5 日 0 点恢复正常更新。希望春节期间你可以好好休息，合家团圆！
