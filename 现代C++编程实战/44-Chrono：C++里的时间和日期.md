# 44 | Chrono：C++里的时间和日期
你好，我是吴咏炜。

从 C++11 开始，C++ 标准就引入了全新的 chrono（来自古希腊语 χρόνος，意为时间）库，解决了时间方面的典型痛点。而到了 C++20，chrono 库进一步得到了强化，弥补了原先的一些不足，并增加了日期方面的支持。这个 chrono 库，在之前的课程中我也零星地用过，但一直没有系统地进行描述。今天，我就来完整讨论一下 C++ 里的时间和日期。

## C++11 之前的时间和日期

在 C++11 之前，程序员当然也有处理时间和日期的需要，但那时，如果不用第三方库的话，我们只能使用 C 带来的陈旧功能。下面的代码演示了标准库提供的基本功能：

```cpp
time_t t = time(nullptr);
cout &lt;&lt; "Seconds since epoch time: "
     &lt;&lt; t &lt;&lt; '\n';
cout &lt;&lt; "ctime result:             "
     &lt;&lt; ctime(&t);
tm* tm_ptr = localtime(&t);
cout &lt;&lt; "Local time as ctime:      "
     &lt;&lt; asctime(tm_ptr);
tm_ptr = gmtime(&t);
cout &lt;&lt; "UTC time as ctime:        "
     &lt;&lt; asctime(tm_ptr);
char buffer[80];
strftime(buffer, sizeof buffer,
         "%F %T %Z", tm_ptr);
cout &lt;&lt; "Formatted time:           "
     &lt;&lt; buffer &lt;&lt; '\n';
cout &lt;&lt; "Wrong mktime result:      "
     &lt;&lt; mktime(tm_ptr) &lt;&lt; '\n';

```

在 Unix 环境下的某次运行输出为：

> `Seconds since epoch time: 1741407262`
>
> `ctime result:             Sat Mar  8 12:14:22 2025`
>
> `Local time as ctime:      Sat Mar  8 12:14:22 2025`
>
> `UTC time as ctime:        Sat Mar  8 04:14:22 2025`
>
> `Formatted time:           2025-03-08 04:14:22 UTC`
>
> `Wrong mktime result:      1741378462`

简单解释一下用到的函数：

- `time`：用来获得当前的系统时间，类型是 `time_t`，代表从协调世界时（UTC）1970 年 1 月 1 日零点开始计数的秒数（忽略闰秒）。
- `localtime`：把 `time_t` 代表的时间点转换成结构体 `tm`，其中包含在本地时间中的具体年、月、日、时、分、秒等信息（不同的平台可能包含不同的额外信息）。
- `gmtime`：把 `time_t` 代表的时间点转换成结构体 `tm`，其中包含在 UTC（以前的标准是格林尼治平时，Greenwich Mean Time）中的具体年、月、日、时、分、秒等信息。
- `ctime`：把 `time_t` 代表的时间点变成一个字符串（尾部自带换行符）。
- `asctime`：把结构体 `tm` 中的信息以 `ctime` 的方式来转成字符串。
- `strftime`：把结构体 `tm` 中的信息以指定的格式化方式来转成字符串。标准里规定很多的格式化方式，而不同的平台又提供了一些扩展。比如，上面使用了 `strftime(buffer, sizeof buffer, "%F %T %Z", tm_ptr)`，在 Unix 得到了正确的结果，而在 Windows 上则在时区部分会有错误，因为 Windows 上 `tm` 里不含时区信息。
- `mktime`：把结构体 `tm` 中的信息当作本地时间转换成 `time_t`（代码里使用了 UTC 时间，因此结果是“错”的）。

这些功能本身看着就一般吧……并且缺点一数一大堆：

- `ctime`、 `asctime`、 `localtime` 和 `gmtime` 使用内部缓冲区，存在重入问题，不适合在多线程环境里使用。
- 没有标准的时区支持。Unix 的 `tzset` 和 Windows 的 `_tzset` 只能全局设置时区，且对于如何设置程序到某一特定时区有不同的方法。
- 没有跨平台的高精度时间获取接口（Unix 下的 `gettimeofday` 不跨平台，在 Windows 上无法直接使用）。
- 没有跨平台的稳定时钟接口（性能测试需要； `clock` 在 Unix 和 Windows 上具有不同的语义和精度）。
- `time_t` 是弱类型，跟其他整数类型容易互转，缺少强类型带来的安全性。
- 有不少易用性问题，如 `tm` 结构体里的 `tm_year`（年）是从 1900 年开始算的年数，而 `tm_mon`（月）的有效范围是从 0 到 11。
- 没有表示秒之外的时长的方便方法。
- 表示日期较为麻烦（需自己填充 `tm` 结构体），也不支持方便的日期运算（如一个月后）。
- 获得和打印时间的代码常常较为冗长。
- ……

