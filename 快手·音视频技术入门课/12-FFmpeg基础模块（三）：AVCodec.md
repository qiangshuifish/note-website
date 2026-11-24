# 12-FFmpeg基础模块（三）：AVCodec

你好，我是刘歧。

前面两节课我们学习了 AVFormat、AVIO、dict 和 opt 操作接口，做容器格式封装与解封装问题不大，但是如果要涉及音视频的编解码的话，就需要用到 AVCodec 部分的接口了。

AVCodec 是存储编解码器信息的结构体，当我们使用编解码器的时候会用到 AVCodec，而FFmpeg 除了 AVCodec 结构体之外，还有一个 AVCodecContext，是 FFmpeg 内部流程中处理编解码时，用来记录和存储上下文的结构体。关于 AVCodecContext 这个结构体的参数，如果你学习第 7 节课 FFmpeg 常用参数的时候，仔细阅读过帮助信息的话，那AVCodecContext 这个结构体对你来说应该很好理解。

## AVCodec 接口

在使用 FFmpeg 的编解码器之前，首先需要找到编解码器。

```javascript
const AVCodec *avcodec_find_decoder(enum AVCodecID id);
const AVCodec *avcodec_find_decoder_by_name(const char *name);
const AVCodec *avcodec_find_encoder(enum AVCodecID id);
const AVCodec *avcodec_find_encoder_by_name(const char *name);
```

如代码所示，找到编码器和解码器有两种方式，一种是通过 AVCodecID 来查找，一种是通过字符串来查找，字符串就是编码器或解码器的名称，例如 libx264。

这里需要注意的是，如果编码器和解码器的 find 接口使用得没有问题，用avcodec_find_decoder 查找编码器的话，在这里可能能找到 AVCodec，但是在后续用来做编码的时候会报错。

通常我们也可以在做编码操作之前，调用接口 av_codec_is_encoder 来确认当前拿到的AVCodec 是不是编码器，或者通过 av_codec_is_decoder 来确认是不是解码器。

找到 AVCodec 之后，最好不要直接使用，推荐的做法是与 FFmpeg 内部流程中的AVCodecContext 建立关联。

```javascript
AVCodecContext *avcodec_alloc_context3(const AVCodec *codec);
void avcodec_free_context(AVCodecContext **avctx);
```

从示例代码中可以看到，AVCodec 与 AVCodecContext 可以通过 avcodec_alloc_context3 接口来申请并建立关联，因为涉及内存申请操作，所以用完之后需要使用 avcodec_free_context释放资源。

申请完 AVCodecContext 上下文之后，接下来可以打开编码器或者解码器了。

```javascript
int avcodec_open2(AVCodecContext *avctx, const AVCodec *codec, AVDictionary **opt
```

你应该已经发现了，这个 avcodec_open2 有三个参数，第一个是 AVCodecContext，它是处理编解码时，用来记录和存储上下文的结构体，第三个参数是 AVDictionary，这个参数用来设置 AVCodec 编码器或者解码器内部的参数，可以使用 ffmpeg -h encoder=libx264 查看libx264 的内部可设置的参数，AVDictionary 和 AVOption 的设置方式，我们在上一节课已经讲过了，这里就不过多介绍了。

好了，我们该说道说道这第二个参数了，前面我们不是已经在 avcodec_alloc_context3 将AVCodec 与 AVCodecContext 建立过关联了吗，这里怎么还需要传递一个 AVCodec 呢？你想得没错，这里可以不传递了，设置为 NULL 就可以了。如果想要关闭编码器，推荐你使用avcodec_free_context 来做一次释放，这样比较干净，因为 avcodec_free_context 里面已经有 avcodec_close 操作了。

### 编码和解码的操作接口

好了，说完编解码的前置操作，接下来进入正题，我们看一看编码和解码的操作接口。

```javascript
int avcodec_send_packet(AVCodecContext *avctx, const AVPacket *avpkt);
int avcodec_receive_frame(AVCodecContext *avctx, AVFrame *frame);
int avcodec_send_frame(AVCodecContext *avctx, const AVFrame *frame);
int avcodec_receive_packet(AVCodecContext *avctx, AVPacket *avpkt);
```

这是两组接口，avcodec_send_packet 与 avcodec_receive_frame 是用来做解码的组合，avcodec_send_frame 与 avcodec_receive_packet 是用来做编码的组合。

大多数场景下，可以调用一次 avcodec_send_packet，将 AVPacket 送到解码器里，然后avcodec_receive_frame 读取一次 AVFrame，但是稳妥起见，avcodec_receive_frame 有时候会返回 EAGAIN，所以我们还需要确认读全了 AVframe，再做 avcodec_receive_frame 操作。

FFmpeg 旧版本其实是用 avcodec_decode_video2 和 avcodec_decode_audio4 来做的音视频的解码，从 2016 年 04 月 21 日开始，FFmpeg 新增了 avcodec_send_packet 和avcodec_receive_frame 这样的组合解码与组合编码接口，主要是为了解决一个 AVPacket 中包含多个视频帧或者音频包的情况。

如果解码结束，给 avcodec_send_packet 写一个 NULL 的 AVPacket 包就可以了。编码的话，给 avcodec_send_frame 设置 AVFrame 为 NULL 就表示编码结束了。

## 关键参数 AVPacket

