import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"31 | 容器存储实践：CSI插件编写指南","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"深入剖析Kubernetes/31-容器存储实践：CSI插件编写指南.md","filePath":"深入剖析Kubernetes/31-容器存储实践：CSI插件编写指南.md","lastUpdated":1779821023000}'),l={name:"深入剖析Kubernetes/31-容器存储实践：CSI插件编写指南.md"};function t(i,s,o,c,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_31-容器存储实践-csi插件编写指南" tabindex="-1">31 | 容器存储实践：CSI插件编写指南 <a class="header-anchor" href="#_31-容器存储实践-csi插件编写指南" aria-label="Permalink to &quot;31 | 容器存储实践：CSI插件编写指南&quot;">​</a></h1><p>你好，我是张磊。今天我和你分享的主题是：容器存储实践之CSI插件编写指南。</p><p>在上一篇文章中，我已经为你详细讲解了CSI插件机制的设计原理。今天我将继续和你一起实践一个CSI插件的编写过程。</p><p>为了能够覆盖到CSI插件的所有功能，我这一次选择了DigitalOcean的块存储（Block Storage）服务，来作为实践对象。</p><p>DigitalOcean是业界知名的“最简”公有云服务，即：它只提供虚拟机、存储、网络等为数不多的几个基础功能，其他功能一概不管。而这，恰恰就使得DigitalOcean成了我们在公有云上实践Kubernetes的最佳选择。</p><p>我们这次编写的CSI插件的功能，就是：让我们运行在DigitalOcean上的Kubernetes集群能够使用它的块存储服务，作为容器的持久化存储。</p><blockquote><p>备注：在DigitalOcean上部署一个Kubernetes集群的过程，也很简单。你只需要先在DigitalOcean上创建几个虚拟机，然后按照我们在第11篇文章 <a href="https://time.geekbang.org/column/article/39724" target="_blank" rel="noreferrer">《从0到1：搭建一个完整的Kubernetes集群》</a> 中从0到1的步骤直接部署即可。</p></blockquote><p>而有了CSI插件之后，持久化存储的用法就非常简单了，你只需要创建一个如下所示的StorageClass对象即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kind: StorageClass</span></span>
<span class="line"><span>apiVersion: storage.k8s.io/v1</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: do-block-storage</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  annotations:</span></span>
<span class="line"><span>    storageclass.kubernetes.io/is-default-class: &quot;true&quot;</span></span>
<span class="line"><span>provisioner: com.digitalocean.csi.dobs</span></span></code></pre></div><p>有了这个StorageClass，External Provisoner就会为集群中新出现的PVC自动创建出PV，然后调用CSI插件创建出这个PV对应的Volume，这正是CSI体系中Dynamic Provisioning的实现方式。</p><blockquote><p>备注： <code>storageclass.kubernetes.io/is-default-class: &quot;true&quot;</code> 的意思，是使用这个StorageClass作为默认的持久化存储提供者。</p></blockquote><p>不难看到，这个StorageClass里唯一引人注意的，是provisioner=com.digitalocean.csi.dobs这个字段。显然，这个字段告诉了Kubernetes，请使用名叫com.digitalocean.csi.dobs的CSI插件来为我处理这个StorageClass相关的所有操作。</p><p>那么，Kubernetes又是如何知道一个CSI插件的名字的呢？</p><p><strong>这就需要从CSI插件的第一个服务CSI Identity说起了。</strong></p><p>其实，一个CSI插件的代码结构非常简单，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tree $GOPATH/src/github.com/digitalocean/csi-digitalocean/driver</span></span>
<span class="line"><span>$GOPATH/src/github.com/digitalocean/csi-digitalocean/driver</span></span>
<span class="line"><span>├── controller.go</span></span>
<span class="line"><span>├── driver.go</span></span>
<span class="line"><span>├── identity.go</span></span>
<span class="line"><span>├── mounter.go</span></span>
<span class="line"><span>└── node.go</span></span></code></pre></div><p>其中，CSI Identity服务的实现，就定义在了driver目录下的identity.go文件里。</p><p>当然，为了能够让Kubernetes访问到CSI Identity服务，我们需要先在driver.go文件里，定义一个标准的gRPC Server，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Run starts the CSI plugin by communication over the given endpoint</span></span>
<span class="line"><span>func (d *Driver) Run() error {</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> listener, err := net.Listen(u.Scheme, addr)</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> d.srv = grpc.NewServer(grpc.UnaryInterceptor(errHandler))</span></span>
<span class="line"><span> csi.RegisterIdentityServer(d.srv, d)</span></span>
<span class="line"><span> csi.RegisterControllerServer(d.srv, d)</span></span>
<span class="line"><span> csi.RegisterNodeServer(d.srv, d)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> d.ready = true // we&#39;re now ready to go!</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> return d.srv.Serve(listener)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，只要把编写好的gRPC Server注册给CSI，它就可以响应来自External Components的CSI请求了。</p><p><strong>CSI Identity服务中，最重要的接口是GetPluginInfo</strong>，它返回的就是这个插件的名字和版本号，如下所示：</p><blockquote><p>备注：CSI各个服务的接口我在上一篇文章中已经介绍过，你也可以在这里找到 <a href="https://github.com/container-storage-interface/spec/blob/master/csi.proto" target="_blank" rel="noreferrer">它的protoc文件</a>。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (d *Driver) GetPluginInfo(ctx context.Context, req *csi.GetPluginInfoRequest) (*csi.GetPluginInfoResponse, error) {</span></span>
<span class="line"><span> resp := &amp;csi.GetPluginInfoResponse{</span></span>
<span class="line"><span>  Name:          driverName,</span></span>
<span class="line"><span>  VendorVersion: version,</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，driverName的值，正是&quot;com.digitalocean.csi.dobs&quot;。所以说，Kubernetes正是通过GetPluginInfo的返回值，来找到你在StorageClass里声明要使用的CSI插件的。</p><blockquote><p>备注：CSI要求插件的名字遵守 <a href="https://en.wikipedia.org/wiki/Reverse_domain_name_notation" target="_blank" rel="noreferrer">“反向DNS”格式</a>。</p></blockquote><p>另外一个 <strong>GetPluginCapabilities接口也很重要</strong>。这个接口返回的是这个CSI插件的“能力”。</p><p>比如，当你编写的CSI插件不准备实现“Provision阶段”和“Attach阶段”（比如，一个最简单的NFS存储插件就不需要这两个阶段）时，你就可以通过这个接口返回：本插件不提供CSI Controller服务，即：没有csi.PluginCapability_Service_CONTROLLER_SERVICE这个“能力”。这样，Kubernetes就知道这个信息了。</p><p>最后， <strong>CSI Identity服务还提供了一个Probe接口</strong>。Kubernetes会调用它来检查这个CSI插件是否正常工作。</p><p>一般情况下，我建议你在编写插件时给它设置一个Ready标志，当插件的gRPC Server停止的时候，把这个Ready标志设置为false。或者，你可以在这里访问一下插件的端口，类似于健康检查的做法。</p><blockquote><p>备注：关于健康检查的问题，你可以再回顾一下第15篇文章 <a href="https://time.geekbang.org/column/article/40466" target="_blank" rel="noreferrer">《深入解析Pod对象（二）：使用进阶》</a> 中的相关内容。</p></blockquote><p>然后，我们要开始编写CSI 插件的第二个服务，即CSI Controller服务了。它的代码实现，在controller.go文件里。</p><p>在上一篇文章中我已经为你讲解过，这个服务主要实现的就是Volume管理流程中的“Provision阶段”和“Attach阶段”。</p><p><strong>“Provision阶段”对应的接口，是CreateVolume和DeleteVolume</strong>，它们的调用者是External Provisoner。以CreateVolume为例，它的主要逻辑如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (d *Driver) CreateVolume(ctx context.Context, req *csi.CreateVolumeRequest) (*csi.CreateVolumeResponse, error) {</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> volumeReq := &amp;godo.VolumeCreateRequest{</span></span>
<span class="line"><span>  Region:        d.region,</span></span>
<span class="line"><span>  Name:          volumeName,</span></span>
<span class="line"><span>  Description:   createdByDO,</span></span>
<span class="line"><span>  SizeGigaBytes: size / GB,</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> vol, _, err := d.doClient.Storage.CreateVolume(ctx, volumeReq)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> resp := &amp;csi.CreateVolumeResponse{</span></span>
<span class="line"><span>  Volume: &amp;csi.Volume{</span></span>
<span class="line"><span>   Id:            vol.ID,</span></span>
<span class="line"><span>   CapacityBytes: size,</span></span>
<span class="line"><span>   AccessibleTopology: []*csi.Topology{</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>     Segments: map[string]string{</span></span>
<span class="line"><span>      &quot;region&quot;: d.region,</span></span>
<span class="line"><span>     },</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>   },</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> return resp, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，对于DigitalOcean这样的公有云来说，CreateVolume需要做的操作，就是调用DigitalOcean块存储服务的API，创建出一个存储卷（d.doClient.Storage.CreateVolume）。如果你使用的是其他类型的块存储（比如Cinder、Ceph RBD等），对应的操作也是类似地调用创建存储卷的API。</p><p>而“ <strong>Attach阶段”对应的接口是ControllerPublishVolume和ControllerUnpublishVolume</strong>，它们的调用者是External Attacher。以ControllerPublishVolume为例，它的逻辑如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (d *Driver) ControllerPublishVolume(ctx context.Context, req *csi.ControllerPublishVolumeRequest) (*csi.ControllerPublishVolumeResponse, error) {</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  dropletID, err := strconv.Atoi(req.NodeId)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // check if volume exist before trying to attach it</span></span>
<span class="line"><span>  _, resp, err := d.doClient.Storage.GetVolume(ctx, req.VolumeId)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // check if droplet exist before trying to attach the volume to the droplet</span></span>
<span class="line"><span>  _, resp, err = d.doClient.Droplets.Get(ctx, dropletID)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  action, resp, err := d.doClient.StorageActions.Attach(ctx, req.VolumeId, dropletID)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if action != nil {</span></span>
<span class="line"><span>  ll.Info(&quot;waiting until volume is attached&quot;)</span></span>
<span class="line"><span> if err := d.waitAction(ctx, req.VolumeId, action.ID); err != nil {</span></span>
<span class="line"><span>  return nil, err</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ll.Info(&quot;volume is attached&quot;)</span></span>
<span class="line"><span> return &amp;csi.ControllerPublishVolumeResponse{}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，对于DigitalOcean来说，ControllerPublishVolume在“Attach阶段”需要做的工作，是调用DigitalOcean的API，将我们前面创建的存储卷，挂载到指定的虚拟机上（d.doClient.StorageActions.Attach）。</p><p>其中，存储卷由请求中的VolumeId来指定。而虚拟机，也就是将要运行Pod的宿主机，则由请求中的NodeId来指定。这些参数，都是External Attacher在发起请求时需要设置的。</p><p>我在上一篇文章中已经为你介绍过，External Attacher的工作原理，是监听（Watch）了一种名叫VolumeAttachment的API对象。这种API对象的主要字段如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// VolumeAttachmentSpec is the specification of a VolumeAttachment request.</span></span>
<span class="line"><span>type VolumeAttachmentSpec struct {</span></span>
<span class="line"><span> // Attacher indicates the name of the volume driver that MUST handle this</span></span>
<span class="line"><span> // request. This is the name returned by GetPluginName().</span></span>
<span class="line"><span> Attacher string</span></span>
<span class="line"><span></span></span>
<span class="line"><span> // Source represents the volume that should be attached.</span></span>
<span class="line"><span> Source VolumeAttachmentSource</span></span>
<span class="line"><span></span></span>
<span class="line"><span> // The node that the volume should be attached to.</span></span>
<span class="line"><span> NodeName string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而这个对象的生命周期，正是由AttachDetachController负责管理的（这里，你可以再回顾一下第28篇文章 <a href="https://time.geekbang.org/column/article/42698" target="_blank" rel="noreferrer">《PV、PVC、StorageClass，这些到底在说啥？》</a> 中的相关内容）。</p><p>这个控制循环的职责，是不断检查Pod所对应的PV，在它所绑定的宿主机上的挂载情况，从而决定是否需要对这个PV进行Attach（或者Dettach）操作。</p><p>而这个Attach操作，在CSI体系里，就是创建出上面这样一个VolumeAttachment对象。可以看到，Attach操作所需的PV的名字（Source）、宿主机的名字（NodeName）、存储插件的名字（Attacher），都是这个VolumeAttachment对象的一部分。</p><p>而当External Attacher监听到这样的一个对象出现之后，就可以立即使用VolumeAttachment里的这些字段，封装成一个gRPC请求调用CSI Controller的ControllerPublishVolume方法。</p><p>最后，我们就可以编写CSI Node服务了。</p><p>CSI Node服务对应的，是Volume管理流程里的“Mount阶段”。它的代码实现，在node.go文件里。</p><p>我在上一篇文章里曾经提到过，kubelet的VolumeManagerReconciler控制循环会直接调用CSI Node服务来完成Volume的“Mount阶段”。</p><p>不过，在具体的实现中，这个“Mount阶段”的处理其实被细分成了NodeStageVolume和NodePublishVolume这两个接口。</p><p>这里的原因其实也很容易理解：我在第28篇文章 <a href="https://time.geekbang.org/column/article/42698" target="_blank" rel="noreferrer">《PV、PVC、StorageClass，这些到底在说啥？》</a> 中曾经介绍过，对于磁盘以及块设备来说，它们被Attach到宿主机上之后，就成为了宿主机上的一个待用存储设备。而到了“Mount阶段”，我们首先需要格式化这个设备，然后才能把它挂载到Volume对应的宿主机目录上。</p><p>在kubelet的VolumeManagerReconciler控制循环中，这两步操作分别叫作 <strong>MountDevice和SetUp。</strong></p><p>其中，MountDevice操作，就是直接调用了CSI Node服务里的NodeStageVolume接口。顾名思义，这个接口的作用，就是格式化Volume在宿主机上对应的存储设备，然后挂载到一个临时目录（Staging目录）上。</p><p>对于DigitalOcean来说，它对NodeStageVolume接口的实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (d *Driver) NodeStageVolume(ctx context.Context, req *csi.NodeStageVolumeRequest) (*csi.NodeStageVolumeResponse, error) {</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> vol, resp, err := d.doClient.Storage.GetVolume(ctx, req.VolumeId)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> source := getDiskSource(vol.Name)</span></span>
<span class="line"><span> target := req.StagingTargetPath</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if !formatted {</span></span>
<span class="line"><span>  ll.Info(&quot;formatting the volume for staging&quot;)</span></span>
<span class="line"><span>  if err := d.mounter.Format(source, fsType); err != nil {</span></span>
<span class="line"><span>   return nil, status.Error(codes.Internal, err.Error())</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> } else {</span></span>
<span class="line"><span>  ll.Info(&quot;source device is already formatted&quot;)</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if !mounted {</span></span>
<span class="line"><span>  if err := d.mounter.Mount(source, target, fsType, options...); err != nil {</span></span>
<span class="line"><span>   return nil, status.Error(codes.Internal, err.Error())</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> } else {</span></span>
<span class="line"><span>  ll.Info(&quot;source device is already mounted to the target path&quot;)</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> return &amp;csi.NodeStageVolumeResponse{}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，在NodeStageVolume的实现里，我们首先通过DigitalOcean的API获取到了这个Volume对应的设备路径（getDiskSource）；然后，我们把这个设备格式化成指定的格式（ d.mounter.Format）；最后，我们把格式化后的设备挂载到了一个临时的Staging目录（StagingTargetPath）下。</p><p>而SetUp操作则会调用CSI Node服务的NodePublishVolume接口。有了上述对设备的预处理工作后，它的实现就非常简单了，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (d *Driver) NodePublishVolume(ctx context.Context, req *csi.NodePublishVolumeRequest) (*csi.NodePublishVolumeResponse, error) {</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> source := req.StagingTargetPath</span></span>
<span class="line"><span> target := req.TargetPath</span></span>
<span class="line"><span></span></span>
<span class="line"><span> mnt := req.VolumeCapability.GetMount()</span></span>
<span class="line"><span> options := mnt.MountFlag</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if !mounted {</span></span>
<span class="line"><span>  ll.Info(&quot;mounting the volume&quot;)</span></span>
<span class="line"><span>  if err := d.mounter.Mount(source, target, fsType, options...); err != nil {</span></span>
<span class="line"><span>   return nil, status.Error(codes.Internal, err.Error())</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> } else {</span></span>
<span class="line"><span>  ll.Info(&quot;volume is already mounted&quot;)</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> return &amp;csi.NodePublishVolumeResponse{}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，在这一步实现中，我们只需要做一步操作，即：将Staging目录，绑定挂载到Volume对应的宿主机目录上。</p><p>由于Staging目录，正是Volume对应的设备被格式化后挂载在宿主机上的位置，所以当它和Volume的宿主机目录绑定挂载之后，这个Volume宿主机目录的“持久化”处理也就完成了。</p><p>当然，我在前面也曾经提到过，对于文件系统类型的存储服务来说，比如NFS和GlusterFS等，它们并没有一个对应的磁盘“设备”存在于宿主机上，所以kubelet在VolumeManagerReconciler控制循环中，会跳过MountDevice操作而直接执行SetUp操作。所以对于它们来说，也就不需要实现NodeStageVolume接口了。</p><p>在编写完了CSI插件之后，我们就可以把这个插件和External Components一起部署起来。</p><p>首先，我们需要创建一个DigitalOcean client授权需要使用的Secret对象，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Secret</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: digitalocean</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>stringData:</span></span>
<span class="line"><span>  access-token: &quot;a05dd2f26b9b9ac2asdas__REPLACE_ME____123cb5d1ec17513e06da&quot;</span></span></code></pre></div><p>接下来，我们通过一句指令就可以将CSI插件部署起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ kubectl apply -f https://raw.githubusercontent.com/digitalocean/csi-digitalocean/master/deploy/kubernetes/releases/csi-digitalocean-v0.2.0.yaml</span></span></code></pre></div><p>这个CSI插件的YAML文件的主要内容如下所示（其中，非重要的内容已经被略去）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kind: DaemonSet</span></span>
<span class="line"><span>apiVersion: apps/v1beta2</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: csi-do-node</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  selector:</span></span>
<span class="line"><span>    matchLabels:</span></span>
<span class="line"><span>      app: csi-do-node</span></span>
<span class="line"><span>  template:</span></span>
<span class="line"><span>    metadata:</span></span>
<span class="line"><span>      labels:</span></span>
<span class="line"><span>        app: csi-do-node</span></span>
<span class="line"><span>        role: csi-do</span></span>
<span class="line"><span>    spec:</span></span>
<span class="line"><span>      serviceAccount: csi-do-node-sa</span></span>
<span class="line"><span>      hostNetwork: true</span></span>
<span class="line"><span>      containers:</span></span>
<span class="line"><span>        - name: driver-registrar</span></span>
<span class="line"><span>          image: quay.io/k8scsi/driver-registrar:v0.3.0</span></span>
<span class="line"><span>          ...</span></span>
<span class="line"><span>        - name: csi-do-plugin</span></span>
<span class="line"><span>          image: digitalocean/do-csi-plugin:v0.2.0</span></span>
<span class="line"><span>          args :</span></span>
<span class="line"><span>            - &quot;--endpoint=$(CSI_ENDPOINT)&quot;</span></span>
<span class="line"><span>            - &quot;--token=$(DIGITALOCEAN_ACCESS_TOKEN)&quot;</span></span>
<span class="line"><span>            - &quot;--url=$(DIGITALOCEAN_API_URL)&quot;</span></span>
<span class="line"><span>          env:</span></span>
<span class="line"><span>            - name: CSI_ENDPOINT</span></span>
<span class="line"><span>              value: unix:///csi/csi.sock</span></span>
<span class="line"><span>            - name: DIGITALOCEAN_API_URL</span></span>
<span class="line"><span>              value: https://api.digitalocean.com/</span></span>
<span class="line"><span>            - name: DIGITALOCEAN_ACCESS_TOKEN</span></span>
<span class="line"><span>              valueFrom:</span></span>
<span class="line"><span>                secretKeyRef:</span></span>
<span class="line"><span>                  name: digitalocean</span></span>
<span class="line"><span>                  key: access-token</span></span>
<span class="line"><span>          imagePullPolicy: &quot;Always&quot;</span></span>
<span class="line"><span>          securityContext:</span></span>
<span class="line"><span>            privileged: true</span></span>
<span class="line"><span>            capabilities:</span></span>
<span class="line"><span>              add: [&quot;SYS_ADMIN&quot;]</span></span>
<span class="line"><span>            allowPrivilegeEscalation: true</span></span>
<span class="line"><span>          volumeMounts:</span></span>
<span class="line"><span>            - name: plugin-dir</span></span>
<span class="line"><span>              mountPath: /csi</span></span>
<span class="line"><span>            - name: pods-mount-dir</span></span>
<span class="line"><span>              mountPath: /var/lib/kubelet</span></span>
<span class="line"><span>              mountPropagation: &quot;Bidirectional&quot;</span></span>
<span class="line"><span>            - name: device-dir</span></span>
<span class="line"><span>              mountPath: /dev</span></span>
<span class="line"><span>      volumes:</span></span>
<span class="line"><span>        - name: plugin-dir</span></span>
<span class="line"><span>          hostPath:</span></span>
<span class="line"><span>            path: /var/lib/kubelet/plugins/com.digitalocean.csi.dobs</span></span>
<span class="line"><span>            type: DirectoryOrCreate</span></span>
<span class="line"><span>        - name: pods-mount-dir</span></span>
<span class="line"><span>          hostPath:</span></span>
<span class="line"><span>            path: /var/lib/kubelet</span></span>
<span class="line"><span>            type: Directory</span></span>
<span class="line"><span>        - name: device-dir</span></span>
<span class="line"><span>          hostPath:</span></span>
<span class="line"><span>            path: /dev</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>kind: StatefulSet</span></span>
<span class="line"><span>apiVersion: apps/v1beta1</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: csi-do-controller</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  serviceName: &quot;csi-do&quot;</span></span>
<span class="line"><span>  replicas: 1</span></span>
<span class="line"><span>  template:</span></span>
<span class="line"><span>    metadata:</span></span>
<span class="line"><span>      labels:</span></span>
<span class="line"><span>        app: csi-do-controller</span></span>
<span class="line"><span>        role: csi-do</span></span>
<span class="line"><span>    spec:</span></span>
<span class="line"><span>      serviceAccount: csi-do-controller-sa</span></span>
<span class="line"><span>      containers:</span></span>
<span class="line"><span>        - name: csi-provisioner</span></span>
<span class="line"><span>          image: quay.io/k8scsi/csi-provisioner:v0.3.0</span></span>
<span class="line"><span>          ...</span></span>
<span class="line"><span>        - name: csi-attacher</span></span>
<span class="line"><span>          image: quay.io/k8scsi/csi-attacher:v0.3.0</span></span>
<span class="line"><span>          ...</span></span>
<span class="line"><span>        - name: csi-do-plugin</span></span>
<span class="line"><span>          image: digitalocean/do-csi-plugin:v0.2.0</span></span>
<span class="line"><span>          args :</span></span>
<span class="line"><span>            - &quot;--endpoint=$(CSI_ENDPOINT)&quot;</span></span>
<span class="line"><span>            - &quot;--token=$(DIGITALOCEAN_ACCESS_TOKEN)&quot;</span></span>
<span class="line"><span>            - &quot;--url=$(DIGITALOCEAN_API_URL)&quot;</span></span>
<span class="line"><span>          env:</span></span>
<span class="line"><span>            - name: CSI_ENDPOINT</span></span>
<span class="line"><span>              value: unix:///var/lib/csi/sockets/pluginproxy/csi.sock</span></span>
<span class="line"><span>            - name: DIGITALOCEAN_API_URL</span></span>
<span class="line"><span>              value: https://api.digitalocean.com/</span></span>
<span class="line"><span>            - name: DIGITALOCEAN_ACCESS_TOKEN</span></span>
<span class="line"><span>              valueFrom:</span></span>
<span class="line"><span>                secretKeyRef:</span></span>
<span class="line"><span>                  name: digitalocean</span></span>
<span class="line"><span>                  key: access-token</span></span>
<span class="line"><span>          imagePullPolicy: &quot;Always&quot;</span></span>
<span class="line"><span>          volumeMounts:</span></span>
<span class="line"><span>            - name: socket-dir</span></span>
<span class="line"><span>              mountPath: /var/lib/csi/sockets/pluginproxy/</span></span>
<span class="line"><span>      volumes:</span></span>
<span class="line"><span>        - name: socket-dir</span></span>
<span class="line"><span>          emptyDir: {}</span></span></code></pre></div><p>可以看到，我们编写的CSI插件只有一个二进制文件，它的镜像是digitalocean/do-csi-plugin:v0.2.0。</p><p>而我们 <strong>部署CSI插件的常用原则是：</strong></p><p><strong>第一，通过DaemonSet在每个节点上都启动一个CSI插件，来为kubelet提供CSI Node服务</strong>。这是因为，CSI Node服务需要被kubelet直接调用，所以它要和kubelet“一对一”地部署起来。</p><p>此外，在上述DaemonSet的定义里面，除了CSI插件，我们还以sidecar的方式运行着driver-registrar这个外部组件。它的作用，是向kubelet注册这个CSI插件。这个注册过程使用的插件信息，则通过访问同一个Pod里的CSI插件容器的Identity服务获取到。</p><p>需要注意的是，由于CSI插件运行在一个容器里，那么CSI Node服务在“Mount阶段”执行的挂载操作，实际上是发生在这个容器的Mount Namespace里的。可是，我们真正希望执行挂载操作的对象，都是宿主机/var/lib/kubelet目录下的文件和目录。</p><p>所以，在定义DaemonSet Pod的时候，我们需要把宿主机的/var/lib/kubelet以Volume的方式挂载进CSI插件容器的同名目录下，然后设置这个Volume的mountPropagation=Bidirectional，即开启双向挂载传播，从而将容器在这个目录下进行的挂载操作“传播”给宿主机，反之亦然。</p><p><strong>第二，通过StatefulSet在任意一个节点上再启动一个CSI插件，为External Components提供CSI Controller服务</strong>。所以，作为CSI Controller服务的调用者，External Provisioner和External Attacher这两个外部组件，就需要以sidecar的方式和这次部署的CSI插件定义在同一个Pod里。</p><p>你可能会好奇，为什么我们会用StatefulSet而不是Deployment来运行这个CSI插件呢。</p><p>这是因为，由于StatefulSet需要确保应用拓扑状态的稳定性，所以它对Pod的更新，是严格保证顺序的，即：只有在前一个Pod停止并删除之后，它才会创建并启动下一个Pod。</p><p>而像我们上面这样将StatefulSet的replicas设置为1的话，StatefulSet就会确保Pod被删除重建的时候，永远有且只有一个CSI插件的Pod运行在集群中。这对CSI插件的正确性来说，至关重要。</p><p>而在今天这篇文章一开始，我们就已经定义了这个CSI插件对应的StorageClass（即：do-block-storage），所以你接下来只需要定义一个声明使用这个StorageClass的PVC即可，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: PersistentVolumeClaim</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: csi-pvc</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  accessModes:</span></span>
<span class="line"><span>  - ReadWriteOnce</span></span>
<span class="line"><span>  resources:</span></span>
<span class="line"><span>    requests:</span></span>
<span class="line"><span>      storage: 5Gi</span></span>
<span class="line"><span>  storageClassName: do-block-storage</span></span></code></pre></div><p>当你把上述PVC提交给Kubernetes之后，你就可以在Pod里声明使用这个csi-pvc来作为持久化存储了。这一部分使用PV和PVC的内容，我就不再赘述了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在今天这篇文章中，我以一个DigitalOcean的CSI插件为例，和你分享了编写CSI插件的具体流程。</p><p>基于这些讲述，你现在应该已经对Kubernetes持久化存储体系有了一个更加全面和深入的认识。</p><p>举个例子，对于一个部署了CSI存储插件的Kubernetes集群来说：</p><p>当用户创建了一个PVC之后，你前面部署的StatefulSet里的External Provisioner容器，就会监听到这个PVC的诞生，然后调用同一个Pod里的CSI插件的CSI Controller服务的CreateVolume方法，为你创建出对应的PV。</p><p>这时候，运行在Kubernetes Master节点上的Volume Controller，就会通过PersistentVolumeController控制循环，发现这对新创建出来的PV和PVC，并且看到它们声明的是同一个StorageClass。所以，它会把这一对PV和PVC绑定起来，使PVC进入Bound状态。</p><p>然后，用户创建了一个声明使用上述PVC的Pod，并且这个Pod被调度器调度到了宿主机A上。这时候，Volume Controller的AttachDetachController控制循环就会发现，上述PVC对应的Volume，需要被Attach到宿主机A上。所以，AttachDetachController会创建一个VolumeAttachment对象，这个对象携带了宿主机A和待处理的Volume的名字。</p><p>这样，StatefulSet里的External Attacher容器，就会监听到这个VolumeAttachment对象的诞生。于是，它就会使用这个对象里的宿主机和Volume名字，调用同一个Pod里的CSI插件的CSI Controller服务的ControllerPublishVolume方法，完成“Attach阶段”。</p><p>上述过程完成后，运行在宿主机A上的kubelet，就会通过VolumeManagerReconciler控制循环，发现当前宿主机上有一个Volume对应的存储设备（比如磁盘）已经被Attach到了某个设备目录下。于是kubelet就会调用同一台宿主机上的CSI插件的CSI Node服务的NodeStageVolume和NodePublishVolume方法，完成这个Volume的“Mount阶段”。</p><p>至此，一个完整的持久化Volume的创建和挂载流程就结束了。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你根据编写FlexVolume和CSI插件的流程，分析一下什么时候该使用FlexVolume，什么时候应该使用CSI？</p><p>感谢你的收听，欢迎你给我留言，也欢迎分享给更多的朋友一起阅读。</p>`,93)])])}const m=n(l,[["render",t]]);export{g as __pageData,m as default};
