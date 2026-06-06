import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"基于DDD的微服务设计实例代码详解","description":"","frontmatter":{},"headers":[{"level":2,"title":"项目回顾","slug":"项目回顾","link":"#项目回顾","children":[]},{"level":2,"title":"请假微服务采用的DDD设计思想","slug":"请假微服务采用的ddd设计思想","link":"#请假微服务采用的ddd设计思想","children":[]},{"level":2,"title":"聚合中的对象","slug":"聚合中的对象","link":"#聚合中的对象","children":[{"level":3,"title":"1. 聚合根","slug":"_1-聚合根","link":"#_1-聚合根","children":[]},{"level":3,"title":"2. 实体","slug":"_2-实体","link":"#_2-实体","children":[]},{"level":3,"title":"3. 值对象","slug":"_3-值对象","link":"#_3-值对象","children":[]},{"level":3,"title":"4. 领域服务","slug":"_4-领域服务","link":"#_4-领域服务","children":[]}]},{"level":2,"title":"领域事件","slug":"领域事件","link":"#领域事件","children":[{"level":3,"title":"1. 领域事件基类DomainEvent","slug":"_1-领域事件基类domainevent","link":"#_1-领域事件基类domainevent","children":[]},{"level":3,"title":"2. 领域事件实体","slug":"_2-领域事件实体","link":"#_2-领域事件实体","children":[]},{"level":3,"title":"3. 领域事件的执行逻辑","slug":"_3-领域事件的执行逻辑","link":"#_3-领域事件的执行逻辑","children":[]},{"level":3,"title":"4. 领域事件数据持久化","slug":"_4-领域事件数据持久化","link":"#_4-领域事件数据持久化","children":[]}]},{"level":2,"title":"仓储模式","slug":"仓储模式","link":"#仓储模式","children":[{"level":3,"title":"1. DO与PO对象的转换","slug":"_1-do与po对象的转换","link":"#_1-do与po对象的转换","children":[]},{"level":3,"title":"2. 仓储模式","slug":"_2-仓储模式","link":"#_2-仓储模式","children":[]}]},{"level":2,"title":"工厂模式","slug":"工厂模式","link":"#工厂模式","children":[]},{"level":2,"title":"服务的组合与编排","slug":"服务的组合与编排","link":"#服务的组合与编排","children":[]},{"level":2,"title":"微服务聚合拆分时的代码演进","slug":"微服务聚合拆分时的代码演进","link":"#微服务聚合拆分时的代码演进","children":[{"level":3,"title":"1. 微服务拆分前","slug":"_1-微服务拆分前","link":"#_1-微服务拆分前","children":[]},{"level":3,"title":"2. 微服务拆分后","slug":"_2-微服务拆分后","link":"#_2-微服务拆分后","children":[]}]},{"level":2,"title":"服务接口的提供","slug":"服务接口的提供","link":"#服务接口的提供","children":[{"level":3,"title":"1. facade接口","slug":"_1-facade接口","link":"#_1-facade接口","children":[]},{"level":3,"title":"2. DTO数据组装","slug":"_2-dto数据组装","link":"#_2-dto数据组装","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"DDD实战课/基于DDD的微服务设计实例代码详解.md","filePath":"DDD实战课/基于DDD的微服务设计实例代码详解.md","lastUpdated":1779815615000}'),l={name:"DDD实战课/基于DDD的微服务设计实例代码详解.md"};function i(t,a,r,o,c,v){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="基于ddd的微服务设计实例代码详解" tabindex="-1">基于DDD的微服务设计实例代码详解 <a class="header-anchor" href="#基于ddd的微服务设计实例代码详解" aria-label="Permalink to &quot;基于DDD的微服务设计实例代码详解&quot;">​</a></h1><p>你好，我是欧创新。好久不见，今天我带着你期待的案例来了。</p><p>还记得我们在 <a href="https://time.geekbang.org/column/article/169881" target="_blank" rel="noreferrer">[第 18 讲]</a> 中用事件风暴完成的“在线请假考勤”项目的领域建模和微服务设计吗？今天我们就在这个项目的基础上看看，用DDD方法设计和开发出来的微服务代码到底是什么样的？点击 <a href="https://github.com/ouchuangxin/leave-sample" target="_blank" rel="noreferrer">Github</a> 获取完整代码，接下来的内容是我对代码的一个详解，期待能帮助你更好地实践我们这个专栏所学到的知识。</p><h2 id="项目回顾" tabindex="-1">项目回顾 <a class="header-anchor" href="#项目回顾" aria-label="Permalink to &quot;项目回顾&quot;">​</a></h2><p>“在线请假考勤”项目中，请假的核心业务流程是：请假人填写请假单提交审批；根据请假人身份、请假类型和请假天数进行校验并确定审批规则；根据审批规则确定审批人，逐级提交上级审批，逐级核批通过则完成审批，否则审批不通过则退回申请人。</p><p>在 <a href="https://time.geekbang.org/column/article/169881" target="_blank" rel="noreferrer">[第 18 讲]</a> 的微服务设计中，我们已经拆分出了两个微服务：请假和考勤微服务。今天我们就围绕“请假微服务”来进行代码详解。微服务采用的开发语言和数据库分别是：Java、Spring boot 和 PostgreSQL。</p><h2 id="请假微服务采用的ddd设计思想" tabindex="-1">请假微服务采用的DDD设计思想 <a class="header-anchor" href="#请假微服务采用的ddd设计思想" aria-label="Permalink to &quot;请假微服务采用的DDD设计思想&quot;">​</a></h2><p>请假微服务中用到了很多的DDD设计思想和方法，主要包括以下几个：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DDD%E5%AE%9E%E6%88%98%E8%AF%BE/images/185174/5f22ed9bb3d5b6c63f21583469399892.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DDD%E5%AE%9E%E6%88%98%E8%AF%BE/images/185174/5f22ed9bb3d5b6c63f21583469399892.jpg" alt=""></a></p><h2 id="聚合中的对象" tabindex="-1">聚合中的对象 <a class="header-anchor" href="#聚合中的对象" aria-label="Permalink to &quot;聚合中的对象&quot;">​</a></h2><p>请假微服务包含请假（leave）、人员（person）和审批规则（rule）三个聚合。leave聚合完成请假申请和审核核心逻辑；person聚合管理人员信息和上下级关系；rule是一个单实体聚合，提供请假审批规则查询。</p><p>Leave是请假微服务的核心聚合，它有请假单聚合根leave、审批意见实体ApprovalInfo、请假申请人Applicant和审批人Approver值对象（它们的数据来源于person聚合），还有部分枚举类型，如请假类型LeaveType，请假单状态Status和审批状态类型ApprovalType等值对象。</p><p>下面我们通过代码来了解一下聚合根、实体以及值对象之间的关系。</p><h3 id="_1-聚合根" tabindex="-1">1. 聚合根 <a class="header-anchor" href="#_1-聚合根" aria-label="Permalink to &quot;1\\. 聚合根&quot;">​</a></h3><p>聚合根leave中有属性、值对象、关联实体和自身的业务行为。Leave实体采用充血模型，有自己的业务行为，具体就是聚合根实体类的方法，如代码中的getDuration和addHistoryApprovalInfo等方法。</p><p>聚合根引用实体和值对象，它可以组合聚合内的多个实体，在聚合根实体类方法中完成复杂的业务行为，这种复杂的业务行为也可以在聚合领域服务里实现。但为了职责和边界清晰，我建议聚合要根据自身的业务行为在实体类方法中实现，而涉及多个实体组合才能实现的业务能力由领域服务完成。</p><p>下面是聚合根leave的实体类方法，它包含属性、对实体和值对象的引用以及自己的业务行为和方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Leave {</span></span>
<span class="line"><span>    String id;</span></span>
<span class="line"><span>    Applicant applicant;</span></span>
<span class="line"><span>    Approver approver;</span></span>
<span class="line"><span>    LeaveType type;</span></span>
<span class="line"><span>    Status status;</span></span>
<span class="line"><span>    Date startTime;</span></span>
<span class="line"><span>    Date endTime;</span></span>
<span class="line"><span>    long duration;</span></span>
<span class="line"><span>    int leaderMaxLevel; //审批领导的最高级别</span></span>
<span class="line"><span>    ApprovalInfo currentApprovalInfo;</span></span>
<span class="line"><span>    List&amp;lt;ApprovalInfo&amp;gt; historyApprovalInfos;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public long getDuration() {</span></span>
<span class="line"><span>        return endTime.getTime() - startTime.getTime();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Leave addHistoryApprovalInfo(ApprovalInfo approvalInfo) {</span></span>
<span class="line"><span>        if (null == historyApprovalInfos)</span></span>
<span class="line"><span>            historyApprovalInfos = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        this.historyApprovalInfos.add(approvalInfo);</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Leave create(){</span></span>
<span class="line"><span>        this.setStatus(Status.APPROVING);</span></span>
<span class="line"><span>        this.setStartTime(new Date());</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//其它方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-实体" tabindex="-1">2. 实体 <a class="header-anchor" href="#_2-实体" aria-label="Permalink to &quot;2\\. 实体&quot;">​</a></h3><p>审批意见实体ApprovalInfo被leave聚合根引用，用于记录审批意见，它有自己的属性和值对象，如approver等，业务逻辑相对简单。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ApprovalInfo {</span></span>
<span class="line"><span>    String approvalInfoId;</span></span>
<span class="line"><span>    Approver approver;</span></span>
<span class="line"><span>    ApprovalType approvalType;</span></span>
<span class="line"><span>    String msg;</span></span>
<span class="line"><span>    long time;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_3-值对象" tabindex="-1">3. 值对象 <a class="header-anchor" href="#_3-值对象" aria-label="Permalink to &quot;3\\. 值对象&quot;">​</a></h3><p>在Leave聚合有比较多的值对象。</p><p>我们先来看一下审批人值对象Approver。这类值对象除了属性集之外，还可以有简单的数据查询和转换服务。Approver数据来源于person聚合，从person聚合获取审批人返回后，从person实体获取personID、personName和level等属性，重新组合为approver值对象，因此需要数据转换和重新赋值。</p><p>Approver值对象同时被聚合根leave和实体approvalInfo引用。这类值对象的数据来源于其它聚合，不可修改，可重复使用。将这种对象设计为值对象而不是实体，可以提高系统性能，降低数据库实体关联的复杂度，所以我一般建议优先设计为值对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Approver {</span></span>
<span class="line"><span>    String personId;</span></span>
<span class="line"><span>    String personName;</span></span>
<span class="line"><span>    int level; //管理级别</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static Approver fromPerson(Person person){</span></span>
<span class="line"><span>        Approver approver = new Approver();</span></span>
<span class="line"><span>        approver.setPersonId(person.getPersonId());</span></span>
<span class="line"><span>        approver.setPersonName(person.getPersonName());</span></span>
<span class="line"><span>        approver.setLevel(person.getRoleLevel());</span></span>
<span class="line"><span>        return approver;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是枚举类型的值对象Status的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum Status {</span></span>
<span class="line"><span>    APPROVING, APPROVED, REJECTED</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里你要记住一点，由于值对象只做整体替换、不可修改的特性，在值对象中基本不会有修改或新增的方法。</p><h3 id="_4-领域服务" tabindex="-1">4. 领域服务 <a class="header-anchor" href="#_4-领域服务" aria-label="Permalink to &quot;4\\. 领域服务&quot;">​</a></h3><p>如果一个业务行为由多个实体对象参与完成，我们就将这部分业务逻辑放在领域服务中实现。领域服务与实体方法的区别是：实体方法完成单一实体自身的业务逻辑，是相对简单的原子业务逻辑，而领域服务则是多个实体组合出的相对复杂的业务逻辑。两者都在领域层，实现领域模型的核心业务能力。</p><p>一个聚合可以设计一个领域服务类，管理聚合内所有的领域服务。</p><p>请假聚合的领域服务类是LeaveDomainService。领域服务中会用到很多的DDD设计模式，比如：用工厂模式实现复杂聚合的实体数据初始化，用仓储模式实现领域层与基础层的依赖倒置和用领域事件实现数据的最终一致性等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveDomainService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    EventPublisher eventPublisher;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    LeaveRepositoryInterface leaveRepositoryInterface;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    LeaveFactory leaveFactory;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void createLeave(Leave leave, int leaderMaxLevel, Approver approver) {</span></span>
<span class="line"><span>            leave.setLeaderMaxLevel(leaderMaxLevel);</span></span>
<span class="line"><span>            leave.setApprover(approver);</span></span>
<span class="line"><span>            leave.create();</span></span>
<span class="line"><span>    leaveRepositoryInterface.save(leaveFactory.createLeavePO(leave));</span></span>
<span class="line"><span>    LeaveEvent event = LeaveEvent.create(LeaveEventType.CREATE_EVENT, leave);</span></span>
<span class="line"><span>    leaveRepositoryInterface.saveEvent(leaveFactory.createLeaveEventPO(event));</span></span>
<span class="line"><span>    eventPublisher.publish(event);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void updateLeaveInfo(Leave leave) {</span></span>
<span class="line"><span>    LeavePO po = leaveRepositoryInterface.findById(leave.getId());</span></span>
<span class="line"><span>        if (null == po) {</span></span>
<span class="line"><span>                throw new RuntimeException(&quot;leave does not exist&quot;);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>     leaveRepositoryInterface.save(leaveFactory.createLeavePO(leave));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void submitApproval(Leave leave, Approver approver) {</span></span>
<span class="line"><span>       LeaveEvent event;</span></span>
<span class="line"><span>       if (ApprovalType.REJECT == leave.getCurrentApprovalInfo().getApprovalType()) {</span></span>
<span class="line"><span>       leave.reject(approver);</span></span>
<span class="line"><span>       event = LeaveEvent.create(LeaveEventType.REJECT_EVENT, leave);</span></span>
<span class="line"><span>       } else {</span></span>
<span class="line"><span>             if (approver != null) {</span></span>
<span class="line"><span>                 leave.agree(approver);</span></span>
<span class="line"><span>                 event = LeaveEvent.create(LeaveEventType.AGREE_EVENT, leave); } else {</span></span>
<span class="line"><span>                    leave.finish();</span></span>
<span class="line"><span>                    event = LeaveEvent.create(LeaveEventType.APPROVED_EVENT, leave);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>      leave.addHistoryApprovalInfo(leave.getCurrentApprovalInfo());</span></span>
<span class="line"><span>      leaveRepositoryInterface.save(leaveFactory.createLeavePO(leave));</span></span>
<span class="line"><span>      leaveRepositoryInterface.saveEvent(leaveFactory.createLeaveEventPO(event));</span></span>
<span class="line"><span>      eventPublisher.publish(event);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Leave getLeaveInfo(String leaveId) {</span></span>
<span class="line"><span>    LeavePO leavePO = leaveRepositoryInterface.findById(leaveId);</span></span>
<span class="line"><span>    return leaveFactory.getLeave(leavePO);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&amp;lt;Leave&amp;gt; queryLeaveInfosByApplicant(String applicantId) {</span></span>
<span class="line"><span>        List&amp;lt;LeavePO&amp;gt; leavePOList = leaveRepositoryInterface.queryByApplicantId(applicantId);</span></span>
<span class="line"><span>    return leavePOList.stream().map(leavePO -&amp;gt; leaveFactory.getLeave(leavePO)).collect(Collectors.toList());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&amp;lt;Leave&amp;gt; queryLeaveInfosByApprover(String approverId) {</span></span>
<span class="line"><span>    List&amp;lt;LeavePO&amp;gt; leavePOList = leaveRepositoryInterface.queryByApproverId(approverId);</span></span>
<span class="line"><span>    return leavePOList.stream().map(leavePO -&amp;gt; leaveFactory.getLeave(leavePO)).collect(Collectors.toList());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>领域服务开发时的注意事项：</strong></p><p>在领域服务或实体方法中，我们应尽量避免调用其它聚合的领域服务或引用其它聚合的实体或值对象，这种操作会增加聚合的耦合度。在微服务架构演进时，如果出现聚合拆分和重组，这种跨聚合的服务调用和对象引用，会变成跨微服务的操作，导致这种跨聚合的领域服务调用和对象引用失效，在聚合分拆时会增加你代码解耦和重构的工作量。</p><p>以下是一段不建议使用的代码。在这段代码里Approver是leave聚合的值对象，它作为对象参数被传到person聚合的findNextApprover领域服务。如果在同一个微服务内，这种方式是没有问题的。但在架构演进时，如果person和leave两个聚合被分拆到不同的微服务中，那么leave中的Approver对象以及它的getPersonId()和fromPersonPO方法在person聚合中就会失效，这时你就需要进行代码重构了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class PersonDomainService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public Approver findNextApprover(Approver currentApprover, int leaderMaxLevel) {</span></span>
<span class="line"><span>   PersonPO leaderPO = personRepository.findLeaderByPersonId(currentApprover.getPersonId());</span></span>
<span class="line"><span>        if (leaderPO.getRoleLevel() &amp;gt; leaderMaxLevel) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return Approver.fromPersonPO(leaderPO);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那正确的方式是什么样的呢？在应用服务组合不同聚合的领域服务时，我们可以通过ID或者参数来传数，如单一参数currentApproverId。这样聚合之间就解耦了，下面是修改后的代码，它可以不依赖其它聚合的实体，独立完成业务逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class PersonDomainService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public Person findNextApprover(String currentApproverId, int leaderMaxLevel) {</span></span>
<span class="line"><span>   PersonPO leaderPO = personRepository.findLeaderByPersonId(currentApproverId);</span></span>
<span class="line"><span>   if (leaderPO.getRoleLevel() &amp;gt; leaderMaxLevel) {</span></span>
<span class="line"><span>       return null;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>            return personFactory.createPerson(leaderPO);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="领域事件" tabindex="-1">领域事件 <a class="header-anchor" href="#领域事件" aria-label="Permalink to &quot;领域事件&quot;">​</a></h2><p>在创建请假单和请假审批过程中会产生领域事件。为了方便管理，我们将聚合内的领域事件相关的代码放在聚合的event目录中。领域事件实体在聚合仓储内完成持久化，但是事件实体的生命周期不受聚合根管理。</p><h3 id="_1-领域事件基类domainevent" tabindex="-1">1. 领域事件基类DomainEvent <a class="header-anchor" href="#_1-领域事件基类domainevent" aria-label="Permalink to &quot;1\\. 领域事件基类DomainEvent&quot;">​</a></h3><p>你可以建立统一的领域事件基类DomainEvent。基类包含：事件ID、时间戳、事件源以及事件相关的业务数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DomainEvent {</span></span>
<span class="line"><span>    String id;</span></span>
<span class="line"><span>    Date timestamp;</span></span>
<span class="line"><span>    String source;</span></span>
<span class="line"><span>    String data;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-领域事件实体" tabindex="-1">2. 领域事件实体 <a class="header-anchor" href="#_2-领域事件实体" aria-label="Permalink to &quot;2\\. 领域事件实体&quot;">​</a></h3><p>请假领域事件实体LeaveEvent继承基类DomainEvent。可根据需要扩展属性和方法，如leaveEventType。data字段中存储领域事件相关的业务数据，可以是XML或Json等格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveEvent extends DomainEvent {</span></span>
<span class="line"><span>    LeaveEventType leaveEventType;</span></span>
<span class="line"><span>    public static LeaveEvent create(LeaveEventType eventType, Leave leave){</span></span>
<span class="line"><span>       LeaveEvent event = new LeaveEvent();</span></span>
<span class="line"><span>       event.setId(IdGenerator.nextId());</span></span>
<span class="line"><span>       event.setLeaveEventType(eventType);</span></span>
<span class="line"><span>       event.setTimestamp(new Date());</span></span>
<span class="line"><span>       event.setData(JSON.toJSONString(leave));</span></span>
<span class="line"><span>       return event;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_3-领域事件的执行逻辑" tabindex="-1">3. 领域事件的执行逻辑 <a class="header-anchor" href="#_3-领域事件的执行逻辑" aria-label="Permalink to &quot;3\\. 领域事件的执行逻辑&quot;">​</a></h3><p>一般来说，领域事件的执行逻辑如下：</p><p>第一步：执行业务逻辑，产生领域事件。</p><p>第二步：完成业务数据持久化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>leaveRepositoryInterface.save(leaveFactory.createLeavePO(leave));</span></span></code></pre></div><p>第三步：完成事件数据持久化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>leaveRepositoryInterface.saveEvent(leaveFactory.createLeaveEventPO(event));</span></span></code></pre></div><p>第四步：完成领域事件发布。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>eventPublisher.publish(event);</span></span></code></pre></div><p>以上领域事件处理逻辑代码详见LeaveDomainService中submitApproval领域服务，里面有请假提交审批事件的完整处理逻辑。</p><h3 id="_4-领域事件数据持久化" tabindex="-1">4. 领域事件数据持久化 <a class="header-anchor" href="#_4-领域事件数据持久化" aria-label="Permalink to &quot;4\\. 领域事件数据持久化&quot;">​</a></h3><p>为了保证事件发布方与事件订阅方数据的最终一致性和数据审计，有些业务场景需要建立数据对账机制。数据对账主要通过对源端和目的端的持久化数据比对，从而发现异常数据并进一步处理，保证数据最终一致性。</p><p>对于需要对账的事件数据，我们需设计领域事件对象的持久化对象PO，完成领域事件数据的持久化，如LeaveEvent事件实体的持久化对象LeaveEventPO。再通过聚合的仓储完成数据持久化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>leaveRepositoryInterface.saveEvent(leaveFactory.createLeaveEventPO(event))。</span></span></code></pre></div><p>事件数据持久化对象LeaveEventPO格式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveEventPO {</span></span>
<span class="line"><span>    &amp;#64;Id</span></span>
<span class="line"><span>    &amp;#64;GenericGenerator(name = &quot;idGenerator&quot;, strategy = &quot;uuid&quot;)</span></span>
<span class="line"><span>    &amp;#64;GeneratedValue(generator = &quot;idGenerator&quot;)</span></span>
<span class="line"><span>    int id;</span></span>
<span class="line"><span>    &amp;#64;Enumerated(EnumType.STRING)</span></span>
<span class="line"><span>    LeaveEventType leaveEventType;</span></span>
<span class="line"><span>    Date timestamp;</span></span>
<span class="line"><span>    String source;</span></span>
<span class="line"><span>    String data;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="仓储模式" tabindex="-1">仓储模式 <a class="header-anchor" href="#仓储模式" aria-label="Permalink to &quot;仓储模式&quot;">​</a></h2><p>领域模型中DO实体的数据持久化是必不可少的，DDD采用仓储模式实现数据持久化，使得业务逻辑与基础资源逻辑解耦，实现依赖倒置。持久化时先完成DO与PO对象的转换，然后在仓储服务中完成PO对象的持久化。</p><h3 id="_1-do与po对象的转换" tabindex="-1">1. DO与PO对象的转换 <a class="header-anchor" href="#_1-do与po对象的转换" aria-label="Permalink to &quot;1\\. DO与PO对象的转换&quot;">​</a></h3><p>Leave聚合根的DO实体除了自身的属性外，还会根据领域模型引用多个值对象，如Applicant和Approver等，它们包含多个属性，如：personId、personName和personType等属性。</p><p>在持久化对象PO设计时，你可以将这些值对象属性嵌入PO属性中，或设计一个组合属性字段，以Json串的方式存储在PO中。</p><p>以下是leave的DO的属性定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Leave {</span></span>
<span class="line"><span>    String id;</span></span>
<span class="line"><span>    Applicant applicant;</span></span>
<span class="line"><span>    Approver approver;</span></span>
<span class="line"><span>    LeaveType type;</span></span>
<span class="line"><span>    Status status;</span></span>
<span class="line"><span>    Date startTime;</span></span>
<span class="line"><span>    Date endTime;</span></span>
<span class="line"><span>    long duration;</span></span>
<span class="line"><span>    int leaderMaxLevel;</span></span>
<span class="line"><span>    ApprovalInfo currentApprovalInfo;</span></span>
<span class="line"><span>    List&amp;lt;ApprovalInfo&amp;gt; historyApprovalInfos;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Applicant {</span></span>
<span class="line"><span>    String personId;</span></span>
<span class="line"><span>    String personName;</span></span>
<span class="line"><span>    String personType;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Approver {</span></span>
<span class="line"><span>    String personId;</span></span>
<span class="line"><span>    String personName;</span></span>
<span class="line"><span>    int level;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了减少数据库表数量以及表与表的复杂关联关系，我们将leave实体和多个值对象放在一个LeavePO中。如果以属性嵌入的方式，Applicant值对象在LeavePO中会展开为：applicantId、applicantName和applicantType三个属性。</p><p>以下为采用属性嵌入方式的持久化对象LeavePO的结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeavePO {</span></span>
<span class="line"><span>    &amp;#64;Id</span></span>
<span class="line"><span>    &amp;#64;GenericGenerator(name=&quot;idGenerator&quot;, strategy=&quot;uuid&quot;)</span></span>
<span class="line"><span>    &amp;#64;GeneratedValue(generator=&quot;idGenerator&quot;)</span></span>
<span class="line"><span>    String id;</span></span>
<span class="line"><span>    String applicantId;</span></span>
<span class="line"><span>    String applicantName;</span></span>
<span class="line"><span>    &amp;#64;Enumerated(EnumType.STRING)</span></span>
<span class="line"><span>    PersonType applicantType;</span></span>
<span class="line"><span>    String approverId;</span></span>
<span class="line"><span>    String approverName;</span></span>
<span class="line"><span>    &amp;#64;Enumerated(EnumType.STRING)</span></span>
<span class="line"><span>    LeaveType leaveType;</span></span>
<span class="line"><span>    &amp;#64;Enumerated(EnumType.STRING)</span></span>
<span class="line"><span>    Status status;</span></span>
<span class="line"><span>    Date startTime;</span></span>
<span class="line"><span>    Date endTime;</span></span>
<span class="line"><span>    long duration;</span></span>
<span class="line"><span>    &amp;#64;Transient</span></span>
<span class="line"><span>    List&amp;lt;ApprovalInfoPO&amp;gt; historyApprovalInfoPOList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-仓储模式" tabindex="-1">2. 仓储模式 <a class="header-anchor" href="#_2-仓储模式" aria-label="Permalink to &quot;2\\. 仓储模式&quot;">​</a></h3><p>为了解耦业务逻辑和基础资源，我们可以在基础层和领域层之间增加一层仓储服务，实现依赖倒置。通过这一层可以实现业务逻辑和基础层资源的依赖分离。在变更基础层数据库的时候，你只要替换仓储实现就可以了，上层核心业务逻辑不会受基础资源变更的影响，从而实现依赖倒置。</p><p>一个聚合一个仓储，实现聚合数据的持久化。领域服务通过仓储接口来访问基础资源，由仓储实现完成数据持久化和初始化。仓储一般包含：仓储接口和仓储实现。</p><p><strong>2.1仓储接口</strong></p><p>仓储接口面向领域服务提供接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface LeaveRepositoryInterface {</span></span>
<span class="line"><span>   void save(LeavePO leavePO);</span></span>
<span class="line"><span>   void saveEvent(LeaveEventPO leaveEventPO);</span></span>
<span class="line"><span>   LeavePO findById(String id);</span></span>
<span class="line"><span>   List&amp;lt;LeavePO&amp;gt; queryByApplicantId(String applicantId);</span></span>
<span class="line"><span>   List&amp;lt;LeavePO&amp;gt; queryByApproverId(String approverId);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>2.2仓储实现</strong></p><p>仓储实现完成数据持久化和数据库查询。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Repository</span></span>
<span class="line"><span>public class LeaveRepositoryImpl implements LeaveRepositoryInterface {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    LeaveDao leaveDao;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    ApprovalInfoDao approvalInfoDao;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    LeaveEventDao leaveEventDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void save(LeavePO leavePO) {</span></span>
<span class="line"><span>        leaveDao.save(leavePO);</span></span>
<span class="line"><span>        approvalInfoDao.saveAll(leavePO.getHistoryApprovalInfoPOList());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void saveEvent(LeaveEventPO leaveEventPO){</span></span>
<span class="line"><span>        leaveEventDao.save(leaveEventPO);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public LeavePO findById(String id) {</span></span>
<span class="line"><span>        return leaveDao.findById(id)</span></span>
<span class="line"><span>                .orElseThrow(() -&amp;gt; new RuntimeException(&quot;leave not found&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public List&amp;lt;LeavePO&amp;gt; queryByApplicantId(String applicantId) {</span></span>
<span class="line"><span>        List&amp;lt;LeavePO&amp;gt; leavePOList = leaveDao.queryByApplicantId(applicantId);</span></span>
<span class="line"><span>        leavePOList.stream()</span></span>
<span class="line"><span>                .forEach(leavePO -&amp;gt; {</span></span>
<span class="line"><span>                    List&amp;lt;ApprovalInfoPO&amp;gt; approvalInfoPOList = approvalInfoDao.queryByLeaveId(leavePO.getId());</span></span>
<span class="line"><span>                    leavePO.setHistoryApprovalInfoPOList(approvalInfoPOList);</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>        return leavePOList;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public List&amp;lt;LeavePO&amp;gt; queryByApproverId(String approverId) {</span></span>
<span class="line"><span>        List&amp;lt;LeavePO&amp;gt; leavePOList = leaveDao.queryByApproverId(approverId);</span></span>
<span class="line"><span>        leavePOList.stream()</span></span>
<span class="line"><span>                .forEach(leavePO -&amp;gt; {</span></span>
<span class="line"><span>                    List&amp;lt;ApprovalInfoPO&amp;gt; approvalInfoPOList = approvalInfoDao.queryByLeaveId(leavePO.getId());</span></span>
<span class="line"><span>                    leavePO.setHistoryApprovalInfoPOList(approvalInfoPOList);</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>        return leavePOList;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里持久化组件采用了Jpa。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface LeaveDao extends JpaRepository&amp;lt;LeavePO, String&amp;gt; {</span></span>
<span class="line"><span>    List&amp;lt;LeavePO&amp;gt; queryByApplicantId(String applicantId);</span></span>
<span class="line"><span>    List&amp;lt;LeavePO&amp;gt; queryByApproverId(String approverId);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>2.3仓储执行逻辑</strong></p><p>以创建请假单为例，仓储的执行步骤如下。</p><p>第一步：仓储执行之前将聚合内DO会转换为PO，这种转换在工厂服务中完成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>leaveFactory.createLeavePO(leave)。</span></span></code></pre></div><p>第二步：完成对象转换后，领域服务调用仓储接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>leaveRepositoryInterface.save。</span></span></code></pre></div><p>第三步：由仓储实现完成PO对象持久化。</p><p>代码执行步骤如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void createLeave(Leave leave, int leaderMaxLevel, Approver approver) {</span></span>
<span class="line"><span>  leave.setLeaderMaxLevel(leaderMaxLevel);</span></span>
<span class="line"><span>  leave.setApprover(approver);</span></span>
<span class="line"><span>  leave.create();</span></span>
<span class="line"><span>  leaveRepositoryInterface.save(leaveFactory.createLeavePO(leave));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="工厂模式" tabindex="-1">工厂模式 <a class="header-anchor" href="#工厂模式" aria-label="Permalink to &quot;工厂模式&quot;">​</a></h2><p>对于大型的复杂领域模型，聚合内的聚合根、实体和值对象之间的依赖关系比较复杂，这种过于复杂的依赖关系，不适合通过根实体构造器来创建。为了协调这种复杂的领域对象的创建和生命周期管理，在DDD里引入了工厂模式（Factory），在工厂里封装复杂的对象创建过程。</p><p>当聚合根被创建时，聚合内所有依赖的对象将会被同时创建。</p><p>工厂与仓储模式往往结对出现，应用于数据的初始化和持久化两类场景。</p><ul><li>DO对象的初始化：获取持久化对象PO，通过工厂一次构建出聚合根所有依赖的DO对象，完数据初始化。</li><li>DO的对象持久化：将所有依赖的DO对象一次转换为PO对象，完成数据持久化。</li></ul><p>下面代码是leave聚合的工厂类LeaveFactory。其中createLeavePO（leave）方法组织leave聚合的DO对象和值对象完成leavePO对象的构建。getLeave（leave）通过持久化对象PO构建聚合的DO对象和值对象，完成leave聚合DO实体的初始化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveFactory {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public LeavePO createLeavePO(Leave leave) {</span></span>
<span class="line"><span>   LeavePO leavePO = new LeavePO();</span></span>
<span class="line"><span>   leavePO.setId(UUID.randomUUID().toString());</span></span>
<span class="line"><span>   leavePO.setApplicantId(leave.getApplicant().getPersonId());</span></span>
<span class="line"><span>   leavePO.setApplicantName(leave.getApplicant().getPersonName());</span></span>
<span class="line"><span>   leavePO.setApproverId(leave.getApprover().getPersonId());</span></span>
<span class="line"><span>   leavePO.setApproverName(leave.getApprover().getPersonName());</span></span>
<span class="line"><span>   leavePO.setStartTime(leave.getStartTime());</span></span>
<span class="line"><span>   leavePO.setStatus(leave.getStatus());</span></span>
<span class="line"><span>   List&amp;lt;ApprovalInfoPO&amp;gt; historyApprovalInfoPOList = approvalInfoPOListFromDO(leave);</span></span>
<span class="line"><span>   leavePO.setHistoryApprovalInfoPOList(historyApprovalInfoPOList);</span></span>
<span class="line"><span>   return leavePO;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public Leave getLeave(LeavePO leavePO) {</span></span>
<span class="line"><span>   Leave leave = new Leave();</span></span>
<span class="line"><span>   Applicant applicant = Applicant.builder()</span></span>
<span class="line"><span>       .personId(leavePO.getApplicantId())</span></span>
<span class="line"><span>       .personName(leavePO.getApplicantName())</span></span>
<span class="line"><span>       .build();</span></span>
<span class="line"><span>   leave.setApplicant(applicant);</span></span>
<span class="line"><span>   Approver approver = Approver.builder()</span></span>
<span class="line"><span>       .personId(leavePO.getApproverId())</span></span>
<span class="line"><span>       .personName(leavePO.getApproverName())</span></span>
<span class="line"><span>       .build();</span></span>
<span class="line"><span>   leave.setApprover(approver);</span></span>
<span class="line"><span>   leave.setStartTime(leavePO.getStartTime());</span></span>
<span class="line"><span>   leave.setStatus(leavePO.getStatus());</span></span>
<span class="line"><span>   List&amp;lt;ApprovalInfo&amp;gt; approvalInfos = getApprovalInfos(leavePO.getHistoryApprovalInfoPOList());</span></span>
<span class="line"><span>   leave.setHistoryApprovalInfos(approvalInfos);</span></span>
<span class="line"><span>   return leave;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//其它方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="服务的组合与编排" tabindex="-1">服务的组合与编排 <a class="header-anchor" href="#服务的组合与编排" aria-label="Permalink to &quot;服务的组合与编排&quot;">​</a></h2><p>应用层的应用服务完成领域服务的组合与编排。一个聚合的应用服务可以建立一个应用服务类，管理聚合所有的应用服务。比如leave聚合有LeaveApplicationService，person聚合有PersonApplicationService。</p><p>在请假微服务中，有三个聚合：leave、person和rule。我们来看一下应用服务是如何跨聚合来进行服务的组合和编排的。以创建请假单createLeaveInfo应用服务为例，分为这样三个步骤。</p><p>第一步：根据请假单定义的人员类型、请假类型和请假时长从rule聚合中获取请假审批规则。这一步通过approvalRuleDomainService类的getLeaderMaxLevel领域服务来实现。</p><p>第二步：根据请假审批规则，从person聚合中获取请假审批人。这一步通过personDomainService类的findFirstApprover领域服务来实现。</p><p>第三步：根据请假数据和从rule和person聚合获取的数据，创建请假单。这一步通过leaveDomainService类的createLeave领域服务来实现。</p><p>由于领域核心逻辑已经很好地沉淀到了领域层中，领域层的这些核心逻辑可以高度复用。应用服务只需要灵活地组合和编排这些不同聚合的领域服务，就可以很容易地适配前端业务的变化。因此应用层不会积累太多的业务逻辑代码，所以会变得很薄，代码维护起来也会容易得多。</p><p>以下是leave聚合的应用服务类。代码是不是非常得少？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveApplicationService{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    LeaveDomainService leaveDomainService;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    PersonDomainService personDomainService;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    ApprovalRuleDomainService approvalRuleDomainService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void createLeaveInfo(Leave leave){</span></span>
<span class="line"><span>    //get approval leader max level by rule</span></span>
<span class="line"><span>    int leaderMaxLevel = approvalRuleDomainService.getLeaderMaxLevel(leave.getApplicant().getPersonType(), leave.getType().toString(), leave.getDuration());</span></span>
<span class="line"><span>    //find next approver</span></span>
<span class="line"><span>    Person approver = personDomainService.findFirstApprover(leave.getApplicant().getPersonId(), leaderMaxLevel);</span></span>
<span class="line"><span>    leaveDomainService.createLeave(leave, leaderMaxLevel, Approver.fromPerson(approver));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void updateLeaveInfo(Leave leave){</span></span>
<span class="line"><span>    leaveDomainService.updateLeaveInfo(leave);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void submitApproval(Leave leave){</span></span>
<span class="line"><span>    //find next approver</span></span>
<span class="line"><span>    Person approver = personDomainService.findNextApprover(leave.getApprover().getPersonId(), leave.getLeaderMaxLevel());</span></span>
<span class="line"><span>    leaveDomainService.submitApproval(leave, Approver.fromPerson(approver));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Leave getLeaveInfo(String leaveId){</span></span>
<span class="line"><span>        return leaveDomainService.getLeaveInfo(leaveId);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&amp;lt;Leave&amp;gt; queryLeaveInfosByApplicant(String applicantId){</span></span>
<span class="line"><span>    return leaveDomainService.queryLeaveInfosByApplicant(applicantId);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&amp;lt;Leave&amp;gt; queryLeaveInfosByApprover(String approverId){</span></span>
<span class="line"><span>    return leaveDomainService.queryLeaveInfosByApprover(approverId);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>应用服务开发注意事项：</strong></p><p>为了聚合解耦和微服务架构演进，应用服务在对不同聚合领域服务进行编排时，应避免不同聚合的实体对象，在不同聚合的领域服务中引用，这是因为一旦聚合拆分和重组，这些跨聚合的对象将会失效。</p><p>在LeaveApplicationService中，leave实体和Applicant值对象分别作为参数被rule聚合和person聚合的领域服务引用，这样会增加聚合的耦合度。下面是不推荐使用的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveApplicationService{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void createLeaveInfo(Leave leave){</span></span>
<span class="line"><span>  //get approval leader max level by rule</span></span>
<span class="line"><span>  ApprovalRule rule = approvalRuleDomainService.getLeaveApprovalRule(leave);</span></span>
<span class="line"><span>  int leaderMaxLevel = approvalRuleDomainService.getLeaderMaxLevel(rule);</span></span>
<span class="line"><span>  leave.setLeaderMaxLevel(leaderMaxLevel);</span></span>
<span class="line"><span>  //find next approver</span></span>
<span class="line"><span>  Approver approver = personDomainService.findFirstApprover(leave.getApplicant(), leaderMaxLevel);</span></span>
<span class="line"><span>  leave.setApprover(approver);</span></span>
<span class="line"><span>  leaveDomainService.createLeave(leave);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那如何实现聚合的解耦呢？我们可以将跨聚合调用时的对象传值调整为参数传值。一起来看一下调整后的代码，getLeaderMaxLevel由leave对象传值调整为personType，leaveType和duration参数传值。findFirstApprover中Applicant值对象调整为personId参数传值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveApplicationService{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void createLeaveInfo(Leave leave){</span></span>
<span class="line"><span>  //get approval leader max level by rule</span></span>
<span class="line"><span>  int leaderMaxLevel = approvalRuleDomainService.getLeaderMaxLevel(leave.getApplicant().getPersonType(), leave.getType().toString(), leave.getDuration());</span></span>
<span class="line"><span>  //find next approver</span></span>
<span class="line"><span>  Person approver = personDomainService.findFirstApprover(leave.getApplicant().getPersonId(), leaderMaxLevel);</span></span>
<span class="line"><span>  leaveDomainService.createLeave(leave, leaderMaxLevel, Approver.fromPerson(approver));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在微服务演进和聚合重组时，就不需要进行聚合解耦和代码重构了。</p><h2 id="微服务聚合拆分时的代码演进" tabindex="-1">微服务聚合拆分时的代码演进 <a class="header-anchor" href="#微服务聚合拆分时的代码演进" aria-label="Permalink to &quot;微服务聚合拆分时的代码演进&quot;">​</a></h2><p>如果请假微服务未来需要演进为人员和请假两个微服务，我们可以基于请假leave和人员person两个聚合来进行拆分。由于两个聚合已经完全解耦，领域逻辑非常稳定，在微服务聚合代码拆分时，聚合领域层的代码基本不需要调整。调整主要集中在微服务的应用服务中。</p><p>我们以应用服务createLeaveInfo为例，当一个微服务拆分为两个微服务时，看看代码需要做什么样的调整？</p><h3 id="_1-微服务拆分前" tabindex="-1">1. 微服务拆分前 <a class="header-anchor" href="#_1-微服务拆分前" aria-label="Permalink to &quot;1\\. 微服务拆分前&quot;">​</a></h3><p>createLeaveInfo应用服务的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void createLeaveInfo(Leave leave){</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //get approval leader max level by rule</span></span>
<span class="line"><span>    int leaderMaxLevel = approvalRuleDomainService.getLeaderMaxLevel(leave.getApplicant().getPersonType(), leave.getType().toString(), leave.getDuration());</span></span>
<span class="line"><span>    //find next approver</span></span>
<span class="line"><span>    Person approver = personDomainService.findFirstApprover(leave.getApplicant().getPersonId(), leaderMaxLevel);</span></span>
<span class="line"><span>    leaveDomainService.createLeave(leave, leaderMaxLevel, Approver.fromPerson(approver));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-微服务拆分后" tabindex="-1">2. 微服务拆分后 <a class="header-anchor" href="#_2-微服务拆分后" aria-label="Permalink to &quot;2\\. 微服务拆分后&quot;">​</a></h3><p>leave和person两个聚合随微服务拆分后，createLeaveInfo应用服务中下面的代码将会变成跨微服务调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Person approver = personDomainService.findFirstApprover(leave.getApplicant().getPersonId(), leaderMaxLevel);</span></span></code></pre></div><p>由于跨微服务的调用是在应用层完成的，我们只需要调整createLeaveInfo应用服务代码，将原来微服务内的服务调用personDomainService.findFirstApprover修改为跨微服务的服务调用：personFeignService. findFirstApprover。</p><p>同时新增ApproverAssembler组装器和PersonResponse的DTO对象，以便将person微服务返回的person DTO对象转换为approver值对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// PersonResponse为调用微服务返回结果的封装</span></span>
<span class="line"><span>//通过personFeignService调用Person微服务用户接口层的findFirstApprover facade接口</span></span>
<span class="line"><span>PersonResponse approverResponse = personFeignService. findFirstApprover(leave.getApplicant().getPersonId(), leaderMaxLevel);</span></span>
<span class="line"><span>Approver approver = ApproverAssembler.toDO(approverResponse);</span></span></code></pre></div><p>在原来的person聚合中，由于findFirstApprover领域服务已经逐层封装为用户接口层的Facade接口，所以person微服务不需要做任何代码调整，只需将PersonApi的findFirstApprover Facade服务，发布到API网关即可。</p><p>如果拆分前person聚合的findFirstApprover领域服务，没有被封装为Facade接口，我们只需要在person微服务中按照以下步骤调整即可。</p><p>第一步：将person聚合PersonDomainService类中的领域服务findFirstApprover封装为应用服务findFirstApprover。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class PersonApplicationService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Autowired</span></span>
<span class="line"><span>  PersonDomainService personDomainService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Person findFirstApprover(String applicantId, int leaderMaxLevel) {</span></span>
<span class="line"><span>  return personDomainService.findFirstApprover(applicantId, leaderMaxLevel);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二步：将应用服务封装为Facade服务，并发布到API网关。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;/person&quot;)</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class PersonApi {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Autowired</span></span>
<span class="line"><span>  &amp;#64;GetMapping(&quot;/findFirstApprover&quot;)</span></span>
<span class="line"><span>  public Response findFirstApprover(&amp;#64;RequestParam String applicantId, &amp;#64;RequestParam int leaderMaxLevel) {</span></span>
<span class="line"><span>  Person person = personApplicationService.findFirstApprover(applicantId, leaderMaxLevel);</span></span>
<span class="line"><span>          return Response.ok(PersonAssembler.toDTO(person));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="服务接口的提供" tabindex="-1">服务接口的提供 <a class="header-anchor" href="#服务接口的提供" aria-label="Permalink to &quot;服务接口的提供&quot;">​</a></h2><p>用户接口层是前端应用与微服务应用层的桥梁，通过Facade接口封装应用服务，适配前端并提供灵活的服务，完成DO和DTO相互转换。</p><p>当应用服务接收到前端请求数据时，组装器会将DTO转换为DO。当应用服务向前端返回数据时，组装器会将DO转换为DTO。</p><h3 id="_1-facade接口" tabindex="-1">1. facade接口 <a class="header-anchor" href="#_1-facade接口" aria-label="Permalink to &quot;1\\. facade接口&quot;">​</a></h3><p>facade接口可以是一个门面接口实现类，也可以是门面接口加一个门面接口实现类。项目可以根据前端的复杂度进行选择，由于请假微服务前端功能相对简单，我们就直接用一个门面接口实现类来实现就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveApi {</span></span>
<span class="line"><span>  &amp;#64;PostMapping</span></span>
<span class="line"><span>  public Response createLeaveInfo(LeaveDTO leaveDTO){</span></span>
<span class="line"><span>          Leave leave = LeaveAssembler.toDO(leaveDTO);</span></span>
<span class="line"><span>          leaveApplicationService.createLeaveInfo(leave);</span></span>
<span class="line"><span>          return Response.ok();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;PostMapping(&quot;/query/applicant/{applicantId}&quot;)</span></span>
<span class="line"><span>  public Response queryByApplicant(&amp;#64;PathVariable String applicantId){</span></span>
<span class="line"><span>  List&amp;lt;Leave&amp;gt; leaveList = leaveApplicationService.queryLeaveInfosByApplicant(applicantId);</span></span>
<span class="line"><span>  List&amp;lt;LeaveDTO&amp;gt; leaveDTOList = leaveList.stream().map(leave -&amp;gt; LeaveAssembler.toDTO(leave)).collect(Collectors.toList());</span></span>
<span class="line"><span>          return Response.ok(leaveDTOList);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//其它方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-dto数据组装" tabindex="-1">2. DTO数据组装 <a class="header-anchor" href="#_2-dto数据组装" aria-label="Permalink to &quot;2\\. DTO数据组装&quot;">​</a></h3><p>组装类（Assembler）：负责将应用服务返回的多个DO对象组装为前端DTO对象，或将前端请求的DTO对象转换为多个DO对象，供应用服务作为参数使用。组装类中不应有业务逻辑，主要负责格式转换、字段映射等。Assembler往往与DTO同时存在。LeaveAssembler完成请假DO和DTO数据相互转换。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaveAssembler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static LeaveDTO toDTO(Leave leave){</span></span>
<span class="line"><span>        LeaveDTO dto = new LeaveDTO();</span></span>
<span class="line"><span>        dto.setLeaveId(leave.getId());</span></span>
<span class="line"><span>        dto.setLeaveType(leave.getType().toString());</span></span>
<span class="line"><span>        dto.setStatus(leave.getStatus().toString());</span></span>
<span class="line"><span>        dto.setStartTime(DateUtil.formatDateTime(leave.getStartTime()));</span></span>
<span class="line"><span>        dto.setEndTime(DateUtil.formatDateTime(leave.getEndTime()));</span></span>
<span class="line"><span>        dto.setCurrentApprovalInfoDTO(ApprovalInfoAssembler.toDTO(leave.getCurrentApprovalInfo()));</span></span>
<span class="line"><span>        List&amp;lt;ApprovalInfoDTO&amp;gt; historyApprovalInfoDTOList = leave.getHistoryApprovalInfos()</span></span>
<span class="line"><span>                .stream()</span></span>
<span class="line"><span>                .map(historyApprovalInfo -&amp;gt; ApprovalInfoAssembler.toDTO(leave.getCurrentApprovalInfo()))</span></span>
<span class="line"><span>                .collect(Collectors.toList());</span></span>
<span class="line"><span>        dto.setHistoryApprovalInfoDTOList(historyApprovalInfoDTOList);</span></span>
<span class="line"><span>        dto.setDuration(leave.getDuration());</span></span>
<span class="line"><span>        return dto;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static Leave toDO(LeaveDTO dto){</span></span>
<span class="line"><span>        Leave leave = new Leave();</span></span>
<span class="line"><span>        leave.setId(dto.getLeaveId());</span></span>
<span class="line"><span>        leave.setApplicant(ApplicantAssembler.toDO(dto.getApplicantDTO()));</span></span>
<span class="line"><span>        leave.setApprover(ApproverAssembler.toDO(dto.getApproverDTO()));</span></span>
<span class="line"><span>        leave.setCurrentApprovalInfo(ApprovalInfoAssembler.toDO(dto.getCurrentApprovalInfoDTO()));</span></span>
<span class="line"><span>        List&amp;lt;ApprovalInfo&amp;gt; historyApprovalInfoDTOList = dto.getHistoryApprovalInfoDTOList()</span></span>
<span class="line"><span>                .stream()</span></span>
<span class="line"><span>                .map(historyApprovalInfoDTO -&amp;gt; ApprovalInfoAssembler.toDO(historyApprovalInfoDTO))</span></span>
<span class="line"><span>                .collect(Collectors.toList());</span></span>
<span class="line"><span>        leave.setHistoryApprovalInfos(historyApprovalInfoDTOList);</span></span>
<span class="line"><span>        return leave;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DTO类：包括requestDTO和responseDTO两部分。</p><p>DTO应尽量根据前端展示数据的需求来定义，避免过多地暴露后端业务逻辑。尤其对于多渠道场景，可以根据渠道属性和要求，为每个渠道前端应用定义个性化的DTO。由于请假微服务相对简单，我们可以用leaveDTO代码做个示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class LeaveDTO {</span></span>
<span class="line"><span>    String leaveId;</span></span>
<span class="line"><span>    ApplicantDTO applicantDTO;</span></span>
<span class="line"><span>    ApproverDTO approverDTO;</span></span>
<span class="line"><span>    String leaveType;</span></span>
<span class="line"><span>    ApprovalInfoDTO currentApprovalInfoDTO;</span></span>
<span class="line"><span>    List&amp;lt;ApprovalInfoDTO&amp;gt; historyApprovalInfoDTOList;</span></span>
<span class="line"><span>    String startTime;</span></span>
<span class="line"><span>    String endTime;</span></span>
<span class="line"><span>    long duration;</span></span>
<span class="line"><span>    String status;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我们了解了用DDD开发出来的微服务代码到底是什么样的。你可以将这些核心设计思想逐步引入到项目中去，慢慢充实自己的DDD知识体系。我还想再重点强调的是：由于架构的演进，微服务与生俱来就需要考虑聚合的未来重组。因此微服务的设计和开发要做到未雨绸缪，而这最关键的就是解耦了。</p><p><strong>聚合与聚合的解耦：</strong> 当多个聚合在同一个微服务时，很多传统架构开发人员会下意识地引用其他聚合的实体和值对象，或者调用其它聚合的领域服务。因为这些聚合的代码在同一个微服务内，运行时不会有问题，开发效率似乎也更高，但这样会不自觉地增加聚合之间的耦合。在微服务架构演进时，如果聚合被分别拆分到不同的微服务中，原来微服务内的关系就会变成跨微服务的关系，原来微服务内的对象引用或服务调用将会失效。最终你还是免不了要花大量的精力去做聚合解耦。虽然前期领域建模和边界划分得很好，但可能会因为开发稍不注意，而导致解耦工作前功尽弃。</p><p><strong>微服务内各层的解耦：</strong> 微服务内有四层，在应用层和领域层组成核心业务领域的两端，有两个缓冲区或数据转换区。前端与应用层通过组装器实现DTO和DO的转换，这种适配方式可以更容易地响应前端需求的变化，隐藏核心业务逻辑的实现，保证核心业务逻辑的稳定，实现核心业务逻辑与前端应用的解耦。而领域层与基础层通过仓储和工厂模式实现DO和PO的转换，实现应用逻辑与基础资源逻辑的解耦。</p><p>最后我想说，DDD知识体系虽大，但你可以根据企业的项目场景和成本要求，逐步引入适合自己的DDD方法和技术，建立适合自己的DDD开发模式和方法体系。</p><p>这一期的加餐到这就结束了，希望你能对照完整代码认真阅读今天的内容，有什么疑问，欢迎在留言区与我交流！</p>`,153)])])}const g=s(l,[["render",i]]);export{u as __pageData,g as default};