在 AVFormat 和 AVCodec 之间有一个关键的参数，就是我们这几节课频繁见到的AVPacket。AVPacket 的内容构建也有一系列的接口需要我们了解，构造 AVPacket 内容的时候用这些接口会非常方便，下面我来介绍一下。

如果你想使用 AVPacket 的话，可以通过 av_packet_alloc 来申请一个 AVPacket。

```
AVPacket *av_packet_alloc(void);
```

但这次申请的只是一个 AVPacket 的内存空间，里面的 buf 和 data 的内存空间不会被申请。如果想要申请 buf 和 data 的空间的话，可以考虑在 av_packet_alloc 之后使用av_new_packet 来解决。

```
int av_new_packet(AVPacket *pkt, int size)
```

当使用 av_new_packet 申请带 buf 和 data 的 AVPacket 的时候，需要给 av_new_packet 传递一个要申请的 buf 空间大小的值。

通过 av_packet_alloc 申请的 AVPacket 需要用 av_packet_free 来释放申请的内存空间。当然，av_new_packet 申请的 buf 在 av_packet_free 里也会一并释放。

这个时候你可能会有个疑问。诶？不对啊，我如果按照 AVIOContext 的操作方式，自己从内存中读到一段数据，想挂到 AVPacket 做解码，这个时候如果用 av_new_packet 申请内存是不是不太对？你想的是对的，这个时候可以不用 av_new_packet 来申请 buf 或者 data 的内存空间，但是前面 av_packet_alloc 还是需要的，只是这里的 buf 或者 data 如果想要指向第三方data 内存区域的话，最好还是使用 av_packet_from_data。

```
int av_packet_from_data(AVPacket *pkt, uint8_t *data, int size);
```

为什么推荐使用 av_packet_from_data 做 data 挂载，而不是直接把 AVPacket 的 data、buf指到我们自己读到的 data 内存空间呢？

其实主要是因为你在使用 FFmpeg 的 API，所以最好还是用 FFmpeg 提供的接口走 FFmpeg自己内部的流程。并不是说不能自己手动处理，而是为了避免很多不必要的问题不这样做，比如你把 data 指向你自己申请的内存空间，那么很有可能会缺少 data 指向 buf，然后那个 buf是有 PADDING 空间预留的。

```
   pkt->buf = av_buffer_create(data, size + AV_INPUT_BUFFER_PADDING_SIZE,
                               av_buffer_default_free, NULL, 0);
```

这个 AV_INPUT_BUFFER_PADDING_SIZE 能解决很重要的问题，尤其是在后续做 packet里面的 data 分析的时候，可能会出现 crash。因为 FFmpeg 内部的 parser 在解析 data 的时候做了一些优化，但是会有一些额外的开销，FFmpeg 的 codec 模块会预读一段数据，这个时候可能会因为内存越界出现 crash 错误。

```
/**
* @ingroup lavc_decoding
* Required number of additionally allocated bytes at the end of the input bitstr
* This is mainly needed because some optimized bitstream readers read
* 32 or 64 bit at once and could read over the end.<br>
* Note: If the first 23 bits of the additional bytes are not 0, then damaged
* MPEG bitstreams could cause overread and segfault.
*/
#define AV_INPUT_BUFFER_PADDING_SIZE 64
```

说到对音视频流做 parser，我们可以大概了解一下。

```javascript
AVCodecParserContext *av_parser_init(int codec_id);
int av_parser_parse2(AVCodecParserContext *s,
                    AVCodecContext *avctx,
                    uint8_t **poutbuf, int *poutbuf_size,
                    const uint8_t *buf, int buf_size,
                    int64_t pts, int64_t dts,
                    int64_t pos);
void av_parser_close(AVCodecParserContext *s);
```

有些音视频的编码数据，是会把一部分数据相关的头信息存储在 AVPacket 的 data 中的，这个时候可以使用 parser 来做解析，获得相关的 codec 信息。如果你想要知道哪些 codec 有parser 的话，可以在编译 FFmpeg 代码那一步就通过./configure --list-parsers 来查看。

比如说 H.264 的数据，可以通过 parser 来得到编码数据的 NALUnit 信息，我们在第 6 节课的时候讲过 ffprobe -show_frames 可以看到音视频流的 frames 信息，parser 解析出来有一些信息是在这个 frames 里面展示出来的。这些信息也主要用来传给解码器作为解码处理的一个参考。

## 小结

我们来回顾一下这节课我们都学到了哪些内容。

- AVCodec 中编解码相关的 API 接口：avcodec_send_packet 与 avcodec_receive_frame、avcodec_send_frame 与 avcodec_receive_packet，两组用来做编解码的组合接口。

- 关键参数 AVPacket，贯穿 Codec 与 Format 模块的始终，无论是处理已有的内存数据，还是按照 FFmpeg 内部框架流程建立的数据，都可以应对自如。

Codec 和 Format 之间还有更多的可操作系统的方法，你可以参考 FFmpeg 提供的例子加深理解。还记得第 10 节课我推荐你下载 FFmpeg 的源代码吗？下载源代码以后，你可以在源代码目录的 doc/examples 目录下看到更全面的 FFmpeg 的 API 用例。

## 思考题

如果解码以后我想给视频添加一些特效，在 AVCodec 操作以后应该使用哪个结构体里面的内容呢？欢迎你在评论区分享你的想法，也欢迎你把这节课分享给对音视频感兴趣的朋友，我们下节课再见！
