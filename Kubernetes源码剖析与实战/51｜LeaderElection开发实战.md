# 51 | LeaderElection开发实战

你好，我是孔令飞。

在第 45、46、47 讲中，我分别介绍了 Leader Election 的原理、源码及使用的场景。因为在上述 3 讲中，已经详细介绍了 Leader Election，所以本节课直接切入主题，介绍下如何使用Leader Election 来实现有状态服务的多副本选主功能。

## 如何实现 Leader Election？

Kuberentes 将很多优秀的功能，通过包的形式加以共享。其中，Leader Election 就是通过

```
k8s.io/client-go/tools/leaderelection 包来进行复用的。
我们可以借助 k8s.io/client-go/tools/leaderelection 提供的方法来实现有状态服
```

务的多副本容灾能力。

## 使用 Leader Election 实现多副本容灾

使用 Leader Election 实现多副本容灾包括以下 2 步：

1. 自定义 Leader Election 锁实现。

2. 使用自定义锁实现有状态服务的多副本容灾。

### Leader Election 支持自定义锁类型

Leader Election 包的 LeaderElectionConfig 结构体定义如下：

```sql
type LeaderElectionConfig struct {
   // Lock is the resource that will be used for locking
   Lock rl.Interface
   // LeaseDuration is the duration that non-leader candidates will
   // wait to force acquire leadership. This is measured against time of
   // last observed ack.
   //
   // A client needs to wait a full LeaseDuration without observing a change to
   // the record before it can attempt to take over. When all clients are
   // shutdown and a new set of clients are started with different names against
   // the same leader record, they must wait the full LeaseDuration before
   // attempting to acquire the lease. Thus LeaseDuration should be as short as
   // possible (within your tolerance for clock skew rate) to avoid a possible
   // long waits in the scenario.
   //
   // Core clients default this value to 15 seconds.
   LeaseDuration time.Duration
   // RenewDeadline is the duration that the acting master will retry
   // refreshing leadership before giving up.
   //
   // Core clients default this value to 10 seconds.
   RenewDeadline time.Duration
   // RetryPeriod is the duration the LeaderElector clients should wait
   // between tries of actions.
   //
   // Core clients default this value to 2 seconds.
   RetryPeriod time.Duration
   // Callbacks are callbacks that are triggered during certain lifecycle
   // events of the LeaderElector
   Callbacks LeaderCallbacks
   // WatchDog is the associated health checker
   // WatchDog may be null if it's not needed/configured.
   WatchDog *HealthzAdaptor
   // ReleaseOnCancel should be set true if the lock should be released
   // when the run context is cancelled. If you set this to true, you must
   // ensure all code guarded by this lease has successfully completed
   // prior to cancelling the context, or you may have two processes
   // simultaneously acting on the critical path.
   ReleaseOnCancel bool
   // Name is the name of the resource lock for debugging
   Name string
}
rl.Interface 定义了一个锁实现，其定义如下：
// by the leaderelection code.
type Interface interface {
   // Get returns the LeaderElectionRecord
   Get(ctx context.Context) (*LeaderElectionRecord, []byte, error)
   // Create attempts to create a LeaderElectionRecord
   Create(ctx context.Context, ler LeaderElectionRecord) error
   // Update will update and existing LeaderElectionRecord
   Update(ctx context.Context, ler LeaderElectionRecord) error
   // RecordEvent is used to record events
   RecordEvent(string)
   // Identity will return the locks Identity
   Identity() string
   // Describe is used to convert details on current resource lock
   // into a string
   Describe() string
}
```

```
所以，使用 Leader Election 包的第一步，便是实现一个符合 rl.Interface 定义的锁。
```

这里，我们使用 Redis 来实现这个锁。

### 自定义一个 RedisLock

RedisLock 的实现位于 redislock.go 文件中，代码如下：

