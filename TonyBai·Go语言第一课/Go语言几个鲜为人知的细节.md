# Go语言几个鲜为人知的细节
你好，我是Tony Bai。

今天我要带你进行一次深度探险，探索Go语言中那些鲜为人知却至关重要的细节。不了解这些细节不会影响你的日常编码，但在构建和优化Go程序时，如果遇到一些令人费解的现象，这些细节就很可能有了用武之地。

在本次探索中，我们将聚焦于导出标识符的微妙之处、gcflags和ldflags的神秘力量、包文件选择的智慧、默认链接方式的探索，以及那些未使用的符号的命运。这五个关键方面，每个都足以写成一篇长文，但今天，我将它们巧妙地编织在一起，带你进行一次全面的探索之旅。

我们先来看看导出标识符，它可不仅仅是首字母大写那么简单!

## 导出标识符：不仅仅是首字母大写那么简单

在Go语言中，导出标识符通常被简单理解为以大写字母开头的标识符。但实际上，这个概念背后隐藏着更多有趣的细节。我们先来重温一下导出标识符的定义。

### 导出标识符的定义

Go语言规范明确指出，一个标识符要成为导出标识符，必须满足两个条件：一是标识符名称的首字母为Unicode大写字母；二是该标识符必须在包块中声明，或者是字段名或方法名。

![图片](images/842942/1d4d5811b4de85db8dd295a1d559fb6f.png)

> 注：上图中Unicode字符类别Lu（Uppercase Letter）包含所有的大写字母。这一类别不仅包括英文大写字母，还涵盖多种语言的大写字符，例如希腊字母、阿拉伯字母、希伯来字母和西里尔字母等。然而，我非常 **不建议你使用非英文大写字母来表示导出标识符**，因为这可能会挑战我们的认知习惯。

这个定义的第一点很容易理解。例如，一个名为MyFunction的函数或MyType的类型就是导出标识符。但第二点往往容易被忽视，一个类型的字段名和方法名可以是导出的，但 **并不要求其关联的类型本身也必须是导出的**。这为我们提供了进一步探索Go导出标识符细节的机会。接下来，我们就用具体示例看看是否可以在包外访问非导出类型的导出字段以及导出方法。

### 访问非导出类型的导出字段和方法

即使一个类型本身是非导出的（即以小写字母开头），其内部的导出字段和方法依然可以在外部包中被访问。

我们来看一个例子，假设现在有一个非导出类型myStruct，它有一个导出字段Field：

```plain
// go-details/unexported-identifiers/field/mypackage/mypackage.go
package mypackage

type myStruct struct {
    Field string // 导出的字段
}

func NewMyStruct(value string) *myStruct {
    return &myStruct{Field: value}
}

func (m *myStruct) M1() {
    // ...
}

```

在另一个包中，我们可以通过NewMyStruct函数获取非导出类型myStruct的实例，并访问其导出字段Field和导出方法M1：

```plain
// go-details/unexported-identifiers/field/main.go
package main

import (
    "demo/mypackage"
    "fmt"
)

func main() {
    ms := mypackage.NewMyStruct("Hello")
    fmt.Println(ms.Field) // 可以访问 Field
    ms.M1() // 可以调用 M1
}

```

这种机制为库的开发者提供了更大的灵活性，可以让他们暴露类型的某些部分，隐藏其他部分，从而更好地控制API的使用。

### 非导出类型实现接口

更有趣的是，非导出类型可以实现外部包中定义的接口。这意味着，即使类型本身对外部不可见，但仍然可以遵循并实现外部定义的行为契约。下面是一个示例，我们来看一下。

```plain
// go-details/unexported-identifiers/interface/mypackage/mypackage.go
package mypackage

import "fmt"

type myStruct struct {
    Field string // 导出的字段
}

// NewMyStruct1是一个导出的函数，返回myStruct的指针
func NewMyStruct1(value string) *myStruct {
    return &myStruct{Field: value}
}

// NewMyStruct1是一个导出的函数，返回myStruct类型变量
func NewMyStruct2(value string) myStruct {
    return myStruct{Field: value}
}

func (m *myStruct) M1() {
    fmt.Println("invoke *myStruct's M1")
}

func (m myStruct) M2() {
    fmt.Println("invoke myStruct's M2")
}

// go-details/unexported-identifiers/interface/main.go
package main

import (
    "demo/mypackage"
)

// 定义一个导出的接口
type MyInterface interface {
    M1()
    M2()
}

func main() {
    var mi MyInterface

    // 通过导出的函数获取myStruct的指针
    ms1 := mypackage.NewMyStruct1("Hello1")
    mi = ms1
    mi.M1()
    mi.M2()

    // 通过导出的函数获取myStruct类型变量
    //ms2 := mypackage.NewMyStruct2("Hello2")
    //mi = ms2 // compile error: mypackage.myStruct does not implement MyInterface
}

```

在这个示例的main.go中，我们定义了一个接口MyInterface，它的方法集合中有两个方法：M1和M2。根据类型方法集合的判定规则，\*myStruct类型实现了MyInterface的所有方法，而myStruct类型则不满足，没有实现M1方法。我们在interface目录下编译运行这个示例，看看是否与预期一致：

