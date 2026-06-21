# 电影如何让世界运转 · 音乐与声音 Cue Sheet

音频现在按 scene cue 而不是按章节整段铺底。代码已预留 `public/audio/` 下的真实音轨路径，并实现 850ms 淡入 / 500ms 淡出的 crossfade；没有放入授权音源时，才使用低声部的临时声音纹理作为不打扰演示的 fallback。

| Scene cue | 预留文件 | 进入时机 | 视觉联动 |
| --- | --- | --- | --- |
| `wind` | `no-country-wind.mp3` | 荒漠 / 地平线 | 沙尘慢移，画面留白。 |
| `coin` | `no-country-coin.mp3` | Call it | 硬币高光、短促闪白。 |
| `dream` | `no-country-dream.mp3` | 门与远火 | 门框与火点从黑中显影。 |
| `main-title` | `gbu-main-title.mp3` | 骑手 / 眼部 | 热浪与准星出现。 |
| `soldier` | `gbu-story-of-a-soldier.mp3` | 墓地 / 行进 | 景别变稳、等待拉长。 |
| `gold` | `gbu-ecstasy-of-gold.mp3` | 奔跑高潮 | 金色饱和度、尘雾、镜头推进提升。 |
| `trio` | `gbu-trio.mp3` | 三人对峙 | 三点锁定、画面降速。 |
| `backstage` | `jazz-backstage.mp3` | 后台 / 身体准备 | 镜面反光跟随鼠标。 |
| `showtime` | `jazz-take-off-with-us.mp3` | 排练 / 舞台 | 光强提升、镜头呼吸。 |
| `applause` | `jazz-applause.mp3` | 掌声 | 高光过曝、颗粒增强。 |
| `white` | `jazz-bye-bye-life.mp3` | 白线结尾 | 音乐抽空，白线横穿画面。 |

## 接入真实音频

1. 只放入有权在答辩中使用的短剪辑（建议 8–20 秒）。
2. 将文件按表中名称放进 `public/audio/`。
3. 在浏览器控制台或入口脚本设置 `window.FILM_AUDIO_ENABLED = true`，页面即使用真实文件并自动 crossfade。
4. 公开仓库不要提交不具备公开发布权的版权音乐；可在本地答辩副本单独放入文件。

首次点击或滚动后的首次交互才会启动声音；`M` 控制声音开关。