```go
package redislock
import (
   "context"
   "encoding/json"
   "errors"
   "fmt"
   "log"
   "strconv"
   "time"
   "github.com/redis/go-redis/v9"
   apierrors "k8s.io/apimachinery/pkg/api/errors"
   "k8s.io/apimachinery/pkg/runtime/schema"
   "k8s.io/client-go/tools/leaderelection/resourcelock"
)
// RedisLock 是一个满足 resourcelock.Interface 的自定义实现，
// 使用 Redis 键存储 LeaderElectionRecord，并用 TTL 表达租约。
type RedisLock struct {
   client   *redis.Client
   key      string
   identity string
   // 注意：LeaseDuration 由选举器控制，这里只负责更新 TTL，保持与 record 一致。
}
func NewRedisLock(client *redis.Client, key, identity string) *RedisLock {
   return &RedisLock{
       client:   client,
       key:      key,
       identity: identity,
   }
}
// leaderElectionState 是 Redis 中存储的值（JSON）。
type leaderElectionState struct {
   Record resourcelock.LeaderElectionRecord `json:"record"`
   // 可选：增加一个伪 resourceVersion/epoch，用于更强的 CAS。
   Epoch string `json:"epoch"`
}
func (l *RedisLock) Identity() string { return l.identity }
func (l *RedisLock) Describe() string { return fmt.Sprintf("redis/%s", l.key) }
// RecordEvent 供事件系统使用；这里简单打印日志。
func (l *RedisLock) RecordEvent(s string) { log.Printf("[event] %s", s) }
// Get 返回当前的 LeaderElectionRecord（如果不存在，返回空记录与错误置 nil 以符合常规期望）。
func (l *RedisLock) Get(ctx context.Context) (*resourcelock.LeaderElectionRecord,
   b, err := l.client.Get(ctx, l.key).Bytes()
   if err != nil {
       if errors.Is(err, redis.Nil) {
           // 不存在视为无锁
           // GroupResource 中 Resource 使用复数资源名，核心组 group 为空字符串
           gr := schema.GroupResource{Group: "", Resource: "redislocks"}
           return &resourcelock.LeaderElectionRecord{}, nil, apierrors.NewNotFou
       }
       return nil, nil, err
   }
   var st leaderElectionState
   if err := json.Unmarshal(b, &st); err != nil {
       return nil, nil, err
   }
   return &st.Record, b, nil
}
// Create 创建租约，要求键不存在（NX 语义）。
func (l *RedisLock) Create(ctx context.Context, ler resourcelock.LeaderElectionRe
   st := leaderElectionState{Record: ler, Epoch: strconv.FormatInt(time.Now().Un
   data, _ := json.Marshal(st)
   ttl := time.Duration(ler.LeaseDurationSeconds) * time.Second
   ok, err := l.client.SetNX(ctx, l.key, data, ttl).Result()
   if err != nil {
       return err
   }
   if !ok {
       // 与 K8s 语义对齐：已存在时返回冲突错误
       return fmt.Errorf("lock already exists")
   }
   return nil
}
// Update 用于 Leader 续约/保持租约，仅允许当前持有者更新；同时刷新 TTL。
func (l *RedisLock) Update(ctx context.Context, ler resourcelock.LeaderElectionRe
   // 使用 Lua 脚本以原子方式校验持有者并更新
   script := redis.NewScript(`
local key = KEYS[1]
local val = redis.call("GET", key)
if not val then
 return {err="not found"}
end
local current = cjson.decode(val)
if current.record.holderIdentity ~= ARGV[1] and current.record.holderIdentity ~=
 return {err="not holder"}
end
current.record = cjson.decode(ARGV[2])
current.epoch = ARGV[3]
local updated = cjson.encode(current)
redis.call("SET", key, updated, "PX", ARGV[4])
return "OK"
`)
   // st := leaderElectionState{Record: ler, Epoch: time.Now().UnixNano()}
   data, _ := json.Marshal(ler)
   ttl := (time.Duration(ler.LeaseDurationSeconds) * time.Second).Milliseconds()
   _, err := script.Run(ctx, l.client, []string{l.key},
       l.identity, string(data), strconv.FormatInt(time.Now().UnixNano(), 10), f
   ).Result()
   if err != nil {
       return err
   }
   return nil
}
```

