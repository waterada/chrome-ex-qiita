//----------------------
$(function () {
    //-------------------------------------------------------------------
    //スライド
    ChEx.matchLink('/qiita.com/', function () {
        const $body = $('body');
        $body.append(`<style>
            /* 赤や青で強調 */
            .slide_preview.markdownContent strong { color: red; }
            .slide_preview.markdownContent em { color: blue; }
            
            /* 選択エリアを黄色に */
            .slide_preview.markdownContent ::selection { background: yellow; color: black; }
            .slide_preview.markdownContent .chex-line-num::selection { background: #f7f7f7; color: black; }
        </style>`);

        let $frame = $('.slide_preview.markdownContent');
        if ($frame.length === 0) return;

        ChEx.keydown('L', '行番号オン/オフ', () => {
            let $preList = $frame.find('pre');
            ChEx.toggle('lineNum', () => {
                $preList.each(function () {
                    let $pre = $(this);
                    let html = $pre.html();
                    let i = 1;
                    html = html.trim().replace(/^/gm, () => `<span class="chex-line-num">${ChEx.padding(i++, 3)}| </span>`);
                    $pre.html(html);
                });
            }, () => {
                $preList.find('.chex-line-num').remove();
            });
        });

        ChEx.keydown('B', '大きなカーソル', () => {
            $frame.toggleClass('chex-big-cursor');
        });
        //noinspection CssUnusedSymbol
        $body.append(`<style>
            .slide_preview.markdownContent.chex-big-cursor,
            .slide_preview.markdownContent.chex-big-cursor img,
            .slide_preview.markdownContent.chex-big-cursor pre { cursor: url(https://waterada.github.io/chrome-ex-qiita/big-cursor.png), auto; }
        </style>`);

        ChEx.keydown('I', '画像の外枠表示', () => {
            $('.slide_preview.markdownContent img').toggleClass('chex-img-border');
        });
        //noinspection CssUnusedSymbol
        $body.append(`<style>
            .slide_preview.markdownContent img.chex-img-border { border: solid 4px silver; padding: 10px; margin: 10px; }
        </style>`);

        // //画像の高さが大きい場合、画面サイズに収まるように
        // ChEx.onChangeDom($frame, function () {
        //     $('.slide_preview.markdownContent img').each(function (i, img) {
        //         let $img = $(img);
        //         let w = $img.width();
        //         let h = $img.height();
        //         let H = $frame.height() * 0.8;
        //         if (H < h) {
        //             $img.css({ width: `${parseInt(H * w / h)}px`, height: `${parseInt(H)}px` });
        //         }
        //     });
        // });

        ChEx.keydown('Q', 'スライドコントローラのオン/オフ', () => {
            $('.slide_controller').toggle();
        });

        ChEx.keydownHelp('H', $frame.offset());

        //h1で半角スペース２つなら改行
        $body.append(`<style>
            /* h1 で改行(チラツキ防止のため初め非表示) */
            .slide_preview.markdownContent h1:only-child { display: none; }
            .slide_preview.markdownContent .slide_preview_firstSlide h1 { display: block; }
        </style>`);
        ChEx.onChangeDom($frame, function () {
            $frame.find('h1').each(function () {
                let $h1 = $(this);
                $h1.html($h1.html().replace(/ {2}/g, '<br/>')).show();
            });
        });
    });
});
