const ChEx = {};

/** html escape */
ChEx.h = function (str) {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    return str;
};

/**
 * ３桁区切り＆パディング＆左右寄せ
 * @param num     - 数値なら３桁区切り。文字列でもいい
 * @param length  - (省略可)この桁数までパディングする。マイナスなら左寄せ
 * @param char    - (省略可)パディングで埋める文字。デフォルトは空白
 * @param decimal - (省略可)表示させたい小数桁
 */
ChEx.padding = function (num, length, char, decimal) {
    if (!num.replace) { //文字列か
        if (decimal) {
            num = num.toLocaleString('ja-JP', { minimumFractionDigits: decimal, maximumFractionDigits: decimal });
        } else {
            num = num.toLocaleString();
        }
    }
    if (length) {
        char = char || ' ';
        if (length > 0) {
            num = char.repeat(length) + num;
            num = num.slice(-length);
        } else {
            num = num + char.repeat(-length);
            num = num.slice(0, -length);
        }
    }
    return num;
};

/** リンクが一致したらcallbackを実行。* は .*? として扱われ、(*) は callback の引数に中味が渡る */
ChEx.matchLink = function(condition, callback) {
    let url = location.href;
    condition = condition.replace(/([.?+\/])/g, '\\$1').replace(/\*/g, '.*?');
    condition = new RegExp(condition);
    url.replace(condition, (hit, a, b, c, d) => {
        callback(a, b, c, d);
    });
};

/** 下位のDOMが変更されたら */
ChEx.onChangeDom = function ($root, callback) {
    let timeoutId = 0;
    $root.on("DOMNodeInserted DOMSubtreeModified", function () {
        if (timeoutId) return true; //動いていたらやらない
        timeoutId = setTimeout(function () {
            try {
                callback($root);
            } finally {
                timeoutId = 0;
            }
            return true;
        }, 100);
    });
};

/** トグルでコールバックを実行する */
ChEx.__toggle = {};
ChEx.toggle = function(key, a, b) {
    ChEx.__toggle[key] = !ChEx.__toggle[key];
    if (ChEx.__toggle[key]) {
        a(true);
    } else if (b) {
        b();
    } else {
        a(false);
    }
};

/** ショートカットキーを追加 */
ChEx.__keydown_KEYS = {
    BS: 8,
    '<': 188,
    '>': 190,
    '?': 191,
    '/': 191,
};
ChEx.__keydown_handlers = null;
ChEx.__keydown_helps = null;
ChEx.keydown = function (key, label, callback) {
    //初回のみ行う
    if (!ChEx.__keydown_handlers) {
        ChEx.__keydown_handlers = {};
        ChEx.__keydown_helps = [];
        //イベント設置
        $(document).keydown(function (e) {
            if ($('textarea,input').is(':focus')) return;
            let code = e.which;
            let handler = ChEx.__keydown_handlers[code];
            if (handler) {
                handler(e);
            }
            //console.log(`${code}:${String.fromCharCode(code)}`);
        });
    }
    //設定
    ChEx.__keydown_handlers[ChEx.__keydown_KEYS[key] || key.charCodeAt(0)] = callback;
    if (label) {
        ChEx.__keydown_helps.push({ key, label });
    }
};
ChEx.keydownHelp = function (key, parentPosition) {
    ChEx.keydown(key || 'H', '', function () {
        const $body = $('body');
        ChEx.toggle('keydown-help', () => {
            let p = parentPosition || $body.position();
            $body.append(
                $(`<pre id='chex-keydown-help' style="position: fixed; left: ${p.left + 20}px; top: ${p.top + 20}px; padding: 10px; background-color: white; border: 3px solid black; z-index: ${Number.MAX_SAFE_INTEGER};"></pre>`).append(
                    ChEx.__keydown_helps.map(h => `<b>${ChEx.h(h.key)}</b> : ${ChEx.h(h.label)}<br/>`)
                )
            );
        }, () => {
            $('#chex-keydown-help').remove();
        });
    });
};