上述代码实现了一个基于 Redis 的 Leader Election 锁。锁定义为：

```
type RedisLock struct {
   client   *redis.Client
   key      string
   identity string
   // 注意：LeaseDuration 由选举器控制，这里只负责更新 TTL，保持与 record 一致。
}
```

其中 client 字段保存了 Redis 的客户端，用来在 Redis 中创建、更新和获取锁信息。key 字段是 Redis 中保存锁信息的 key。identity 字段保存了持锁的实例名。

leaderElectionState 定义如下：

```
// leaderElectionState 是 Redis 中存储的值（JSON）。
type leaderElectionState struct {
   Record resourcelock.LeaderElectionRecord `json:"record"`
   // 可选：增加一个伪 resourceVersion/epoch，用于更强的 CAS。
   Epoch string `json:"epoch"`
}
```

leaderElectionState 结构体中保存了锁的信息，Record 是标准的锁信息定义，Epoch 是一个可选字段，对锁功能没有影响，只是用来表示锁更新的时间信息。

```
RedisLock 结构体实现了 rl.Interface 接口中定义的方法。Identity、Describe 方法分别
```

返回锁的实例 ID 和详细的锁描述，这些信息会在 leaderelection 框架中使用，用来标识枪锁的信息，方便观察锁的状态。

RecordEvent 方法用来记录一次抢锁事件。

核心方法是：

- Get 根据 key 获取锁的信息；

- Create 在 Redis 中创建一个锁记录；

- Update 更新 Redis 中的锁信息。

### Get 方法实现

```go
// Get 返回当前的 LeaderElectionRecord（如果不存在，返回空记录与错误置 nil 以符合常规期望）。
func (l *RedisLock) Get(ctx context.Context) (*resourcelock.LeaderElectionRecord,
   b, err := l.client.Get(ctx, l.key).Bytes()
   if err != nil {
       if errors.Is(err, redis.Nil) {
           // 不存在视为无锁
           // GroupResource 中 Resource 使用复数资源名，核心组 group 为空字符串
           gr := schema.GroupResource{Group: "", Resource: "redislocks"}
           return &resourcelock.LeaderElectionRecord{}, nil, apierrors.NewNotFou
       }
       return nil, nil, err
   }
   var st leaderElectionState
   if err := json.Unmarshal(b, &st); err != nil {
       return nil, nil, err
   }
   return &st.Record, b, nil
}
```

在 Get 方法中，会尝试根据 key 获取锁信息，如果没有获取到，说明锁不存在，抢锁成功。这里要注意，返回的错误一定要是 apierrors.NewNotFound 错误类型，否则 leaderelection 包会报 not found 错误，就会导致后面创建锁时失败。

### Create 方法实现

如果锁不存在，则会调用 Create 方法创建一个锁，并记录持有锁的实例信息。Create 方法实现如下：

```go
// Create 创建租约，要求键不存在（NX 语义）。
func (l *RedisLock) Create(ctx context.Context, ler resourcelock.LeaderElectionRe
   st := leaderElectionState{Record: ler, Epoch: strconv.FormatInt(time.Now().Un
   data, _ := json.Marshal(st)
   ttl := time.Duration(ler.LeaseDurationSeconds) * time.Second
   ok, err := l.client.SetNX(ctx, l.key, data, ttl).Result()
   if err != nil {
       return err
   }
   if !ok {
       // 与 K8s 语义对齐：已存在时返回冲突错误
       return fmt.Errorf("lock already exists")
   }
   return nil
}
```

在 Create 方法中，ttl 为锁的超时时间，值为 leaderelection.LeaderElectionConfig 结构体中的 LeaseDuration 字段的值。ttl 可以防止持有锁的实例挂掉后，一直空占着锁。

### Update 方法实现

Update 用来更新锁的信息，在续锁时会被调用。其代码实现如下：

