# 07 | 划定边界，掌控全局：Scope和子线程的终止

你好，我是鸟窝。

在前面几节课程中我们学习了如何在 Rust 中创建线程、获取线程的一些基本属性，已经对线程有了比较深度的了解，这节课我给你介绍几个有趣的线程相关的库。

```
在第四课中，我介绍了 Scope 这个概念。Scope 是一个管理线程生命周期的结构体。我们可
以确保线程的生命周期不会超过 Scope 的生命周期，从而提供了更安全的线程管理机制。这
节课我们介绍几个第三方库实现的 Scope。第二部分我会给你介绍“可控制的”子线程，看看如
```

何控制子线程的终止。

首先我们来了解一下第三方库提供的 scoped thread 的功能。

![](images/07/1.png)

## Rayon scoped thread

Rayon 是 Rust 中一个强大的数据并行库，它提供了一种简单而高效的方式来并行化迭代器和执行函数，我们之后有专门的一节课讲解它，其中，scoped threads（作用域线程）是 Rayon中一个重要的概念，它允许你在一个特定的代码块内创建和管理线程，并在该代码块结束后自动回收这些线程。这提供了一种安全且方便的方式来执行 fork-join 类型的并行任务。

scoped threads 的核心思想是在一个作用域（通常是一个函数或代码块）内创建线程，并保证

```
在该作用域结束之前所有创建的线程都必须完成执行。这意味着你不需要手动 join 每一个线
```

程，Rayon 会自动处理线程的生命周期，避免悬垂线程和内存泄漏等问题。

```javascript
Rayon 提供了 scope 函数来创建 scoped threads。scope 函数接受一个闭包作为参数，在
这个闭包内部，你可以使用 spawn 函数来创建新的线程：
use rayon;
fn main() {
   let mut a = vec![1, 2, 3];
   let mut x = 0;
   rayon::scope(|s| {
       s.spawn(|_| {
           println!("hello from the first rayon scoped thread");
           dbg!(&a);
       });
       s.spawn(|_| {
           println!("hello from the second rayon scoped thread");
           x += a[0] + a[2];
       });
       println!("hello from the main thread");
   });
   // After the scope, we can modify and access our variables again:
   a.push(4);
   assert_eq!(x, a.len());
}
在这个例子中，rayon::scope 创建了一个新的作用域。在这个作用域内部，我们使用
s.spawn 创建了两个线程，分别访问 vec ，并且修改变量 x 都没有问题。当 scope 结束
时，Rayon 会确保这两个线程都执行完毕，然后程序才会继续执行后面的 println! 语句。
```

通过使用 scoped threads，我们可以获得以下好处：

```
避免悬垂线程： 由于 Rayon 会自动管理线程的生命周期，因此可以避免手动 join 线程可
能导致的错误，例如忘记 join 导致的悬垂线程。
简化代码： 使用 scope 可以使并行代码更加简洁易懂，减少了手动管理线程的复杂性。
数据安全性： 在 scope 内部，你可以安全地访问和修改共享数据，因为 Rayon 保证在
scope 结束之前所有线程都会完成执行，避免了数据竞争的发生。
```

scoped threads 特别适用于以下场景：

- fork-join 并行： 将一个任务分解成多个子任务并行执行，然后将子任务的结果合并。

- 需要在特定范围内控制线程生命周期的场景： 例如，需要在某个函数内部创建一些线程来执行一些辅助任务，并在函数结束时自动回收这些线程。

```
std::thread::spawn 创建的线程是独立的，其生命周期不受创建它的线程控制。你需要
手动 join 这些线程，否则可能会导致悬垂线程。而 scoped threads 则不同，它们的生命周
期被限制在 scope 内部，Rayon 会自动管理它们的生命周期。
```

- 悬垂线程（Dangling Thread） 是指一个线程在执行过程中，虽然它已经完成了任务或退出了执行，但其资源没有被正确地释放或清理，导致该线程仍然占用系统资源（如内存或句柄），而这些资源没有被回收或重新分配。在并发编程中，悬垂线程通常指的是以下几种情况：1. 线程结束后资源没有释放当一个线程完成执行后，操作系统或程序没有及时释放与该线程相关的资源（例如内存、线程句柄等），使得这些资源继续占用系统资源，直到程序结束。这些未清理的资源可能导致内存泄漏或资源耗尽。2. 线程无法正常退出线程本应在任务完成后退出，但由于某种原因（例如死锁、异常等），线程无法正常退出，并且不会主动释放资源。这种情况下，线程虽然名义上完成了任务，但实际上它处于一种“挂起”或“悬挂”的状态。3. 线程的父线程未等待其结束在多线程编程中，父线程可能没有正确地等待子线程的结束，导致子线程处于“悬垂”状态。比如父线程调用了子线程的 join() 方法，但是由于某种错误或逻辑问题，join() 没有成功执

