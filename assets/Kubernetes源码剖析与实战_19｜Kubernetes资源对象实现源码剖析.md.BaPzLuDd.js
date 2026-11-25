import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"19 | Kubernetes资源对象实现源码剖析","description":"","frontmatter":{},"headers":[{"level":2,"title":"Kubernetes 对象概览","slug":"kubernetes-对象概览","link":"#kubernetes-对象概览","children":[]},{"level":2,"title":"Kubernetes 对象体系中的核心结构","slug":"kubernetes-对象体系中的核心结构","link":"#kubernetes-对象体系中的核心结构","children":[]},{"level":2,"title":"runtime.Object","slug":"runtime-object","link":"#runtime-object","children":[{"level":3,"title":"runtime.Object 接口实现（metav1.TypeMeta）","slug":"runtime-object-接口实现-metav1-typemeta","link":"#runtime-object-接口实现-metav1-typemeta","children":[]},{"level":3,"title":"DeepCopyObject 是如何生成的？","slug":"deepcopyobject-是如何生成的","link":"#deepcopyobject-是如何生成的","children":[]}]},{"level":2,"title":"metav1.ObjectMeta","slug":"metav1-objectmeta","link":"#metav1-objectmeta","children":[{"level":3,"title":"metav1.ObjectMeta 字段详细介绍","slug":"metav1-objectmeta-字段详细介绍","link":"#metav1-objectmeta-字段详细介绍","children":[]},{"level":3,"title":"metav1.ObjectType 的接口实现","slug":"metav1-objecttype-的接口实现","link":"#metav1-objecttype-的接口实现","children":[]}]},{"level":2,"title":"课程总结","slug":"课程总结","link":"#课程总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Kubernetes源码剖析与实战/19｜Kubernetes资源对象实现源码剖析.md","filePath":"Kubernetes源码剖析与实战/19｜Kubernetes资源对象实现源码剖析.md","lastUpdated":1795530017000}'),i={name:"Kubernetes源码剖析与实战/19｜Kubernetes资源对象实现源码剖析.md"};function t(l,s,c,o,r,h){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_19-kubernetes资源对象实现源码剖析" tabindex="-1">19 | Kubernetes资源对象实现源码剖析 <a class="header-anchor" href="#_19-kubernetes资源对象实现源码剖析" aria-label="Permalink to &quot;19 | Kubernetes资源对象实现源码剖析&quot;">​</a></h1><p>你好，我是孔令飞。</p><p>Kubernetes 的对象有很多，在相关文章、书籍或者课程中，你可能经常接触到 Kubernetes 资源对象、Kubernetes 对象、Kubernetes 对象属性、Kubernetes 资源元数据这些概念，它们因为定义相近经常会被混淆。</p><p>这节课我们就来系统梳理下 Kubernetes 对象，并重点剖析 Kubernetes 资源对象的实现源码。</p><h2 id="kubernetes-对象概览" tabindex="-1">Kubernetes 对象概览 <a class="header-anchor" href="#kubernetes-对象概览" aria-label="Permalink to &quot;Kubernetes 对象概览&quot;">​</a></h2><p>首先，我们介绍下资源对象、对象、对象属性和资源元数据的概念。</p><p>Kubernetes 中“一条记录”就是一个资源对象（Resource Object），代表集群期望或当前的某个实体状态，它会持久化到 etcd，API Server 为它暴露 REST 端点。典型的资源对象如Pod、Deployment、Service、ConfigMap、CustomResource 等。Deployment 资源对象定义示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Deployment struct {</span></span>
<span class="line"><span>   metav1.TypeMeta   \`json:&quot;,inline&quot;\` // apiVersion / kind</span></span>
<span class="line"><span>   metav1.ObjectMeta \`json:&quot;metadata,omitempty&quot;\` // 名称、标签等</span></span>
<span class="line"><span>   Spec   appsv1.DeploymentSpec   \`json:&quot;spec,omitempty&quot;\`   // 期望</span></span>
<span class="line"><span>   Status appsv1.DeploymentStatus \`json:&quot;status,omitempty&quot;\` // 当前</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Kubernetes 对象（Object）与 Kubernetes 资源对象基本等价，多指单个 API 资源实例。在代码层，二者都映射为某个 Go 结构体。但“对象”更侧重抽象概念，“资源对象”强调它通过 API暴露且可持久化。</p><p>对象属性（Object Field / Attribute）即对象结构体里的字段。最顶层常见字段如</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>metadata、spec.replicas、status.phase 等。字段既可读也可写，部分字段只由控</span></span></code></pre></div><p>制器写（如 Status）。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spec.replicas           # 属性：副本数</span></span>
<span class="line"><span>spec.template.spec.containers[0].image  # 属性：容器镜像</span></span>
<span class="line"><span>status.observedGeneration              # 属性：已观测版本</span></span>
<span class="line"><span>资源元数据（Resource Metadata）指所有描述“这个对象是谁”的信息，主要由 TypeMeta</span></span>
<span class="line"><span>与 ObjectMeta 组成。</span></span>
<span class="line"><span>TypeMeta（类型元数据）告诉 API Server 这是哪个组 / 版本里的哪种资源，示例如下：</span></span>
<span class="line"><span>apiVersion: apps/v1</span></span>
<span class="line"><span>kind: Deployment</span></span>
<span class="line"><span>ObjectMeta（对象元数据）介绍资源对象有哪些元数据的数据结构，典型字段如下：</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: web-deploy</span></span>
<span class="line"><span> namespace: prod</span></span>
<span class="line"><span> labels:</span></span>
<span class="line"><span>   app: web</span></span>
<span class="line"><span> annotations:</span></span>
<span class="line"><span>   description: &quot;demo&quot;</span></span>
<span class="line"><span> uid: 3c6…      # 系统生成</span></span>
<span class="line"><span> resourceVersion: &quot;74291&quot;</span></span>
<span class="line"><span> generation: 4</span></span>
<span class="line"><span> creationTimestamp: &quot;2024-04-22T10:00:00Z&quot;</span></span>
<span class="line"><span> finalizers: [...]</span></span>
<span class="line"><span> ownerReferences: [...]</span></span></code></pre></div><p>为帮助你理解，我单独列出了一些需要解释的内容：</p><ul><li><p>name/namespace：唯一定位。</p></li><li><p>labels/annotations：查询与附加信息。</p></li><li><p>uid/resourceVersion/generation：用于一致性与并发控制。</p></li><li><p>finalizers/ownerReferences：级联删除、控制器关联等。</p></li></ul><p>最后，我将不同概念的作用 / 范围和示例梳理到了一张表格里，方便你对比。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/1.png" alt=""></a></p><h2 id="kubernetes-对象体系中的核心结构" tabindex="-1">Kubernetes 对象体系中的核心结构 <a class="header-anchor" href="#kubernetes-对象体系中的核心结构" aria-label="Permalink to &quot;Kubernetes 对象体系中的核心结构&quot;">​</a></h2><p>Kubernetes 对象都实现了 runtime.Object 接口，我们可以用 runtime.Object 指代所有的Kubernetes 对象。runtime.Object 是个接口类型，可以有多个实现。在 Kubernetes 中，你可以根据需要实现多种不同的 Kubernetes 对象。当前 Kubernetes 中有 2 种对象：单个对象（如 Pod）和列表对象（如 PodList）。每种对象又有对应的对象类型和属性。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/2.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>上图包含了 Kubernetes 对象构建体系中的多个核心结构，如 schema.ObjectKind、</span></span>
<span class="line"><span>metav1.TypeMeta、metav1.ObjectMeta、metav1.Object 等。</span></span></code></pre></div><p>下表总结了 Kubernetes 对象体系中的核心结构及其源码位置和功能，帮助你快速建立整体认知：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>提示：文件位置父路径统一为 k8s.io/apimachinery/pkg。</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/3.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在深入讲解前，我们先明确相关核心包的导入路径，以便后续结合源码分析。metav1、</span></span>
<span class="line"><span>runtime、schema 包的导入路径如下：</span></span>
<span class="line"><span>metav1 &quot;k8s.io/apimachinery/pkg/apis/meta/v1&quot;</span></span>
<span class="line"><span>&quot;k8s.io/apimachinery/pkg/runtime&quot;</span></span>
<span class="line"><span>&quot;k8s.io/apimachinery/pkg/runtime/schema&quot;</span></span></code></pre></div><p>接下来，我自顶向下来给你介绍这些核心结构的功能和实现。</p><h2 id="runtime-object" tabindex="-1">runtime.Object <a class="header-anchor" href="#runtime-object" aria-label="Permalink to &quot;runtime.Object&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>runtime.Object 接口是一个非常重要的接口，用于表示 Kubernetes API 对象的通用类</span></span></code></pre></div><p>型。这个接口定义了一些方法，使得所有 Kubernetes API 对象都能够遵循统一的规范，有助于简化开发人员对 Kubernetes 对象的处理和管理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>runtime.Object 位于 runtime 包中，说明 runtime.Object 是一个非常基础的接口。</span></span>
<span class="line"><span>事实上，所有的 Kubernetes 对象都属于 runtime.Object。</span></span>
<span class="line"><span>下面是 runtime.Object 接口的定义：</span></span>
<span class="line"><span>// Object interface must be supported by all API types registered with Scheme. Si</span></span>
<span class="line"><span>// expected to be serialized to the wire, the interface an Object must provide to</span></span>
<span class="line"><span>// serializers to set the kind, version, and group the object is represented as.</span></span>
<span class="line"><span>// to return a no-op ObjectKindAccessor in cases where it is not expected to be s</span></span>
<span class="line"><span>type Object interface {</span></span>
<span class="line"><span>   GetObjectKind() schema.ObjectKind</span></span>
<span class="line"><span>   DeepCopyObject() Object</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>runtime.Object 接口中包含了两个方法：</span></span>
<span class="line"><span>GetObjectKind() schema.ObjectKind 方法返回对象的类型信息。</span></span>
<span class="line"><span>DeepCopyObject() Object 方法用于创建对象的深层副本。在 Kubernetes 中，对象的</span></span></code></pre></div><ul><li>深层副本是一种常见的操作，用于确保对象的不可变性，避免引用共享。</li></ul><p>schema.ObjectKind 也是一个接口，用于描述 Kubernetes API 对象的类型和版本信息，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码位于：staging/src/k8s.io/apimachinery/pkg/runtime/schema/interfaces.go</span></span>
<span class="line"><span>// All objects that are serialized from a Scheme encode their type information. T</span></span>
<span class="line"><span>// by serialization to set type information from the Scheme onto the serialized v</span></span>
<span class="line"><span>// For objects that cannot be serialized or have unique requirements, this interf</span></span>
<span class="line"><span>type ObjectKind interface {</span></span>
<span class="line"><span>   // SetGroupVersionKind sets or clears the intended serialized kind of an obje</span></span>
<span class="line"><span>   // should clear the current setting.</span></span>
<span class="line"><span>   SetGroupVersionKind(kind GroupVersionKind)</span></span>
<span class="line"><span>   // GroupVersionKind returns the stored group, version, and kind of an object,</span></span>
<span class="line"><span>   // if the object does not expose or provide these fields.</span></span>
<span class="line"><span>   GroupVersionKind() GroupVersionKind</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// GroupVersionKind unambiguously identifies a kind.  It doesn&#39;t anonymously incl</span></span>
<span class="line"><span>// to avoid automatic coercion.  It doesn&#39;t use a GroupVersion to avoid custom ma</span></span>
<span class="line"><span>type GroupVersionKind struct {</span></span>
<span class="line"><span>   Group   string // 资源组</span></span>
<span class="line"><span>   Version string // 资源版本</span></span>
<span class="line"><span>   Kind    string // 资源类型</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>schema.ObjectKind 接口提供了 2 个核心方法用来设置和获取资源的核心信息：</span></span>
<span class="line"><span>SetGroupVersionKind()：设置资源组、资源版本、资源类型。3 个核心信息以字符串</span></span>
<span class="line"><span>的形式包含在 GroupVersionKind 结构体中。</span></span>
<span class="line"><span>GroupVersionKind()：获取资源组、资源版本、资源类型。3 个核心信息以字符串的形</span></span>
<span class="line"><span>式包含在GroupVersionKind 结构体中。</span></span>
<span class="line"><span>也就是说，所有的 Kubernetes 对象都可以使用 SetGroupVersionKind 方法设置 GKV 信</span></span>
<span class="line"><span>息、使用 GroupVersionKind 方法获取 GVK 信息，使用 DeepCopyObject 方法深拷贝该</span></span></code></pre></div><p>对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在 runtime.Object 的接口中，包含了一个函数 DeepCopyObject，用来实现</span></span></code></pre></div><p>Kubernetes 对象的深度拷贝。那么，为什么一定要生成 API 定义的深度拷贝方法呢？</p><p>在 Kubernetes 中，深拷贝函数的存在是为了确保在处理 API 对象时能够正确地进行对象的复制，避免因浅拷贝而导致的数据共享和引用问题。具体的原因如下：</p><ul><li><p>避免数据共享问题：在 Kubernetes 中，API 对象通常包含复杂的嵌套结构和引用关系。如果使用浅拷贝来复制这些对象，可能会导致不同对象之间共享同一份数据，一个对象的修改会影响到其他对象，造成意外。</p></li><li><p>保持对象的一致性：在 Kubernetes 中，各种控制器和操作都可能涉及对 API 对象的操作和处理。使用深拷贝函数可以确保在处理对象时不会意外地修改原对象，从而保持对象的一致性和正确性。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于此，我们可以知道一个 Kubernetes 一定实现了 runtime.Object 接口，一定具有以下</span></span></code></pre></div><p>3 个核心方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SetGroupVersionKind()：设置对象的 GVK（Group、Version、Kind）。</span></span>
<span class="line"><span>GroupVersionKind()：获取对象的 GVK。</span></span>
<span class="line"><span>DeepCopyObject()：深度拷贝当前资源对象。</span></span>
<span class="line"><span>现在，你应该已经明白 runtime.Object 的实现和功能了。runtime.Object 代表任何</span></span>
<span class="line"><span>Kubernetes 对象，可能是一个 Kubernetes 资源对象，也可能只是一个 metav1.TypeMeta</span></span></code></pre></div><p>结构体对象，但是无论如何，能直接从它那里得到的东西很少，因为它只有一个方法定义而</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>已，所以拿到 runtime.Object 之后，还需要通过转换和判断，获取原始类型对象，从而获</span></span></code></pre></div><p>取更多的信息，执行更多的操作。</p><h3 id="runtime-object-接口实现-metav1-typemeta" tabindex="-1">runtime.Object 接口实现（metav1.TypeMeta） <a class="header-anchor" href="#runtime-object-接口实现-metav1-typemeta" aria-label="Permalink to &quot;runtime.Object 接口实现（metav1.TypeMeta）&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>上一节我说过，Kubernetes 对象定义中都要内嵌一个 metav1.TypeMeta 结构体类型，</span></span>
<span class="line"><span>metav1.TypeMeta 就是 runtime.Object 接口的具体实现。</span></span>
<span class="line"><span>metav1.TypeMeta 结构体定义如下：</span></span>
<span class="line"><span>// 位于 k8s.io/apimachinery/pkg/apis/meta/v1/types.go 文件中</span></span>
<span class="line"><span>// TypeMeta describes an individual object in an API response or request</span></span>
<span class="line"><span>// with strings representing the type of the object and its API schema version.</span></span>
<span class="line"><span>// Structures that are versioned or persisted should inline TypeMeta.</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// +k8s:deepcopy-gen=false</span></span>
<span class="line"><span>type TypeMeta struct {</span></span>
<span class="line"><span>   // Kind is a string value representing the REST resource this object represen</span></span>
<span class="line"><span>   // Servers may infer this from the endpoint the client submits requests to.</span></span>
<span class="line"><span>   // Cannot be updated.</span></span>
<span class="line"><span>   // In CamelCase.</span></span>
<span class="line"><span>   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   Kind string \`json:&quot;kind,omitempty&quot; protobuf:&quot;bytes,1,opt,name=kind&quot;\`</span></span>
<span class="line"><span>   // APIVersion defines the versioned schema of this representation of an objec</span></span>
<span class="line"><span>   // Servers should convert recognized schemas to the latest internal value, an</span></span>
<span class="line"><span>   // may reject unrecognized values.</span></span>
<span class="line"><span>   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   APIVersion string \`json:&quot;apiVersion,omitempty&quot; protobuf:&quot;bytes,2,opt,name=api</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>metav1.TypeMeta 结构体具有以下方法（metav1.TypeMeta 方法列表）：</span></span>
<span class="line"><span>func (obj *TypeMeta) GetObjectKind() schema.ObjectKind { return obj }</span></span>
<span class="line"><span>// SetGroupVersionKind satisfies the ObjectKind interface for all objects that em</span></span>
<span class="line"><span>func (obj *TypeMeta) SetGroupVersionKind(gvk schema.GroupVersionKind) {</span></span>
<span class="line"><span>   obj.APIVersion, obj.Kind = gvk.ToAPIVersionAndKind()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// GroupVersionKind satisfies the ObjectKind interface for all objects that embed</span></span>
<span class="line"><span>func (obj *TypeMeta) GroupVersionKind() schema.GroupVersionKind {</span></span>
<span class="line"><span>   return schema.FromAPIVersionAndKind(obj.APIVersion, obj.Kind)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>可以看到 Kubernetes 对象通过内嵌 metav1.TypeMeta 结构体实现了 GetObjectKind()</span></span></code></pre></div><p>方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>那么 DeepCopyObject() Object 方法又是如何实现的呢？这里，我们来看下 Deployment</span></span></code></pre></div><p>的具体定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// +genclient</span></span>
<span class="line"><span>// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object</span></span>
<span class="line"><span>// +k8s:prerelease-lifecycle-gen:introduced=1.6</span></span>
<span class="line"><span>// +k8s:prerelease-lifecycle-gen:deprecated=1.8</span></span>
<span class="line"><span>// +k8s:prerelease-lifecycle-gen:removed=1.16</span></span>
<span class="line"><span>// +k8s:prerelease-lifecycle-gen:replacement=apps,v1,Deployment</span></span>
<span class="line"><span>// DEPRECATED - This group version of Deployment is deprecated by apps/v1beta2/De</span></span>
<span class="line"><span>// more information.</span></span>
<span class="line"><span>// Deployment enables declarative updates for Pods and ReplicaSets.</span></span>
<span class="line"><span>type Deployment struct {</span></span>
<span class="line"><span>   metav1.TypeMeta \`json:&quot;,inline&quot;\`</span></span>
<span class="line"><span>   // Standard object metadata.</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   metav1.ObjectMeta \`json:&quot;metadata,omitempty&quot; protobuf:&quot;bytes,1,opt,name=metad</span></span>
<span class="line"><span>   // Specification of the desired behavior of the Deployment.</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   Spec DeploymentSpec \`json:&quot;spec,omitempty&quot; protobuf:&quot;bytes,2,opt,name=spec&quot;\`</span></span>
<span class="line"><span>   // Most recently observed status of the Deployment.</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   Status DeploymentStatus \`json:&quot;status,omitempty&quot; protobuf:&quot;bytes,3,opt,name=s</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>在 Deployment 结构体上面有一行 // +k8s:deepcopy-</span></span>
<span class="line"><span>gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object 注释，只是</span></span>
<span class="line"><span>Kubernetes 源码文件中一种特殊的注释，Kubernetes 的 deepcopy-gen 代码生成工具会根</span></span>
<span class="line"><span>据该注释生成资源结构体的 DeepCopyObject 方法（生成的代码保存在</span></span></code></pre></div><p>zz_generated.deepcopy.go 文件中）：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, cr</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">in </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Deployment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DeepCopyObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">runtime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Object</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> c </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> in.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DeepCopy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(); c </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nil</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>所以，在 Kubernetes 中，我们如果想实现一个 Kubernetes 对象，就要做以下 2 步：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>定义的资源对象内嵌 metav1.TypeMeta 结构体。</span></span>
<span class="line"><span>结构体定义前面，添加 // +k8s:deepcopy-</span></span>
<span class="line"><span>gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object 注释，并调用</span></span>
<span class="line"><span>deepcopy-gen 工具生成 DeepCopyObject 方法。</span></span>
<span class="line"><span>这个时候，你可能会问，Kubernetes 对象定义中也会固定内嵌一个 metav1.ObjectMeta</span></span></code></pre></div><p>结构体，它的功能又是什么呢？后面我就会讲到。</p><h3 id="deepcopyobject-是如何生成的" tabindex="-1">DeepCopyObject 是如何生成的？ <a class="header-anchor" href="#deepcopyobject-是如何生成的" aria-label="Permalink to &quot;DeepCopyObject 是如何生成的？&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>上面，我多次提到过 DeepCopyObject 方法，那么 DeepCopyObject 方法具体是如何实现</span></span>
<span class="line"><span>的呢？在 Kubernetes 中，DeepCopyObject 方法是通过 deepcopy-gen 工具生成的。</span></span>
<span class="line"><span>首先，在资源对象目录下创建一个 doc.go 文件（如果没有的话），并在 doc.go 文件中添加</span></span>
<span class="line"><span>/ +k8s:deepcopy-gen=package 注释：</span></span>
<span class="line"><span>// Copyright 2022 Lingfei Kong &lt;​colin404@foxmail.com&gt;. All rights reserved.</span></span>
<span class="line"><span>// Use of this source code is governed by a MIT style</span></span>
<span class="line"><span>// license that can be found in the LICENSE file. The original repo for</span></span>
<span class="line"><span>// this file is https://github.com/superproj/onex.</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// +k8s:deepcopy-gen=package</span></span>
<span class="line"><span>// Package v1beta1 is the v1beta1 version of the API.</span></span>
<span class="line"><span>package v1beta1</span></span>
<span class="line"><span>这里一定要注意，// +k8s:deepcopy-gen=package 注释要在 package v1beta1 之</span></span></code></pre></div><p>上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>接着，在你要生成的资源对象结构体定义之上添加 // +k8s:deepcopy-</span></span>
<span class="line"><span>gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object 注释，例如：</span></span>
<span class="line"><span>// +genclient</span></span>
<span class="line"><span>// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object</span></span>
<span class="line"><span>// XXX is an example definition of a Kubernetes resource object.</span></span>
<span class="line"><span>type XXX struct {</span></span>
<span class="line"><span>   metav1.TypeMeta \`json:&quot;,inline&quot;\`</span></span>
<span class="line"><span>   // Standard object&#39;s metadata.</span></span>
<span class="line"><span>   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   metav1.ObjectMeta \`json:&quot;metadata,omitempty&quot; protobuf:&quot;bytes,1,opt,name=metad</span></span>
<span class="line"><span>   // Spec defines the behavior of the XXX.</span></span>
<span class="line"><span>   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   Spec XXXSpec \`json:&quot;spec,omitempty&quot; protobuf:&quot;bytes,2,opt,name=spec&quot;\`</span></span>
<span class="line"><span>   // Status describes the current status of a XXX.</span></span>
<span class="line"><span>   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur</span></span>
<span class="line"><span>   // +optional</span></span>
<span class="line"><span>   Status XXXStatus \`json:&quot;status,omitempty&quot; protobuf:&quot;bytes,3,opt,name=status&quot;\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// +k8s:deepcopy-</span></span>
<span class="line"><span>gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object 注释告诉</span></span>
<span class="line"><span>deepcopy-gen 工具生成 runtime.Object 的接口实现。</span></span></code></pre></div><h2 id="metav1-objectmeta" tabindex="-1">metav1.ObjectMeta <a class="header-anchor" href="#metav1-objectmeta" aria-label="Permalink to &quot;metav1.ObjectMeta&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>metav1.ObjectMeta 是 Kubernetes 资源的元数据。所有 Kubernetes 资源对象均具有统一</span></span></code></pre></div><p>的元数据。资源具有统一的元数据，会带来很多好处：</p><ul><li><p>提高代码复用度：所有资源对象用同一个元数据定义，可以复用跟元数据相关的方法、函数等。</p></li><li><p>提高代码可读性：所有资源具有统一的元数据，也可以提高代码的可读性，开发者理解了一个资源的元数据定义，相当于理解了所有资源对象的元数据定义。</p></li><li><p>提示：在实际的业务开发中，建议业务的 REST 资源对象也具有统一的元数据。</p></li></ul><p>metav1.ObjectMeta 的具体定义及字段释义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Kubernetes 所有的资源对象定义中都会内嵌该字段，作为资源对象的元数据（资源List对象除外）。</span></span>
<span class="line"><span>type ObjectMeta struct {</span></span>
<span class="line"><span> // 资源对象的名字，作为资源的唯一标识。</span></span>
<span class="line"><span> // 如果资源是集群维度的，那需要集群维度唯一。如果资源是命名空间维度的，那需要命名空间唯一。</span></span>
<span class="line"><span> // 如果创建资源时，没有指定 GenerateName 字段，那么必须要设置 Name 字段。</span></span>
<span class="line"><span> // Name 字段不能被更新。</span></span>
<span class="line"><span> // 更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/na</span></span>
<span class="line"><span> Name string \`json:&quot;name,omitempty&quot; protobuf:&quot;bytes,1,opt,name=name&quot;\`</span></span>
<span class="line"><span> // GenerateName 是一个可选的字段，用来告诉 Kubernets 要以 GenerateName 字段为前缀自动生</span></span>
<span class="line"><span> // 例如，GenerateName: agent-，当 Name 字段为空时，Kubernetes 会为该字段生成 agent-xx</span></span>
<span class="line"><span> // 当 Name 字段不为空时，使用 Name 字段作为资源名，忽略 GenerateName 字段。</span></span>
<span class="line"><span> // 如果指定该字段且生成的名称已存在，服务器将返回 409。</span></span>
<span class="line"><span> // 更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api</span></span>
<span class="line"><span> GenerateName string \`json:&quot;generateName,omitempty&quot; protobuf:&quot;bytes,2,opt,name=g</span></span>
<span class="line"><span> // 必须是 DNS_LABEL。</span></span>
<span class="line"><span> // Namespace 定义了资源所在的命令空间。这里要注意，并非所有的对象都需要命名空间。</span></span>
<span class="line"><span> // 在 Kubernetes 中有 2 大类资源：</span></span>
<span class="line"><span> //   - 命名空间维度的资源，如 Pod、Service、Secret等，绝大部分资源都有 Namespace 属性；</span></span>
<span class="line"><span> //   - 集群维度的资源，如 Node、ClusterRole、PV 等。</span></span>
<span class="line"><span> // Namespace 字段不能被更新。</span></span>
<span class="line"><span> // 更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/na</span></span>
<span class="line"><span> Namespace string \`json:&quot;namespace,omitempty&quot; protobuf:&quot;bytes,3,opt,name=namespa</span></span>
<span class="line"><span> // 已废弃：selfLink 是一个遗留只读字段，系统不再填充该字段。</span></span>
<span class="line"><span> SelfLink string \`json:&quot;selfLink,omitempty&quot; protobuf:&quot;bytes,4,opt,name=selfLink&quot;</span></span>
<span class="line"><span> // UID 是该资源对象在时间和空间中唯一的值。通常在资源成功创建时由服务器生成，且不允许在 PUT 操</span></span>
<span class="line"><span> // UID 字段由系统填充，且只读。</span></span>
<span class="line"><span> // 更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/na</span></span>
<span class="line"><span> UID types.UID \`json:&quot;uid,omitempty&quot; protobuf:&quot;bytes,5,opt,name=uid,casttype=k8s</span></span>
<span class="line"><span> // ResourceVersion 表示该对象的内部版本，可被客户端用于确定对象何时发生变化。</span></span>
<span class="line"><span> // 可用于乐观并发、变更检测和资源或资源集的观察操作。</span></span>
<span class="line"><span> // 客户端必须将这些值视为不透明并未修改地传回服务器。</span></span>
<span class="line"><span> // 仅对特定资源或资源集有效。</span></span>
<span class="line"><span> // ResourceVersion 字段由系统填充，且只读。</span></span>
<span class="line"><span> // 更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api</span></span>
<span class="line"><span> ResourceVersion string \`json:&quot;resourceVersion,omitempty&quot; protobuf:&quot;bytes,6,opt,</span></span>
<span class="line"><span> // Generation 代表特定状态的序列号。</span></span>
<span class="line"><span> // Generation 由系统填充，且只读。</span></span>
<span class="line"><span> Generation int64 \`json:&quot;generation,omitempty&quot; protobuf:&quot;varint,7,opt,name=gener</span></span>
<span class="line"><span> // CreationTimestamp 表示该对象创建时的服务器时间戳。</span></span>
<span class="line"><span> // 客户端无法设置此值。其表示格式为 RFC3339，并为 UTC。</span></span>
<span class="line"><span> // CreationTimestamp 由系统填充，且只读。</span></span>
<span class="line"><span> // 对于资源列表为 Null。</span></span>
<span class="line"><span> // 更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api</span></span>
<span class="line"><span> CreationTimestamp Time \`json:&quot;creationTimestamp,omitempty&quot; protobuf:&quot;bytes,8,op</span></span>
<span class="line"><span> // DeletionTimestamp 表示该资源将被删除的 RFC 3339 日期和时间。</span></span>
<span class="line"><span> // 当用户请求优雅删除时，服务器设置该字段，客户端无法直接设置。</span></span>
<span class="line"><span> // 预期在此字段中的时间之后，资源将被删除（不再可见且无法通过名称访问）。</span></span>
<span class="line"><span> // 只要 finalizers 列表中有元素，删除就会被阻止。</span></span>
<span class="line"><span> // 一旦设置了 deletionTimestamp，该值不可取消或设置为将来的时间，但可缩短。</span></span>
<span class="line"><span> // 例如，用户可能请求在 30 秒后删除 Pod，Kubelet 会向 Pod 中的容器发送优雅终止信号。</span></span>
<span class="line"><span> // 30 秒后，Kubelet 会发送强制终止信号（SIGKILL）并在清理后从 API 中移除 Pod。</span></span>
<span class="line"><span> // 如果未设置，则表示未请求对象的优雅删除。</span></span>
<span class="line"><span> //</span></span>
<span class="line"><span> // DeletionTimestamp 由系统在请求优雅删除时填充，且只读。</span></span>
<span class="line"><span> // 更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api</span></span>
<span class="line"><span> DeletionTimestamp *Time \`json:&quot;deletionTimestamp,omitempty&quot; protobuf:&quot;bytes,9,o</span></span>
<span class="line"><span> // 允许该对象优雅终止的秒数，在此之后将从系统中删除。</span></span>
<span class="line"><span> // 仅在 deletionTimestamp 设置时才会设置。</span></span>
<span class="line"><span> // 该字段只能缩短，且只读。</span></span>
<span class="line"><span> DeletionGracePeriodSeconds *int64 \`json:&quot;deletionGracePeriodSeconds,omitempty&quot;</span></span>
<span class="line"><span> // Labels（标签）是资源对象非常重要的一个属性，可用于组织和分类（范围和选择）对象。</span></span>
<span class="line"><span> // 在 Kubernetes 中，我们可以基于标签来查询资源，也即指定 labelSelector。</span></span>
<span class="line"><span> // 更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/la</span></span>
<span class="line"><span> Labels map[string]string \`json:&quot;labels,omitempty&quot; protobuf:&quot;bytes,11,rep,name=l</span></span>
<span class="line"><span> // Annotations（注解）是资源对象非常重要的一个属性，用来给资源对象添加额外的字段属性。</span></span>
<span class="line"><span> // 外部工具可根据需要设置任意元数据。</span></span>
<span class="line"><span> // 你可以将 Annotations 理解为实验性质的 Spec 定义。如果 Annotations 某个键，</span></span>
<span class="line"><span> // 后来证明是资源刚需的字段，那么可以靠谱将键以 Spec 字段的方式在资源对象中定义</span></span>
<span class="line"><span> // 该字段不能被查询。</span></span>
<span class="line"><span> // 更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/an</span></span>
<span class="line"><span> Annotations map[string]string \`json:&quot;annotations,omitempty&quot; protobuf:&quot;bytes,12,</span></span>
<span class="line"><span> // 此对象依赖的对象列表。如果列表中的所有对象都被删除， 则该对象将被垃圾回收。</span></span>
<span class="line"><span> // 如果该对象由控制器管理，则列表中的一个条目将指向该控制器，且该控制器字段设置为 true。</span></span>
<span class="line"><span> // 不能有多个管理控制器。</span></span>
<span class="line"><span> OwnerReferences []OwnerReference \`json:&quot;ownerReferences,omitempty&quot; patchStrateg</span></span>
<span class="line"><span> // 在 Kubernetes 中，Finalizers（最终器）是一种机制，用于在资源被删除之前执行特定的清理操作</span></span>
<span class="line"><span> // 它们允许开发者确保在 Kubernetes 资源的删除过程中，执行一些必要的步骤或逻辑，以便妥善处理依</span></span>
<span class="line"><span> // 如果对象的 deletionTimestamp 非空，则此列表中的条目只能被移除。</span></span>
<span class="line"><span> // Finalizers 可以以任何顺序处理和移除。未强制执行顺序，因为这会引入严重的风险，导致最终器阻</span></span>
<span class="line"><span> // finalizers 是共享字段，任何拥有权限的参与者都可以重新排序。</span></span>
<span class="line"><span> // 如果按顺序处理 finalizer 列表，则可能导致第一个最终器负责的组件在等待某个信号时阻塞，</span></span>
<span class="line"><span> // 该信号由负责列表中后一个 finalizer 的组件产生，导致死锁。</span></span>
<span class="line"><span> // 在未强制顺序的情况下，finalizers 可以自行排序并不会受到列表顺序变化的影响。</span></span>
<span class="line"><span> Finalizers []string \`json:&quot;finalizers,omitempty&quot; patchStrategy:&quot;merge&quot; protobuf</span></span>
<span class="line"><span> // Tombstone：ClusterName 是一个遗留字段，系统会始终将其清除且从未使用。</span></span>
<span class="line"><span> // ClusterName string \`json:&quot;clusterName,omitempty&quot; protobuf:&quot;bytes,15,opt,name</span></span>
<span class="line"><span> // 在 Kubernetes 中，ManagedFields（管理字段）是一种机制，用于追踪特定字段的更新和管理状态</span></span>
<span class="line"><span> // 这一机制主要用于为对象的不同字段提供版本控制和管理信息，主要用于内部管理，</span></span>
<span class="line"><span> // 用户通常不需要设置或理解该字段。</span></span>
<span class="line"><span> ManagedFields []ManagedFieldsEntry \`json:&quot;managedFields,omitempty&quot; protobuf:&quot;by</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>metav1.ObjectMeta 包含了很多资源对象的元数据信息，这些元数据信息在 Kubernetes</span></span></code></pre></div><p>中经常被用到。比如，通过 Annotations 来给 Kubernetes 资源打上标注，Controller 会根据这些标注实现自定义的逻辑。又比如，我们删除资源时，需要指定资源的 Namespace 和Name。</p><h3 id="metav1-objectmeta-字段详细介绍" tabindex="-1">metav1.ObjectMeta 字段详细介绍 <a class="header-anchor" href="#metav1-objectmeta-字段详细介绍" aria-label="Permalink to &quot;metav1.ObjectMeta 字段详细介绍&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>metav1.ObjectMeta 中包含了资源对象的标准元数据信息。以下是 metav1.ObjectMeta</span></span></code></pre></div><p>结构体中包含的元数据信息的解释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ObjectMeta 保存所有持久化资源必须包含的元数据。</span></span>
<span class="line"><span>// 下面对每个字段含义逐一说明（已去掉 json / protobuf 等标签）。</span></span>
<span class="line"><span>type ObjectMeta struct {</span></span>
<span class="line"><span> // Name 是对象在同一命名空间内唯一的名称。</span></span>
<span class="line"><span> // 创建时通常必填，用于幂等与配置声明；创建后不可修改。</span></span>
<span class="line"><span> Name string</span></span>
<span class="line"><span> // GenerateName 是服务器在 Name 未指定时生成唯一名称的前缀。</span></span>
<span class="line"><span> // 返回给客户端的最终名称会在该前缀后附加随机后缀；若生成后的名称冲突将返回 409。</span></span>
<span class="line"><span> GenerateName string</span></span>
<span class="line"><span> // Namespace 决定名称的作用域。不填写等同于 &quot;default&quot; 命名空间。</span></span>
<span class="line"><span> // 并非所有资源都需要归属命名空间；集群级资源该字段为空。</span></span>
<span class="line"><span> Namespace string</span></span>
<span class="line"><span> // SelfLink（已废弃）曾用于存放对象的完整访问路径，现已停止填充。</span></span>
<span class="line"><span> SelfLink string</span></span>
<span class="line"><span> // UID 是对象在时间与空间上的唯一标识，成功创建后由服务器分配；PUT 不可变。</span></span>
<span class="line"><span> UID types.UID</span></span>
<span class="line"><span> // ResourceVersion 表示对象的内部版本号，用于并发控制、变更检测及 watch。</span></span>
<span class="line"><span> // 客户端需视为不透明字符串，原样回传。</span></span>
<span class="line"><span> ResourceVersion string</span></span>
<span class="line"><span> // Generation 表示期望状态（Spec）的版本号，每次用户修改 Spec 时自动递增。</span></span>
<span class="line"><span> Generation int64</span></span>
<span class="line"><span> // CreationTimestamp 表示对象在服务器上的创建时间（UTC，RFC3339 格式）。</span></span>
<span class="line"><span> // 由系统填充，客户端只读；列表对象中为 null。</span></span>
<span class="line"><span> CreationTimestamp Time</span></span>
<span class="line"><span> // DeletionTimestamp 指定资源将被删除的时间（优雅删除场景）。</span></span>
<span class="line"><span> // 设置后需等待 Finalizers 清空才真正删除；若为空代表未请求删除。</span></span>
<span class="line"><span> DeletionTimestamp *Time</span></span>
<span class="line"><span> // DeletionGracePeriodSeconds 与 DeletionTimestamp 配合，表示优雅终止的宽限秒数。</span></span>
<span class="line"><span> // 仅在 DeletionTimestamp 非空时设置，只允许缩短。</span></span>
<span class="line"><span> DeletionGracePeriodSeconds *int64</span></span>
<span class="line"><span> // Labels 是键值对，用于对象的分组与选择（label 选择器）。</span></span>
<span class="line"><span> Labels map[string]string</span></span>
<span class="line"><span> // Annotations 也是键值对，用于存放非查询型的附加信息，由外部工具自由读写。</span></span>
<span class="line"><span> Annotations map[string]string</span></span>
<span class="line"><span> // OwnerReferences 记录该对象依赖的父对象列表，全部父对象删除后本对象可被垃圾回收。</span></span>
<span class="line"><span> // 若由控制器管理，其中一个引用的 controller 字段会为 true；同一对象最多一个控制器。</span></span>
<span class="line"><span> OwnerReferences []OwnerReference</span></span>
<span class="line"><span> // Finalizers 在删除前必须被清空的标记列表，用于实现外部/级联清理逻辑。</span></span>
<span class="line"><span> // 条目顺序不保证，任何拥有权限的主体都可增删重排。</span></span>
<span class="line"><span> Finalizers []string</span></span>
<span class="line"><span> // ManagedFields 记录不同「工作流」对对象字段的管理关系，</span></span>
<span class="line"><span> // 用于服务器端 Apply 等变更合并逻辑。一般用户无需关心。</span></span>
<span class="line"><span> ManagedFields []ManagedFieldsEntry</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="metav1-objecttype-的接口实现" tabindex="-1">metav1.ObjectType 的接口实现 <a class="header-anchor" href="#metav1-objecttype-的接口实现" aria-label="Permalink to &quot;metav1.ObjectType 的接口实现&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>metav1.ObjectType 是 metav1.Object 接口的具体实现。metav1.Object 接口定义如</span></span></code></pre></div><p>下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Object interface {</span></span>
<span class="line"><span>   GetNamespace() string</span></span>
<span class="line"><span>   SetNamespace(namespace string)</span></span>
<span class="line"><span>   GetName() string</span></span>
<span class="line"><span>   SetName(name string)</span></span>
<span class="line"><span>   GetGenerateName() string</span></span>
<span class="line"><span>   SetGenerateName(name string)</span></span>
<span class="line"><span>   GetUID() types.UID</span></span>
<span class="line"><span>   SetUID(uid types.UID)</span></span>
<span class="line"><span>   GetResourceVersion() string</span></span>
<span class="line"><span>   SetResourceVersion(version string)</span></span>
<span class="line"><span>   GetGeneration() int64</span></span>
<span class="line"><span>   SetGeneration(generation int64)</span></span>
<span class="line"><span>   GetSelfLink() string</span></span>
<span class="line"><span>   SetSelfLink(selfLink string)</span></span>
<span class="line"><span>   GetCreationTimestamp() Time</span></span>
<span class="line"><span>   SetCreationTimestamp(timestamp Time)</span></span>
<span class="line"><span>   GetDeletionTimestamp() *Time</span></span>
<span class="line"><span>   SetDeletionTimestamp(timestamp *Time)</span></span>
<span class="line"><span>   GetDeletionGracePeriodSeconds() *int64</span></span>
<span class="line"><span>   SetDeletionGracePeriodSeconds(*int64)</span></span>
<span class="line"><span>   GetLabels() map[string]string</span></span>
<span class="line"><span>   SetLabels(labels map[string]string)</span></span>
<span class="line"><span>   GetAnnotations() map[string]string</span></span>
<span class="line"><span>   SetAnnotations(annotations map[string]string)</span></span>
<span class="line"><span>   GetFinalizers() []string</span></span>
<span class="line"><span>   SetFinalizers(finalizers []string)</span></span>
<span class="line"><span>   GetOwnerReferences() []OwnerReference</span></span>
<span class="line"><span>   SetOwnerReferences([]OwnerReference)</span></span>
<span class="line"><span>   GetManagedFields() []ManagedFieldsEntry</span></span>
<span class="line"><span>   SetManagedFields(managedFields []ManagedFieldsEntry)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 Kubernetes 开发中，我们经常需要在代码中获取资源对象的 Namespace、Name、</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Labels、Annotations 等属性，如果操作对象是一个 Deployment/*Deployment 类型的对</span></span></code></pre></div><p>象，我们可以直接引用其字段值即可，例如：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">obj </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Deployment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">namespace </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> obj.ObjectMeta.Namespace</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> obj.ObjectMeta.Name</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">但是， 如果操作对象是 runtime.Object 类型的类型呢？在 Kubernetes 开发中，我们可以</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">使用 meta.Accessor 方法从 runtime.Object 类型对象中获取 metav1.Object 接口对象，</span></span></code></pre></div><p>例如：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">deploy </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Deployment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> obj </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">runtime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Object</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> deploy</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">accessor, _ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> meta.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Accessor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">namespace </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> accessor.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GetNamespace</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> accessor.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GetName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">meta.Accessor 方法在 Kubernetes 源码中也经常被使用到，是一个非常实用和常用的方</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">法。meta.Accessor 函数实现如下：</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Accessor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">obj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}) (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">metav1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Object</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   switch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> t </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> obj.(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   case</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> metav1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Object</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> t, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">nil</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   case</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> metav1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ObjectMetaAccessor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> m </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> t.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GetObjectMeta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(); m </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> m, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">nil</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, errNotObject</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, errNotObject</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">可以看到，meta.Accessor 函数其实是借助了 Go 的类型断言来获取具体类型的。很多</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Kubernetes 的核心结构都是在 k8s.io</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">apimachinery 定义的，所以，我们也可以称</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">apimachinery 包为“API 类型构建的基础设施”。</span></span></code></pre></div><h2 id="课程总结" tabindex="-1">课程总结 <a class="header-anchor" href="#课程总结" aria-label="Permalink to &quot;课程总结&quot;">​</a></h2><p>本节课我们详细介绍了 Kubernetes 中的核心对象及源码实现。</p><p>在 Kuberentes 中有很多内置资源和自定义资源，这些资源有一些通用的处理逻辑，为了能够使用同一份代码，对不同资源执行相同的程序逻辑。Kubernetes 还定义了不同的 Go 接口，用来处理资源对象中的不同部分：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>runtime.Object：用来操作 metav1.TypeMeta 域及资源对象的复制。</span></span>
<span class="line"><span>schema.ObjectKind：用来操作 metav1.TypeMeta 域。</span></span>
<span class="line"><span>metav1.Object：用来操作 metav1.ObjectMeta 域。</span></span></code></pre></div><p>这些对象之间的关系如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/19/4.png" alt=""></a></p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在 runtime.Object 单个对象中，对象类型的接口和实现分别是什么？</span></span></code></pre></div><ol start="2"><li>Kubernetes 对象之间的关系是什么？</li></ol><p>欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！</p>`,90)])])}const k=n(i,[["render",t]]);export{u as __pageData,k as default};