```go
// Update 用于 Leader 续约/保持租约，仅允许当前持有者更新；同时刷新 TTL。
func (l *RedisLock) Update(ctx context.Context, ler resourcelock.LeaderElectionRe
   // 使用 Lua 脚本以原子方式校验持有者并更新
   script := redis.NewScript(`
local key = KEYS[1]
local val = redis.call("GET", key)
if not val then
 return {err="not found"}
end
local current = cjson.decode(val)
if current.record.holderIdentity ~= ARGV[1] and current.record.holderIdentity ~=
 return {err="not holder"}
end
current.record = cjson.decode(ARGV[2])
current.epoch = ARGV[3]
local updated = cjson.encode(current)
redis.call("SET", key, updated, "PX", ARGV[4])
return "OK"
`)
   // st := leaderElectionState{Record: ler, Epoch: time.Now().UnixNano()}
   data, _ := json.Marshal(ler)
   ttl := (time.Duration(ler.LeaseDurationSeconds) * time.Second).Milliseconds()
   _, err := script.Run(ctx, l.client, []string{l.key},
       l.identity, string(data), strconv.FormatInt(time.Now().UnixNano(), 10), f
   ).Result()
   if err != nil {
       return err
   }
   return nil
}
```

在 Update 方法中，通过在 Redis 中运行 lua 脚本来更新指定键为 key 的锁信息。

### 使用 RedisLock

接下来，我们通过创建一个 main 函数，来实现 Leader Election 的多副本容灾功能。main函数代码如下：

```go
package main
import (
   "context"
   "crypto/tls"
   "flag"
   "fmt"
   "log"
   "os"
   "strings"
   "time"
   "github.com/redis/go-redis/v9"
   leaderelection "k8s.io/client-go/tools/leaderelection"
   "github.com/onexstack/kubernetes-examples/leader-election/redislock"
)
func main() {
   var (
       id            string
       redisAddr     string
       redisUser     string
       redisPass     string
       redisDB       int
       useTLS        bool
       lockKey       string
       leaseSeconds  int
       renewDeadline int
       retryPeriod   int
   )
   flag.StringVar(&id, "id", hostnameOrRand(), "instance identity")
   flag.StringVar(&redisAddr, "redis", "localhost:6379", "redis address or URL (
   flag.StringVar(&redisUser, "redis-user", "", "redis username (Redis 6+ ACL)")
   flag.StringVar(&redisPass, "redis-pass", "", "redis password")
   flag.IntVar(&redisDB, "redis-db", 0, "redis db index")
   flag.BoolVar(&useTLS, "redis-tls", false, "enable TLS (ignored if rediss:// U
   flag.StringVar(&lockKey, "lock-key", "leader-election:demo", "redis key for l
   flag.IntVar(&leaseSeconds, "lease", 15, "lease duration seconds")
   flag.IntVar(&renewDeadline, "renew", 10, "renew deadline seconds")
   flag.IntVar(&retryPeriod, "retry", 2, "retry period seconds")
   flag.Parse()
   // 构建 Redis 连接配置：优先支持 URL，其次走手动参数
   var rdb *redis.Client
   if strings.HasPrefix(redisAddr, "redis://") {
       opt, err := redis.ParseURL(redisAddr)
       if err != nil {
           log.Fatalf("invalid redis URL: %v", err)
       }
       // URL 优先，命令行可覆盖用户名/密码/DB
       if redisUser != "" {
           opt.Username = redisUser
       }
       if redisPass != "" {
           opt.Password = redisPass
       }
       if redisDB != 0 {
           opt.DB = redisDB
       }
       // rediss:// 自动启用 TLS；如果用 redis:// 但强制 TLS，可以在下方再覆盖
       if useTLS && opt.TLSConfig == nil {
           opt.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
       }
       rdb = redis.NewClient(opt)
   } else {
       opt := &redis.Options{Addr: redisAddr, Username: redisUser, Password: red
       if useTLS {
           opt.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
       }
       rdb = redis.NewClient(opt)
   }
   // 健康检查（带超时）
   ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
   defer cancel()
   if err := rdb.Ping(ctx).Err(); err != nil {
       log.Fatalf("redis ping err: %v", err)
   }
   log.Printf("connected to redis: %s", safeRedisAddr(redisAddr))
   // 自定义 Redis 锁
   lock := redislock.NewRedisLock(rdb, lockKey, id)
   // 构造选举配置
   cfg := leaderelection.LeaderElectionConfig{
       Lock:            lock,
       ReleaseOnCancel: true,
       LeaseDuration:   time.Duration(leaseSeconds) * time.Second,
       RenewDeadline:   time.Duration(renewDeadline) * time.Second,
       RetryPeriod:     time.Duration(retryPeriod) * time.Second,
       Callbacks: leaderelection.LeaderCallbacks{
           OnStartedLeading: func(ctx context.Context) {
               log.Printf("[LEADER] %s started leading", id)
               t := time.NewTicker(2 * time.Second)
               defer t.Stop()
               for {
                   select {
                   case <-ctx.Done():
                       log.Printf("[LEADER] %s context canceled", id)
                       return
                   case tm := <-t.C:
                       log.Printf("[LEADER] %s tick at %s", id, tm.Format(time.R
                   }
               }
           },
           OnStoppedLeading: func() {
               log.Printf("[FOLLOWER] %s stopped leading", id)
           },
           OnNewLeader: func(identity string) {
               if identity == id {
                   log.Printf("[INFO] %s is the new leader", id)
               } else {
                   log.Printf("[INFO] current leader elected: %s", identity)
               }
           },
       },
   }
   // 运行选举（阻塞直到上下文取消）
   runCtx, runCancel := context.WithCancel(context.Background())
   defer runCancel()
   elector, err := leaderelection.NewLeaderElector(cfg)
   if err != nil {
       log.Fatalf("create elector err: %v", err)
   }
   go func() {
       time.Sleep(60 * time.Minute)
       log.Printf("stopping after 2 minutes")
       runCancel()
   }()
   elector.Run(runCtx)
   log.Printf("exit")
}
func hostnameOrRand() string {
   h, err := os.Hostname()
   if err == nil && h != "" {
       return h
   }
   return fmt.Sprintf("inst-%d", time.Now().UnixNano())
}
// 打印地址时避免泄露密码
func safeRedisAddr(addr string) string {
   if strings.HasPrefix(addr, "redis://") || strings.HasPrefix(addr, "rediss://"
       // 粗略脱敏
       return "[redis URL masked]"
   }
   return addr
}
```