- 行，导致子线程的清理工作没有完成。

```
在第二课我们使用 thread::scope 实现了一个归并排序，这里我们也可以使用 rayon 来实
```

现。

```javascript
use rayon::prelude::*;
fn parallel_sort<T: Ord + Send>(slice: &mut [T]) {
   if slice.len() <= 1 {
       return;
   }
   let mid = slice.len() / 2;
   let (left, right) = slice.split_at_mut(mid); // 分割成两个互不重叠的可变切片
   rayon::scope(|s| {
       s.spawn(|_| parallel_sort(left));       // 对左半部分进行并行排序
       s.spawn(|_| parallel_sort(right));      // 对右半部分进行并行排序
   }); // 作用域结束，等待所有子线程完成
   slice.sort(); // 合并排序后的子切片（这里使用稳定的排序算法）
}
fn main() {
   let mut data = vec![5, 2, 8, 1, 9, 4, 7, 3, 6];
   parallel_sort(&mut data);
   println!("{:?}", data); // 输出：[1, 2, 3, 4, 5, 6, 7, 8, 9]
}
这个例子展示了如何使用 scoped threads 实现一个简单的并行排序算法。通过 scope 和
spawn，我们可以递归地并行排序数组的不同部分，最后再合并结果。
split_at_mut(mid)：这一行是关键。它将 slice 分割成两个可变切片，left 包含
slice[..mid] 的元素，right 包含 slice[mid..] 的元素。这两个切片在内存上是互
```

- 不重叠的。

```
rayon::scope：创建一个新的作用域，用于并行执行子任务。
s.spawn：在新的线程中执行 parallel_sort 函数，分别对 left 和 right 进行递归
排序。由于 left 和 right 是独立的借用，因此不会发生借用冲突。
slice.sort()：在 rayon::scope 结束后，所有子线程都已完成，此时 left 和
right 分别是排序好的子切片。这一步使用 slice.sort() 对整个 slice 进行排序，将
两个已排序的子切片合并成一个完全排序的切片。这里使用 slice.sort() 是因为子切片
```

- 已经在各自的线程中排好序，所以只需要对整个切片进行一次合并排序即可。如果子切片内

```
部没有排序，则需要使用更复杂的合并算法。使用 slice.sort_unstable() 也可以，
```

- 它通常更快，但不保证相等元素的相对顺序。

## Crossbeam scoped thread

Crossbeam 是一个 Rust 库，旨在简化并发编程。它提供了一系列工具，包括：

- Scoped Threads（作用域线程）：允许安全地在线程中借用栈上的数据。

- Channels（通道）：用于线程间通信的高效通道。

- Atomic Data Structures（原子数据结构）：用于线程之间安全共享数据的并发数据结构。

- Synchronization Primitives（同步原语）：例如互斥锁、条件变量等。

和 Rayon 一样，我们也会专门拿出一讲来介绍这个知名的并发库，本节课我们只介绍 scopedthread。

- 重复强调一下：Scoped threads 允许你在一个特定的作用域内创建线程，并且这些线程可以安全地借用该作用域内栈上的数据。当作用域结束时，所有在其中创建的线程都会被强制 join（等待其执行完成），从而保证了数据的安全性。

```javascript
使用 Crossbeam 的 scope 函数可以创建 scoped threads。
use crossbeam::thread;
fn main() {
   let message = String::from("Hello from main thread!");
   thread::scope(|s| {
       // 在作用域内创建线程
       s.spawn(|_| {
           // 安全地借用 message
           println!("{}", message);
       });
       s.spawn(|_| {
           // 也可以创建多个线程
            println!("{}", message.to_uppercase());
       });
   });
   println!("Main thread continues after scope.");
}
thread::scope(|s| { ... }); 创建了一个新的作用域。s 是一个 Scope 类型的变
量，用于在该作用域内创建线程。s.spawn(|_| { ... }); 在作用域内创建一个新的线
程。闭包 |_| { ... } 是新线程要执行的代码。
在闭包中，我们可以安全地借用 message 变量，因为 scoped threads 保证了在作用域结束
之前，所有线程都会执行完成。当 thread::scope 快结束时，主线程会等待所有在其中创
```

