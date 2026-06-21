# 电影如何让世界运转 · 图像资产提示词

本项目已使用内置图像模型生成并接入以下 16:9 氛围资产。提示词刻意避开电影海报、具体演员与可识别剧照，保留课堂答辩需要的「电影空间」而不是版权素材的替身。

| 路径 | 用途 | 已使用提示词要点 |
| --- | --- | --- |
| `public/assets/home-cinema.png` | 首页放映厅 | 空无一人的旧电影院、投影机、灰尘中的光束、硬币/墓碑/灯泡三个细小象征物、35mm 颗粒、无文字。 |
| `public/assets/no-country-desert.png` | 《老无所依》 | 原创荒漠公路、远方反光、极大留白、冷枯黄晨光、安静的新西部片气质、无人物无文字。 |
| `public/assets/gbu-cemetery.png` | 《黄金三镖客》 | 原创荒漠墓地圆形空地、三个无名黑色剪影构成三角、长阴影、35mm 西部片语法、无武器无文字。 |
| `public/assets/jazz-backstage.png` | 《爵士春秋》 | 1970 年代后台化妆镜、暖灯泡、冷色舞台光从门缝进入、无人物、疲惫又华丽、无文字。 |

## 后续可补充资产

若要在答辩现场进一步加强层次，可按下列提示词生成并替换（不要在图片里生成文字）：

1. **硬币局部**：`an aged silver coin floating in black negative space, microscopic scratches, one hard rim light, restrained 35mm cinema still, no symbols that resemble real currency, no text, no watermark`
2. **三名角色独立剪影**：`three separate anonymous western traveller silhouettes, each on a perfectly flat magenta chroma-key background, full body, distant 19th-century costume, no weapons, no faces, no text`
3. **舞台心电白线**：`a single thin white theatre follow-spot across deep black stage curtains, a faint red pulse glow below it, abstract photographic light exposure, no words, no UI`
4. **通用光漏叠层**：`abstract analog 35mm film burn and dust, delicate amber edge flare, mostly transparent-looking black field, no frame, no text`

## 生成约束

- 始终使用 16:9、无文字、无水印、无商业海报构图。
- 人物应保持无名、远景或剪影，避免生成具体演员脸部。
- 图像只承担空间、光线与情绪；论点和交互由网页完成。