在上述代码中，首先定义了一系列命令行参数。核心的命令行参数如下：

```
-id：实例 ID
-redis：Redis 认证信息
redis-user：指定 Redis 用户名，可覆盖 -redis 参数中指定的用户名
redis-pass：指定 Redis 密码，可覆盖 -redis 参数中指定的密码
redis-db：指定 Redis DB，可覆盖 -redis 参数中指定的 DB
redis-tls：指定链接 Redis 时是否使用 TLS
lock-key：指定保存锁信息的 Redis 键名
lease：指定锁的超时时间
renew：指定抢锁成功后，多久续锁一次
retry：指定重试 / 心跳周期
```

main 函数中有创建 Redis 客户端的代码，代码简单，这里不再解释。

在创建完 Redis 客户端之后，就可以创建一个 RedisLock 实现，创建代码如下：

```go
lock := redislock.NewRedisLock(rdb, lockKey, id)
```

创建时指定了保存锁信息的 Redis 键和当前实例的 ID。

之后，便可以使用从命令行中传来的参数创建 LeaderElectionConfig 类型的配置。

```go
   // 构造选举配置
   cfg := leaderelection.LeaderElectionConfig{
       Lock:            lock,
       ReleaseOnCancel: true,
       LeaseDuration:   time.Duration(leaseSeconds) * time.Second,
       RenewDeadline:   time.Duration(renewDeadline) * time.Second,
       RetryPeriod:     time.Duration(retryPeriod) * time.Second,
       Callbacks: leaderelection.LeaderCallbacks{
           OnStartedLeading: func(ctx context.Context) {
               log.Printf("[LEADER] %s started leading", id)
               t := time.NewTicker(2 * time.Second)
               defer t.Stop()
               for {
                   select {
                   case <-ctx.Done():
                       log.Printf("[LEADER] %s context canceled", id)
                       return
                   case tm := <-t.C:
                       log.Printf("[LEADER] %s tick at %s", id, tm.Format(time.R
                   }
               }
           },
           OnStoppedLeading: func() {
               log.Printf("[FOLLOWER] %s stopped leading", id)
           },
           OnNewLeader: func(identity string) {
               if identity == id {
                   log.Printf("[INFO] %s is the new leader", id)
               } else {
                   log.Printf("[INFO] current leader elected: %s", identity)
               }
           },
       },
   }
```