建的线程执行完毕。

同样的，scoped thread 的就像硬币的两面，优缺点都是有的：

Scoped Threads 的优点

- 安全性：避免了数据竞争和悬垂引用等问题，保证了内存安全。

```
方便性：简化了在线程中传递数据的操作，无需手动使用 Arc、Mutex 等同步原语。
性能：由于避免了不必要的堆分配和同步开销，scoped thread 通常比使用 Arc 和 Mutex
```

- 的方法更高效。

Scoped Threads 的局限性

- 只能借用栈上的数据，不能传递所有权。

- 所有线程必须在作用域结束前完成。

## terminate-thread

```
Rust 的 std::thread 库基于操作系统的线程 API 构建，但它提供了一种更高级、更安全的
抽象。然而，这种抽象也带来了一些限制。其中一个重要的限制是，std::thread 没有提供
```

直接强制终止线程的方法。

```
在 std::thread 中，管理线程生命周期的主要方式是：
```

- 线程自然结束：当线程执行完其代码逻辑后，它会自动退出。

```
使用共享状态和原子类型（如 AtomicBool）进行协作式终止：线程定期检查某个共享变
```

- 量的状态，并根据其值决定是否继续执行。

- 通道（Channels）：通过关闭通道来通知线程退出。

这些方法在大多数情况下都足够好，但它们有一个共同的缺点：它们都需要线程主动配合。如果一个线程因为某些原因被阻塞（例如，等待 I/O、死锁等），它就无法检查共享状态或接收通道消息，因此也无法通过这些方式终止。

```
terminate-thread crate 使用了 POSIX 线程 API 中的 pthread_cancel 函数来实现线
程的强制终止。pthread_cancel 允许一个线程向另一个线程发送取消请求，目标线程可以
```

选择忽略或处理该请求。默认情况下，取消请求会导致目标线程立即终止。

![](images/07/2.png)

下面是一个手工终止子线程的例子：

```javascript
use terminate_thread::Thread;
fn main() {
   let thr = Thread::spawn(|| loop {
       // infinite loop in this thread
       println!("loop run");
       std::thread::sleep(std::time::Duration::from_secs(10));
       println!("loop end"); // 这行代码不会被执行
   });
   std::thread::sleep(std::time::Duration::from_secs(1));
   thr.terminate() // 手工终止线程
}
虽然 terminate-thread 提供了一种强制终止线程的方法，但它应该谨慎使用。强制终止
```

线程可能会导致以下问题：

- 资源泄漏： 如果被终止的线程持有锁、文件句柄或其他资源，这些资源可能无法正确释放。

- 数据损坏： 如果被终止的线程正在修改共享数据，可能导致数据处于不一致的状态。

- 未定义行为： 在某些情况下，强制终止线程可能导致程序崩溃或其他未定义行为。

正如这个库的说明中提到的：

- 终止一个正在运行的线程永远是一个坏主意！更好的方法是使用像 std::sync::atomic::AtomicBool 这样的方式，给你的线程一个正常退出的机会。

```
因此，只有在其他方法都不可行的情况下，才应该考虑使用 terminate-thread。在使用
```

时，务必仔细考虑潜在的风险，并采取必要的措施来减轻这些风险。例如，可以将被终止的线程设计成在关键操作前后设置取消点，以便在安全的时间点响应取消请求。

## ctx-thread

```
大多数情况下，超出父线程生命周期的线程被认为是一个代码异味（code smell）。ctx-
thread 确保在离开作用域之前，所有线程都会被连接（join）。子线程可以访问 Context
```

对象，利用它来轮询线程组的状态。如果其中一个线程发生 panic，整个上下文会被取消。

```
ctx-thread 提供带上下文的线程，这听起来和 scoped thread 类似，实际上，ctx-
thread 也是在 crossbeam 的 scoped thread 实现的。比如下面的写法和 crossbeam
```

scoped thread 一致：

```javascript
use ctx_thread::scope;
let people = vec![
   "Alice".to_string(),
   "Bob".to_string(),
   "Carol".to_string(),
];
scope(|ctx| {
   for person in &people {
       ctx.spawn(move |_| {
           println!("Hello, {}", person);
       });
   }
}).unwrap();
但是 ctx-thread 的功能不止于此，否则也没必要在 crossbeam 基础上做重复的事情了。除
了 ctx-thread 可以引用外部作用域，线程还可以检查额外的方法，并在必要时返回。
use std::thread;
use std::time::Duration;
use ctx_thread::scope;
fn main() {
   scope(|ctx| {
       ctx.spawn(|ctx| {
           while ctx.active() {
               thread::sleep(Duration::from_secs(1));
               println!("thread run and ctx is active");
           }
           println!("thread end");
       });
       ctx.spawn(|ctx| {
           thread::sleep(Duration::from_secs(5));
           ctx.cancel();
       });
   }).unwrap();
   println!("main thread end");
}
```