```plain
$go run main.go
invoke *myStruct's M1
invoke myStruct's M2

```

如果我们去掉上面代码中对ms2的注释，将得到Compiler error: mypackage.myStruct does not implement MyInterface。

> 注：关于一个类型的方法集合的判定规则，可以参考专栏 [第](https://time.geekbang.org/column/article/466221) [25讲](https://time.geekbang.org/column/article/466221)。

接下来，我们再来考虑一个场景，即非导出类型用作嵌入字段的情况，看看该类型的导出方法和导出字段是否会promote到外部类型中。

### 嵌入字段中的非导出类型

我们改造一下示例，新版的带有嵌入字段的结构见下面mypackage包代码：

```plain
// go-details/unexported-identifiers/embeded_field/mypackage/mypackage.go

package mypackage

import "fmt"

type nonExported struct {
    Field string // 导出的字段
}

// Exported 是导出的结构体，嵌入了nonExported
type Exported struct {
    nonExported // 嵌入非导出结构体
}

func NewExported(value string) *Exported {
    return &Exported{
        nonExported: nonExported{
            Field: value,
        },
    }
}

// M1是导出的函数
func (n *nonExported) M1() {
    fmt.Println("invoke nonExported's M1")
}

// M2是导出的函数
func (e *Exported) M2() {
    fmt.Println("invoke Exported's M2")
}

```

这里新增一个导出类型Exported，它嵌入了一个非导出类型nonExported，后者拥有导出字段Field，以及两个导出方法M1。我们也给Exported类型定义了一个方法M2。

下面，我们再来看看main.go中是如何使用Exported的。

```plain
// go-details/unexported-identifiers/embeded_field/main.go
package main

import (
    "demo/mypackage"
    "fmt"
)

// 定义一个导出的接口
type MyInterface interface {
    M1()
    M2()
}

func main() {
    ms := mypackage.NewExported("Hello")
    fmt.Println(ms.Field) // 访问嵌入的非导出结构体的导出字段

    ms.M1() // 访问嵌入的非导出结构体的导出方法

    var mi MyInterface = ms
    mi.M1()
    mi.M2()
}

```

在embedded\_field目录下编译运行这个示例：

```plain
$go run main.go
Hello
invoke nonExported's M1
invoke nonExported's M1
invoke Exported's M2

```

我们看到，作为嵌入字段的非导出类型的导出字段与方法会被自动promote到外部类型中，通过外部类型的变量可以直接访问这些字段，调用这些导出方法。这些方法还可以作为外部类型方法集中的一员，来满足特定接口类型（如上面代码中的MyInterface）的条件。

在Go 1.18引入泛型之后，非导出类型也可以用作泛型函数和泛型类型的类型实参，这进一步扩展了非导出类型的应用范围。接下来，我们就一起看看非导出类型在泛型中的应用。

### 泛型与非导出类型

和前面一样，我们先定义用于该示例的带有导出字段和导出方法的非导出类型，代码如下：

```plain
// go-details/unexported-identifiers/generics/mypackage/mypackage.go

package mypackage

import "fmt"

// 定义一个非导出的结构体
type nonExported struct {
    Field string
}

// 导出的方法
func (n *nonExported) M1() {
    fmt.Println("invoke nonExported's M1")
}

func (n *nonExported) M2() {
    fmt.Println("invoke nonExported's M2")
}

// 导出的函数，用于创建非导出类型的实例
func NewNonExported(value string) *nonExported {
    return &nonExported{Field: value}
}

```

现在，我们要将其用于泛型函数。下面定义了泛型函数UseNonExportedAsTypeArgument，它的类型参数使用MyInterface作为约束，而上面的nonExported显然满足该约束，我们通过构造函数NewNonExported获得非导出类型的实例，然后将其传递给UseNonExportedAsTypeArgument，Go会通过泛型的类型参数自动推导机制推断出类型实参的类型，代码如下：

```plain
// go-details/unexported-identifiers/generics/main.go

package main

import (
    "demo/mypackage"
)

// 定义一个用作约束的接口
type MyInterface interface {
    M1()
    M2()
}

func UseNonExportedAsTypeArgument[T MyInterface](item T) {
    item.M1()
    item.M2()
}

// 定义一个带有泛型参数的新类型
type GenericType[T MyInterface] struct {
    Item T
}

func NewGenericType[T MyInterface](item T) GenericType[T] {
    return GenericType[T]{Item: item}
}

func main() {
    // 创建非导出类型的实例
    n := mypackage.NewNonExported("Hello")

    // 调用泛型函数，传入实现了MyInterface的非导出类型
    UseNonExportedAsTypeArgument(n) // ok

    // g := GenericType{Item: n} // compiler error: cannot use generic type GenericType[T MyInterface] without instantiation
    g := NewGenericType(n)
    g.Item.M1()
}

```

但目前Go泛型还不支持对泛型类型的类型参数的自动推导，所以直接通过g := GenericType{Item: n} 来初始化一个泛型类型变量将导致编译错误！我们需要借助泛型函数的推导机制将非导出类型与泛型类型结合，参考上面示例中的NewGenericType函数，通过泛型函数支持的类型参数的自动推导，间接获得GenericType的类型实参。在generics目录下编译运行这个示例，便可得到我们预期的结果，如下所示：

```plain
$go run main.go
invoke nonExported's M1
invoke nonExported's M2
invoke nonExported's M1

```

通过探讨这些细节，我们可以看到，Go语言的导出机制远比表面上看到的要复杂和精妙。它不仅仅是一种可见性控制手段，更是一种强大的设计工具，允许开发者构建出灵活且易于维护的代码结构。

## gcflags和ldflags：编译和链接的秘密武器

在Go语言的构建过程中，gcflags和ldflags是两个强大的工具。它们允许开发者向Go编译器和链接器传递额外的参数，从而精细地控制构建过程。不过，Go build文档中关于gcflags和ldflags的说明很短小精悍，如下所示：

```plain
$go help build
... ...
    -gcflags '[pattern=]arg list'
        arguments to pass on each go tool compile invocation.
    -ldflags '[pattern=]arg list'
        arguments to pass on each go tool link invocation.
... ...

The -asmflags, -gccgoflags, -gcflags, and -ldflags flags accept a space-separated list of arguments to pass to an underlying tool during the build. To embed spaces in an element in the list, surround it with either single or double quotes. The argument list may be preceded by a package pattern and an equal sign, which restricts the use of that argument list to the building of packages matching that pattern (see 'go help packages' for a description of package patterns). Without a pattern, the argument list applies only to the packages named on the command line. The flags may be repeated with different patterns in order to specify different arguments for different sets of packages. If a package matches patterns given in multiple flags, the latest match on the command line wins. For example, 'go build -gcflags=-S fmt' prints the disassembly only for package fmt, while 'go build -gcflags=all=-S fmt' prints the disassembly for fmt and all its dependencies.

... ...

```

以gcflags为例，多数Go初学者初次看到关于gcflags的说明，都无法知道到底有哪些arg可用，以及究竟如何使用gcflags，而 [Go cmd文档](https://pkg.go.dev/cmd/go) 中关于gcflags的内容也仅限于上述这些。

基于此，我将经常遇到的主要问题总结为下面两条：

- gcflags的完整参数选项列表在哪里可以找到？

- gcflags的使用模式，尤其是go help build输出的内容中的package pattern该如何正确使用？


我们先来看看如何 **查找gcflags可用的全部参数选项。** go help build不行， [go command的Web文档](https://pkg.go.dev/cmd/go) 中没有！甚至 [Go tool compile的Web文档](https://pkg.go.dev/cmd/compile) 中列举的gcflag的参数列表也是不全的（或者说文档没有及时同步最新的参数列表变化）。其实，答案远在天边，近在眼前！如下命令就可以让gcflag可用的参数选项完整列表尽收眼底：

```plain
$go tool compile -h
usage: compile [options] file.go...
  -%    debug non-static initializers
  -+    compiling runtime
  -B    disable bounds checking
  -C    disable printing of columns in error messages
  -D path
        set relative path for local imports
  -E    debug symbol export
  -I directory
        add directory to import search path
  -K    debug missing line numbers
  -L    also show actual source file names in error messages for positions affected by //line directives
  -N    disable optimizations
  -S    print assembly listing
  -V    print version and exit
  -W    debug parse tree after type checking
  -asan
        build code compatible with C/C++ address sanitizer
  -asmhdr file
        write assembly header to file
... ...

```

> 注：如果你要查看ldflags的完整参数选项列表，你可以使用go tool link -h。

接下来，我们再来看第二个问题： **-gcflags的使用模式**。根据go help build的输出，我们知道-gcflags的使用形式如下：

```plain
-gcflags '[pattern=]arg list'

```

其中：

- \[pattern=\]（可选）：包模式（package pattern），用于作用范围控制，即限定参数仅应用于特定的包。如果省略此部分，则参数仅适用于命令行中指定的包。

- arg list：参数选项列表，多个参数以空格分隔。


想要使用好gcflags，并不一样要深入理解包模式。但在一些复杂项目中，我们可能会通过包模式精确控制调试和优化，那在这种情况下，对包模式有深入理解还是大有裨益的。

包模式是一种通过匹配规则指定目标包的方式，常见的包模式有以下几种：

- ./…：匹配当前目录及其所有子目录中的包。

- /DIR/…：匹配/DIR及其子目录中的包。

- cmd/…：匹配Go仓库中cmd目录下的所有命令包。

- github.com/user/repo/…：匹配该GitHub仓库中的所有包。

- all：GOPATH模式下，匹配的是所有GOPATH路径中的包，Go module模式下，all匹配主模块及其所有依赖的包（包括测试依赖）。

- std：仅匹配标准库包。

- cmd：匹配Go仓库中的Go命令及其内部包(internal)。


基于上述关于gcflags使用形式以及包模式的说明，我们通过几个示例来直观理解一下gcflags的用法。

- 对单个包设置参数：参数-S仅作用于fmt包，显示其反汇编代码。

```plain
$go build -gcflags=-S fmt

```

- 对特定模式（比如all/std等）的包设置参数：在Go module模式下，参数-N和-l应用于当前主模块所有包及其依赖，禁用优化和内联。

```plain
$go build -gcflags='all=-N -l'

```

- 对不同包模式设置不同参数：Go build命令行中可以 **多次使用-gcflags**，如下命令中的第一个gcflags对fmt包启用反汇编输出（-S），第二个gcflags对net/http包禁用优化（-N）。

```plain
$go build -gcflags='fmt=-S' -gcflags='net/http=-N'

```

- 模式的优先级：如下命令中，两个gcflags都匹配了fmt包，或者说两个gcflags的作用范围都包含了fmt包，这种情况下哪些参数会对fmt包生效呢？Go规定：当一个包匹配多个模式时，以最后一个匹配的参数为准。所以在这个例子中，fmt包将只应用-S参数，而其他包应用-N参数。

```plain
$go build -gcflags='all=-N' -gcflags='fmt=-S'

```

到这里，你应该能掌握查看gcflags完整参数列表的方法，以及gcflags的使用模式了。有了对这些细节的把握，你在后续构建和调试Go项目时能更加得心应手。

## 包文件选择的规则

了解了编译器和链接器的参数使用后，我们再来看看Go编译的基本单元：包。在Go语言中，一个包通常由一个目录下的多个 .go文件组成。但是，并非所有的文件都会被编译到最终的包中。Go编译器会根据一套规则来选择需要编译的文件，那这套规则是怎样的呢？下面我们就来学习一下包文件选择的细节。

### 表象

在Go工程中，通常一个目录对应一个Go包，每个Go包下可以存在多个以 .go为后缀的Go源文件，这些源文件只能具有唯一的包名（测试源文件除外）。以标准库fmt包为例，它的目录下的源文件列表如下（以Go 1.23.0源码为例）：

```plain
$ls $GOROOT/src/fmt
doc.go                export_test.go          print.go            stringer_example_test.go
errors.go            fmt_test.go         scan.go             stringer_test.go
errors_test.go            format.go           scan_test.go
example_test.go            gostringer_example_test.go  state_test.go

```

在这些文件中，哪些最终进入到了fmt包的目标文件（fmt.a）中呢？ **贴心的Go工具链** 为我们提供了如下的查看方法：

```plain
$go list -f '{{.GoFiles}}' fmt
[doc.go errors.go format.go print.go scan.go]

```

对于独立于目标ARCH和OS的fmt包来说，其Go源文件的选择似乎要简单一些。我们看到，除了包测试文件（xxx\_test.go），其他文件都被编译到了最终的fmt包中。

我们再来看一个与目标ARCH和OS相关性较高的net包。除去子目录，这个包目录下的Go源文件数量大约有220多个，但在 **macOS/amd64** 下通过go list查看最终进入net包目标文件的文件，大约只有几十个：

```plain
$go list -f '{{.GoFiles}}' net
[addrselect.go cgo_darwin.go cgo_unix.go cgo_unix_syscall.go conf.go dial.go dnsclient.go dnsclient_unix.go dnsconfig.go dnsconfig_unix.go error_posix.go error_unix.go fd_posix.go fd_unix.go file.go file_unix.go hook.go hook_unix.go hosts.go interface.go interface_bsd.go interface_darwin.go ip.go iprawsock.go iprawsock_posix.go ipsock.go ipsock_posix.go lookup.go lookup_unix.go mac.go mptcpsock_stub.go net.go netcgo_off.go netgo_off.go nss.go parse.go pipe.go port.go port_unix.go rawconn.go rlimit_unix.go sendfile_unix_alt.go sock_bsd.go sock_posix.go sockaddr_posix.go sockopt_bsd.go sockopt_posix.go sockoptip_bsdvar.go sockoptip_posix.go splice_stub.go sys_cloexec.go tcpsock.go tcpsock_posix.go tcpsock_unix.go tcpsockopt_darwin.go tcpsockopt_posix.go udpsock.go udpsock_posix.go unixsock.go unixsock_posix.go unixsock_readmsg_cloexec.go writev_unix.go]

```

接下来，我们跳出Go标准库，来看一个自定义的示例：

```plain
$tree -F buildconstraints/demo1
buildconstraints/demo1
├── foo/
│   ├── f1_android.go
│   ├── f2_linux.go
│   └── f3_darwin.go
└── go.mod

// go-details/buildconstraints/demo1/foo/f1_android.go

//go:build linux

package foo

func F1() {
}

// go-details/buildconstraints/demo1/foo/f2_linux.go
//go:build android

package foo

func F2() {
}

// go-details/buildconstraints/demo1/foo/f3_darwin.go
//go:build android

package foo

func F3() {
}

```

在GOOS=android下构建buildconstraints/demo1/foo这个包，哪些文件会被选出来呢？我们先看下面的输出结果：

```plain
$GOOS=android go list -f '{{.GoFiles}}' github.com/bigwhite/demo1/foo
[f1_android.go f2_linux.go]

```

如果说前两个示例还好理解，那这第三个示例很可能会让很多开发者有些“发懵”。别急，上面三个示例都是表象。接下来，我们仔细探索一下Go构建时的文件选择机制。

### 文件选择机制

Go包构建时选择源文件的机制还是蛮繁琐的，我们需要从源码入手梳理出主要逻辑。在Go 1.23版本中，Go包构建过程源文件选择逻辑的代码位于 $GOROOT/src/go/build/build.go 中。这个源文件有2k多行，不过不用担心，我替你把主要调用逻辑梳理出来了，如下图：

![](images/842942/227f6b5c7eeb5966c82b4467975fc48d.jpg)

函数Import调用Default.Import去获取包的详细信息，信息用build.Package结构表示：

```plain
// $GOROOT/src/go/build/build.go
// A Package describes the Go package found in a directory.
  type Package struct {
      Dir           string   // directory containing package sources
      Name          string   // package name
      ImportComment string   // path in import comment on package statement
      Doc           string   // documentation synopsis
      ImportPath    string   // import path of package ("" if unknown)
      Root          string   // root of Go tree where this package lives
      SrcRoot       string   // package source root directory ("" if unknown)
      PkgRoot       string   // package install root directory ("" if unknown)
      PkgTargetRoot string   // architecture dependent install root directory ("" if unknown)
      BinDir        string   // command install directory ("" if unknown)
      Goroot        bool     // package found in Go root
      PkgObj        string   // installed .a file
      AllTags       []string // tags that can influence file selection in this directory
      ConflictDir   string   // this directory shadows Dir in $GOPATH
      BinaryOnly    bool     // cannot be rebuilt from source (has //go:binary-only-package comment)

      // Source files
      GoFiles           []string // .go source files (excluding CgoFiles, TestGoFiles, XTestGoFiles)
      ... ...

```

其中的GoFiles就是参与Go包编译的源文件列表。Default是默认的上下文信息，包括构建所需的默认goenv中几个环境变量，比如GOARCH、GOOS等的值：

```plain
// Default is the default Context for builds.
// It uses the GOARCH, GOOS, GOROOT, and GOPATH environment variables
// if set, or else the compiled code's GOARCH, GOOS, and GOROOT.
var Default Context = defaultContext()

```

Context的Import方法代码行数很多，对于要了解文件选择细节的我们来说，最重要的调用是Context的matchFile方法。matchFile正是那个 **用于确定某个Go源文件是否应该被选入最终包文件中的方法**。

它内部的逻辑可以分为两个主要步骤。第一步是 **调用Context的goodOSArchFile方法对Go源文件的名字进行判定**，goodOSArchFile方法的判定也有两个子步骤。

首先是判断名字中的OS和ARCH是否在Go支持的OS和ARCH列表中。当前Go支持的OS和ARCH在syslist.go文件中有如下定义：

```plain
// $GOROOT/src/go/build/syslist.go

// knownArch is the list of past, present, and future known GOARCH values.
// Do not remove from this list, as it is used for filename matching.
var knownArch = map[string]bool{
    "386":         true,
    "amd64":       true,
    "amd64p32":    true,
    "arm":         true,
    "armbe":       true,
    "arm64":       true,
    "arm64be":     true,
    "loong64":     true,
    "mips":        true,
    "mipsle":      true,
    "mips64":      true,
    "mips64le":    true,
    "mips64p32":   true,
    "mips64p32le": true,
    "ppc":         true,
    "ppc64":       true,
    "ppc64le":     true,
    "riscv":       true,
    "riscv64":     true,
    "s390":        true,
    "s390x":       true,
    "sparc":       true,
    "sparc64":     true,
    "wasm":        true,
}

// knownOS is the list of past, present, and future known GOOS values.
// Do not remove from this list, as it is used for filename matching.
// If you add an entry to this list, look at unixOS, below.
var knownOS = map[string]bool{
    "aix":       true,
    "android":   true,
    "darwin":    true,
    "dragonfly": true,
    "freebsd":   true,
    "hurd":      true,
    "illumos":   true,
    "ios":       true,
    "js":        true,
    "linux":     true,
    "nacl":      true,
    "netbsd":    true,
    "openbsd":   true,
    "plan9":     true,
    "solaris":   true,
    "wasip1":    true,
    "windows":   true,
    "zos":       true,
}

```

我们也可以通过下面命令查看：

```plain
$go tool dist list
aix/ppc64
android/386
android/amd64
android/arm
android/arm64
darwin/amd64
darwin/arm64
dragonfly/amd64
freebsd/386
freebsd/amd64
freebsd/arm
freebsd/arm64
freebsd/riscv64
illumos/amd64
ios/amd64
ios/arm64
js/wasm
linux/386
linux/amd64
linux/arm
linux/arm64
linux/loong64
linux/mips
linux/mips64
linux/mips64le
linux/mipsle
linux/ppc64
linux/ppc64le
linux/riscv64
linux/s390x
netbsd/386
netbsd/amd64
netbsd/arm
netbsd/arm64
openbsd/386
openbsd/amd64
openbsd/arm
openbsd/arm64
openbsd/ppc64
openbsd/riscv64
plan9/386
plan9/amd64
plan9/arm
solaris/amd64
wasip1/wasm
windows/386
windows/amd64
windows/arm
windows/arm64

```

> 注：像sock\_bsd.go、sock\_posix.go这样的Go源文件，虽然它们的文件名中包含posix、bsd等字样，但这些文件实际上只是普通的Go源文件。其文件名本身并不会影响Go包在构建时选择文件的结果。

然后是调用matchTag，来判定该Go源文件名字中的OS和ARCH是否与当前上下文信息中的OS和ARCH匹配。Go支持的源文件名组成格式如下：

```plain
  //  name_$(GOOS).*
  //  name_$(GOARCH).*
  //  name_$(GOOS)_$(GOARCH).*
  //  name_$(GOOS)_test.*
  //  name_$(GOARCH)_test.*
  //  name_$(GOOS)_$(GOARCH)_test.*

```

不过，如下三种情况例外：

- 如果上下文中的GOOS=android，那么文件名字中OS值为linux的Go源文件也算是匹配的。

- 如果上下文中的GOOS=illumos，那么文件名字中OS值为solaris的Go源文件也算是匹配的。

- 如果上下文中的GOOS=ios，那么文件名字中OS值为darwin的Go源文件也算是匹配的。


此外，还有一个特殊处理，那就是当文件名字中OS值为unix时，该源文件可以匹配下面上下文中GOOS的值：

```plain
// $GOROOT/src/go/build/syslist.go

// unixOS is the set of GOOS values matched by the "unix" build tag.
// This is not used for filename matching.
// This list also appears in cmd/dist/build.go and
// cmd/go/internal/imports/build.go.
var unixOS = map[string]bool{
    "aix":       true,
    "android":   true,
    "darwin":    true,
    "dragonfly": true,
    "freebsd":   true,
    "hurd":      true,
    "illumos":   true,
    "ios":       true,
    "linux":     true,
    "netbsd":    true,
    "openbsd":   true,
    "solaris":   true,
}

```

> 这里面列出的OS都是所谓的“类Unix”操作系统。

如果goodOSArchFile方法返回文件名匹配成功，那么 **第二步就是调用Context的shouldBuild方法对Go源文件中的build constraints进行判定。** 这个判定过程也是调用matchTag完成的，因此规则与上面对matchTag的说明一致。如果判定match成功，那么该源文件将会被Go编译器编译到最终的Go包目标文件中去。

最后，我再结合之前“表象”中提到的那个自定义示例，详细判定一下为何最终会输出相应的结果。

### 示例分析

在go-details/buildconstraints/demo1/foo包目录中，一共有三个Go源文件：

```plain
$tree -F foo
foo
├── f1_android.go
├── f2_linux.go
└── f3_darwin.go

```

注意：当前我的系统为 **darwin/amd64**，但我们使用了GOOS=android的环境变量。我们顺着刚才梳理出来的文件选择判定的主逻辑，逐一过一遍这三个文件。

对于f1\_android.go，先用goodOSArchFile判定文件名是否匹配。当GOOS=android时，文件名中的OS为android，文件名匹配成功，然后用shouldBuild判定文件中的build constraints是否匹配。

如果该文件的约束为linux，我们在上面matchTag的三个例外规则里提到过，当GOOS=android时，如果build constraints是linux，是可以匹配的。因此，f1\_android.go将出现在最终编译文件列表中。

对于f2\_linux.go，先用goodOSArchFile判定文件名是否匹配。当GOOS=android时，文件名中的OS为linux，linux显然在Go支持的OS列表中，并且根据matchTag的例外规则，当GOOS=android时，文件名中的OS为linux时是可以匹配的。

然后用shouldBuild判定文件中的build constraints是否匹配。该文件的约束为android，与GOOS相同，可以匹配。因此，f2\_linux.go将出现在最终编译文件列表中。

对于f3\_darwin.go，先用goodOSArchFile判定文件名是否匹配。当GOOS=android时，文件名中的OS为darwin，虽然darwin在Go支持的OS列表中，但darwin与GOOS=android并不匹配。

因此在goodOSArchFile这步中，f3\_darwin.go就被“淘汰”掉了！即便f3\_darwin.go中的build constraints为android，f3\_darwin.go也不会出现在最终编译文件列表中。

如果再增加一个如下的源文件f4\_unix.go，它是否会出现在最终的包编译文件列表中呢？

```plain
//go:build android

func F4() {
}

```

这就作为思考题留给你了，也欢迎你在评论区留言，说说你的思考结果。

通过以上这些规则，Go语言实现了灵活而强大的文件选择机制，使得我们可以轻松地编写跨平台的代码。并且，理解这些内部机制不仅能帮助开发者优化构建过程，还能有效避免潜在的错误。

## 默认的链接方式：静态还是动态？

接下来，我们再来看两个与Go构建有关的细节，先来看Go默认的链接方式！你知道在默认情况下，Go程序究竟是静态链接还是动态链接的吗？如果你还不是很确定，就和我一起继续探索吧！

### 默认的静态链接

实际上，尽管CGO\_ENABLED的默认值为1， **但在大多数情况下，Go编译器会尽可能地采用静态链接**。这意味着Go程序会将所有依赖的代码（包括标准库）都打包到最终的可执行文件中，而不依赖于外部的动态链接库。

例如，一个简单的“Hello, World”程序，即使在 `CGO_ENABLED=1` 的情况下，默认也是静态链接的：

```plain
package main

import "fmt"

func main() {
    fmt.Println("hello, world")
}

```

我们可以编译并检查这个程序来验证一下：

```plain
$ go build -o helloworld
$ file helloworld
helloworld: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, not stripped

```

可以看到，这个程序是静态链接的。

### 一些例外

然而，凡事总有例外。在某些情况下，Go编译器也会生成动态链接的可执行文件。接下来，我列举三种常见情况。

**第一种是使用了某些标准库包的C实现。** 某些标准库包，如 `net` 和 `os/user`，在某些操作系统上有纯Go实现和C实现两个版本。当CGO\_ENABLED=1且目标平台支持C实现时，Go编译器会优先选择C实现，这将导致动态链接。

例如，如果我们稍微修改一下前面的程序，导入os/user包：

```plain
package main

import (
    "fmt"
    _ "os/user"
)

func main() {
    fmt.Println("hello, world")
}

```

再次编译并检查，就可以看到这次生成的可执行文件是动态链接的。

```plain
$ go build -o helloworld
$ file helloworld
helloworld: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, not stripped

```

**第二种情况是显式使用了cgo。** 如果代码中显式使用了cgo来调用外部的C代码，那么最终的可执行文件通常会是动态链接的。

**第三种情况是使用了依赖cgo的第三方包。** 如果你的代码依赖的第三方包中使用了cgo，那么最终的可执行文件也可能是动态链接的。

### 控制链接方式

如果出现了上面三种例外情况，但是我们仍需要静态链接，又应该怎么做呢？我们一个一个来看！

针对第一种例外情况，即使在使用了 `os/user` 或 `net` 的情况下，我们也可以设置 `CGO_ENABLED=0` 来禁用cgo：

```plain
$ CGO_ENABLED=0 go build -o helloworld
$ file helloworld
helloworld: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, not stripped

```

对于显式使用了cgo的情况，如果外部C库提供了静态库（ `.a` 文件），我们也可以通过适当设置CGO\_LDFLAGS来实现静态链接：

```plain
// 在调用cgo的代码中使用LDFLAGS静态链接第三方的C库
... ...
#cgo LDFLAGS: -static -L my-c-lib -lmylib
... ...

```

最麻烦的当数第三种例外了，即依赖使用cgo的外部Go包。要想在这种情况下实现静态链接，我们需要找出Go依赖所有外部C库的 .a文件（静态共享库）。

以一个使用了go-sqlite3包的代码为例，go-sqlite3是SQLite库的go binding，它依赖SQLite库，同时所有第三方C库都依赖libc。为了静态编译这个示例代码，我们要准备SQLite和libc的 .a文件：

```plain
$yum install -y gcc glibc-static sqlite-devel
... ...

已安装:
  sqlite-devel.x86_64 0:3.7.17-8.el7_7.1

更新完毕:
  glibc-static.x86_64 0:2.17-326.el7_9.3

```

接下来，我们就能以静态链接的方式编译该代码了，下面是一个go build命令的参考：

```plain
$go build -tags 'sqlite_omit_load_extension' -ldflags '-linkmode external -extldflags "-static"' demo

$file ./demo
./demo: ELF 64-bit LSB executable, x86-64, version 1 (GNU/Linux), statically linked, for GNU/Linux 2.6.32, BuildID[sha1]=c779f5c3eaa945d916de059b56d94c23974ce61c, not stripped

```

这里命令行中的 `-tags 'sqlite_omit_load_extension'` 用于禁用SQLite3的动态加载功能，确保更好的静态链接兼容性。而 `-ldflags '-linkmode external -extldflags "-static"'` 的含义是使用外部链接器（比如gcc linker），并强制静态链接所有库。

## 未使用的符号会包含在最终的可执行文件中吗？

我们知道，无论是GOPATH时代，还是Go module时代，Go的编译单元始终是包（package）。一个包（无论包中包含多少个Go源文件）会作为一个编译单元被编译为一个目标文件（.a），然后Go链接器会将多个目标文件链接在一起生成可执行文件。因此如果一个包被依赖，那么它就会进入到Go二进制文件中，它内部的符号也会进入到Go二进制文件中。

那么问题来了！是否被依赖包中的所有符号都会被放到最终的可执行文件中？我们以最简单的Hello World（前面示例中的代码）为例，它依赖fmt包，并调用了fmt包的Println函数，我们看看Println这个符号是否会出现在最终的可执行文件中：

```plain
$nm -a helloworld-default | grep "Println"
000000000048eba0 T fmt.(*pp).doPrintln

```

居然没有！我们初步怀疑是inline优化在作祟。接下来，关闭优化再来试试：

```plain
$go build -o helloworld-default-noinline -gcflags='-l -N' main.go

$nm -a helloworld-default-noinline | grep "Println"
000000000048ec00 T fmt.(*pp).doPrintln
0000000000489ee0 T fmt.Println

```

的确如此！不过当使用"fmt."去过滤helloworld-default-noinline的所有符号时，我们发现fmt包的一些常见符号并未包含在其中，比如Printf、Fprintf、Scanf等。

这是因为Go编译器的一个重要特性：死码消除（Dead Code Elimination），即编译器会将未使用的代码和数据从最终的二进制文件中剔除。

解决了这个问题，我们再来探讨一个衍生问题： **如果Go源码使用空导入方式导入了一个包，那么这个包是否会被编译到Go二进制文件中呢**？其实道理是一样的，如果用到了里面的符号，就会存在，否则不会。

以空导入os/user为例，即便在CGO\_ENABLED=0的情况下，因为没有使用os/user中的任何符号，在最终的二进制文件中也不会包含user包：

```plain
$CGO_ENABLED=0 go build -o helloworld-with-os-user-noinline -gcflags='-l -N' main-with-os-user.go
[root&#64;iZ2ze18rmx2avqb5xgb4omZ helloworld]# nm -a helloworld-with-os-user-noinline |grep user
0000000000551ac0 B runtime.userArenaState

```

但是，如果是带有init函数的包，且init函数中调用了同包其他符号的情况呢？我们以expvar包为例看一下：

```plain
// go-details/go-compilation/main-with-expvar.go

package main

import (
    _ "expvar"
    "fmt"
)

func main() {
    fmt.Println("hello, world")
}

```

编译并查看一下其中的符号：

```plain
$go build -o helloworld-with-expvar-noinline -gcflags='-l -N' main-with-expvar.go
$nm -a helloworld-with-expvar-noinline|grep expvar
0000000000556480 T expvar.appendJSONQuote
00000000005562e0 T expvar.cmdline
00000000005561c0 T expvar.expvarHandler
00000000005568e0 T expvar.(*Func).String
0000000000555ee0 T expvar.Func.String
00000000005563a0 T expvar.init.0
00000000006e0560 D expvar..inittask
0000000000704550 d expvar..interfaceSwitch.0
... ...

```

除此之外，一个包即便没有init函数，但也有需要初始化的全局变量，比如crypto包的hashes：

```plain
// $GOROOT/src/crypto/crypto.go
var hashes = make([]func() hash.Hash, maxHash)

```

crypto包的相关符号如何也会进入最终的可执行文件中，不妨自己动手试试。下面是我得到的一些输出：

```plain
$go build -o helloworld-with-crypto-noinline -gcflags='-l -N' main-with-crypto.go
$nm -a helloworld-with-crypto-noinline|grep crypto
00000000005517b0 B crypto.hashes
000000000048ee60 T crypto.init
0000000000547280 D crypto..inittask

```

有人会问：os/user包也有一些全局变量啊，为什么这些符号没有被包含在可执行文件中呢？比如：

```plain
// $GOROOT/src/os/user/user.go
var (
    userImplemented      = true
    groupImplemented     = true
    groupListImplemented = true
)

```

这就涉及Go包初始化的逻辑了。我们看到crypto包包含在可执行文件中的符号有crypto.init和crypto…inittask，显然这不是crypto包代码中的符号，而是Go编译器为crypto包自动生成的init函数和inittask结构。

Go编译器会为每个包生成一个init函数，即使包中没有显式定义init函数，同时 [每个包都会有一个inittask结构](https://go.dev/src/cmd/compile/internal/pkginit/init.go)，用于运行时的包初始化系统。当然这么说也不够精确，如果一个包没有init函数、需要初始化的全局变量或其他需要运行时初始化的内容，则编译器不会为其生成init函数和inittask，比如上面的os/user包。

os/user包确实有上述全局变量的定义，但是这些变量是在编译期就可以确定值的常量布尔值，而且未被包外引用或在包内用于影响控制流。Go编译器足够智能，能够判断出这些初始化是“无副作用的”，不需要在运行时进行初始化，只有真正需要运行时初始化的包才会生成init和inittask。

这也解释了，为什么空导入os/user包时没有相关的init和inittask符号，而crypto、expvar包有init.0和inittask符号。

## 小结

今天，我们一起走过了一段充满惊喜的旅程，探索了Go语言中那些鲜为人知却至关重要的细节。从导出标识符的微妙之处，到 `gcflags` 和 `ldflags` 的强大力量，再到包文件选择的智慧，以及默认链接方式的探索，最后到那些未使用的符号的命运，每一个主题都让我们对Go语言的理解更加深入。

当然，这些知识不仅仅是一些琐碎的细节，它们是构建高效、健壮且易于维护的Go程序的基础。

- 理解了导出标识符的真正含义，我们可以更好地设计包的接口，实现信息隐藏和封装。
- 掌握了 `gcflags` 和 `ldflags`，我们就拥有了精细调控编译和链接过程的能力，可以针对不同的需求进行优化。
- 了解了包文件选择的规则，我们就能更轻松地编写跨平台的代码。
- 明白了默认的链接方式，我们就可以更好地控制程序的依赖和部署。
- 认识到死代码消除的机制，则有助于我们编写出更简洁、高效的代码。

我希望这次的探险能够激发你对Go语言更深层次的兴趣。Go语言就像一个宝藏，总有新的领域等待我们去探索，总有新的知识等待我们去发现。每一次的深入挖掘，都会让我们对这门语言有更多的了解和喜爱。

最后，再次感谢你的陪伴。希望这篇加餐能够成为你Go语言学习之旅中一块有益的垫脚石。如果你有任何问题或者想要进一步探讨的内容，欢迎随时与我交流。让我们在Go语言的世界里继续探索，不断前行！

## 思考题

学完这一节后，建议你使用我给出的示例，自己动手从头探索一下今天讲的细节。如果有新的想法，欢迎在留言区一起分享和交流。