在 leaderelection.LeaderElectionConfig 中，指定了以下参数：

- Lock：锁实现为 lock。

- ReleaseOnCancel：控制“当选举循环所用的上下文被取消时（ctx.Done）”，当前领导者是否要主动释放领导锁。

- LeaseDuration：非领导者需要等待的最长时间窗口。具体来说，其他候选者会以“上次看到领导者成功续约的时间”为基准，只有在整整等待了 LeaseDuration 后，才允许尝试抢占领导权。换句话说就是指定锁的超时时间。该参数用来防止脑裂行为，允许领导者一定时间的卡顿冗余。

- RenewDeadline：当前领导者在遇到问题（网络抖动、存储变慢）时，允许自己尝试“继续续约”的最长时间窗口。在这段时间内，会每隔 RetryPeriod 去续约，多次失败仍未成功则主动放弃领导身份。核心作用是降低脑裂风险，领导者在无法确认自己还能成功续约时，会尽快让出位置。

- RetryPeriod：指定尝试动作之间的等待间隔。具体包括：

- 领导者在续约失败后的再次续约尝试间隔；

- 非领导者在竞争 / 观察过程中的轮询间隔。

- Callbacks：

- OnStartedLeading：指定抢锁成功后，执行的代码逻辑；

- OnStoppedLeading：指定丢失锁后，执行的代码逻辑；

- OnNewLeader：指定成为领导者时，执行的代码逻辑。

LeaseDuration、RenewDeadline、RetryPeriod 在设置值时有以下要求：

- LeaseDuration 需要与 RenewDeadline 拉开一定安全边（默认 15s vs 10s，留出 5s 的缓冲）。

- RenewDeadline 必须小于 LeaseDuration（避免出现“领导者还在续约窗口里，其他人已开始接管”的冲突）。一般设置为 LeaseDuration 的 2/3 左右是常见经验（如 10s vs 15s）。

- RetryPeriod 必须小于 RenewDeadline（让领导者在截止窗口内能进行多次续约尝试）。

三者之间的协同与时序示意如下：

- 假设当前领导者最后一次成功续约时间为 t。

- 领导者出现网络故障：

- 它会在接下来的 RenewDeadline（如 10s）中，每隔 RetryPeriod（如 2s）尝试续约；

- 若到 t + RenewDeadline 仍无法续约成功，则它主动“放弃领导者”角色。

- 其他候选者：

- 只有在观察到“距离 t 已经过去了整整 LeaseDuration（如 15s）且仍未看到新的续约”时，才会尝试接管。

- 结果：

- 安全缓冲约为 LeaseDuration− RenewDeadline（默认约 5s），用于避免脑裂；

- 最坏情况下的切换时延接近 LeaseDuration。

在 main 函数中，通过以下代码，来启动领导者选举：

```go
   runCtx, runCancel := context.WithCancel(context.Background())
   defer runCancel()
   elector, err := leaderelection.NewLeaderElector(cfg)
   if err != nil {
       log.Fatalf("create elector err: %v", err)
   }
   go func() {
       time.Sleep(60 * time.Minute)
       log.Printf("stopping after 2 minutes")
       runCancel()
   }()
   elector.Run(runCtx)
   log.Printf("exit")
```

上述代码比较简单，不再解释。

## 测试 Leader Election