这些问题，到 C++20 时基本都得到了解决。

## C++11/14 的时间库

### 基本概念

C++11 的 chrono 库引入了三个基本概念：

- 时钟（clock）
- 时间点（time point）
- 时长（duration）

它们之间的基本关系是：

- 每种 **时钟** 有一个时间原点（epoch），且可以产生 **时间点**。每种时钟是独立的类型。
- **时间点** 是从某个时间原点开始计算的 **时长**。 **时间点** `time_point` 是类模板，它的模板参数是 **时钟类型** 和 **时长**。
- **时间点** 相减可以得到 **时长**。 **时长** `duration` 是类模板，它的模板参数是表示时长的数值类型和比例。

所有的相关实体定义在 `std::chrono` 名空间里。时长相关的自定义字面量后缀（参见 [第 9 讲](https://time.geekbang.org/column/article/176916)）定义在 `std::literals::chrono_literals` 内联名空间里，且在导入 `std::chrono` 名空间后也可以直接使用。

### 时钟

C++11 提供了三种不同的时钟：

- `system_clock`（系统时钟）：这是跟 C 的标准接口有对应关系的时钟，表示的时间跟 `time` 接口相仿，但原生提供了更高的精度。仅对于该类型的时钟，我们可以使用静态成员函数 `from_time_t` 和 `to_time_t` 来跟 `time_t` 类型进行互转。
- `steady_clock`（稳定时钟）：这是能以稳定频率增加时间的时钟，可以保证时间稳定增长不回退，比较适合测时之类的场合。
- `high_resolution_clock`（高精度时钟）：通常是上面两种时钟之一的别名，是目标平台上最高精度的时钟。目前看下来，这种时钟类型并没有什么特别适用的场合。

下面的代码展示了 `system_clock` 的基本用法：

```cpp
auto now = system_clock::now();
cout &lt;&lt; "to_time_t(now):     "
     &lt;&lt; system_clock::to_time_t(now)
     &lt;&lt; '\n';
cout &lt;&lt; "Seconds from epoch: "
     &lt;&lt; setprecision(13)
     &lt;&lt; duration_cast&lt;
          duration&lt;double&gt;&gt;(
          now.time_since_epoch())
          .count()
     &lt;&lt; '\n';

```

“当前”运行的输出是：

> `to_time_t(now):     1741584687`
>
> `Seconds from epoch: 1741584687.305`

这里，我们首先用 `system_clock::now()` 获取当前时间点，然后将其转成 `time_t` 来输出。随后，我们用时间点的 `time_since_epoch` 成员函数获取从时间原点开始的时长，并将其转成用 `double` 作为基础数值类型的秒数。注意，此时得到的结果是时长，在 C++20 之前不能直接输出，因此需要用 `count` 成员函数获得 `double` 类型的秒计数才能正确输出。

此处我们可以看到，时间点的精度可以比秒更细。在主流平台上， `system_clock` 记录的时间精度至少达到了微秒级，而 `steady_clock` 记录的时间精度一般是纳秒。

### 时长、时间点和基本运算支持

时长的定义（因而也影响了时间点的定义）包括了数据表示类型（如 `int64_t`）和精度（使用比例）。我们知道：1 纳秒是 1⁄109 秒；纳秒的英文是 nanosecond，国际单位制（SI）里缩写为 ns。这些定义跟 C++ 里的定义完美吻合。在目前的主流标准库实现里，定义差不多是下面这样：

```cpp
using nano = ratio&lt;1, 1000000000&gt;;
using nanoseconds =
  duration&lt;int64_t, nano&gt;;

```

第一个定义位于 `std` 名空间里，由头文件 &lt;ratio> 提供。第二个定义位于 `std::chrono` 名空间里，由头文件 &lt;chrono> 提供。为了方便使用，C++ 标准库为常用的 `duration` 情况定义了别名（完整的 chrono 库的预定义时长类型列表请参见 \[1\]），以及自定义字面量（从 C++14 开始），如 `s`（秒）、 `ms`（毫秒）、 `ns`（纳秒） 等。

下面的代码展示了 `steady_clock` 的一些用法：

```cpp
auto t1 = steady_clock::now();
cout &lt;&lt; "Hello world\n";
auto t2 = steady_clock::now();
cout &lt;&lt; (t2 - t1) / 1ns
     &lt;&lt; "ns has elapsed\n";

```

这里，我们连续两次使用 `steady_clock::now` 测量时间点，其差值就大致是 `cout` 上输出字符串所耗费的时长。然后，我们用该时长除以一纳秒的时长，就得到了以纳秒为单位的一个整数值。完整的时间点和时长相关的算术运算列表如下：

- 时长 `±` 时长 ➔ 时长
- 时间点 `±` 时长 ➔ 时间点
- 时长 `+` 时间点 ➔ 时间点
- 时间点 `-` 时间点 ➔ 时长
- 标量 `*` 时长 ➔ 时长
- 时长 `*`（或 `/` 或 `%`）标量 ➔ 时长
- 时长 `/` 时长 ➔ 标量
- 时长 `%` 时长 ➔ 时长

因此，我之前写的 `duration_cast&lt;duration&lt;double>>(now.time_since_epoch()).count()` 的另一种更简洁的表达方式是 `now.time_since_epoch() / 1.0s`。

为了方便使用，标准库除支持上面的运算外，还支持安全的转换，如从秒到微秒的隐式转换。不受支持的运算和可能损失精度的转换则会导致编译失败，这样我们在构建时就能发现代码中的问题。对于可能损失精度的场景，你如果确实需要，可以用 `duration_cast` 来手工进行转型。

下面的代码展示了时间点和时长的一些基本运算和转换（代码比较简单，就不详细讲解了）：

```cpp
now -= 24h;
cout &lt;&lt; "24h ago:            "
     &lt;&lt; now.time_since_epoch() /
          1.0s
     &lt;&lt; '\n';

seconds s{1};
milliseconds ms = s;     // 可以自动转

ms = milliseconds{1500};
// s = ms;               // 不能自动转
s = duration_cast&lt;seconds&gt;(ms);
duration&lt;double&gt; fs = ms;// 可以自动转
// ms = fs;              // 不能自动转

static_assert(1h * 10 == 10h);
static_assert(1h / 1min == 60);

```

## C++20 的时间库改进

到了 C++20，时间库又带来了更多的改进。下面我就简单讨论一下。

注意，在试验本节内容时需要一个较新的编译器，目前测试下来最低版本要求是： Clang 17、GCC 13 或 MSVC 19.32（Visual Studio 17.2）。但目前——2025 年 3 月——Clang 的 libc++ 库仍不支持时区，MSVC 对时区的支持也存在缺陷。只有 GCC 提供了最完整的 C++20 时间库支持。

### 基本易用性改进

chrono 库虽然已经提供了很多有用的功能，但它仍具有一些缺陷。其中最明显的易用性问题是：

- 时间点和时长都不能直接输出
- 没有提供方便的日期支持

这两个问题都在 C++20 里得到了解决。如果使用 C++20 的话，你现在可以直接写 `cout &lt;&lt; (t2 - t1)`，而不需要 `cout &lt;&lt; (t2 - t1) / 1ns`。 `system_clock` 的时间点也可以直接输出（虽然 `steady_clock` 的时间点仍不可以）。下面的代码展示了时间点和时长的输出：

```cpp
auto tp = system_clock::now();
cout &lt;&lt; tp &lt;&lt; '\n';
this_thread::sleep_for(100ms);
cout &lt;&lt; duration_cast&lt;milliseconds&gt;(
          system_clock::now() - tp)
     &lt;&lt; '\n';

```

我“现在”得到的输出是：

> `2025-03-10 07:24:14.855349`
>
> `104ms`

不过，要注意这个时间并不是清晨，因为这是 UTC 时间，UTC 时间与北京时间（也称为中国标准时，CST ）有 8 小时的时差。要真正处理好时间，需要使用 C++20 提供的时区（time zone）支持。这个我稍后讨论。

### 日期支持

C++20 时间库的一个最显著的改进就是增加了对日期的支持。现在你可以方便地用年月日表达日期，也可以写出一些以前不可能的日期表达式，如：

- 某月的最后一天
- 一个月后的同一天
- 五月的第二个星期日

C++20 提供的日期支持相当复杂：

- 单独的 `year`（年）、 `month`（月）、 `day`（日）、 `weekday`（星期几）类型，用来合成时间点
- 单独的 `years`、 `months`、 `days`、 `weeks` 时长类型，以及跟这些类型相关的特殊运算
- 特殊的 `last` 常量，表示一个月的最后一天或星期几
- `Sunday`、 `Monday`、 `Tuesday` 等表示星期几的常量，通常结合 `[]` 运算符表示某月的第几个
- `January`、 `February`、 `March` 等表示月份的常量
- 两种新的自定义字面量后缀：表示年的 `y`，和表示月中某天的 `d`
- 使用 `/` 运算符来拼接日期（结果是更复杂的类型，如 `year_month`、 `year_month_day` 等）

这些东西看起来有点复杂，但使用起来相当方便（感谢 Howard Hinnant）。下面是一些示例：

- `2025y/3/10`：2025 年 3 月 10 日
- `2025y/March/10d`：同样，2025 年 3 月 10 日
- `10d/3/2025`：还是 2025 年 3 月 10 日
- `March/10/2025`：还是 2025 年 3 月 10 日
- `Sunday[2]/5/2025`：2025 年 5 月第 2 个星期天
- `2025y/5/last`：2025 年 5 月的最后一天

注意一下以下两点：

- 日期的头两项里应当明确指定一个年、月、日或星期几相关的类型，否则解析存在歧义，会导致编译失败。
- 前四个表达式的类型都是 `year_month_day`，而最后两个则分别是 `year_month_weekday` 和 `year_month_day_last`。

最后这两个表达式的类型是特殊的类型，这是为了利用类型系统得到直观的运算结果。想象一下：5 月的最后一天加 1 个月，跟 5 月 31 日加 1 个月，是不是一回事？至少，对于前者，我们明确希望得到 6 月 30 日，而不是其他日期。

目前 chrono 库里跟月加减的逻辑是这样的：

- 对于 `year_month_day`、 `year_month_day_last` 之类的类型，加减月的运算是对底层表示里的月的部分进行调整（有进位或借位时可能修改年）。
- 对于普通的时间点类型，那加减月的时候，月将会被简单理解成一年的十二分之一，即 30 天 10 小时 29 分钟 06 秒。

显然，我们需要时间点跟 `year_month_day` 等类型之间的转换，这是在后者的构造函数和转换函数里实现的。这里，我们需要用到 C++20 引入的 `sys_days` 类型：

```cpp
template &lt;class Duration&gt;
using sys_time =
  time_point&lt;system_clock,
             Duration&gt;;
using sys_days = sys_time&lt;days&gt;;

```

也就是说， `sys_days` 是以天为单位的时间点。 `year_month_day`、 `year_month_day_last` 和 `year_month_weekday` 可以转换成 `sys_days`，下面的代码可以看出这些不同类型的效果：

```cpp
cout &lt;&lt; Sunday[2]/5/2025
     &lt;&lt; '\n';
cout &lt;&lt; sys_days{Sunday[2]/5/2025}
     &lt;&lt; '\n';
cout &lt;&lt; 2025y/5/last &lt;&lt; '\n';
cout &lt;&lt; sys_days{2025y/5/last}
     &lt;&lt; '\n';
cout &lt;&lt; sys_days{2025y/5/last +
                 months{1}}
     &lt;&lt; '\n';
cout &lt;&lt; (sys_days{2025y/5/last} +
         months{1})
     &lt;&lt; '\n';

```

输出为：

> `2025/May/Sun[2]`
>
> `2025-05-11`
>
> `2025/May/last`
>
> `2025-05-31`
>
> `2025-06-30`
>
> `2025-06-30 10:29:06`

这里要注意，最后一个运算是 `sys_days` 和 `months` 相加，结果类型虽然仍是 `sys_time`，但不再是 `sys_days` 了。如果想抛弃这个结果的当日时间部分，你可以使用 `floor` 函数模板，如：

```cpp
cout &lt;&lt; floor&lt;days&gt;(
          sys_days{2025y/5/last} +
          months{1})
     &lt;&lt; '\n';

```

反过来，我们也可以用 `sys_days`（注意不是 `year_month_day`）跟其他时长做加法，来拼出一个一天中的具体时间点，如：

```cpp
cout &lt;&lt; sys_days{2025y/3/10} +
          10h + 30min
     &lt;&lt; '\n';

```

结果是：

> `2025-03-10 10:30:00`

### 时区支持

前面已经提到，直接输出 `system_clock::now()`，我们得到的是 UTC 时间。为了跟本地时间（北京时间）之间进行转换，我们需要 **本地时区** 的支持。

下面的代码展示了如何把系统时间转换成带时区的本地时间：

```cpp
auto sys_tp =
  sys_days{2025y/3/9} +
  9h + 59min + 59s;
cout &lt;&lt; sys_tp &lt;&lt; '\n';
auto* local_tz =
  get_tzdb().current_zone();
auto zoned_tp =
  zoned_time{local_tz, sys_tp};
cout &lt;&lt; zoned_tp &lt;&lt; '\n';

```

这里，我用 `get_tzdb()` 获取时区数据库的引用，调用其 `current_zone` 成员函数获得本地时区的指针，然后用 `zoned_time` 创建出一个带时区的时间点对象。程序输出是：

> `2025-03-09 09:59:59`
>
> `2025-03-09 17:59:59 CST`

当然，如非必要，勿增实体。如果只用 `sys_time` 就能满足基本需求，大部分情况你可以不需要用 `zoned_time`，或者只在输出时间时才用。由于需要额外存放一个时区的指针， `zoned_tp` 比 `sys_tp` 要“胖”一些，在我的机器上，它们的大小（ `sizeof`）分别是 16 字节和 8 字节。

在中国，目前只使用一个时区，也没有夏令时跟标准时（冬令时）之间的切换，常常不需要复杂的时区支持。不过，在世界的其他部分，可能就要复杂很多。对于像日历这样的应用，我们也需要能够在程序里 **指定时区**，并同时对多个时区的时间进行操作——这在以前的 C 标准接口里完全做不到。C++20 里我们可以使用时区数据库的 `locate_zone` 成员函数来指定时区，如下所示：

```cpp
auto* pst_tz =
  get_tzdb().locate_zone(
    "US/Pacific");
auto pst_tp =
  zoned_time{pst_tz, sys_tp};
cout &lt;&lt; pst_tp &lt;&lt; '\n';

```

这样得到的结果是：

> `2025-03-09 01:59:59 PST`

此外，注意 `zoned_time` 不支持跟时长的加减运算，但 `sys_time` 可以。下面显示了一秒钟后的美国太平洋时间：

```cpp
pst_tp =
  zoned_time{pst_tz, sys_tp + 1s};
cout &lt;&lt; pst_tp &lt;&lt; '\n';

```

结果是：

> `2025-03-09 03:00:00 PDT`

在这个瞬间太平洋时间从标准时切换成了夏令时，因此 1:59:59 PST 的下一秒成了 3:00:00 PDT。

不携带时区的时间除了 `sys_time` 之外，还有 `local_time`。它代表的是纯粹的本地时间。但使用该类型时需要谨慎，因为它代表的时间可能不存在或者有歧义，如下面的代码所示：

```cpp
try {
  auto local_tp =
    local_days{2025y/3/9} + 2h;
  pst_tp =
    zoned_time{pst_tz, local_tp};
  cout &lt;&lt; pst_tp &lt;&lt; '\n';
}
catch (const exception& e) {
  cout &lt;&lt; "*** Error: "
       &lt;&lt; e.what() &lt;&lt; '\n';
}
try {
  auto local_tp =
    local_days{2025y/11/2} + 1h;
  pst_tp =
    zoned_time{pst_tz, local_tp};
  cout &lt;&lt; pst_tp &lt;&lt; '\n';
}
catch (const exception& e) {
  cout &lt;&lt; "*** Error: "
       &lt;&lt; e.what() &lt;&lt; '\n';
}

```

运行之后得到了下面的结果：

> `*** Error: 2025-03-09 02:00:00 is in a gap between`
>
> `2025-03-09 02:00:00 PST and`
>
> `2025-03-09 03:00:00 PDT which are both equivalent to`
>
> `2025-03-09 10:00:00 UTC`
>
> `*** Error: 2025-11-02 01:00:00 is ambiguous.  It could be`
>
> `2025-11-02 01:00:00 PDT == 2025-11-02 08:00:00 UTC or`
>
> `2025-11-02 01:00:00 PST == 2025-11-02 09:00:00 UTC`

对于美国时间来说，2025-03-09 02:00:00 和 2025-11-02 01:00:00 都不是好的本地时间表示法：前者不存在；后者存在歧义，因为时钟到 2:00:00 时会被拨回 1:00:00，因此有一小时的时间在夏令时和标准时里存在同样的表示——你需要明确使用 `zoned_time&#123;pst_tz, local_tp, choose::earliest&#125;` 来选择前者，使用 `zoned_time&#123;pst_tz, local_tp, choose::latest&#125;` 来选择后者。

很麻烦，是吧？幸好，除非需要开发国际化的日历相关应用，中国人一般不太需要关心夏令时的问题。不过，你知道中国也用过夏令时吗？下面的程序可以“算出”哪些年使用了夏令时（这个例子目前只有使用 GCC 的标准库才能得到正确的结果）：

```cpp
auto* tz_ptr =
  get_tzdb().locate_zone(
    "Asia/Shanghai");
for (auto yr = 1980y; yr != 2000y;
     ++yr) {
  auto local_tp =
    local_days{yr/June/1};
  auto sys_tp =
    sys_days{yr/June/1};
  auto diff =
    sys_tp -
    tz_ptr-&gt;to_sys(local_tp);
  if (diff != 8h) {
    cout &lt;&lt; yr &lt;&lt; '\n';
  }
}

```

该程序检查从 1980 年到 2000 年之间的每年 6 月 1 日，看这天的本地时间和 UTC 时间的时差是不是 8 小时。如果不是 8 小时，那就说明这年夏天使用了夏令时。注意系统时间和本地时间之间没法直接相比或相减，因此需要使用时区的 `to_sys` 成员函数将 `local_tp` 转成系统时间。另一种等价（但更啰嗦）的写法是 `zoned_time&#123;tz_ptr, local_tp&#125;.get_sys_time()`。

### 其他时间相关改进

到目前为止，你可以看到，传统 C 标准接口在处理日期和时间上的缺点，到 C++20 已经基本全部解决了。而 C++20 时间库带来的改进还不止这些，如：

- 更多的时钟类型，支持带闰秒的真正 UTC 时钟（ `utc_clock`）、恒定前进的国际原子钟（ `tai_clock`）等
- 对 12/24 小时制的支持（ `is_pm`、 `make24` 等）
- 对“当天时刻” 的支持（ `hh_mm_ss`）
- 不同时钟之间的转换（ `clock_cast`）
- 对时间字符串流的解析（ `parse` 和 `from_stream`）
- ……

限于篇幅，这里不再一一赘述，你有兴趣的话可以自行查阅 CppReference \[2\]。不过，在下一讲里，作为 `std::format` 相关讨论的一部分，我们会查看一下日期的格式化输出问题。

## 内容小结

本讲我们从缺点多多的 C 风格日期时间开始，讲解了 C++ 标准的新特性如何解决了以前在处理时间和日期上存在的问题：C++11 提供了基础的时钟、时间点、时长支持，C++20 进一步完善了时间库，尤其是添加了对日期和相关运算的支持。到 C++20 为止的 C++ 标准库已经提供了相当完备的时间和日期支持，足以支撑一般应用的开发需求。

## 课后思考

本讲内容以纯知识为主，没有什么很难的地方，但我还是建议你一定要尝试一下文中的代码，对其充分消化理解。可以参考本专栏的 GitHub 代码库：

[https://github.com/adah1972/geek\_time\_cpp/](https://github.com/adah1972/geek_time_cpp/)

有一个小问题请你思考一下：根据已有的记录倒推，周武王伐纣可能发生于公元前 1046 年 1 月 20 日（格里高利历，即不用考虑儒略历和格里高利历的切换问题）。这个日期在 C++ 里该如何表达？

欢迎留言和我分享你的想法和疑问。如果读完这篇文章有所收获，也欢迎分享给你的朋友。

## 参考资料

\[1\] cppreference.com, “std::chrono::duration”. [https://en.cppreference.com/w/cpp/chrono/duration](https://en.cppreference.com/w/cpp/chrono/duration)

\[1a\] cppreference.com, “std::chrono::duration”. [https://zh.cppreference.com/w/cpp/chrono/duration](https://zh.cppreference.com/w/cpp/chrono/duration)

\[2\] cppreference.com, “Date and time library”. [https://en.cppreference.com/w/cpp/chrono](https://en.cppreference.com/w/cpp/chrono)

\[2a\] cppreference.com, “日期和时间库”. [https://zh.cppreference.com/w/cpp/chrono](https://zh.cppreference.com/w/cpp/chrono)