在上一节课我们已经说了，终止一个线程有三种方式：线程自然终止、使用共享状态和原子类

```
型、使用通道。这个库就是第二种，使用共享状态，这个共享状态可以使用active()方法检
查，使用 cancel() 方法更改状态。
```

- 第三种终止线程的方式在我们介绍通道的时候再介绍。

```
它的上下文使用 Context 来表示，Context 这个结构体包含几个方法：
active() -> bool：等价于 !done，检查当前上下文是否还未完成。
cancel()：信号取消当前上下文，导致 done 返回 true，active 返回 false。已取消的上
```

- 下文无法重新启用。

```
done() -> bool：检查当前上下文是否已完成。它的返回值应该是和 active 是相反
```

- 的。

```
spawn：创建一个作用域线程，并提供一个派生的上下文。
builder：创建一个构建器，在生成线程之前可以配置线程，例如：
use ctx_thread::scope;
scope(|ctx| {
   ctx.builder()
       .name(String::from("child"))
       .stack_size(1024)
       .spawn(|_| println!("运行一个子线程"))
       .unwrap();
}).unwrap();
```

## thread-control

```
thread-control 是另外一个可以控制子线程的辅助库。
```

![](images/07/3.png)

```
这个库简单干脆，通过 make_pair 函数生成两个对象 Control 和 Flag:
```

- Control：用于控制线程执行的结构体。

- Flag：用于检查已启动线程执行状态的结构体。

一个用来控制，一个用来检查，非常符合常人的思维。

下面是一个使用它的例子：

```javascript
use std::thread;
use thread_control::*;
fn main() {
   let (flag, control) = make_pair();
   let handle = thread::spawn(move || {
       while flag.alive() {
       }
   });
   assert_eq!(control.is_done(), false);
   control.stop();
   let _ = handle.join();
   assert_eq!(control.is_interrupted(), false);
   assert_eq!(control.is_done(), true);
}
多多少少和 ctx_thread 有些类似，只不过这里我们调用的是 control.stop。
如果和 ctx-thread 做对比，感觉这个库的 API 的设计初衷是好的，但是有一点点问题。理
论上 Control 用来控制，提供 stop、interrupt 方法是比较合适的，但是 flag 也提供了
interrupt 方法，挺别扭的，flag 不要做控制层面的动作，而且还提供了 alive、
is_alive 方法，让人迷惑。不止于此，Control 又提供了 is_done、is_interrupted
方法，感觉 Control 和 Flag 混杂在一起，不清晰。
```

## 总结

好了，这一节课，我们介绍了 Rust 中管理和控制线程生命周期的几种关键方法和相关库：

- 作用域线程（Scoped Threads）： 一种在特定代码块内创建和管理线程的技术，确保线程在作用域结束前完成，避免悬垂线程和内存泄漏。Rayon 和 Crossbeam 库都提供了作用域线程的实现，简化了并发代码的编写。

- Rayon：一个数据并行库，其作用域线程适用于 fork-join 类型的并行任务，并自动管理线程生命周期。

- Crossbeam：一个并发库，其作用域线程允许安全地在线程中借用栈上数据，提高并发代码的安全性、方便性和性能。

- 线程终止：

```
terminate-thread：std::thread 主要通过线程自然结束、共享状态 / 原子类型
（如 AtomicBool）以及通道进行协作式终止。terminate-thread 库提供了强制终
止线程的方法（pthread_cancel），但应谨慎使用，因为它可能导致资源泄漏和数据
```

- 损坏。

```
ctx-thread：基于 Crossbeam 的作用域线程，提供了更丰富的上下文管理功能，允许
线程检查上下文状态（active()、done()）并进行取消操作（cancel()），通过
builder() 配置线程属性。
thread-control：和 ctx-thread 类似，也可以通过状态控制子线程的终止。
```

## 思考题

请你实现一个计算斐波那契数列的程序。其中子线程进行计算，主线程等待 10 秒，如果子线程还在计算中，则强制结束子线程。

期待你的分享。如果今天的内容对你有所帮助，也期待你转发给你的同事或者朋友，大家一起学习，共同进步。我们下节课再见！
