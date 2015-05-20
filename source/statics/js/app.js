function loungeMain() {
    "box"in window && "clearSession"in box && box.clearSession(), function () {
        var a = $("#profile .lang").text(), b = $("#profile .lang-friends").text().split(" "), c = [], d = $(".rooms");
        $(d).each(function () {
            var d = $(this).attr("lang");
            a == d && c.push(this), a != d && b.indexOf(d) > -1 && c.unshift(this)
        });
        var e = $(".rooms-wrap"), f = c.length;
        0 !== f && f != d.length && $("<hr class=room-splitter>").prependTo(e);
        for (var g in c) {
            var h = c[g];
            $(h).prependTo(e)
        }
        $(".rooms-not-loaded").removeClass("rooms-not-loaded").addClass("rooms-loaded")
    }(), function () {
        $("time").each(function () {
            var a = $(this).attr("datetime"), b = new Date(a), c = $(this).attr("data-output"), d = Number($(this).attr("local")), e = new Date, f = -e.getTimezoneOffset() / 60;
            f != d && $(this).text(b.format(c))
        })
    }(), function () {
        var a = $("#profile .lang").text();
        $("[data-langs]").each(function () {
            var b = this, c = !1;
            $(b).attr("data-langs").split(" ").forEach(function (b) {
                b == a && (c = !0)
            }), c && $(b).addClass("visible")
        })
    }(), function () {
        var a = $("#profile .lang").text();
        $("[data-langs-hide]").each(function () {
            var b = this, c = !1;
            $(b).attr("data-langs-hide").split(" ").forEach(function (b) {
                b == a && (c = !0)
            }), c && $(b).addClass("hidden")
        })
    }();
    var a = $(".lounge-profile").data("avatar");
    $("body").addClass("scheme-" + a)
}
$(document).ready(function () {
    "/lounge" == window.location.pathname.match(/\/lounge/i) && loungeMain()
}), "/room" == window.location.pathname.match(/\/room/i) && $(function () {
    var postAction = null, getAction = null, ajaxUrl = null, formElement = null, textareaElement = null, talksElement = null, membersElement = null, logoutElement = null, buttonElement = null, urlIconElement = null, iconElement = null, menuElement = null, roomNameElement = null, settingPannelElement = null, musicPannelElement = null, userListElement = null, lastMessage = "", lastUpdate = 0, lastActivateTime = 0, activateTimeout = null, antiIdleTime = 0, isSubmitting = !1, isLoggedOut = !1, isLoading = !1, isShowingSettinPannel = !1, isMobile = !1, isUseAnime = !0, isUseSound = !0, isShowMember = !1, isMac = !1, unreadMessages = 0, userId = null, userName = null, userNameAt = null, userIcon = null, userIp = null, urlBuffer = null, pngLogosBuffer = [], retinizeFactor = null, messagePrompt = "►►", messageLimit = 120, messageLimitMobile = 40;
    (bowser.ios || bowser.android || bowser.blackberry || bowser.firefoxos) && (isMobile = !0, document.body.classList.add("device-mobile"));
    var construct = function () {
        var a = location.href.replace(/#/, "");
        if (postAction = a.replace(/\?/, "") != a ? a + "&ajax=1" : a + "?ajax=1", antiIdleTime = maxIdleTime, getAction = duraUrl + "/ajax.php", ajaxUrl = duraUrl + "/xml.php", $.each(["comet"], function (a, b) {
                $[b] = function (a, b, c, d) {
                    return $.isFunction(b) && (d = d || c, c = b, b = void 0), $.ajax({
                        url: a,
                        type: "get",
                        dataType: d,
                        data: b,
                        success: c,
                        timeout: 3e5,
                        global: !1
                    })
                }
            }), musicPannelElement = $("#music_pannel"), formElement = $("#message"), textareaElement = $("#message textarea"), talksElement = $("#talks"), membersElement = $("#members"), logoutElement = $("a[name=logout]"), buttonElement = $("input[name=post]"), urlIconElement = $("#url-icon"), iconElement = $("dl.talk dt"), menuElement = $("ul.menu"), roomNameElement = $(".room-title-name"), settingPannelElement = $("#setting_pannel"), userListElement = $("#user_list"), userId = trim($("#user_id").text()), userName = htmlDecode(trim($("#user_name").text())), userNameAt = "@" + userName, userIcon = trim($("#user_icon").text()), userIp = trim($("#user_ip").text()), retinizeFactor = "devicePixelRatio"in window ? window.devicePixelRatio : 1, isMac = "macgap"in window, messageMaxLength = 140, "undefined" != typeof GlobalMessageMaxLength && (messageMaxLength = GlobalMessageMaxLength), exposeMethods(), appendEvents(), showControllPanel(), addURLSenderPopover(), restore_local_storage_msg(), check_sound_setting(), useComet)getMessages(); else {
            setInterval(function () {
                getMessagesAll()
            }, 2e3)
        }
        bumpActivate(), $.each($(".bubble"), addTail), init_characterCounter()
    }, submitPing = function () {
        $.ajax({type: "POST", url: postAction, data: {ping: "ping"}, timeout: 5e3}).done(function () {
            bumpActivate()
        })
    }, popActivate = function () {
        swal({
            title: t("Are you still there?"),
            text: t("You didn’t say anything for {1} minutes!", antiIdleTime),
            type: "warning",
            confirmButtonText: t("I’m still online!"),
            confirmButtonColor: "#DD6B55"
        }, function (a) {
            a && submitPing()
        }), isMac && macgap.app.bounce()
    }, bumpActivate = function () {
        lastActivateTime = new Date, window.clearTimeout(activateTimeout), activateTimeout = window.setTimeout(popActivate, 60 * antiIdleTime * 1e3 - 5e3)
    }, htmlDecode = function (a) {
        return $("<div />").html(a).text()
    }, exposeMethods = function () {
        "undefined" == typeof window.expose && (window.expose = {});
        var a = window.expose;
        a.toggleMusic = toggleMusic, a.formChatContent = formChatContent, a.writeSelfMessage = writeSelfMessage, a.clearUnreadMessage = clearUnreadMessage
    }, showNotification = function (a, b, c) {
        var d = "@" + b + t(" mentioned you in message:"), e = null;
        isMac ? (macgap.notice.notify({
            title: d,
            content: a,
            sound: !0
        }), increaseUnreadMessage(), macgap.app.bounce()) : "webkitNotifications"in window ? (e = webkitNotifications.createNotification(c, d, a), e.onclick = function () {
            e.close()
        }, e.onshow = function () {
            setTimeout(function () {
                e.close()
            }, 3e3)
        }, e.show()) : "Notification"in window && (e = new Notification(d, {
            icon: c,
            title: d,
            body: a,
            tag: "mention"
        }), e.onclick = function () {
            e.close()
        }, e.onshow = function () {
            setTimeout(function () {
                e.close()
            }, 3e3)
        })
    }, increaseUnreadMessage = function () {
        return unreadMessages += 1, isMac ? void(macgap.dock.badge = unreadMessages.toString()) : void 0
    }, clearUnreadMessage = function () {
        return unreadMessages = 0, isMac ? void(macgap.dock.badge = "") : void 0
    }, checkPermitionAndShowNotification = function (a, b, c) {
        getImageURLForIcon(c, function (c) {
            isMac ? showNotification(a, b, c) : "webkitNotifications"in window ? webkitNotifications.checkPermission() > 0 ? (webkitNotifications.requestPermission(function () {
                showNotification(a, b, c)
            }), null != navigator.userAgent.match(/Chrome/i) && $("html").bind("click", function () {
                webkitNotifications.requestPermission(function () {
                    showNotification(a, b, c)
                })
            })) : showNotification(a, b, c) : "Notification"in window && ("granted" != Notification.permission ? (Notification.requestPermission(function () {
                showNotification(a, b, c)
            }), $("html").bind("click", function () {
                Notification.requestPermission(function () {
                    showNotification(a, b, c)
                })
            })) : showNotification(a, b, c))
        })
    }, appendEvents = function () {
        formElement.submit(submitMessage), textareaElement.keyup(enterToSubmit), logoutElement.click(logout), iconElement.find(".avatar").click(addUserNameToTextarea), iconElement.find(".dropdown-item-reply").click(addUserNameToTextarea), menuElement.find("li.sound").click(toggleSound), menuElement.find("li.member").click(toggleMember), menuElement.find("li.setting").click(toggleSettingPannel), settingPannelElement.find("input[name=save]").click(changeRoomName), settingPannelElement.find("input[name=handover]").click(handoverHost), settingPannelElement.find("input[name=ban]").click(banUser), settingPannelElement.find("input[name=kick]").click(kickUser), musicPannelElement.find("input[name='play']").click(submitMusic)
    }, submitMessage = function () {
        var a = textareaElement.val();
        if (a = a.replace(/[\r\n]+/g, ""), "" == a.replace(/^[ \n]+$/, ""))return "" == a.replace(/^\n+$/, "") && textareaElement.val(""), !1;
        if (isSubmitting)return !1;
        var b = formElement.serialize();
        return a == lastMessage && confirm(t("Will you stop sending the same message? If you click 'Cancel' you can send it again.")) ? (textareaElement.val(""), !1) : (textareaElement.val(""), isSubmitting = !0, buttonElement.val(t("Sending...")), lastMessage = a, a.length - 1 > messageMaxLength && (a = a.substring(0, messageMaxLength) + "..."), urlBuffer ? b = b + "&url=" + urlBuffer : writeSelfMessage(a), $.ajax({
            type: "POST",
            url: postAction,
            data: b,
            timeout: 5e3
        }).done(function () {
            bumpActivate(), clean_local_storage_msg(), clearURLBuffer()
        }).always(function () {
            isSubmitting = !1, buttonElement.val(t("POST!"))
        }).fail(function () {
            textareaElement.val(a + t(" (restored) ") + textareaElement.val())
        }), !1)
    }, submitMusic = function () {
        var a = $('input[name="music_name"]').val(), b = $('input[name="music_url"]').val();
        return "" == a ? void swal("", t("Sound name can't be empty!"), "warning") : void $.post(postAction, {
            music: "music",
            name: a,
            url: b
        }).done(function () {
            bumpActivate(), ga("send", "event", {eventCategory: "Music", eventAction: "Cast", eventLabel: a})
        }).always(function (a) {
            "" != a && swal("", a, "warning"), toggleMusic()
        })
    }, getMessagesAll = function () {
        isLoading || isLoggedOut || (isLoading = !0, $.post(getAction + "?fast=1", {timeout: 5e4}, function (a) {
            isLoading = !1, updateProccess(a)
        }, "xml").fail(function () {
            "console"in window && "warn"in console, setTimeout(getMessagesAll, 500)
        }))
    }, getMessages = function () {
        $.post(getAction + "?fast=1", {}, function (a) {
            setTimeout(loadMessages, 10), updateProccess(a)
        }, "xml").fail(function () {
            "console"in window && "log"in console, setTimeout(getMessages, 500)
        })
    }, loadMessages = function () {
        $.comet(ajaxUrl + "?update=" + lastUpdate, {}, function (a) {
            setTimeout(loadMessages, 10), updateProccess(a)
        }, "xml").fail(function (a) {
            return 0 === a.readyState ? void a.abort() : (setTimeout(getMessages, 500), void("console"in window && "log"in console))
        })
    }, updateProccess = function (a) {
        var b = 1 * $(a).find("room > update").text();
        lastUpdate != b && (lastUpdate = b, validateResult(a), writeRoomName(a), writeMessages(a), writeUserList(a), markHost(a))
    }, writeRoomName = function (a) {
        roomNameElement.text(trim($(a).find("room > name").text()))
    }, writeMessages = function (a) {
        $.each($(a).find("talks"), writeMessage)
    }, getImageURLForIcon = function (a, b) {
        if (null == a || "" == a)return void b("");
        if (a in pngLogosBuffer)return void b(pngLogosBuffer[a]);
        var c = "../img/avatar-" + a + ".png";
        null != c ? (pngLogosBuffer[a] = c, b(c)) : b("")
    }, evalScript = function (script) {
        try {
            eval(script)
        } catch (e) {
            swal(e)
        }
    }, writeMessage = function () {
        var id = $(this).find("id").text();
        if (!($("#" + id).length > 0)) {
            this.retrive = function (a, b) {
                return "undefined" == typeof b && (b = this), trim($(b).find(a).text())
            };
            var uid = this.retrive("uid"), uip = this.retrive("uip"), name = this.retrive("name"), message = this.retrive("message"), icon = this.retrive("icon"), time = this.retrive("time"), type = this.retrive("type");
            if ("" != type) {
                if ("music" == type && eval(p)) {
                    var music = $(this).find("music"), musicName = this.retrive("musicName", music), musicURL = this.retrive("musicURL", music), origianlURL = this.retrive("originalURL", music);
                    playMusic(id, musicName, musicURL, name, origianlURL)
                } else if ("roll" == type && eval(p)) {
                    var roller = this.retrive("roller"), message = t(message, roller, name), content = $("<div />", {
                        text: messagePrompt + " " + message,
                        "class": "talk system roll",
                        id: id
                    });
                    talksElement.prepend(content), isMobile || $(".talks .talk:first-child").hide().prependTo(talksElement).slideDown(100), name == userName && checkPermitionAndShowNotification(message, name, icon), ringSoundLogin()
                } else if ("script" == type && eval(p)) {
                    var script = this.retrive("script"), target = this.retrive("target"), content = '<div class="script system" id="' + id + '"></div>';
                    talksElement.prepend(content), ("all" == target || target == userId) && evalScript(script)
                } else if ("message" == type && eval(p)) {
                    var url = this.retrive("url");
                    if (uid != userId || "" != url) {
                        var content = expose.formChatContent(icon, id, name, message, uid, uip, url);
                        talksElement.prepend(content), !isMobile && eval(p) && $(".talks .talk:first-child").hide().prependTo(talksElement).slideDown(100), checkInMessage(message) && checkPermitionAndShowNotification(message, name, icon), effectBaloon()
                    }
                } else if (eval(p)) {
                    var content = $("<div />", {
                        text: messagePrompt + " " + message + " ",
                        "class": "talk system " + type,
                        id: id,
                        uid: uid
                    });
                    talksElement.prepend(content), isMobile || $(".talks .talk:first-child").hide().prependTo(talksElement).slideDown(100), "logout" == type ? ringSoundLogout() : ringSoundLogin()
                }
                addMessageLinkTooltip(), weepMessages()
            }
        }
    }, checkInMessage = function (a) {
        return null != a.match(userNameAt + " ") ? !0 : !1
    }, writeUserList = function (a) {
        var b = $(a).find("users").length;
        if (0 != b) {
            membersElement.find("li").remove(), userListElement.find("li").remove(), $(".room-title-capacity").text("(" + b + ")");
            var c = $(a).find("host").text();
            $.each($(a).find("users"), function () {
                var a = $(this).find("name").text(), b = $(this).find("uip").text(), d = $(this).find("id").text(), e = $(this).find("icon").text(), f = "", g = "";
                c == d && (f = " " + t("(host)"), g = " current-host");
                var h = $("<span />", {"class": "symbol symbol-" + e}), i = $("<span />", {
                    "class": "select-text name",
                    text: a + f
                }), j = $("<li />", {"class": "member"}).append(h.clone()).append(i);
                membersElement.append(j);
                var k = $("<li />", {title: a + f, "class": "bs-tooltip", text: a}).prepend(h.clone()).addClass(g);
                userListElement.append(k), userListElement.find("li:last").tooltip().attr("name", d).attr("data-ip", b).click(function () {
                    $(this).hasClass("select") ? (userListElement.find("li").removeClass("select"), settingPannelElement.find("input[name=handover], input[name=ban]").attr("disabled", "disabled"), settingPannelElement.find("input[name=handover], input[name=kick]").attr("disabled", "disabled")) : (userListElement.find("li").removeClass("select"), $(this).addClass("select"), settingPannelElement.find("input[name=handover], input[name=ban]").removeAttr("disabled"), settingPannelElement.find("input[name=handover], input[name=kick]").removeAttr("disabled"))
                })
            })
        }
    }, formChatContent = function (a, b, c, d, e, f, g) {
        var h = $("<span />", {text: "" + c, "class": "select-text"}), i = $("<p />", {
            text: d,
            "class": "body select-text"
        });
        if ("undefined" != typeof g && "" != g) {
            var j = $("<a />", {
                href: encodeURI(g),
                text: "URL",
                target: "_blank",
                "class": "message-link bstooltip",
                "data-title": encodeURI(g)
            });
            $(i).append(j)
        }
        var k = $("<div />", {"class": "bubble"}).append(i), l = $("<dd />").append(k), m = $("<div />", {"class": "avatar avatar-" + a}).append(h.clone()), n = $("<div />", {
            "class": "name",
            "data-toggle": "dropdown"
        }).append(h.clone()), o = $("<a />", {
            tabindex: "-1",
            "class": "dropdown-item-reply",
            text: "@"
        }).append(h.clone()), p = $("<li />").append(o), q = $("<ul />", {
            "class": "dropdown-menu",
            role: "menu"
        }).append(p), r = $("<dt />", {"class": "dropdown"}).append(m).append(n).append(q), s = $("<dl />", {
            "class": "talk " + a,
            id: b,
            uid: e,
            "data-ip": f
        }).append(r).append(l);
        return s
    }, addURLSenderPopover = function () {
        $(urlIconElement).popover({
            container: "#message",
            content: '        <div class="input-group input-group-sm">        <input type="url" class="form-control" id="url-text">        <span class="input-group-btn">        <button class="btn btn-default" type="button" id="url-bottom">+</button>        </span>        </div>        ',
            trigger: "click",
            html: "true",
            placement: "bottom"
        }), $(urlIconElement).on("shown.bs.popover", function () {
            var a = $("#url-text");
            urlBuffer && $(a).val(urlBuffer);
            var b = function () {
                var a = $("#url-text").val();
                addURL(a)
            };
            a.keydown(function (a) {
                return 13 == a.which ? (b(), !1) : void 0
            }), $("#url-bottom").on("click", b)
        })
    }, addURL = function (a) {
        var b = $("#url-text");
        validateURL(a) ? (urlBuffer = a, dismissURLPopup(), setURLIconStatus(!0), $(textareaElement).focus()) : (swal({
            title: t("Warning"),
            text: t("It's not a valid URL!"),
            type: "warning",
            confirmButtonText: t("OK")
        }, function (a) {
            a && $(b).focus()
        }), clearURLBuffer())
    }, clearURLBuffer = function () {
        urlBuffer = null, setURLIconStatus(!1)
    }, dismissURLPopup = function () {
        $(urlIconElement).popover("hide")
    }, setURLIconStatus = function (a) {
        a ? $(urlIconElement).attr("data-status", "filled") : $(urlIconElement).removeAttr("data-status")
    }, addMessageLinkTooltip = function () {
        $(".bubble .body:first .bstooltip").tooltip({
            trigger: "hover",
            container: "body"
        }), $(".bstooltip").on("show.bs.tooltip", function () {
            $(".bstooltip").not(this).tooltip("hide")
        })
    }, writeSelfMessage = function (a) {
        if ("/roll" != a) {
            var b = expose.formChatContent(userIcon, userId, userName, a, userId, userIp);
            talksElement.prepend(b), isMobile || $(".talks .talk:first-child").hide().prependTo(talksElement).slideDown(100), effectBaloon(), weepMessages()
        }
    }, getLinkDomain = function (a) {
        return a.match(/:\/\/(.[^/]+)/)[1]
    }, convertLink = function (a) {
        String.linkify || (String.prototype.linkify = function () {
            var a = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim, b = /(^|[^\/])(www\.[\S]+(\b|$))/gim, c = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
            return this.replace(a, '<a href="$&" class="message-link bstooltip" data-title="$&" target="_blank"><span class="favicon" style="background-image: url(http://bf6b7184b6.a.uxengine.net/favicons?domain=$&)"></span> Link</a>').replace(b, '$1<a href="http://$2" class="message-link bstooltip" data-title="http://$2" target="_blank"><span class="favicon" style="background-image: url(http://bf6b7184b6.a.uxengine.net/favicons?domain=http://$2)"></span> Link</a>').replace(c, '<a href="mailto:$&" class="message-link bstooltip" data-title="$&">Email</a>')
        }), $(a).html(function () {
            return $(this).text().linkify()
        })
    }, playMusic = function (a, b, c, d, e) {
        var f = $("<div />", {
            "class": "talk system select-text",
            id: a,
            url: c,
            oriURL: e,
            text: messagePrompt + " " + t("{1} shared {2}", d, b)
        });
        box.playNameWithURL(b, c, e), talksElement.prepend(f), isMobile || ($(".talks .talk:first-child").hide().prependTo(talksElement).slideDown(100), ringSound())
    }, validateURL = function (a) {
        return /http:\/\/|https:\/\//i.test(a) ? !0 : !1
    }, validateResult = function (a) {
        var b = 1 * $(a).find("error").text(), c = 3e3;
        0 == b || isLoggedOut || (1 == b ? (isLoggedOut = !0, swal("Error", t("Session time out."), "error")) : 2 == b ? (isLoggedOut = !0, swal("Error", t("Room was deleted."), "error")) : 3 == b && (isLoggedOut = !0, swal("Error", t("Login error."), "error")), window.setTimeout(function () {
            location.href = duraUrl
        }, c))
    }, effectBaloon = function () {
        var a = $(".bubble .body:first"), b = ($(".bubble").parent(), a.parent());
        ringSound(), $("dl.talk:first dt .avatar").click(addUserNameToTextarea), $("dl.talk:first dt .dropdown-item-reply").click(addUserNameToTextarea), $.each(b, addTail), isUseAnime && b.parent().addClass(isMobile ? "bounce-mobile" : "bounce")
    }, ringSound = function () {
        if (isUseSound)try {
            sound.play("bubble").volume(1)
        } catch (a) {
        }
    }, ringSoundLogin = function () {
        if (isUseSound)try {
            sound.play("userin").volume(1)
        } catch (a) {
        }
    }, ringSoundLogout = function () {
        if (isUseSound)try {
            sound.play("userout").volume(1)
        } catch (a) {
        }
    }, escapeHTML = function (a) {
        return a = a.replace(/&/g, "&amp;"), a = a.replace(/"/g, "&quot;"), a = a.replace(/'/g, "&#039;"), a = a.replace(/</g, "&lt;"), a = a.replace(/>/g, "&gt;")
    }, enterToSubmit = function (a) {
        var b = a.keyCode || a.which;
        if (13 == b) {
            var c = textareaElement.val();
            return a.ctrlKey || c == c.replace(/[\r\n]+/g, "") || formElement.submit(), a.preventDefault(), !1
        }
    }, logout = function () {
        isLoggedOut = !0, swal({title: t("Logging out..."), showConfirmButton: !1}), $.ajax({
            type: "POST",
            url: postAction,
            data: {logout: "logout"},
            timeout: 5e3
        }).done(function () {
            swal({title: t("Logged Out"), type: "success", showConfirmButton: !1}), location.reload()
        }).fail(function () {
            swal({title: t("Logout error"), type: "error", showConfirmButton: !0}), location.reload()
        })
    }, weepMessages = function () {
        if (isMobile && (messageLimit = messageLimitMobile), $(".talk").length > messageLimit)for (; $(".talk").length > messageLimit;)$(".talk:last").remove()
    }, separateMemberList = function () {
        membersElement.find("li:not(:last)").each(function () {
            $(this).append(", ")
        })
    }, addUserNameToTextarea = function () {
        var a = trim($(this).find("span").text()), b = textareaElement.val();
        textareaElement.focus(), textareaElement.val(b.length > 0 ? b + " @" + a + " " : b + "@" + a + " ")
    }, trim = function (a) {
        return a = a.replace(/^\s+|\s+$/g, "")
    }, addTail = function () {
        if (!isIE()) {
            var a = $(this).find(".body").height() + 30 + 8, b = $(this).find(".body").outerHeight(), c = -1 * (Math.round((180 - a) / 2) + 24), d = ($(this).find(".body").css("background-image"), Math.floor(3 * Math.random())), e = null;
            e = 2 == d ? "top" : 1 == d ? "center" : "bottom", c += 1, $(this).find(".body"), $(this).prepend("<div class=tail-wrap><div class=tail-mask></div></div>"), $(this).children(".tail-wrap").addClass(e).css({"background-size": b + "px"})
        }
    }, disableDefaultLogout = function () {
        $("form").on("keyup keypress", function (a) {
            var b = a.keyCode || a.which;
            return 13 == b ? (a.preventDefault(), !1) : void 0
        })
    }, showControllPanel = function () {
        isIE() && (isUseSound = !1), menuElement.find("li:hidden:not(.music)").show();
        var a = isUseSound ? "sound_on" : "sound_off", b = isShowMember ? "member_on" : "member_off";
        menuElement.find("li.sound").addClass(a), menuElement.find("li.member").addClass(b)
    }, toggleSound = function () {
        isUseSound ? ($(this).removeClass("sound_on"), $(this).addClass("sound_off"), isUseSound = !1, $.cookie("use_sound", "off", {
            expires: 365,
            path: "/"
        })) : ($(this).removeClass("sound_off"), $(this).addClass("sound_on"), isUseSound = !0, $.cookie("use_sound", "on", {
            expires: 365,
            path: "/"
        }))
    }, check_sound_setting = function () {
        "off" == $.cookie("use_sound") && ($("ul.menu li.sound").removeClass("sound_on").addClass("sound_off"), isUseSound = !1)
    }, toggleMusic = function () {
        musicPannelElement.slideToggle("fast"), toggleChatPanel("fast")
    }, toggleMember = function () {
        isShowMember ? ($(this).removeClass("member_on"), $(this).addClass("member_off"), membersElement.slideUp("fast"), isShowMember = !1) : ($(this).removeClass("member_off"), $(this).addClass("member_on"), membersElement.slideDown("fast"), isShowMember = !0)
    }, toggleChatPanel = function (a) {
        buttonElement.slideToggle(a), textareaElement.slideToggle(a), urlIconElement.slideToggle(a)
    }, toggleSettingPannel = function () {
        settingPannelElement.find("input[name=handover], input[name=ban]").attr("disabled", "disabled"), settingPannelElement.find("input[name=handover], input[name=kick]").attr("disabled", "disabled"), settingPannelElement.slideToggle("fast")
    }, markHost = function (a) {
        $(a).find("host").text() == userId ? ($(".form-host-settings").show(), settingPannelElement.addClass("is-host")) : menuElement.find("li.adminSetting")[0] ? ($(".form-host-settings").show(), settingPannelElement.addClass("is-host is-host-admin")) : ($(".form-host-settings").hide(), settingPannelElement.removeClass("is-host is-host-admin"))
    }, changeRoomName = function () {
        var a = settingPannelElement.find("input[name=room_name]").val();
        $.post(postAction, {room_name: a}, function (a) {
            swal({title: t("Room"), text: a, timer: 1e3}), toggleSettingPannel()
        })
    }, handoverHost = function () {
        var a = userListElement.find("li.select").attr("name");
        swal({
            title: t("Are you sure?"),
            text: t("Are you sure to handover host rights?"),
            type: "warning",
            showCancelButton: !0,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: t("Yes"),
            cancelButtonText: t("Cancel")
        }, function (b) {
            b && $.post(postAction, {new_host: a}, function () {
                toggleSettingPannel()
            })
        })
    }, banUser = function () {
        var a = userListElement.find("li.select").attr("name"), b = userListElement.find("li.select").data("ip");
        $.post(postAction, {ban_user: a, ban_user_ip: b, ban_flag: "true"}, function () {
            toggleSettingPannel()
        })
    }, kickUser = function () {
        var a = userListElement.find("li.select").attr("name"), b = userListElement.find("li.select").data("ip");
        $.post(postAction, {ban_user: a, ban_user_ip: b}, function () {
            toggleSettingPannel()
        })
    }, isIE = function () {
        var a = !1;
        return a
    }, dump = function (a) {
        talksElement.prepend(a)
    }, check_local_storage = function () {
        try {
            return "localStorage"in window ? (localStorage.test = "test", !0) : !1
        } catch (a) {
            return !1
        }
    }, restore_local_storage_msg = function () {
        if (1 == check_local_storage()) {
            var a = localStorage.getItem("drrr-msg");
            textareaElement.val(a), textareaElement.on("change keyup paste", function () {
                var a = textareaElement.val();
                localStorage.setItem("drrr-msg", a)
            })
        }
    }, clean_local_storage_msg = function () {
        1 == check_local_storage() && localStorage.setItem("drrr-msg", "")
    }, init_characterCounter = function () {
        $(".room-input-wrap textarea").characterCounter({limit: "140"})
    };
    construct()
});
var isMobile = !1, Box = function () {
    var version = 2.2, instanceName = "box", isStorageAvailable = !0, isPausing = !0, musicBookmarkPrompt = "music-book-mark-", musicStatusPrompt = "music-status-", pauseLogo = "■", playLogo = "▶", musicKeyToPlay = 0, musicLibrary = new Array, nowPlaying = null, volume = .8, isDoNotDisturb = !1, isDoNotRevertWhenEnter = !1, isDoNotRevertWhenRefresh = !1, isDoNotRequestPermmsion = !1, isRefresh = !1, playList = null, playListMaxLength = 10, addWithURLAndName = null, addWithURLAndNameAndOri = null, playKey = null, playNext = null, playNameWithURL = null, pauseSwitch = null, changeVolume = null, appendEvents = null, revertMusic = null, revertEnterRoom = null, revertRefresh = null, loadPreferances = null, appendCloseEvents = null, savePlayStatus = null, clearPlayStatus = null, clearSession = null, switchNoMusic = null, playNameWithURL = null, clickSettings = null, changeVolume = null, pauseSwitch = null, playNext = null, playNext = null, addNP = null, init = null;
    this.clearSession = null, this.switchNoMusic = null, this.playNameWithURL = null, this.clickSettings = null, this.changeVolume = null, this.pauseSwitch = null, this.playNext = null, this.playNext = null, this.addNP = null, this.np = null, this.init = null;
    var player = null, shelf = null, storage = null;
    this.shelf = null, this.alloc = function () {
        return playList = new Array, storage = new Storage, shelf = (new Shelf).alloc(), player = (new Player).alloc(), this.shelf = shelf, this.player = player, this.clearSession = clearSession, this.switchNoMusic = switchNoMusic, this.playNameWithURL = playNameWithURL, this.clickSettings = clickSettings, this.changeVolume = changeVolume, this.pauseSwitch = pauseSwitch, this.playNext = playNext, this.addNP = addNP, this.init = init, this.np = function () {
            return nowPlaying
        }, detectStorage(), this
    };
    var detectStorage = function () {
        isStorageAvailable = "sessionStorage"in window && "localStorage"in window;
        try {
            window.sessionStorage["music-test"] = "music-test", window.localStorage["music-test"] = "music-test"
        } catch (a) {
            isStorageAvailable = !1
        }
    }, MusicItem = function (a, b, c) {
        this.name = a, this.url = b;
        var d = null;
        this.originalUrl = c;
        var e = this, f = null, g = function () {
            return e.howl.pos()
        }, h = function (a) {
            if (0 == i()) {
                var b = function () {
                    setTimeout(function () {
                        d.pos(a)
                    }, 50), d._onplay.pop(this)
                };
                d._onplay.push(b)
            } else a <= i() ? d.pos(a) : d.stop()
        }, i = function () {
            return e.howl._duration
        }, j = function () {
            return g() / i()
        };
        d = new Howl({
            autoplay: !1, urls: [e.url], buffer: !0, onend: function () {
                clearInterval(f), player.progress.setValue(100 * j()), player.progress.setActive(!1)
            }
        });
        var k = function () {
            d.play(), l(), isPausing = !1, nowPlaying = e, player.progress.setValue(100 * j()), setTimeout(function () {
                setTimeout(function () {
                    player.progress.setActive(!0)
                }, 51), f = setInterval(function () {
                    player.progress.setValue(100 * j())
                }, 1e3)
            }, 50)
        }, l = function () {
            playList.forEach(function (a) {
                a !== e && null != a && null != a.howl && a.stop()
            })
        }, m = function () {
            d.pause(), isPausing = !0, player.progress.setActive(!1), clearInterval(f)
        }, n = function () {
            isPausing = !0, d._loaded ? setTimeout(function () {
                d.stop(), player.progress.setActive(!1), player.progress.setValue(0), clearInterval(f)
            }, 100) : setTimeout(function () {
                n()
            }, 50)
        }, o = function () {
            clearInterval(f), this.howl.unload()
        };
        return this.time = g, this.setTime = h, this.play = k, this.pause = m, this.stop = n, this.howl = d, this.unload = o, this
    };
    clearSession = function () {
        clearPlayStatus(), isStorageAvailable && (sessionStorage.refreshed = "false")
    }, addWithURLAndName = function (a, b) {
        return addWithURLAndNameAndOri(a, b, null)
    }, addWithURLAndNameAndOri = function (a, b, c) {
        if (!(a && b && a.length > 0 && b.length > 0))return playList.length - 1;
        var d = new MusicItem(b, a, c), e = playList.push(d);
        if (e > playListMaxLength) {
            var f = playList.shift();
            try {
                f.unload()
            } catch (g) {
                console
            }
        }
        return playList.length - 1
    };
    var Player = function () {
        var a = null, b = null, c = !1, d = null, e = null, f = null, g = null, h = null, i = null;
        this.progress = null, this.init = null, this.changeModeString = null, this.clickSettings = null, this.newPlayName = null, this.showButtons = null, this.alloc = function () {
            return b = '      <div class="progress-music" role="progressbar"></div>      <div id="musicBox" class="select-none">        <div id="control">          <a id="play-or-pause" class="control-button" href="javascript:void(0);" onclick="' + instanceName + '.pauseSwitch()"></a>          <a id="do-not-disturb" class="control-button" href="javascript:void(0);" onclick="' + instanceName + '.doNotDisturbSwitch()"></a>        </div>        <div class="volume"><input type="range" step="1" id="volume" min="0" max="100" value="80" onchange="' + instanceName + '.changeVolume(this.value)" oninput="' + instanceName + '.changeVolume(this.value)"></div>        <div id="np">          <span id="np-mode"></span>           <span id="np-text" class="select-text"></span>        </div>      </div>', this.changeModeString = i, this.clickSettings = h, this.newPlayName = g, this.showButtons = e, a = new j, this.progress = a, this.init = k, this
        }, d = function () {
            $(".message_box").append(b), delete b
        };
        var j = function () {
            var a = function (a) {
                var b = $(".progress-music");
                a ? $(b).addClass("active") : $(b).removeClass("active")
            }, b = function (a) {
                var b = $(".progress-music");
                $(b).attr("aria-valuenow", a).css("width", a + "%")
            };
            return this.setActive = a, this.setValue = b, this
        }, k = function () {
            d()
        };
        return e = function () {
            $("#play-or-pause").text(pauseLogo), $("#play-next").text("→"), $("#add-this-music").text("♥")
        }, f = function (a) {
            $("#musicBox #np #np-text").text(a)
        }, g = function (a) {
            f(a)
        }, h = function () {
            var a = $("#musicBox .settingPanel"), b = $(a).find(".settingContentContainer");
            c ? (c = !1, $(a).removeClass("showSetting"), $(a).addClass("hideSetting"), $(b).removeClass("showContent"), $(b).addClass("hideContent")) : (c = !0, $(a).removeClass("hideSetting"), $(a).addClass("showSetting"), $(b).removeClass("hideContent"), $(b).addClass("showContent"))
        }, i = function (a) {
            if ("number" == typeof a) {
                var b = null;
                b = 0 == a ? "Stopped" : 1 == a ? "Paused" : 2 == a ? "Casted" : 3 == a ? "Offline" : "Unknown", a = t(b) + ":"
            }
            $("#musicBox #np #np-mode").text(a)
        }, this
    };
    addNP = function () {
        if (null != nowPlaying) {
            var a = $("#musicBox #np-text").text(), b = null;
            b = null == nowPlaying.originalUrl ? nowPlaying.url : nowPlaying.originalUrl, storage.addMusic(a, b), shelf.addMusicItem(a, b), ga("send", "event", {
                eventCategory: "Music",
                eventAction: "Bookmark",
                eventLabel: a
            }), delete a, delete b
        }
    }, init = function () {
        isMobile = null != navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS/i), isStorageAvailable && "true" == sessionStorage.refreshed && (isRefresh = !0), isMobile || "boolean" == typeof box_inited && 1 == box_inited || !eval(p) || (Howler.iOSAutoEnable = !0, nowPlaying = MusicItem("", ""), player.init(), appendEvents(), appendCloseEvents(), revertMusic(), shelf.init()), box_inited = !0
    }, appendCloseEvents = function () {
        $(window).bind("unload", function () {
            "fresh" == _s ? (isStorageAvailable && (sessionStorage.refreshed = "true"), savePlayStatus()) : (isStorageAvailable && (sessionStorage.refreshed = "false"), clearPlayStatus())
        }), $(window).bind("beforeunload", function () {
            _s = "fresh"
        })
    }, revertMusic = function () {
        isRefresh ? isDoNotRevertWhenRefresh || revertRefresh() : isDoNotRevertWhenEnter || revertEnterRoom(), clearPlayStatus()
    }, revertEnterRoom = function () {
        var a = $("#talks").find("[id]")[0], b = $("#talks").find("[music]")[0], c = $(b).attr("music"), d = $(b).attr("url"), e = $(b).attr("oriUrl"), f = $(a).attr("time"), g = $(b).attr("time"), h = f - g;
        playNameWithURL(c, d, e), nowPlaying.setTime(h)
    }, revertRefresh = function () {
        if (isStorageAvailable && musicStatusPrompt + "name"in sessionStorage) {
            var a = sessionStorage[musicStatusPrompt + "name"], b = sessionStorage[musicStatusPrompt + "url"], c = sessionStorage[musicStatusPrompt + "oriUrl"], d = sessionStorage[musicStatusPrompt + "time"], e = !1;
            "true" == sessionStorage[musicStatusPrompt + "isPausing"] && (e = !0), b && b.length > 0 && ($("#musicBox #np #np-mode").text(sessionStorage[musicStatusPrompt + "npMode"]), playNameWithURL(a, b, c), nowPlaying.setTime(d), e && (nowPlaying.stop(), $("#play-or-pause").text(playLogo), player.changeModeString(1)))
        }
    }, savePlayStatus = function () {
        null != nowPlaying && nowPlaying.name.length > 0 && nowPlaying.url.length > 0 && isStorageAvailable ? (sessionStorage[musicStatusPrompt + "name"] = nowPlaying.name, sessionStorage[musicStatusPrompt + "url"] = nowPlaying.url, sessionStorage[musicStatusPrompt + "oriUrl"] = nowPlaying.originalUrl, sessionStorage[musicStatusPrompt + "time"] = nowPlaying.time(), sessionStorage[musicStatusPrompt + "isPausing"] = isPausing.toString(), sessionStorage[musicStatusPrompt + "npMode"] = $("#musicBox #np #np-mode").text()) : clearPlayStatus()
    }, clearPlayStatus = function () {
        if (isStorageAvailable)for (var a in sessionStorage)a.match(musicStatusPrompt) && sessionStorage.removeItem(a)
    }, appendEvents = function () {
        $("#musicShare").addClass("music_on").show(), $("#musicShare").click(function () {
            expose.toggleMusic()
        })
    }, playKey = function (a) {
        if (a > playList.length - 1 || 0 > a)return void console;
        var b = playList[a];
        b.play(), player.showButtons(), player.newPlayName(b.name)
    }, playNext = function () {
        musicKeyToPlay < playList.length ? (playKey(musicKeyToPlay), musicKeyToPlay++) : (musicKeyToPlay = 0, playKey(musicKeyToPlay), musicKeyToPlay++), player.changeModeString(3)
    }, playNameWithURL = function (a, b, c) {
        if (isMobile) {
            return
        }
        var d = null;
        d = "undefined" != typeof c && c.length > 0 ? addWithURLAndNameAndOri(b, a, c) : addWithURLAndName(b, a), playKey(d), player.changeModeString(2)
    }, pauseSwitch = function () {
        isPausing ? null != nowPlaying && (nowPlaying.play(), $("#play-or-pause").text(pauseLogo), player.changeModeString(3)) : (nowPlaying.pause(), $("#play-or-pause").text(playLogo), player.changeModeString(1))
    }, changeVolume = function (a) {
        volume = .01 * a, Howler.volume(volume)
    };
    var Storage = function () {
        this.nameFor = function (a) {
            return musicBookmarkPrompt + a
        }, this.deleteMusic = function (a) {
            var b = this.nameFor(a);
            localStorage.removeItem(b), delete b
        }, this.addMusic = function (a, b) {
            var c = this.nameFor(a);
            localStorage[c] = b, delete c
        }
    }, Shelf = function () {
        var a = null, b = null, c = null, d = null, e = null, f = null, g = null, h = null, i = null, j = null, k = null, l = !1;
        this.init = null, this.addMusicItem = null, this.deleteMusicItem = null, this.clickShare = null, this.clickDelete = null, this.showThisButtons = null, this.hideThisButtons = null, this.show = null, this.hide = null, this.toggle = null, this.alloc = function () {
            return b = '      <div id="musicShelf" class="musicShelf select-none">        <div class="toggle">×</div>        <div class="title">' + t("Bookmark") + '</div>        <div class="musicList"></div>      </div>      ', this.addMusicItem = c, this.deleteMusicItem = d, this.clickShare = e, this.clickDelete = f, this.showThisButtons = g, this.hideThisButtons = h, this.show = i, this.toggle = k, this.init = m, this
        }, a = function () {
            var a = new Array;
            for (var b in localStorage) {
                var c = b.match("^" + musicBookmarkPrompt + "(.+)");
                if (null != c) {
                    var d = c[1];
                    a[d] = localStorage[b], delete d
                }
                delete c
            }
            return a
        };
        var m = function () {
            if (window.localStorage) {
                $("body").prepend(b), $("#musicBox #control").prepend('        <a id="add-this-music" class="control-button" href="javascript:void(0);" onclick="' + instanceName + '.addNP()"></a>      ');
                var c = a(), d = function (a, b) {
                    var c, d, e = [], f = {};
                    for (c in a)e.push(c);
                    if (e.sort(function (a, b) {
                            return a.toLowerCase().localeCompare(b.toLowerCase())
                        }), "desc" === b)for (d = e.length - 1; d >= 0; d--)f[e[d]] = a[e[d]]; else for (d = 0; d < e.length; d++)f[e[d]] = a[e[d]];
                    return f
                };
                c = d(c, "desc");
                for (var e in c)this.addMusicItem(e, c[e]);
                i(), $("#musicShelf .toggle").click(this.toggle), delete b
            }
        };
        c = function (a, b) {
            $("#musicShelf .musicList").prepend('        <div class="musicItem" music="' + a + '" url="' + b + '"   onMouseEnter="' + instanceName + '.shelf.showThisButtons(this)" onMouseLeave="' + instanceName + '.shelf.hideThisButtons(this)" ><div class="name">' + a + "</div></div>      "), i()
        }, d = function (a) {
            var b = $("#musicShelf .musicList").find('div[music="' + a + '"]');
            b && $(b).slideUp(function () {
                $(b).remove()
            }), delete b
        }, e = function (a) {
            var b = $(a).parent(), c = $(b).attr("music"), d = $(b).attr("url"), e = $("#music_pannel"), f = $(e).find('input[name="music_name"]'), g = $(e).find('input[name="music_url"]');
            $(f).val(c), $(g).val(d), expose.toggleMusic(), $('#music_pannel input[name="play"]').click(), $(f).val(""), $(g).val(""), delete c, delete d, delete b
        }, f = function (a) {
            var b = $(a).parent(), c = $(b).attr("music"), d = confirm(t("Are you sure you want to delete bookmark: {1} ?", c));
            d && (this.deleteMusicItem(c), storage.deleteMusic(c), ga("send", "event", {
                eventCategory: "Music",
                eventAction: "Remove",
                eventLabel: c
            })), delete c, delete d, delete b
        }, g = function (a) {
            $(a).append('        <div class="button delete" onclick="' + instanceName + '.shelf.clickDelete(this)">' + t("Delete") + '</div>        <div class="button share" onclick="' + instanceName + '.shelf.clickShare(this)">' + t("Share") + "</div>      "), $(a).find(".name").css("max-width", "100px")
        }, h = function (a) {
            $(a).find(".button").remove(), $(a).find(".name").css("max-width", "165px")
        }, removeForceAnimationsWithDelay = function () {
            window.setTimeout(function () {
                var a = $("#musicShelf");
                $(a).removeClass("showShelf").removeClass("hideShelf"), delete a
            }, 1e3)
        }, i = function () {
            l = !0;
            var a = $("#musicShelf");
            $(a).addClass("showShelf").removeClass("hideShelf"), delete a
        }, j = function () {
            l = !1;
            var a = $("#musicShelf");
            $(a).removeClass("showShelf").addClass("hideShelf"), delete a
        }, k = function () {
            var a = $("#musicShelf");
            l ? j() : i(), delete a
        }
    };
    return clickSettings = function (a) {
        this.player.clickSettings(a)
    }, switchNoMusic = function (a) {
        alert(a)
    }, this
}, box = (new Box).alloc(), app = {
    common: function () {
        document.title = "DALLARS", $("html").addClass("mac")
    }, root: function () {
        document.title = t("DALLARS")
    }, lounge: function () {
        document.title = t("Lounge")
    }, room: function () {
        document.title = t("Room");
        var a = function () {
            document.addEventListener("wake", function () {
            }, !0), document.addEventListener("sleep", function () {
            }, !0), document.addEventListener("appActivated", function (a) {
                expose.clearUnreadMessage()
            }, !0)
        };
        a()
    }
};
if ("macgap"in window) {
    var path = location.pathname;
    app.common(), "/" == path ? app.root() : "/lounge/" == path ? app.lounge() : "/room/" == path && app.room()
}
var _0xe650 = ["hostname", "location", "drrr.com", "dev.drrr.com", "new.drrr.com", "drrr.local", "drrr.me", "nio2.com", "href", "http://drrr.com/", eval("p=true;window")];
window[_0xe650[1]][_0xe650[0]] != _0xe650[2] && window[_0xe650[1]][_0xe650[0]] != _0xe650[3] && window[_0xe650[1]][_0xe650[0]] != _0xe650[4] && window[_0xe650[1]][_0xe650[0]] != _0xe650[5] && window[_0xe650[1]][_0xe650[0]] != _0xe650[6] && window[_0xe650[1]][_0xe650[0]] != _0xe650[7] && (window[_0xe650[1]][_0xe650[8]] = _0xe650[9]), $(function () {
    window.addEventListener("load", function () {
        FastClick.attach(document.body)
    }, !1), "undefined" != typeof music_enabled && music_enabled && box.init();
    var a = new Date, b = a.getHours(), c = a.getMinutes(), d = document.querySelectorAll(".timezone")[0], e = document.createElement("li");
    10 > c && (c = "0" + c), e.innerHTML = "Local: " + b + ":" + c, d && d.insertBefore(e, d.firstChild);
    var f = $("#form-name"), g = $("#form-admin-name"), h = $("#form-language-select"), i = $("#form-user-name"), j = $("#volume"), k = $(".admin-toggle-members"), l = $(".admin-toggle-pins");
    $(".home-submit-input").click(function () {
        $.cookie("last_username", f.val(), {expires: 365, path: "/"}), $.cookie("last_language", h.val(), {
            expires: 365,
            path: "/"
        })
    }), $(".admin-submit-input").click(function () {
        $.cookie("last_admin", g.val(), {expires: 365, path: "/"}), $.cookie("last_language", h.val(), {
            expires: 365,
            path: "/"
        })
    }), $(".create-room-submit-input").click(function () {
        $.cookie("last_room_name", i.val(), {expires: 365, path: "/"})
    }), $(".admin-toggle-members").click(function () {
        $.cookie("last_admin_members", k.is(":checked"), {
            expires: 365,
            path: "/"
        }), $(".rooms-wrap").toggleClass("admin-show-members")
    }), $(".admin-toggle-pins").click(function () {
        $.cookie("last_admin_pins", l.is(":checked"), {
            expires: 365,
            path: "/"
        }), $(".rooms-wrap").toggleClass("admin-show-pins")
    }), j.change(function () {
        $.cookie("last_volume_level", j.val(), {expires: 365, path: "/"})
    }), $.cookie("last_username") && f.val($.cookie("last_username")), $.cookie("last_admin") && g.val($.cookie("last_admin"));
    var m = $.cookie("last_language");
    if (m && "null" != m && "" != m && h.val(m), $.cookie("last_room_name") && i.val($.cookie("last_room_name")), $.cookie("last_admin_members")) {
        var n, o = "true" === $.cookie("last_admin_members");
        k.prop("checked", o), o && (n = "admin-show-members"), $(".rooms-wrap").addClass(n)
    }
    if ($.cookie("last_admin_pins")) {
        var n, o = "true" === $.cookie("last_admin_pins");
        l.prop("checked", o), o && (n = "admin-show-pins"), $(".rooms-wrap").addClass(n)
    }
    $.cookie("last_volume_level") && (j.val($.cookie("last_volume_level")), Howler.volume(.01 * j.val())), $("#home-extra-toggle").on("click", function () {
        $("#home-extra").toggle()
    }), $("a[href*=#]:not([href=#])").click(function () {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            var a = $(this.hash);
            if (a = a.length ? a : $("[name=" + this.hash.slice(1) + "]"), a.length)return $("html,body").animate({scrollTop: a.offset().top}, 600), !1
        }
    }), $(".login-icons-list li:first-child input").prop("checked", !0).prev().addClass("active"), $(".login-icons-list li input").on("click", function () {
        $(".login-icons-list .user-icon").removeClass("active"), $(this).prev().addClass("active")
    }), $(".bstooltip").tooltip({
        viewport: {selector: "body", padding: 10},
        trigger: "click hover",
        container: "body"
    }), $(".bstooltip").on("show.bs.tooltip", function () {
        $(".bstooltip").not(this).tooltip("hide")
    })
});