打开 Linux 终端 A 执行以下命令：

```
$ go run redislock.go -id instance1 -redis 'redis://default:onex(%23)666@127.0.0.
2025/09/10 01:19:24 connected to redis: [redis URL masked]
I0910 01:19:24.623964 3949516 leaderelection.go:250] attempting to acquire leader
2025/09/10 01:19:24 [event] became leader
I0910 01:19:24.624391 3949516 leaderelection.go:260] successfully acquired lease
2025/09/10 01:19:24 [INFO] instance1 is the new leader
2025/09/10 01:19:24 [LEADER] instance1 started leading
通过日志，可以看到 instance1 副本抢锁成功。这里要注意，-redis 要换成你的 Redis 连
```

接。

查看 Redis 中的锁信息：

```
$ dbr
127.0.0.1:6379> keys *
1) "leader-election:demo"
127.0.0.1:6379> get leader-election:demo
"{\"record\":{\"renewTime\":\"2025-09-09T17:19:28Z\",\"leaseDurationSeconds\":15,
```

打开一个新的 Linux 终端 B，执行以下命令：

```
$ go run redislock.go -id instance2 -redis 'redis://default:onex(%23)666@127.0.0.
2025/09/10 01:19:52 connected to redis: [redis URL masked]
I0910 01:19:52.335802 3950550 leaderelection.go:250] attempting to acquire leader
2025/09/10 01:19:52 [INFO] current leader elected: instance1
```

通过日志，可以看到 instance2 副本抢锁失败。

切换到终端 A 中，键入 CTRL + C，终止掉进程。15s 后切换到终端 B，查看日志：

```
I0910 01:21:08.885734 3950550 leaderelection.go:260] successfully acquired lease
2025/09/10 01:21:08 [INFO] instance2 is the new leader
2025/09/10 01:21:08 [LEADER] instance2 started leading
```

可以看到，instance2 副本抢锁成功。

再次查看 Redis 中的锁信息：

```
127.0.0.1:6379> get leader-election:demo
"{\"record\":{\"renewTime\":\"2025-09-09T17:22:16Z\",\"leaseDurationSeconds\":15,
```

可以看到锁信息中的持锁副本变成 instance2。

## 课程总结

本节课介绍了如何使用 Kubernetes 的 client-go 中的 leaderelection 包实现有状态服务的多副本选主（Leader Election）功能。

首先回顾了 LeaderElectionConfig 的核心参数及关系：LeaseDuration（租期、决定最坏切换时间）、RenewDeadline（领导者自我续约的截止窗口）、RetryPeriod（重试 / 心跳间隔），并强调它们需满足 LeaseDuration > RenewDeadline > RetryPeriod，典型默认值为15s/10s/2s，同时解释了 ReleaseOnCancel 在上下文取消时主动释锁以加快切换的作用及使用注意事项。

```
随后，我们通过实现 rl.Interface 自定义锁，给出了一个基于 Redis 的 RedisLock：将
```

LeaderElectionRecord 与一个字符串形式的 epoch（纳秒时间戳）一起以 JSON 存储在Redis 中，用键的 TTL 表达租约。

Get 在 key 不存在时返回 apierrors.NewNotFound 以契合 leaderelection 的语义；Create 使用 SET NX + TTL 原子创建；Update 用 Lua 脚本原子校验持有者并更新记录与 TTL，epoch以字符串存储以规避 lua-cjson 的大整数精度问题。整体保证了“只有现任持有者能续约”的并发安全和“租期到期即可被他人接管”的容灾语义。

最后给出了完整 main 程序：通过命令行参数配置 Redis 连接、锁 key 与三大时间参数，创建RedisLock 并运行选举，Callbacks 中演示了 Leader/Follower 的生命周期日志。

## 课后练习

1. 请尝试实现一个基于 MySQL 的锁。

2. 分别以默认值（15/10/2）与更激进值（9/6/1）运行两个实例，观察正常切换与网络抖动时的切换时延与稳定性差异，记录最快切换时间是否接近 LeaseDuration。

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
