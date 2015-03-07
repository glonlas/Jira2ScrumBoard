/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 4.1.8
 *
 * File input styled for Bootstrap 3.0 that utilizes HTML5 File Input's advanced 
 * features including the FileReader API. 
 * 
 * The plugin drastically enhances the HTML file input to preview multiple files on the client before
 * upload. In addition it provides the ability to preview content of images, text, videos, audio, html, 
 * flash and other objects. It also offers the ability to upload and delete files using AJAX, and add 
 * files in batches (i.e. preview, append, or remove before upload).
 * 
 * Author: Kartik Visweswaran
 * Copyright: 2015, Kartik Visweswaran, Krajee.com
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
(function ($) {
    "use strict";
    String.prototype.repl = function (from, to) {
        return this.split(from).join(to);
    };
    var isIE = function (ver) {
            var div = document.createElement("div"), status;
            div.innerHTML = "<!--[if IE " + ver + "]><i></i><![endif]-->";
            status = (div.getElementsByTagName("i").length === 1);
            document.body.appendChild(div);
            div.parentNode.removeChild(div);
            return status;
        },
        getNum = function(num, def) {
            def = def || 0;
            if (typeof num === "number") {
                return num;
            }
            if (typeof num === "string") {
                num = parseFloat(num);
            }
            return isNaN(num) ? def : num;
        },
        hasFileAPISupport = function () {
            return window.File && window.FileReader;
        },
        hasDragDropSupport = function () {
            var $div = document.createElement('div');
            return !isIE(9) && ($div.draggable !== undefined || ($div.ondragstart !== undefined && $div.ondrop !== undefined));
        },
        hasFileUploadSupport = function () {
            return hasFileAPISupport && window.FormData;
        },
        addCss = function ($el, css) {
            $el.removeClass(css).addClass(css);
        },
        STYLE_SETTING = 'style="width:{width};height:{height};"',
        OBJECT_PARAMS = '      <param name="controller" value="true" />\n' +
            '      <param name="allowFullScreen" value="true" />\n' +
            '      <param name="allowScriptAccess" value="always" />\n' +
            '      <param name="autoPlay" value="false" />\n' +
            '      <param name="autoStart" value="false" />\n' +
            '      <param name="quality" value="high" />\n',
        DEFAULT_PREVIEW = '<div class="file-preview-other">\n' +
            '       {previewFileIcon}\n' +
            '   </div>',
        defaultFileActionSettings = {
            removeIcon: '<i class="glyphicon glyphicon-trash text-danger"></i>',
            removeClass: 'btn btn-xs btn-default',
            removeTitle: 'Remove file',
            uploadIcon: '<i class="glyphicon glyphicon-upload text-info"></i>',
            uploadClass: 'btn btn-xs btn-default',
            uploadTitle: 'Upload file',
            indicatorNew: '<i class="glyphicon glyphicon-hand-down text-warning"></i>',
            indicatorSuccess: '<i class="glyphicon glyphicon-ok-sign file-icon-large text-success"></i>',
            indicatorError: '<i class="glyphicon glyphicon-exclamation-sign text-danger"></i>',
            indicatorLoading: '<i class="glyphicon glyphicon-hand-up text-muted"></i>',
            indicatorNewTitle: 'Not uploaded yet',
            indicatorSuccessTitle: 'Uploaded',
            indicatorErrorTitle: 'Upload Error',
            indicatorLoadingTitle: 'Uploading ...'
        },
        tMain1 = '{preview}\n' +
            '<div class="kv-upload-progress hide"></div>\n' +
            '<div class="input-group {class}">\n' +
            '   {caption}\n' +
            '   <div class="input-group-btn">\n' +
            '       {remove}\n' +
            '       {cancel}\n' +
            '       {upload}\n' +
            '       {browse}\n' +
            '   </div>\n' +
            '</div>',
        tMain2 = '{preview}\n<div class="kv-upload-progress hide"></div>\n{remove}\n{cancel}\n{upload}\n{browse}\n',
        tPreview = '<div class="file-preview {class}">\n' +
            '    <div class="close fileinput-remove">&times;</div>\n' +
            '    <div class="{dropClass}">\n' +
            '    <div class="file-preview-thumbnails">\n' +
            '    </div>\n' +
            '    <div class="clearfix"></div>' +
            '    <div class="file-preview-status text-center text-success"></div>\n' +
            '    <div class="kv-fileinput-error"></div>\n' +
            '    </div>\n' +
            '</div>',
        tIcon = '<span class="glyphicon glyphicon-file kv-caption-icon"></span>',
        tCaption = '<div tabindex="-1" class="form-control file-caption {class}">\n' +
            '   <span class="file-caption-ellipsis">&hellip;</span>\n' +
            '   <div class="file-caption-name"></div>\n' +
            '</div>',
        tModal = '<div id="{id}" class="modal fade">\n' +
            '  <div class="modal-dialog modal-lg">\n' +
            '    <div class="modal-content">\n' +
            '      <div class="modal-header">\n' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n' +
            '        <h3 class="modal-title">Detailed Preview <small>{title}</small></h3>\n' +
            '      </div>\n' +
            '      <div class="modal-body">\n' +
            '        <textarea class="form-control" style="font-family:Monaco,Consolas,monospace; height: {height}px;" readonly>{body}</textarea>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '</div>',
        tProgress = '<div class="progress">\n' +
            '    <div class="{class}" role="progressbar"' +
            ' aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n' +
            '        {percent}%\n' +
            '     </div>\n' +
            '</div>',
        tFooter = '<div class="file-thumbnail-footer">\n' +
            '    <div class="file-caption-name">{caption}</div>\n' +
            '    {actions}\n' +
            '</div>',
        tActions = '<div class="file-actions">\n' +
            '    <div class="file-footer-buttons">\n' +
            '        {upload}{delete}{other}' +
            '    </div>\n' +
            '    <div class="file-upload-indicator" tabindex="-1" title="{indicatorTitle}">{indicator}</div>\n' +
            '    <div class="clearfix"></div>\n' +
            '</div>',
        tActionDelete = '<button type="button" class="kv-file-remove {removeClass}" ' +
            'title="{removeTitle}"{dataUrl}{dataKey}{dataIndex}>{removeIcon}</button>\n',
        tActionUpload = '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">' +
            '   {uploadIcon}\n</button>\n',
        tGeneric = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
            '   {content}\n' +
            '   {footer}\n' +
            '</div>\n',
        tHtml = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
            '    <object data="{data}" type="{type}" width="{width}" height="{height}">\n' +
            '       ' + DEFAULT_PREVIEW + '\n' +
            '    </object>\n' +
            '   {footer}\n' +
            '</div>',
        tImage = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
            '   <img src="{data}" class="file-preview-image" title="{caption}" alt="{caption}" ' + STYLE_SETTING + '>\n' +
            '   {footer}\n' +
            '</div>\n',
        tText = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n' +
            '   <div class="file-preview-text" title="{caption}" ' + STYLE_SETTING + '>\n' +
            '       {data}\n' +
            '   </div>\n' +
            '   {footer}\n' +
            '</div>',
        tVideo = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}"' +
            ' title="{caption}" ' + STYLE_SETTING + '>\n' +
            '   <video width="{width}" height="{height}" controls>\n' +
            '       <source src="{data}" type="{type}">\n' +
            '       ' + DEFAULT_PREVIEW + '\n' +
            '   </video>\n' +
            '   {footer}\n' +
            '</div>\n',
        tAudio = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}"' +
            ' title="{caption}" ' + STYLE_SETTING + '>\n' +
            '   <audio controls>\n' +
            '       <source src="' + '{data}' + '" type="{type}">\n' +
            '       ' + DEFAULT_PREVIEW + '\n' +
            '   </audio>\n' +
            '   {footer}\n' +
            '</div>',
        tFlash = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}"' +
            ' title="{caption}" ' + STYLE_SETTING + '>\n' +
            '   <object type="application/x-shockwave-flash" width="{width}" height="{height}" data="{data}">\n' +
            OBJECT_PARAMS + '       ' + DEFAULT_PREVIEW + '\n' +
            '   </object>\n' +
            '   {footer}\n' +
            '</div>\n',
        tObject = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}"' +
            ' title="{caption}" ' + STYLE_SETTING + '>\n' +
            '   <object data="{data}" type="{type}" width="{width}" height="{height}">\n' +
            '       <param name="movie" value="{caption}" />\n' +
            OBJECT_PARAMS + '         ' + DEFAULT_PREVIEW + '\n' +
            '   </object>\n' +
            '   {footer}\n' +
            '</div>',
        tOther = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}"' +
            ' title="{caption}" ' + STYLE_SETTING + '>\n' +
            '   ' + DEFAULT_PREVIEW + '\n' +
            '   {footer}\n' +
            '</div>',
        defaultLayoutTemplates = {
            main1: tMain1,
            main2: tMain2,
            preview: tPreview,
            icon: tIcon,
            caption: tCaption,
            modal: tModal,
            progress: tProgress,
            footer: tFooter,
            actions: tActions,
            actionDelete: tActionDelete,
            actionUpload: tActionUpload
        },
        defaultPreviewTemplates = {
            generic: tGeneric,
            html: tHtml,
            image: tImage,
            text: tText,
            video: tVideo,
            audio: tAudio,
            flash: tFlash,
            object: tObject,
            other: tOther
        },
        defaultPreviewTypes = ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],
        defaultPreviewSettings = {
            image: {width: "auto", height: "160px"},
            html: {width: "213px", height: "160px"},
            text: {width: "160px", height: "160px"},
            video: {width: "213px", height: "160px"},
            audio: {width: "213px", height: "80px"},
            flash: {width: "213px", height: "160px"},
            object: {width: "160px", height: "160px"},
            other: {width: "160px", height: "160px"}
        },
        defaultFileTypeSettings = {
            image: function (vType, vName) {
                return (vType !== undefined) ? vType.match('image.*') : vName.match(/\.(gif|png|jpe?g)$/i);
            },
            html: function (vType, vName) {
                return (vType !== undefined) ? vType === 'text/html' : vName.match(/\.(htm|html)$/i);
            },
            text: function (vType, vName) {
                return (vType !== undefined && vType.match('text.*')) || vName.match(/\.(txt|md|csv|nfo|php|ini)$/i);
            },
            video: function (vType, vName) {
                return (vType !== undefined && vType.match(/\.video\/(ogg|mp4|webm)$/i)) || vName.match(/\.(og?|mp4|webm)$/i);
            },
            audio: function (vType, vName) {
                return (vType !== undefined && vType.match(/\.audio\/(ogg|mp3|wav)$/i)) || vName.match(/\.(ogg|mp3|wav)$/i);
            },
            flash: function (vType, vName) {
                return (vType !== undefined && vType === 'application/x-shockwave-flash') || vName.match(/\.(swf)$/i);
            },
            object: function () {
                return true;
            },
            other: function () {
                return true;
            }
        },
        isEmpty = function (value, trim) {
            return value === null || value === undefined || value.length === 0 || (trim && $.trim(value) === '');
        },
        isArray = function (a) {
            return Array.isArray(a) || Object.prototype.toString.call(a) === '[object Array]';
        },
        isSet = function (needle, haystack) {
            return (typeof haystack === 'object' && needle in haystack);
        },
        getElement = function (options, param, value) {
            return (isEmpty(options) || isEmpty(options[param])) ? value : $(options[param]);
        },
        uniqId = function () {
            return Math.round(new Date().getTime() + (Math.random() * 100));
        },
        htmlEncode = function (str) {
            return String(str).repl('&', '&amp;')
                .repl('"', '&quot;')
                .repl("'", '&#39;')
                .repl('<', '&lt;')
                .repl('>', '&gt;');
        },
        replaceTags = function (str, tags) {
            var out = str;
            $.each(tags, function (key, value) {
                if (typeof value === "function") {
                    value = value();
                }
                out = out.repl(key, value);
            });
            return out;
        },
        objUrl = window.URL || window.webkitURL,
        FileInput = function (element, options) {
            this.$element = $(element);
            if (hasFileAPISupport() || isIE(9)) {
                this.init(options);
                this.listen();
            } else {
                this.$element.removeClass('file-loading');
            }
        };

    FileInput.prototype = {
        constructor: FileInput,
        init: function (options) {
            var self = this, $el = self.$element, content, t;
            $.each(options, function (key, value) {
                if (key === 'maxFileCount' || key === 'maxFileSize' || key === 'initialPreviewCount') {
                    self[key] = getNum(value);
                }
                self[key] = value;
            });
            if (isEmpty(self.allowedPreviewTypes)) {
                self.allowedPreviewTypes = defaultPreviewTypes;
            }
            self.uploadFileAttr = !isEmpty($el.attr('name')) ? $el.attr('name') : 'file_data';
            self.reader = null;
            self.formdata = {};
            self.isIE9 = isIE(9);
            self.isIE10 = isIE(10);
            self.filestack = [];
            self.ajaxRequests = [];
            self.isError = false;
            self.dropZoneEnabled = hasDragDropSupport() && self.dropZoneEnabled;
            self.isDisabled = self.$element.attr('disabled') || self.$element.attr('readonly');
            self.isUploadable = hasFileUploadSupport && !isEmpty(self.uploadUrl);
            self.slug = typeof options.slugCallback === "function" ? options.slugCallback : self.slugDefault;
            self.mainTemplate = self.showCaption ? self.getLayoutTemplate('main1') : self.getLayoutTemplate('main2');
            self.captionTemplate = self.getLayoutTemplate('caption');
            self.previewGenericTemplate = self.getPreviewTemplate('generic');
            if (isEmpty(self.$element.attr('id'))) {
                self.$element.attr('id', uniqId());
            }
            if (self.$container === undefined) {
                self.$container = self.createContainer();
            } else {
                self.refreshContainer();
            }
            self.$progress = self.$container.find('.kv-upload-progress');
            self.$btnUpload = self.$container.find('.kv-fileinput-upload');
            self.$captionContainer = getElement(options, 'elCaptionContainer', self.$container.find('.file-caption'));
            self.$caption = getElement(options, 'elCaptionText', self.$container.find('.file-caption-name'));
            self.$previewContainer = getElement(options, 'elPreviewContainer', self.$container.find('.file-preview'));
            self.$preview = getElement(options, 'elPreviewImage', self.$container.find('.file-preview-thumbnails'));
            self.$previewStatus = getElement(options, 'elPreviewStatus', self.$container.find('.file-preview-status'));
            self.$errorContainer = getElement(options, 'elErrorContainer',
                self.$previewContainer.find('.kv-fileinput-error'));
            if (!isEmpty(self.msgErrorClass)) {
                addCss(self.$errorContainer, self.msgErrorClass);
            }
            self.$errorContainer.hide();
            self.initialPreviewContent = '';
            content = self.initialPreview;
            self.initialPreviewCount = isArray(content) ? content.length : (content.length > 0 ? content.split(self.initialPreviewDelimiter).length : 0);
            self.fileActionSettings = $.extend(defaultFileActionSettings, options.fileActionSettings);
            self.previewInitId = "preview-" + uniqId();
            self.initPreview();
            self.initPreviewDeletes();
            self.original = {
                preview: self.$preview.html(),
                caption: self.$caption.html()
            };
            self.options = options;
            self.setFileDropZoneTitle();
            self.uploadCount = 0;
            self.uploadPercent = 0;
            self.$element.removeClass('file-loading');
            t = self.getLayoutTemplate('progress');
            self.progressTemplate = t.replace('{class}', self.progressClass);
            self.progressCompleteTemplate = t.replace('{class}', self.progressCompleteClass);
            self.setEllipsis();
        },
        raise: function (event, params) {
            var self = this;
            if (params !== undefined) {
                self.$element.trigger(event, params);
            } else {
                self.$element.trigger(event);
            }
        },
        getLayoutTemplate: function (t) {
            var self = this,
                template = isSet(t, self.layoutTemplates) ? self.layoutTemplates[t] : defaultLayoutTemplates[t];
            if (isEmpty(self.customLayoutTags)) {
                return template;
            }
            return replaceTags(template, self.customLayoutTags);
        },
        getPreviewTemplate: function (t) {
            var self = this,
                template = isSet(t, self.previewTemplates) ? self.previewTemplates[t] : defaultPreviewTemplates[t];
            template = template.repl('{previewFileIcon}', self.previewFileIcon);
            if (isEmpty(self.customPreviewTags)) {
                return template;
            }
            return replaceTags(template, self.customPreviewTags);
        },
        getOutData: function (jqXHR, responseData, filesData) {
            var self = this;
            jqXHR = jqXHR || {};
            responseData = responseData || {};
            filesData = filesData || self.filestack.slice(0) || {};
            return {
                form: self.formdata,
                files: filesData,
                extra: self.getExtraData(),
                response: responseData,
                reader: self.reader,
                jqXHR: jqXHR
            };
        },
        setEllipsis: function () {
            var self = this, $capCont = self.$captionContainer, $cap = self.$caption,
                $div = $cap.clone().css('height', 'auto').hide();
            $capCont.parent().before($div);
            $capCont.removeClass('kv-has-ellipsis');
            if ($div.outerWidth() > $cap.outerWidth()) {
                $capCont.addClass('kv-has-ellipsis');
            }
            $div.remove();
        },
        listen: function () {
            var self = this, $el = self.$element, $cap = self.$captionContainer, $btnFile = self.$btnFile;
            $el.on('change', $.proxy(self.change, self));
            $(window).on('resize', function () {
                self.setEllipsis();
            });
            $btnFile.off('click').on('click', function () {
                self.raise('filebrowse');
                if (self.isError && !self.isUploadable) {
                    self.clear(true);
                }
                $cap.focus();
            });
            $el.closest('form').off('reset').on('reset', $.proxy(self.reset, self));
            self.$container.off('click')
                .on('click', '.fileinput-remove:not([disabled])', $.proxy(self.clear, self))
                .on('click', '.fileinput-cancel', $.proxy(self.cancel, self));
            if (self.isUploadable && self.dropZoneEnabled && self.showPreview) {
                self.initDragDrop();
            }
            if (!self.isUploadable) {
                return;
            }
            self.$container.find('.kv-fileinput-upload').off('click').on('click', function (e) {
                if (!self.isUploadable) {
                    return;
                }
                e.preventDefault();
                if (!$(this).hasClass('disabled') && isEmpty($(this).attr('disabled'))) {
                    self.upload();
                }
            });
        },
        setProgress: function (p) {
            var self = this, pct = Math.min(p, 100),
                template = pct < 100 ? self.progressTemplate : self.progressCompleteTemplate;
            self.$progress.html(template.repl('{percent}', pct));
        },
        upload: function () {
            var self = this, totLen = self.getFileStack().length,
                i, outData, len, hasExtraData = !$.isEmptyObject(self.getExtraData());
            if (!self.isUploadable || self.isDisabled || (totLen === 0 && !hasExtraData)) {
                return;
            }
            self.resetUpload();
            self.$progress.removeClass('hide');
            self.uploadCount = 0;
            self.uploadPercent = 0;
            self.lock();
            self.setProgress(0);
            if (totLen === 0 && hasExtraData) {
                self.uploadExtraOnly();
                return;
            }
            len = self.filestack.length;
            if ((self.uploadAsync || totLen === 1) && self.showPreview) {
                outData = self.getOutData();
                self.raise('filebatchpreupload', [outData]);
                for (i = 0; i < len; i += 1) {
                    if (self.filestack[i] !== undefined) {
                        self.uploadSingle(i, self.filestack, true);
                    }
                }
                return;
            }
            self.uploadBatch();
        },
        lock: function () {
            var self = this;
            self.resetErrors();
            self.disable();
            if (self.showRemove) {
                addCss(self.$container.find('.fileinput-remove'), 'hide');
            }
            if (self.showCancel) {
                self.$container.find('.fileinput-cancel').removeClass('hide');
            }
            self.raise('filelock', [self.filestack, self.getExtraData()]);
        },
        unlock: function (reset) {
            var self = this;
            if (reset === undefined) {
                reset = true;
            }
            self.enable();
            if (self.showCancel) {
                addCss(self.$container.find('.fileinput-cancel'), 'hide');
            }
            if (self.showRemove) {
                self.$container.find('.fileinput-remove').removeClass('hide');
            }
            if (reset) {
                self.resetFileStack();
            }
            self.raise('fileunlock', [self.filestack, self.getExtraData()]);
        },
        resetFileStack: function () {
            var self = this, i = 0, newstack = [];
            self.$preview.find('.file-preview-frame').each(function () {
                var $thumb = $(this), ind = $thumb.attr('data-fileindex'),
                    file = self.filestack[ind];
                if (ind === -1) {
                    return;
                }
                if (file !== undefined) {
                    newstack[i] = file;
                    $thumb.attr({
                        'id': self.previewInitId + '-' + i,
                        'data-fileindex': i
                    });
                    i += 1;
                } else {
                    $thumb.attr({
                        'id': 'uploaded-' + uniqId(),
                        'data-fileindex': '-1'
                    });
                }
            });
            self.filestack = newstack;
        },
        refresh: function (options) {
            var self = this, $el = self.$element, $zone,
                params = (arguments.length) ? $.extend(self.options, options) : self.options;
            $el.off();
            self.init(params);
            $zone = self.$container.find('.file-drop-zone');
            $zone.off('dragenter dragover drop');
            $(document).off('dragenter dragover drop');
            self.listen();
            self.setFileDropZoneTitle();
        },
        initDragDrop: function () {
            var self = this, $zone = self.$container.find('.file-drop-zone');
            $zone.off('dragenter dragover drop');
            $(document).off('dragenter dragover drop');
            $zone.on('dragenter dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (self.isDisabled) {
                    return;
                }
                addCss($(this), 'highlighted');
            });
            $zone.on('dragleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (self.isDisabled) {
                    return;
                }
                $(this).removeClass('highlighted');
            });
            $zone.on('drop', function (e) {
                e.preventDefault();
                if (self.isDisabled) {
                    return;
                }
                self.change(e, 'dragdrop');
                $(this).removeClass('highlighted');
            });
            $(document).on('dragenter dragover drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        },
        setFileDropZoneTitle: function () {
            var self = this, $zone = self.$container.find('.file-drop-zone');
            $zone.find('.' + self.dropZoneTitleClass).remove();
            if (!self.isUploadable || !self.showPreview || $zone.length === 0 || self.getFileStack().length > 0 || !self.dropZoneEnabled) {
                return;
            }
            if ($zone.find('.file-preview-frame').length === 0) {
                $zone.prepend('<div class="' + self.dropZoneTitleClass + '">' + self.dropZoneTitle + '</div>');
            }
            self.$container.removeClass('file-input-new');
            addCss(self.$container, 'file-input-ajax-new');
        },
        initFileActions: function () {
            var self = this;
            self.$preview.find('.kv-file-remove').each(function () {
                var $el = $(this), $frame = $el.closest('.file-preview-frame'),
                    ind = $frame.attr('data-fileindex'), n, cap;
                $el.off('click').on('click', function () {
                    $frame.fadeOut('slow', function () {
                        self.filestack[ind] = undefined;
                        self.clearObjects($frame);
                        $frame.remove();
                        self.clearFileInput();
                        var filestack = self.getFileStack(), len = filestack.length,
                            chk = self.$container.find('.file-preview-initial').length;
                        if (len === 0 && chk === 0) {
                            self.original.preview = '';
                            self.reset();
                        } else {
                            n = self.initialPreviewCount + len;
                            cap = n > 1 ? self.msgSelected.repl('{n}', n) : filestack[0].name;
                            self.setCaption(cap);
                        }
                    });
                });
            });
            self.$preview.find('.kv-file-upload').each(function () {
                var $el = $(this);
                $el.off('click').on('click', function () {
                    var $frame = $el.closest('.file-preview-frame'),
                        ind = $frame.attr('data-fileindex');
                    self.uploadSingle(ind, self.filestack, false);
                });
            });
        },
        renderInitFileFooter: function (i) {
            if (this.initialPreviewConfig.length === 0 || isEmpty(this.initialPreviewConfig[i])) {
                return '';
            }
            var self = this, template = self.getLayoutTemplate('footer'),
                config = self.initialPreviewConfig[i],
                caption = isSet('caption', config) ? config.caption : '',
                width = isSet('width', config) ? config.width : 'auto',
                url = isSet('url', config) ? config.url : false,
                key = isSet('key', config) ? config.key : null,
                disabled = (url === false),
                actions = self.initialPreviewShowDelete ? self.renderFileActions(false, true, disabled, url, key, i) : '',
                footer = template.repl('{actions}', actions);
            return footer.repl('{caption}', caption).repl('{width}', width)
                .repl('{indicator}', '').repl('{indicatorTitle}', '');
        },
        renderFileFooter: function (caption, width) {
            var self = this, config = self.fileActionSettings, footer,
                template = self.getLayoutTemplate('footer');
            if (self.isUploadable) {
                footer = template.repl('{actions}', self.renderFileActions(true, true, false, false, false, false));
                return footer.repl('{caption}', caption)
                    .repl('{width}', width)
                    .repl('{indicator}', config.indicatorNew)
                    .repl('{indicatorTitle}', config.indicatorNewTitle);
            }
            return template.repl('{actions}', '')
                .repl('{caption}', caption)
                .repl('{width}', width)
                .repl('{indicator}', '')
                .repl('{indicatorTitle}', '');
        },
        renderFileActions: function (showUpload, showDelete, disabled, url, key, index) {
            if (!showUpload && !showDelete) {
                return '';
            }
            var self = this,
                vUrl = url === false ? '' : ' data-url="' + url + '"',
                vIndex = index === false ? '' : ' data-index="' + index + '"',
                vKey = key === false ? '' : ' data-key="' + key + '"',
                btnDelete = self.getLayoutTemplate('actionDelete'),
                btnUpload = '',
                template = self.getLayoutTemplate('actions'),
                otherActionButtons = self.otherActionButtons.repl('{dataKey}', vKey),
                config = self.fileActionSettings,
                removeClass = disabled ? config.removeClass + ' disabled' : config.removeClass;
            btnDelete = btnDelete
                .repl('{removeClass}', removeClass)
                .repl('{removeIcon}', config.removeIcon)
                .repl('{removeTitle}', config.removeTitle)
                .repl('{dataUrl}', vUrl)
                .repl('{dataKey}', vKey)
                .repl('{dataIndex}', vIndex);
            if (showUpload) {
                btnUpload = self.getLayoutTemplate('actionUpload')
                    .repl('{uploadClass}', config.uploadClass)
                    .repl('{uploadIcon}', config.uploadIcon)
                    .repl('{uploadTitle}', config.uploadTitle);
            }
            return template
                .repl('{delete}', btnDelete)
                .repl('{upload}', btnUpload)
                .repl('{other}', otherActionButtons);
        },
        getInitialPreview: function (template, content, i) {
            var self = this, ind = 'init_' + i,
                previewId = self.previewInitId + '-' + ind,
                footer = self.renderInitFileFooter(i, false);
            return template
                .repl('{previewId}', previewId)
                .repl('{frameClass}', ' file-preview-initial')
                .repl('{fileindex}', ind)
                .repl('{content}', content)
                .repl('{footer}', footer);
        },
        initPreview: function () {
            var self = this, html = '', content = self.initialPreview, len = self.initialPreviewCount,
                cap = self.initialCaption.length, i, fileList,
                caption = (cap > 0) ? self.initialCaption : self.msgSelected.repl('{n}', len);
            if (isArray(content) && len > 0) {
                for (i = 0; i < len; i += 1) {
                    html += self.getInitialPreview(self.previewGenericTemplate, content[i], i);
                }
                if (len > 1 && cap === 0) {
                    caption = self.msgSelected.repl('{n}', len);
                }
            } else {
                if (len > 0) {
                    fileList = content.split(self.initialPreviewDelimiter);
                    for (i = 0; i < len; i += 1) {
                        html += self.getInitialPreview(self.previewGenericTemplate, fileList[i], i);
                    }
                    if (len > 1 && cap === 0) {
                        caption = self.msgSelected.repl('{n}', len);
                    }
                } else {
                    if (cap > 0) {
                        self.setCaption(caption);
                    }
                    return;
                }
            }
            self.initialPreviewContent = html;
            self.$preview.html(html);
            self.setCaption(caption);
            self.$container.removeClass('file-input-new');
        },
        initPreviewDeletes: function () {
            var self = this, deleteExtraData = self.deleteExtraData || {}, caption, $that,
                resetProgress = function () {
                    if (self.$preview.find('.kv-file-remove').length === 0) {
                        self.reset();
                    }
                };
            self.$preview.find('.kv-file-remove').each(function () {
                var $el = $(this), $frame = $el.closest('.file-preview-frame'), index = $el.data('index'), 
                    config = isEmpty(self.initialPreviewConfig[index]) ? null : self.initialPreviewConfig[index],
                    extraData = isEmpty(config) || isEmpty(config.extra) ? deleteExtraData : config.extra,
                    vUrl = $el.data('url') || self.deleteUrl, vKey = $el.data('key'), $content;
                if (typeof extraData === "function") { 
                    extraData = extraData();
                }
                if (vUrl === undefined || vKey === undefined) {
                    return;
                }
                $el.off('click').on('click', function () {
                    $.ajax({
                        url: vUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: $.extend({key: vKey}, extraData),
                        beforeSend: function (jqXHR) {
                            addCss($frame, 'file-uploading');
                            addCss($el, 'disabled');
                            self.raise('filepredelete', [vKey, jqXHR, extraData]);
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.error === undefined) {
                                self.raise('filedeleted', [vKey, jqXHR, extraData]);
                            } else {
                                self.showError(data.error, extraData, $el.attr('id'), vKey, 'filedeleteerror', jqXHR);
                                $frame.removeClass('file-uploading');
                                $el.removeClass('disabled');
                                resetProgress();
                                return;
                            }
                            $frame.removeClass('file-uploading').addClass('file-deleted');
                            $frame.fadeOut('slow', function () {
                                self.clearObjects($frame);
                                $frame.remove();
                                $content = $(document.createElement('div')).html(self.original.preview);
                                $content.find('.file-preview-frame').each(function () {
                                    $that = $(this);
                                    if ($that.find('.kv-file-remove').attr('data-key') == vKey) {
                                        $that.remove();
                                    }
                                });
                                self.initialPreviewContent = $content.html();
                                if (self.initialPreviewCount > 0) {
                                    self.initialPreviewCount -= 1;
                                }
                                caption = self.initialCaption;
                                if (self.initialCaption.length === 0) {
                                    caption = self.msgSelected.repl('{n}', self.initialPreviewCount);
                                }
                                self.original.preview = $content.html();
                                self.setCaption(caption);
                                self.original.caption = self.$caption.html();
                                $content.remove();
                                resetProgress();
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            self.showError(errorThrown, extraData, $el.attr('id'), vKey, 'filedeleteerror', jqXHR);
                            $frame.removeClass('file-uploading');
                            resetProgress();
                        }
                    });
                });
            });
        },
        clearObjects: function ($el) {
            $el.find('video audio').each(function () {
                this.pause();
                $(this).remove();
            });
            $el.find('img object div').each(function () {
                $(this).remove();
            });
        },
        clearFileInput: function () {
            var self = this, $el = self.$element, $srcFrm, $tmpFrm, $tmpEl;
            if (isEmpty($el.val())) {
                return;
            }
            // Fix for IE ver < 11, that does not clear file inputs
            // Requires a sequence of steps to prevent IE crashing but
            // still allow clearing of the file input.
            if (self.isIE9 || self.isIE10) {
                $srcFrm = $el.closest('form');
                $tmpFrm = $(document.createElement('form'));
                $tmpEl = $(document.createElement('div'));
                $el.before($tmpEl);
                if ($srcFrm.length) {
                    $srcFrm.after($tmpFrm);
                } else {
                    $tmpEl.after($tmpFrm);
                }
                $tmpFrm.append($el).trigger('reset');
                $tmpEl.before($el).remove();
                $tmpFrm.remove();
            } else { // normal input clear behavior for other sane browsers
                $el.val('');
            }
        },
        resetUpload: function () {
            var self = this;
            self.uploadCount = 0;
            self.uploadPercent = 0;
            self.$btnUpload.removeAttr('disabled');
            self.setProgress(0);
            addCss(self.$progress, 'hide');
            self.resetErrors(false);
            self.ajaxRequests = [];
        },
        cancel: function () {
            var self = this, xhr = self.ajaxRequests, len = xhr.length, i;
            if (len > 0) {
                for (i = 0; i < len; i += 1) {
                    xhr[i].abort();
                }
            }
            self.$preview.find('.file-preview-frame').each(function () {
                var $thumb = $(this), ind = $thumb.attr('data-fileindex');
                $thumb.removeClass('file-uploading');
                if (self.filestack[ind] !== undefined) {
                    $thumb.find('.kv-file-upload').removeClass('disabled').removeAttr('disabled');
                    $thumb.find('.kv-file-remove').removeClass('disabled').removeAttr('disabled');
                }
                self.unlock();
            });
        },
        clear: function (trig) {
            var self = this, cap;
            if (!self.isIE9 && self.reader instanceof FileReader) {
                self.reader.abort();
            }
            self.$btnUpload.removeAttr('disabled');
            self.resetUpload();
            self.filestack = [];
            self.clearFileInput();
            self.resetErrors(true);

            if (trig !== true) {
                self.raise('change');
                self.raise('fileclear');
            }
            if (self.overwriteInitial) {
                self.initialPreviewCount = 0;
                self.initialPreviewContent = '';
            }
            if (!self.overwriteInitial && self.initialPreviewContent.length > 0) {
                self.showFileIcon();
                self.$preview.html(self.original.preview);
                self.$caption.html(self.original.caption);
                self.setEllipsis();
                self.initPreviewDeletes();
                self.$container.removeClass('file-input-new');
            } else {
                self.$preview.find('.file-preview-frame').each(function () {
                    self.clearObjects($(this));
                });
                self.$preview.html('');
                cap = (!self.overwriteInitial && self.initialCaption.length > 0) ? self.original.caption : '';
                self.$caption.html(cap);
                self.setEllipsis();
                self.$caption.attr('title', '');
                addCss(self.$container, 'file-input-new');
            }
            if (self.$container.find('.file-preview-frame').length === 0) {
                self.initialCaption = '';
                self.original.caption = '';
                self.$caption.html('');
                self.setEllipsis();
                self.$captionContainer.find('.kv-caption-icon').hide();
            }
            self.hideFileIcon();
            self.raise('filecleared');
            self.$captionContainer.focus();
            self.setFileDropZoneTitle();
        },
        reset: function () {
            var self = this;
            self.clear(true);
            self.$preview.html(self.original.preview);
            self.$caption.html(self.original.caption);
            self.setEllipsis();
            self.$container.find('.fileinput-filename').text('');
            self.raise('filereset');
            if (self.initialPreview.length > 0) {
                self.$container.removeClass('file-input-new');
            }
            self.setFileDropZoneTitle();
            if (self.isUploadable) {
                self.resetUpload();
            }
            self.filestack = [];
            self.formdata = {};
        },
        disable: function () {
            var self = this;
            self.isDisabled = true;
            self.raise('filedisabled');
            self.$element.attr('disabled', 'disabled');
            self.$container.find(".kv-fileinput-caption").addClass("file-caption-disabled");
            self.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").attr("disabled", true);
            self.initDragDrop();
        },
        enable: function () {
            var self = this;
            self.isDisabled = false;
            self.raise('fileenabled');
            self.$element.removeAttr('disabled');
            self.$container.find(".kv-fileinput-caption").removeClass("file-caption-disabled");
            self.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").removeAttr("disabled");
            self.initDragDrop();
        },
        getExtraData: function () {
            var self = this, data = self.uploadExtraData;
            if (typeof self.uploadExtraData === "function") {
                data = self.uploadExtraData();
            }
            return data;
        },
        uploadExtra: function () {
            var self = this, data = self.getExtraData();
            if (data.length === 0) {
                return;
            }
            $.each(data, function (key, value) {
                self.formdata.append(key, value);
            });
        },
        initXhr: function (xhrobj, factor) {
            var self = this;
            if (xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function (event) {
                    var pct = 0, position = event.loaded || event.position, total = event.total;
                    if (event.lengthComputable) {
                        pct = Math.ceil(position / total * factor);
                    }
                    self.uploadPercent = Math.max(pct, self.uploadPercent);
                    self.setProgress(self.uploadPercent);
                }, false);
            }
            return xhrobj;
        },
        ajaxSubmit: function (fnBefore, fnSuccess, fnComplete, fnError) {
            var self = this, settings;
            self.uploadExtra();
            settings = $.extend(self.ajaxSettings, {
                xhr: function () {
                    var xhrobj = $.ajaxSettings.xhr();
                    return self.initXhr(xhrobj, 98);
                },
                url: self.uploadUrl,
                type: 'POST',
                dataType: 'json',
                data: self.formdata,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: fnBefore,
                success: fnSuccess,
                complete: fnComplete,
                error: fnError
            });
            self.ajaxRequests.push($.ajax(settings));
        },
        uploadSingle: function (i, files, allFiles) {
            var self = this, total = self.getFileStack().length, formdata = new FormData(), outData,
                previewId = self.previewInitId + "-" + i, $thumb = $('#' + previewId), cap, pct, chkComplete,
                $btnUpload = $thumb.find('.kv-file-upload'), $btnDelete = $thumb.find('.kv-file-remove'),
                $indicator = $thumb.find('.file-upload-indicator'), config = self.fileActionSettings,
                hasPostData = self.filestack.length > 0 || !$.isEmptyObject(self.uploadExtraData),
                setIndicator, updateProgress, resetActions, fnBefore, fnSuccess, fnComplete, fnError;
            self.formdata = formdata;
            if (total === 0 || !hasPostData || $btnUpload.hasClass('disabled')) {
                return;
            }
            chkComplete = function () {
                var $thumbs = self.$preview.find('.file-preview-frame.file-uploading'), chk = $thumbs.length;
                if (chk > 0) {
                    return;
                }
                self.setProgress(100);
                self.unlock();
                self.clearFileInput();
                self.raise('filebatchuploadcomplete', [self.filestack, self.getExtraData()]);
            };
            setIndicator = function (icon, msg) {
                $indicator.html(config[icon]);
                $indicator.attr('title', config[msg]);
            };
            updateProgress = function () {
                if (!allFiles || total === 0 || self.uploadPercent >= 100) {
                    return;
                }
                self.uploadCount += 1;
                pct = 80 + Math.ceil(self.uploadCount * 20 / total);
                self.uploadPercent = Math.max(pct, self.uploadPercent);
                self.setProgress(self.uploadPercent);
                self.initPreviewDeletes();
            };
            resetActions = function () {
                $btnUpload.removeAttr('disabled');
                $btnDelete.removeAttr('disabled');
                $thumb.removeClass('file-uploading');
            };
            fnBefore = function (jqXHR) {
                outData = self.getOutData(jqXHR);
                setIndicator('indicatorLoading', 'indicatorLoadingTitle');
                addCss($thumb, 'file-uploading');
                $btnUpload.attr('disabled', true);
                $btnDelete.attr('disabled', true);
                if (!allFiles) {
                    self.lock();
                }
                self.raise('filepreupload', [outData, previewId, i]);
            };
            fnSuccess = function (data, textStatus, jqXHR) {
                outData = self.getOutData(jqXHR, data);
                setTimeout(function () {
                    if (data.error === undefined) {
                        setIndicator('indicatorSuccess', 'indicatorSuccessTitle');
                        $btnUpload.hide();
                        $btnDelete.hide();
                        self.filestack[i] = undefined;
                        if (!allFiles) {
                            self.resetFileStack();
                        }
                        self.raise('fileuploaded', [outData, previewId, i]);
                    } else {
                        setIndicator('indicatorError', 'indicatorErrorTitle');
                        self.showUploadError(data.error, outData, previewId, i);
                    }
                }, 100);
            };
            fnComplete = function () {
                setTimeout(function () {
                    updateProgress();
                    resetActions();
                    if (!allFiles) {
                        self.unlock(false);
                    } else {
                        chkComplete();
                    }
                }, 100);
            };
            fnError = function (jqXHR, textStatus, errorThrown) {
                setIndicator('indicatorError', 'indicatorErrorTitle');
                outData = self.getOutData(jqXHR);
                if (allFiles) {
                    cap = files[i].name;
                    self.showUploadError('<b>' + cap + '</b>: ' + errorThrown, outData, previewId, i);
                } else {
                    self.showUploadError(errorThrown, outData, previewId, i);
                }
            };
            formdata.append(self.uploadFileAttr, files[i]);
            formdata.append('file_id', i);
            self.ajaxSubmit(fnBefore, fnSuccess, fnComplete, fnError);
        },
        uploadBatch: function () {
            var self = this, files = self.filestack, total = files.length, config,
                hasPostData = self.filestack.length > 0 || !$.isEmptyObject(self.uploadExtraData),
                setIndicator, setAllUploaded, enableActions, fnBefore, fnSuccess, fnComplete, fnError;
            self.formdata = new FormData();
            if (total === 0 || !hasPostData) {
                return;
            }
            config = self.fileActionSettings;
            setIndicator = function (i, icon, msg) {
                var $indicator = $('#' + self.previewInitId + "-" + i).find('.file-upload-indicator');
                $indicator.html(config[icon]);
                $indicator.attr('title', config[msg]);
            };
            enableActions = function (i) {
                var $thumb = $('#' + self.previewInitId + "-" + i),
                    $btnUpload = $thumb.find('.kv-file-upload'),
                    $btnDelete = $thumb.find('.kv-file-delete');
                $thumb.removeClass('file-uploading');
                $btnUpload.removeAttr('disabled');
                $btnDelete.removeAttr('disabled');
            };
            setAllUploaded = function () {
                $.each(files, function (key, data) {
                    self.filestack[key] = undefined;
                });
                self.clearFileInput();
            };
            fnBefore = function (jqXHR) {
                self.lock();
                var outData = self.getOutData(jqXHR);
                if (self.showPreview) {
                    self.$preview.find('.file-preview-frame').each(function () {
                        var $thumb = $(this), $btnUpload = $thumb.find('.kv-file-upload'), $btnDelete = $thumb.find('.kv-file-remove');
                        addCss($thumb, 'file-uploading');
                        $btnUpload.attr('disabled', true);
                        $btnDelete.attr('disabled', true);
                    });
                }
                self.raise('filebatchpreupload', [outData]);
            };
            fnSuccess = function (data, textStatus, jqXHR) {
                var outData = self.getOutData(jqXHR, data),
                    keys = isEmpty(data.errorkeys) ? [] : data.errorkeys;
                if (data.error === undefined || isEmpty(data.error)) {
                    self.raise('filebatchuploadsuccess', [outData]);
                    setAllUploaded();
                    if (self.showPreview) {
                        self.$preview.find('.kv-file-upload').hide();
                        self.$preview.find('.kv-file-remove').hide();
                        self.$preview.find('.file-preview-frame').each(function () {
                            var $thumb = $(this), key = $thumb.attr('data-fileindex');
                            setIndicator(key, 'indicatorSuccess', 'indicatorSuccessTitle');
                            enableActions(key);
                        });
                    } else {
                        self.reset();
                    }
                } else {
                    if (self.showPreview) {
                        self.$preview.find('.file-preview-frame').each(function () {
                            var $thumb = $(this), key = parseInt($thumb.attr('data-fileindex'), 10);
                            enableActions(key);
                            if (keys.length === 0) {
                                setIndicator(key, 'indicatorError', 'indicatorErrorTitle');
                                return;
                            }
                            if ($.inArray(key, keys) !== -1) {
                                setIndicator(key, 'indicatorError', 'indicatorErrorTitle');
                            } else {
                                $thumb.find('.kv-file-upload').hide();
                                $thumb.find('.kv-file-remove').hide();
                                setIndicator(key, 'indicatorSuccess', 'indicatorSuccessTitle');
                                self.filestack[key] = undefined;
                            }
                        });
                    }
                    self.showUploadError(data.error, outData, null, null, 'filebatchuploaderror');
                }
            };
            fnComplete = function () {
                self.setProgress(100);
                self.unlock();
                self.raise('filebatchuploadcomplete', [self.filestack, self.getExtraData()]);
                self.clearFileInput();
            };
            fnError = function (jqXHR, textStatus, errorThrown) {
                var outData = self.getOutData(jqXHR);
                self.showUploadError(errorThrown, outData, null, null, 'filebatchuploaderror');
                self.uploadFileCount = total - 1;
                if (!self.showPreview) {
                    return;
                }
                self.$preview.find('.file-preview-frame').each(function () {
                    var $thumb = $(this), key = $thumb.attr('data-fileindex');
                    $thumb.removeClass('file-uploading');
                    if (self.filestack[key] !== undefined) {
                        setIndicator(key, 'indicatorError', 'indicatorErrorTitle');
                    }
                });
                self.$preview.find('.file-preview-frame').removeClass('file-uploading');
                self.$preview.find('.file-preview-frame kv-file-upload').removeAttr('disabled');
                self.$preview.find('.file-preview-frame kv-file-delete').removeAttr('disabled');
            };
            $.each(files, function (key, data) {
                if (!isEmpty(files[key])) {
                    self.formdata.append(self.uploadFileAttr, data);
                }
            });
            self.ajaxSubmit(fnBefore, fnSuccess, fnComplete, fnError);
        },
        uploadExtraOnly: function () {
            var self = this, fnBefore, fnSuccess, fnComplete, fnError;
            self.formdata = new FormData();
            fnBefore = function (jqXHR) {
                self.lock();
                var outData = self.getOutData(jqXHR);
                self.raise('filebatchpreupload', [outData]);
                self.setProgress(50);
            };
            fnSuccess = function (data, textStatus, jqXHR) {
                var outData = self.getOutData(jqXHR, data),
                    keys = isEmpty(data.errorkeys) ? [] : data.errorkeys;
                if (data.error === undefined || isEmpty(data.error)) {
                    self.raise('filebatchuploadsuccess', [outData]);
                    self.clearFileInput();
                } else {
                    self.showUploadError(data.error, outData, null, null, 'filebatchuploaderror');
                }
            };
            fnComplete = function () {
                self.setProgress(100);
                self.unlock();
                self.raise('filebatchuploadcomplete', [self.filestack, self.getExtraData()]);
                self.clearFileInput();
            };
            fnError = function (jqXHR, textStatus, errorThrown) {
                var outData = self.getOutData(jqXHR);
                self.showUploadError(errorThrown, outData, null, null, 'filebatchuploaderror');
            };
            self.ajaxSubmit(fnBefore, fnSuccess, fnComplete, fnError);
        },
        hideFileIcon: function () {
            if (this.overwriteInitial) {
                this.$captionContainer.find('.kv-caption-icon').hide();
            }
        },
        showFileIcon: function () {
            this.$captionContainer.find('.kv-caption-icon').show();
        },
        resetErrors: function (fade) {
            var self = this, $error = self.$errorContainer;
            self.isError = false;
            self.$container.removeClass('has-error');
            $error.html('');
            if (fade) {
                $error.fadeOut('slow');
            } else {
                $error.hide();
            }
        },
        showUploadError: function (msg, data, previewId, index, ev) {
            var self = this, $error = self.$errorContainer;
            ev = ev || 'fileuploaderror';
            if ($error.find('ul').length === 0) {
                $error.html('<ul class="text-left"><li>' + msg + '</li></ul>');
            } else {
                $error.find('ul').append('<li>' + msg + '</li>');
            }
            $error.fadeIn(800);
            self.raise(ev, [data, previewId, index, self.reader]);
            addCss(self.$container, 'has-error');
            return true;
        },
        showError: function (msg, file, previewId, index, ev, jqXHR) {
            var self = this, $error = self.$errorContainer;
            ev = ev || 'fileerror';
            jqXHR = jqXHR || {};
            $error.html(msg);
            $error.fadeIn(800);
            self.raise(ev, [file, previewId, index, self.reader, jqXHR]);
            if (!self.isUploadable) {
                self.clearFileInput();
            }
            addCss(self.$container, 'has-error');
            self.$btnUpload.attr('disabled', true);
            return true;
        },
        errorHandler: function (evt, caption) {
            var self = this, err = evt.target.error;
            switch (err.code) {
                case err.NOT_FOUND_ERR:
                    self.addError(self.msgFileNotFound.repl('{name}', caption));
                    break;
                case err.SECURITY_ERR:
                    self.addError(self.msgFileSecured.repl('{name}', caption));
                    break;
                case err.NOT_READABLE_ERR:
                    self.addError(self.msgFileNotReadable.repl('{name}', caption));
                    break;
                case err.ABORT_ERR:
                    self.addError(self.msgFilePreviewAborted.repl('{name}', caption));
                    break;
                default:
                    self.addError(self.msgFilePreviewError.repl('{name}', caption));
            }
        },
        parseFileType: function (file) {
            var self = this, isValid, vType, cat, i;
            for (i = 0; i < defaultPreviewTypes.length; i += 1) {
                cat = defaultPreviewTypes[i];
                isValid = isSet(cat, self.fileTypeSettings) ? self.fileTypeSettings[cat] : defaultFileTypeSettings[cat];
                vType = isValid(file.type, file.name) ? cat : '';
                if (!isEmpty(vType)) {
                    return vType;
                }
            }
            return 'other';
        },
        previewDefault: function (file, previewId, isDisabled) {
            if (!this.showPreview) {
                return;
            }
            var self = this, data = objUrl.createObjectURL(file), $obj = $('#' + previewId),
                config = self.previewSettings.other,
                footer = self.renderFileFooter(file.name, config.width),
                previewOtherTemplate = self.getPreviewTemplate('other'),
                ind = previewId.slice(previewId.lastIndexOf('-') + 1),
                frameClass = '';
            if (isDisabled === true) {
                frameClass = ' btn disabled';
                footer += '<div class="file-other-error text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i></div>';
            }
            self.$preview.append("\n" + previewOtherTemplate
                .repl('{previewId}', previewId)
                .repl('{frameClass}', frameClass)
                .repl('{fileindex}', ind)
                .repl('{caption}', self.slug(file.name))
                .repl('{width}', config.width)
                .repl('{height}', config.height)
                .repl('{type}', file.type)
                .repl('{data}', data)
                .repl('{footer}', footer));
            $obj.on('load', function () {
                objUrl.revokeObjectURL($obj.attr('data'));
            });
        },
        previewFile: function (file, theFile, previewId, data) {
            if (!this.showPreview) {
                return;
            }
            var self = this, cat = self.parseFileType(file), caption = self.slug(file.name), content, strText,
                types = self.allowedPreviewTypes, mimes = self.allowedPreviewMimeTypes,
                tmplt = self.getPreviewTemplate(cat),
                config = isSet(cat, self.previewSettings) ? self.previewSettings[cat] : defaultPreviewSettings[cat],
                wrapLen = parseInt(self.wrapTextLength, 10), wrapInd = self.wrapIndicator,
                chkTypes = types.indexOf(cat) >= 0, id, height,
                chkMimes = isEmpty(mimes) || (!isEmpty(mimes) && isSet(file.type, mimes)),
                footer = self.renderFileFooter(caption, config.width), modal = '',
                ind = previewId.slice(previewId.lastIndexOf('-') + 1);
            if (chkTypes && chkMimes) {
                if (cat === 'text') {
                    strText = htmlEncode(theFile.target.result);
                    objUrl.revokeObjectURL(data);
                    if (strText.length > wrapLen) {
                        id = 'text-' + uniqId();
                        height = window.innerHeight * 0.75;
                        modal = self.getLayoutTemplate('modal').repl('{id}', id)
                            .repl('{title}', caption)
                            .repl('{height}', height)
                            .repl('{body}', strText);
                        wrapInd = wrapInd
                            .repl('{title}', caption)
                            .repl('{dialog}', "$('#" + id + "').modal('show')");
                        strText = strText.substring(0, (wrapLen - 1)) + wrapInd;
                    }
                    content = tmplt.repl('{previewId}', previewId).repl('{caption}', caption)
                        .repl('{frameClass}', '')
                        .repl('{type}', file.type).repl('{width}', config.width)
                        .repl('{height}', config.height).repl('{data}', strText)
                        .repl('{footer}', footer).repl('{fileindex}', ind) + modal;
                } else {
                    content = tmplt.repl('{previewId}', previewId).repl('{caption}', caption)
                        .repl('{frameClass}', '')
                        .repl('{type}', file.type).repl('{data}', data)
                        .repl('{width}', config.width).repl('{height}', config.height)
                        .repl('{footer}', footer).repl('{fileindex}', ind);
                }
                self.$preview.append("\n" + content);
                self.autoSizeImage(previewId);
            } else {
                self.previewDefault(file, previewId);
            }
        },
        slugDefault: function (text) {
            return isEmpty(text) ? '' : text.split(/(\\|\/)/g).pop().replace(/[^\w\-.\\\/ ]+/g, '');
        },
        getFileStack: function () {
            var self = this;
            return self.filestack.filter(function (n) {
                return n !== undefined;
            });
        },
        readFiles: function (files) {
            this.reader = new FileReader();
            var self = this, $el = self.$element, $preview = self.$preview, reader = self.reader,
                $container = self.$previewContainer, $status = self.$previewStatus, msgLoading = self.msgLoading,
                msgProgress = self.msgProgress, previewInitId = self.previewInitId, numFiles = files.length,
                settings = self.fileTypeSettings, ctr = self.filestack.length,
                throwError = function (msg, file, previewId, index) {
                    self.previewDefault(file, previewId, true);
                    var outData = self.getOutData({}, {}, files);
                    return self.isUploadable ? self.showUploadError(msg, outData, previewId,
                        index) : self.showError(msg, file, previewId, index);
                };

            function readFile(i) {
                if (isEmpty($el.attr('multiple'))) {
                    numFiles = 1;
                }
                if (i >= numFiles) {
                    $container.removeClass('loading');
                    $status.html('');
                    return;
                }
                var node = ctr + i, previewId = previewInitId + "-" + node, isText, file = files[i], 
                    caption = self.slug(file.name), fileSize = (file.size || 0) / 1000, checkFile, fileExtExpr = '',
                    previewData = objUrl.createObjectURL(file), fileCount = 0, j, msg, typ, chk,
                    fileTypes = self.allowedFileTypes, strTypes = isEmpty(fileTypes) ? '' : fileTypes.join(', '),
                    fileExt = self.allowedFileExtensions, strExt = isEmpty(fileExt) ? '' : fileExt.join(', ');
                if (!isEmpty(fileExt)) {
                    fileExtExpr = new RegExp('\\.(' + fileExt.join('|') + ')$', 'i');
                }
                fileSize = fileSize.toFixed(2);
                if (self.maxFileSize > 0 && fileSize > self.maxFileSize) {
                    msg = self.msgSizeTooLarge.repl('{name}', caption)
                        .repl('{size}', fileSize)
                        .repl('{maxSize}', self.maxFileSize);
                    self.isError = throwError(msg, file, previewId, i);
                    return;
                }
                if (!isEmpty(fileTypes) && isArray(fileTypes)) {
                    for (j = 0; j < fileTypes.length; j += 1) {
                        typ = fileTypes[j];
                        checkFile = settings[typ];
                        chk = (checkFile !== undefined && checkFile(file.type, caption));
                        fileCount += isEmpty(chk) ? 0 : chk.length;
                    }
                    if (fileCount === 0) {
                        msg = self.msgInvalidFileType.repl('{name}', caption).repl('{types}', strTypes);
                        self.isError = throwError(msg, file, previewId, i);
                        return;
                    }
                }
                if (fileCount === 0 && !isEmpty(fileExt) && isArray(fileExt) && !isEmpty(fileExtExpr)) {
                    chk = caption.match(fileExtExpr);
                    fileCount += isEmpty(chk) ? 0 : chk.length;
                    if (fileCount === 0) {
                        msg = self.msgInvalidFileExtension.repl('{name}', caption).repl('{extensions}',
                            strExt);
                        self.isError = throwError(msg, file, previewId, i);
                        return;
                    }
                }
                if (!self.showPreview) {
                    self.filestack.push(file);
                    setTimeout(readFile(i + 1), 100);
                    self.raise('fileloaded', [file, previewId, i, reader]);
                    return;
                }
                if ($preview.length > 0 && FileReader !== undefined) {
                    $status.html(msgLoading.repl('{index}', i + 1).repl('{files}', numFiles));
                    $container.addClass('loading');
                    reader.onerror = function (evt) {
                        self.errorHandler(evt, caption);
                    };
                    reader.onload = function (theFile) {
                        self.previewFile(file, theFile, previewId, previewData);
                        self.initFileActions();
                    };
                    reader.onloadend = function () {
                        msg = msgProgress
                            .repl('{index}', i + 1).repl('{files}', numFiles)
                            .repl('{percent}', 50).repl('{name}', caption);
                        setTimeout(function () {
                            $status.html(msg);
                            objUrl.revokeObjectURL(previewData);
                        }, 100);
                        setTimeout(function () {
                            readFile(i + 1);
                            self.updateFileDetails(numFiles);
                        }, 100);
                        self.raise('fileloaded', [file, previewId, i, reader]);
                    };
                    reader.onprogress = function (data) {
                        if (data.lengthComputable) {
                            var fact = (data.loaded / data.total) * 100, progress = Math.ceil(fact);
                            msg = msgProgress.repl('{index}', i + 1).repl('{files}', numFiles)
                                .repl('{percent}', progress).repl('{name}', caption);
                            setTimeout(function () {
                                $status.html(msg);
                            }, 100);
                        }
                    };
                    isText = isSet('text', settings) ? settings.text : defaultFileTypeSettings.text;
                    if (isText(file.type, caption)) {
                        reader.readAsText(file, self.textEncoding);
                    } else {
                        reader.readAsArrayBuffer(file);
                    }
                } else {
                    self.previewDefault(file, previewId);
                    setTimeout(function () {
                        readFile(i + 1);
                        self.updateFileDetails(numFiles);
                    }, 100);
                    self.raise('fileloaded', [file, previewId, i, reader]);
                }
                self.filestack.push(file);
            }

            readFile(0);
            self.updateFileDetails(numFiles, false);
        },
        updateFileDetails: function (numFiles) {
            var self = this, msgSelected = self.msgSelected, $el = self.$element, fileStack = self.getFileStack(),
                name = $el.val() || (fileStack.length && fileStack[0].name) || '', label = self.slug(name),
                n = self.isUploadable ? fileStack.length : numFiles,
                nFiles = self.initialPreviewCount + n,
                log = n > 1 ? msgSelected.repl('{n}', nFiles) : label;
            if (self.isError) {
                self.$previewContainer.removeClass('loading');
                self.$previewStatus.html('');
                self.$captionContainer.find('.kv-caption-icon').hide();
                log = self.msgValidationError;
            } else {
                self.showFileIcon();
            }
            self.setCaption(log);
            self.$container.removeClass('file-input-new file-input-ajax-new');
            if (arguments.length === 1) {
                self.raise('fileselect', [numFiles, label]);
            }            
            if (self.initialPreviewContent.length > 0) {
                self.initPreviewDeletes();
            }
        },
        change: function (e) {
            var self = this, $el = self.$element;
            if (!self.isUploadable && isEmpty($el.val())) { // IE 11 fix
                return;
            }
            var tfiles, msg, total, $preview = self.$preview, isDragDrop = arguments.length > 1,
                files = isDragDrop ? e.originalEvent.dataTransfer.files : $el.get(0).files,
                isSingleUpload = isEmpty($el.attr('multiple')),
                ctr = self.filestack.length, isAjaxUpload = (self.isUploadable && ctr !== 0),
                throwError = function (mesg, file, previewId, index) {
                    var outData = self.getOutData({}, {}, files);
                    return self.isUploadable ? self.showUploadError(mesg, outData, previewId,
                        index) : self.showError(mesg, file, previewId, index);
                };
            self.resetUpload();
            self.hideFileIcon();
            self.$container.find('.file-drop-zone .' + self.dropZoneTitleClass).remove();
            if (isDragDrop) {
                tfiles = files;
            } else {
                if (e.target.files === undefined) {
                    tfiles = e.target && e.target.value ? [
                        {name: e.target.value.replace(/^.+\\/, '')}
                    ] : [];
                } else {
                    tfiles = e.target.files;
                }
            }
            if (isEmpty(tfiles) || tfiles.length === 0) {
                if (!isAjaxUpload) {
                    self.clear(true);
                }
                self.raise('fileselectnone');
                return;
            }
            self.resetErrors();
            if (!isAjaxUpload || (isSingleUpload && ctr > 0)) {
                if (!self.overwriteInitial) {
                    $preview.html(self.initialPreviewContent);
                    if (self.initialPreviewContent.length > 0) {
                        self.initPreviewDeletes();
                    }
                } else {
                    $preview.html('');
                }
                
                if (isSingleUpload && ctr > 0) {
                    self.filestack = [];
                }
            }
            total = self.isUploadable ? self.getFileStack().length + tfiles.length : tfiles.length;
            if (self.maxFileCount > 0 && total > self.maxFileCount) {
                msg = self.msgFilesTooMany.repl('{m}', self.maxFileCount).repl('{n}', total);
                self.isError = throwError(msg, null, null, null);
                self.$captionContainer.find('.kv-caption-icon').hide();
                self.$caption.html(self.msgValidationError);
                self.setEllipsis();
                self.$container.removeClass('file-input-new file-input-ajax-new');
                return;
            }
            if (!self.isIE9) {
                self.readFiles(tfiles);
            } else {
                self.updateFileDetails(1);
            }
            if (isAjaxUpload) {
                self.raise('filebatchselected', [self.getFileStack()]);
            } else {
                self.raise('filebatchselected', [tfiles]);
            }
            self.reader = null;
        },
        autoSizeImage: function (previewId) {
            var self = this, $preview = self.$preview,
                $thumb = $preview.find("#" + previewId),
                $img = $thumb.find('img'), w1, w2, $cap;
            if (!$img.length) {
                return;
            }
            $img.on('load', function () {
                w1 = $thumb.width();
                w2 = $preview.width();
                if (w1 > w2) {
                    $img.css('width', '100%');
                    $thumb.css('width', '97%');
                }
                $cap = $img.closest('.file-preview-frame').find('.file-caption-name');
                if ($cap.length) {
                    $cap.width($img.width());
                    $cap.attr('title', $cap.text());
                }
                self.raise('fileimageloaded', previewId);
            });
        },
        setCaption: function (content) {
            var self = this, title = $('<div>' + content + '</div>').text(),
                icon = self.getLayoutTemplate('icon'),
                out = icon + title;
            if (self.$caption.length === 0) {
                return;
            }
            self.$caption.html(out);
            self.$caption.attr('title', title);
            self.$captionContainer.find('.file-caption-ellipsis').attr('title', title);
            self.setEllipsis();
        },
        initBrowse: function ($container) {
            var self = this;
            self.$btnFile = $container.find('.btn-file');
            self.$btnFile.append(self.$element);
        },
        createContainer: function () {
            var self = this,
                $container = $(document.createElement("span"))
                    .attr({"class": 'file-input file-input-new'})
                    .html(self.renderMain());
            self.$element.before($container);
            self.initBrowse($container);
            return $container;
        },
        refreshContainer: function () {
            var self = this, $container = self.$container;
            $container.before(self.$element);
            $container.html(self.renderMain());
            self.initBrowse($container);
        },
        renderMain: function () {
            var self = this, dropCss = (self.isUploadable && self.dropZoneEnabled) ? ' file-drop-zone' : '',
                preview = self.showPreview ? self.getLayoutTemplate('preview').repl('{class}', self.previewClass)
                    .repl('{dropClass}', dropCss) : '',
                css = self.isDisabled ? self.captionClass + ' file-caption-disabled' : self.captionClass,
                caption = self.captionTemplate.repl('{class}', css + ' kv-fileinput-caption');
            return self.mainTemplate.repl('{class}', self.mainClass)
                .repl('{preview}', preview)
                .repl('{caption}', caption)
                .repl('{upload}', self.renderUpload())
                .repl('{remove}', self.renderRemove())
                .repl('{cancel}', self.renderCancel())
                .repl('{browse}', self.renderBrowse());
        },
        renderBrowse: function () {
            var self = this, css = self.browseClass + ' btn-file', status = '';
            if (self.isDisabled) {
                status = ' disabled ';
            }
            return '<div class="' + css + '"' + status + '> ' + self.browseIcon + self.browseLabel + ' </div>';
        },
        renderRemove: function () {
            var self = this, css = self.removeClass + ' fileinput-remove fileinput-remove-button', status = '';
            if (!self.showRemove) {
                return '';
            }
            if (self.isDisabled) {
                status = ' disabled ';
            }
            return '<button type="button" title="' + self.removeTitle + '" class="' + css + '"' + status + '>' + self.removeIcon + self.removeLabel + '</button>';
        },
        renderCancel: function () {
            var self = this, css = self.cancelClass + ' fileinput-cancel fileinput-cancel-button';
            if (!self.showCancel) {
                return '';
            }
            return '<button type="button" title="' + self.cancelTitle + '" class="hide ' + css + '">' + self.cancelIcon + self.cancelLabel + '</button>';
        },
        renderUpload: function () {
            var self = this, css = self.uploadClass + ' kv-fileinput-upload fileinput-upload-button', content = '', status = '';
            if (!self.showUpload) {
                return '';
            }
            if (self.isDisabled) {
                status = ' disabled ';
            }
            if (!self.isUploadable || self.isDisabled) {
                content = '<button type="submit" title="' + self.uploadTitle + '"class="' + css + '"' + status + '>' + self.uploadIcon + self.uploadLabel + '</button>';
            } else {
                content = '<a href="' + self.uploadUrl + '" title="' + self.uploadTitle + '" class="' + css + '"' + status + '>' + self.uploadIcon + self.uploadLabel + '</a>';
            }
            return content;
        }
    };

    //FileInput plugin definition
    $.fn.fileinput = function (option) {
        if (!hasFileAPISupport() && !isIE(9)) {
            return;
        }

        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('fileinput'),
                options = typeof option === 'object' && option;

            if (!data) {
                data = new FileInput(this, $.extend({}, $.fn.fileinput.defaults, options, $(this).data()));
                $this.data('fileinput', data);
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.fileinput.defaults = {
        showCaption: true,
        showPreview: true,
        showRemove: true,
        showUpload: true,
        showCancel: true,
        mainClass: '',
        previewClass: '',
        captionClass: '',
        mainTemplate: null,
        initialCaption: '',
        initialPreview: '',
        initialPreviewCount: 0,
        initialPreviewDelimiter: '*$$*',
        initialPreviewConfig: [],
        initialPreviewShowDelete: true,
        deleteUrl: '',
        deleteExtraData: {},
        overwriteInitial: true,
        layoutTemplates: defaultLayoutTemplates,
        previewTemplates: defaultPreviewTemplates,
        allowedPreviewTypes: defaultPreviewTypes,
        allowedPreviewMimeTypes: null,
        allowedFileTypes: null,
        allowedFileExtensions: null,
        customLayoutTags: {},
        customPreviewTags: {},
        previewSettings: defaultPreviewSettings,
        fileTypeSettings: defaultFileTypeSettings,
        previewFileIcon: '<i class="glyphicon glyphicon-file"></i>',
        browseLabel: 'Browse &hellip;',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i> &nbsp;',
        browseClass: 'btn btn-primary',
        removeLabel: 'Remove',
        removeTitle: 'Clear selected files',
        removeIcon: '<i class="glyphicon glyphicon-trash"></i> ',
        removeClass: 'btn btn-default',
        cancelLabel: 'Cancel',
        cancelTitle: 'Abort ongoing upload',
        cancelIcon: '<i class="glyphicon glyphicon-ban-circle"></i> ',
        cancelClass: 'btn btn-default',
        uploadLabel: 'Upload',
        uploadTitle: 'Upload selected files',
        uploadIcon: '<i class="glyphicon glyphicon-upload"></i> ',
        uploadClass: 'btn btn-default',
        uploadUrl: null,
        uploadAsync: true,
        uploadExtraData: {},
        maxFileSize: 0,
        maxFileCount: 0,
        msgSizeTooLarge: 'File "{name}" (<b>{size} KB</b>) exceeds maximum allowed upload size of <b>{maxSize} KB</b>. Please retry your upload!',
        msgFilesTooMany: 'Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>. Please retry your upload!',
        msgFileNotFound: 'File "{name}" not found!',
        msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
        msgFileNotReadable: 'File "{name}" is not readable.',
        msgFilePreviewAborted: 'File preview aborted for "{name}".',
        msgFilePreviewError: 'An error occurred while reading the file "{name}".',
        msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
        msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
        msgValidationError: '<span class="text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i> File Upload Error</span>',
        msgErrorClass: 'file-error-message',
        msgLoading: 'Loading  file {index} of {files} &hellip;',
        msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
        msgSelected: '{n} files selected',
        progressClass: "progress-bar progress-bar-success progress-bar-striped active",
        progressCompleteClass: "progress-bar progress-bar-success",
        previewFileType: 'image',
        wrapTextLength: 250,
        wrapIndicator: ' <span class="wrap-indicator" title="{title}" onclick="{dialog}">[&hellip;]</span>',
        elCaptionContainer: null,
        elCaptionText: null,
        elPreviewContainer: null,
        elPreviewImage: null,
        elPreviewStatus: null,
        elErrorContainer: null,
        slugCallback: null,
        dropZoneEnabled: true,
        dropZoneTitle: 'Drag & drop files here &hellip;',
        dropZoneTitleClass: 'file-drop-zone-title',
        fileActionSettings: {},
        otherActionButtons: '',
        textEncoding: 'UTF-8',
        ajaxSettings: {}
    };

    $.fn.fileinput.Constructor = FileInput;

    /**
     * Convert automatically file inputs with class 'file'
     * into a bootstrap fileinput control.
     */
    $(document).ready(function () {
        var $input = $('input.file[type=file]'), count = $input.attr('type') ? $input.length : 0;
        if (count > 0) {
            $input.fileinput();
        }
    });
})(window.jQuery);
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		header = document.querySelector( '.navbar-default' ),
		didScroll = false,
		changeHeaderOn = 130;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		var sy = scrollY();
		if ( sy >= changeHeaderOn ) {
			classie.add( header, 'navbar-shrink' );
		}
		else {
			classie.remove( header, 'navbar-shrink' );
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();
/* jqBootstrapValidation
 * A plugin for automating validation on Twitter Bootstrap formatted forms.
 *
 * v1.3.6
 *
 * License: MIT <http://opensource.org/licenses/mit-license.php> - see LICENSE file
 *
 * http://ReactiveRaven.github.com/jqBootstrapValidation/
 */

(function( $ ){

	var createdElements = [];

	var defaults = {
		options: {
			prependExistingHelpBlock: false,
			sniffHtml: true, // sniff for 'required', 'maxlength', etc
			preventSubmit: true, // stop the form submit event from firing if validation fails
			submitError: false, // function called if there is an error when trying to submit
			submitSuccess: false, // function called just before a successful submit event is sent to the server
            semanticallyStrict: false, // set to true to tidy up generated HTML output
			autoAdd: {
				helpBlocks: true
			},
            filter: function () {
                // return $(this).is(":visible"); // only validate elements you can see
                return true; // validate everything
            }
		},
    methods: {
      init : function( options ) {

        var settings = $.extend(true, {}, defaults);

        settings.options = $.extend(true, settings.options, options);

        var $siblingElements = this;

        var uniqueForms = $.unique(
          $siblingElements.map( function () {
            return $(this).parents("form")[0];
          }).toArray()
        );

        $(uniqueForms).bind("submit", function (e) {
          var $form = $(this);
          var warningsFound = 0;
          var $inputs = $form.find("input,textarea,select").not("[type=submit],[type=image]").filter(settings.options.filter);
          $inputs.trigger("submit.validation").trigger("validationLostFocus.validation");

          $inputs.each(function (i, el) {
            var $this = $(el),
              $controlGroup = $this.parents(".form-group").first();
            if (
              $controlGroup.hasClass("warning")
            ) {
              $controlGroup.removeClass("warning").addClass("error");
              warningsFound++;
            }
          });

          $inputs.trigger("validationLostFocus.validation");

          if (warningsFound) {
            if (settings.options.preventSubmit) {
              e.preventDefault();
            }
            $form.addClass("error");
            if ($.isFunction(settings.options.submitError)) {
              settings.options.submitError($form, e, $inputs.jqBootstrapValidation("collectErrors", true));
            }
          } else {
            $form.removeClass("error");
            if ($.isFunction(settings.options.submitSuccess)) {
              settings.options.submitSuccess($form, e);
            }
          }
        });

        return this.each(function(){

          // Get references to everything we're interested in
          var $this = $(this),
            $controlGroup = $this.parents(".form-group").first(),
            $helpBlock = $controlGroup.find(".help-block").first(),
            $form = $this.parents("form").first(),
            validatorNames = [];

          // create message container if not exists
          if (!$helpBlock.length && settings.options.autoAdd && settings.options.autoAdd.helpBlocks) {
              $helpBlock = $('<div class="help-block" />');
              $controlGroup.find('.controls').append($helpBlock);
							createdElements.push($helpBlock[0]);
          }

          // =============================================================
          //                                     SNIFF HTML FOR VALIDATORS
          // =============================================================

          // *snort sniff snuffle*

          if (settings.options.sniffHtml) {
            var message = "";
            // ---------------------------------------------------------
            //                                                   PATTERN
            // ---------------------------------------------------------
            if ($this.attr("pattern") !== undefined) {
              message = "Not in the expected format<!-- data-validation-pattern-message to override -->";
              if ($this.data("validationPatternMessage")) {
                message = $this.data("validationPatternMessage");
              }
              $this.data("validationPatternMessage", message);
              $this.data("validationPatternRegex", $this.attr("pattern"));
            }
            // ---------------------------------------------------------
            //                                                       MAX
            // ---------------------------------------------------------
            if ($this.attr("max") !== undefined || $this.attr("aria-valuemax") !== undefined) {
              var max = ($this.attr("max") !== undefined ? $this.attr("max") : $this.attr("aria-valuemax"));
              message = "Too high: Maximum of '" + max + "'<!-- data-validation-max-message to override -->";
              if ($this.data("validationMaxMessage")) {
                message = $this.data("validationMaxMessage");
              }
              $this.data("validationMaxMessage", message);
              $this.data("validationMaxMax", max);
            }
            // ---------------------------------------------------------
            //                                                       MIN
            // ---------------------------------------------------------
            if ($this.attr("min") !== undefined || $this.attr("aria-valuemin") !== undefined) {
              var min = ($this.attr("min") !== undefined ? $this.attr("min") : $this.attr("aria-valuemin"));
              message = "Too low: Minimum of '" + min + "'<!-- data-validation-min-message to override -->";
              if ($this.data("validationMinMessage")) {
                message = $this.data("validationMinMessage");
              }
              $this.data("validationMinMessage", message);
              $this.data("validationMinMin", min);
            }
            // ---------------------------------------------------------
            //                                                 MAXLENGTH
            // ---------------------------------------------------------
            if ($this.attr("maxlength") !== undefined) {
              message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";
              if ($this.data("validationMaxlengthMessage")) {
                message = $this.data("validationMaxlengthMessage");
              }
              $this.data("validationMaxlengthMessage", message);
              $this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
            }
            // ---------------------------------------------------------
            //                                                 MINLENGTH
            // ---------------------------------------------------------
            if ($this.attr("minlength") !== undefined) {
              message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";
              if ($this.data("validationMinlengthMessage")) {
                message = $this.data("validationMinlengthMessage");
              }
              $this.data("validationMinlengthMessage", message);
              $this.data("validationMinlengthMinlength", $this.attr("minlength"));
            }
            // ---------------------------------------------------------
            //                                                  REQUIRED
            // ---------------------------------------------------------
            if ($this.attr("required") !== undefined || $this.attr("aria-required") !== undefined) {
              message = settings.builtInValidators.required.message;
              if ($this.data("validationRequiredMessage")) {
                message = $this.data("validationRequiredMessage");
              }
              $this.data("validationRequiredMessage", message);
            }
            // ---------------------------------------------------------
            //                                                    NUMBER
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "number") {
              message = settings.builtInValidators.number.message;
              if ($this.data("validationNumberMessage")) {
                message = $this.data("validationNumberMessage");
              }
              $this.data("validationNumberMessage", message);
            }
            // ---------------------------------------------------------
            //                                                     EMAIL
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email") {
              message = "Not a valid email address<!-- data-validator-validemail-message to override -->";
              if ($this.data("validationValidemailMessage")) {
                message = $this.data("validationValidemailMessage");
              } else if ($this.data("validationEmailMessage")) {
                message = $this.data("validationEmailMessage");
              }
              $this.data("validationValidemailMessage", message);
            }
            // ---------------------------------------------------------
            //                                                MINCHECKED
            // ---------------------------------------------------------
            if ($this.attr("minchecked") !== undefined) {
              message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";
              if ($this.data("validationMincheckedMessage")) {
                message = $this.data("validationMincheckedMessage");
              }
              $this.data("validationMincheckedMessage", message);
              $this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
            }
            // ---------------------------------------------------------
            //                                                MAXCHECKED
            // ---------------------------------------------------------
            if ($this.attr("maxchecked") !== undefined) {
              message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";
              if ($this.data("validationMaxcheckedMessage")) {
                message = $this.data("validationMaxcheckedMessage");
              }
              $this.data("validationMaxcheckedMessage", message);
              $this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
            }
          }

          // =============================================================
          //                                       COLLECT VALIDATOR NAMES
          // =============================================================

          // Get named validators
          if ($this.data("validation") !== undefined) {
            validatorNames = $this.data("validation").split(",");
          }

          // Get extra ones defined on the element's data attributes
          $.each($this.data(), function (i, el) {
            var parts = i.replace(/([A-Z])/g, ",$1").split(",");
            if (parts[0] === "validation" && parts[1]) {
              validatorNames.push(parts[1]);
            }
          });

          // =============================================================
          //                                     NORMALISE VALIDATOR NAMES
          // =============================================================

          var validatorNamesToInspect = validatorNames;
          var newValidatorNamesToInspect = [];

          do // repeatedly expand 'shortcut' validators into their real validators
          {
            // Uppercase only the first letter of each name
            $.each(validatorNames, function (i, el) {
              validatorNames[i] = formatValidatorName(el);
            });

            // Remove duplicate validator names
            validatorNames = $.unique(validatorNames);

            // Pull out the new validator names from each shortcut
            newValidatorNamesToInspect = [];
            $.each(validatorNamesToInspect, function(i, el) {
              if ($this.data("validation" + el + "Shortcut") !== undefined) {
                // Are these custom validators?
                // Pull them out!
                $.each($this.data("validation" + el + "Shortcut").split(","), function(i2, el2) {
                  newValidatorNamesToInspect.push(el2);
                });
              } else if (settings.builtInValidators[el.toLowerCase()]) {
                // Is this a recognised built-in?
                // Pull it out!
                var validator = settings.builtInValidators[el.toLowerCase()];
                if (validator.type.toLowerCase() === "shortcut") {
                  $.each(validator.shortcut.split(","), function (i, el) {
                    el = formatValidatorName(el);
                    newValidatorNamesToInspect.push(el);
                    validatorNames.push(el);
                  });
                }
              }
            });

            validatorNamesToInspect = newValidatorNamesToInspect;

          } while (validatorNamesToInspect.length > 0)

          // =============================================================
          //                                       SET UP VALIDATOR ARRAYS
          // =============================================================

          var validators = {};

          $.each(validatorNames, function (i, el) {
            // Set up the 'override' message
            var message = $this.data("validation" + el + "Message");
            var hasOverrideMessage = (message !== undefined);
            var foundValidator = false;
            message =
              (
                message
                  ? message
                  : "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->"
              )
            ;

            $.each(
              settings.validatorTypes,
              function (validatorType, validatorTemplate) {
                if (validators[validatorType] === undefined) {
                  validators[validatorType] = [];
                }
                if (!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined) {
                  validators[validatorType].push(
                    $.extend(
                      true,
                      {
                        name: formatValidatorName(validatorTemplate.name),
                        message: message
                      },
                      validatorTemplate.init($this, el)
                    )
                  );
                  foundValidator = true;
                }
              }
            );

            if (!foundValidator && settings.builtInValidators[el.toLowerCase()]) {

              var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);
              if (hasOverrideMessage) {
                validator.message = message;
              }
              var validatorType = validator.type.toLowerCase();

              if (validatorType === "shortcut") {
                foundValidator = true;
              } else {
                $.each(
                  settings.validatorTypes,
                  function (validatorTemplateType, validatorTemplate) {
                    if (validators[validatorTemplateType] === undefined) {
                      validators[validatorTemplateType] = [];
                    }
                    if (!foundValidator && validatorType === validatorTemplateType.toLowerCase()) {
                      $this.data("validation" + el + formatValidatorName(validatorTemplate.name), validator[validatorTemplate.name.toLowerCase()]);
                      validators[validatorType].push(
                        $.extend(
                          validator,
                          validatorTemplate.init($this, el)
                        )
                      );
                      foundValidator = true;
                    }
                  }
                );
              }
            }

            if (! foundValidator) {
              $.error("Cannot find validation info for '" + el + "'");
            }
          });

          // =============================================================
          //                                         STORE FALLBACK VALUES
          // =============================================================

          $helpBlock.data(
            "original-contents",
            (
              $helpBlock.data("original-contents")
                ? $helpBlock.data("original-contents")
                : $helpBlock.html()
            )
          );

          $helpBlock.data(
            "original-role",
            (
              $helpBlock.data("original-role")
                ? $helpBlock.data("original-role")
                : $helpBlock.attr("role")
            )
          );

          $controlGroup.data(
            "original-classes",
            (
              $controlGroup.data("original-clases")
                ? $controlGroup.data("original-classes")
                : $controlGroup.attr("class")
            )
          );

          $this.data(
            "original-aria-invalid",
            (
              $this.data("original-aria-invalid")
                ? $this.data("original-aria-invalid")
                : $this.attr("aria-invalid")
            )
          );

          // =============================================================
          //                                                    VALIDATION
          // =============================================================

          $this.bind(
            "validation.validation",
            function (event, params) {

              var value = getValue($this);

              // Get a list of the errors to apply
              var errorsFound = [];

              $.each(validators, function (validatorType, validatorTypeArray) {
                if (value || value.length || (params && params.includeEmpty) || (!!settings.validatorTypes[validatorType].blockSubmit && params && !!params.submitting)) {
                  $.each(validatorTypeArray, function (i, validator) {
                    if (settings.validatorTypes[validatorType].validate($this, value, validator)) {
                      errorsFound.push(validator.message);
                    }
                  });
                }
              });

              return errorsFound;
            }
          );

          $this.bind(
            "getValidators.validation",
            function () {
              return validators;
            }
          );

          // =============================================================
          //                                             WATCH FOR CHANGES
          // =============================================================
          $this.bind(
            "submit.validation",
            function () {
              return $this.triggerHandler("change.validation", {submitting: true});
            }
          );
          $this.bind(
            [
              "keyup",
              "focus",
              "blur",
              "click",
              "keydown",
              "keypress",
              "change"
            ].join(".validation ") + ".validation",
            function (e, params) {

              var value = getValue($this);

              var errorsFound = [];

              $controlGroup.find("input,textarea,select").each(function (i, el) {
                var oldCount = errorsFound.length;
                $.each($(el).triggerHandler("validation.validation", params), function (j, message) {
                  errorsFound.push(message);
                });
                if (errorsFound.length > oldCount) {
                  $(el).attr("aria-invalid", "true");
                } else {
                  var original = $this.data("original-aria-invalid");
                  $(el).attr("aria-invalid", (original !== undefined ? original : false));
                }
              });

              $form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");

              errorsFound = $.unique(errorsFound.sort());

              // Were there any errors?
              if (errorsFound.length) {
                // Better flag it up as a warning.
                $controlGroup.removeClass("success error").addClass("warning");

                // How many errors did we find?
                if (settings.options.semanticallyStrict && errorsFound.length === 1) {
                  // Only one? Being strict? Just output it.
                  $helpBlock.html(errorsFound[0] + 
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                } else {
                  // Multiple? Being sloppy? Glue them together into an UL.
                  $helpBlock.html("<ul role=\"alert\"><li>" + errorsFound.join("</li><li>") + "</li></ul>" +
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                }
              } else {
                $controlGroup.removeClass("warning error success");
                if (value.length > 0) {
                  $controlGroup.addClass("success");
                }
                $helpBlock.html($helpBlock.data("original-contents"));
              }

              if (e.type === "blur") {
                $controlGroup.removeClass("success");
              }
            }
          );
          $this.bind("validationLostFocus.validation", function () {
            $controlGroup.removeClass("success");
          });
        });
      },
      destroy : function( ) {

        return this.each(
          function() {

            var
              $this = $(this),
              $controlGroup = $this.parents(".form-group").first(),
              $helpBlock = $controlGroup.find(".help-block").first();

            // remove our events
            $this.unbind('.validation'); // events are namespaced.
            // reset help text
            $helpBlock.html($helpBlock.data("original-contents"));
            // reset classes
            $controlGroup.attr("class", $controlGroup.data("original-classes"));
            // reset aria
            $this.attr("aria-invalid", $this.data("original-aria-invalid"));
            // reset role
            $helpBlock.attr("role", $this.data("original-role"));
						// remove all elements we created
						if (createdElements.indexOf($helpBlock[0]) > -1) {
							$helpBlock.remove();
						}

          }
        );

      },
      collectErrors : function(includeEmpty) {

        var errorMessages = {};
        this.each(function (i, el) {
          var $el = $(el);
          var name = $el.attr("name");
          var errors = $el.triggerHandler("validation.validation", {includeEmpty: true});
          errorMessages[name] = $.extend(true, errors, errorMessages[name]);
        });

        $.each(errorMessages, function (i, el) {
          if (el.length === 0) {
            delete errorMessages[i];
          }
        });

        return errorMessages;

      },
      hasErrors: function() {

        var errorMessages = [];

        this.each(function (i, el) {
          errorMessages = errorMessages.concat(
            $(el).triggerHandler("getValidators.validation") ? $(el).triggerHandler("validation.validation", {submitting: true}) : []
          );
        });

        return (errorMessages.length > 0);
      },
      override : function (newDefaults) {
        defaults = $.extend(true, defaults, newDefaults);
      }
    },
		validatorTypes: {
      callback: {
        name: "callback",
        init: function ($this, name) {
          return {
            validatorName: name,
            callback: $this.data("validation" + name + "Callback"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (validator.lastValue === value && validator.lastFinished) {
            return !validator.lastValid;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;

            var rrjqbvValidator = validator;
            var rrjqbvThis = $this;
            executeFunctionByName(
              validator.callback,
              window,
              $this,
              value,
              function (data) {
                if (rrjqbvValidator.lastValue === data.value) {
                  rrjqbvValidator.lastValid = data.valid;
                  if (data.message) {
                    rrjqbvValidator.message = data.message;
                  }
                  rrjqbvValidator.lastFinished = true;
                  rrjqbvThis.data("validation" + rrjqbvValidator.validatorName + "Message", rrjqbvValidator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    rrjqbvThis.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              }
            );
          }

          return false;

        }
      },
      ajax: {
        name: "ajax",
        init: function ($this, name) {
          return {
            validatorName: name,
            url: $this.data("validation" + name + "Ajax"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (""+validator.lastValue === ""+value && validator.lastFinished === true) {
            return validator.lastValid === false;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            $.ajax({
              url: validator.url,
              data: "value=" + value + "&field=" + $this.attr("name"),
              dataType: "json",
              success: function (data) {
                if (""+validator.lastValue === ""+data.value) {
                  validator.lastValid = !!(data.valid);
                  if (data.message) {
                    validator.message = data.message;
                  }
                  validator.lastFinished = true;
                  $this.data("validation" + validator.validatorName + "Message", validator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    $this.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              },
              failure: function () {
                validator.lastValid = true;
                validator.message = "ajax call failed";
                validator.lastFinished = true;
                $this.data("validation" + validator.validatorName + "Message", validator.message);
                // Timeout is set to avoid problems with the events being considered 'already fired'
                setTimeout(function () {
                  $this.trigger("change.validation");
                }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
              }
            });
          }

          return false;

        }
      },
			regex: {
				name: "regex",
				init: function ($this, name) {
					return {regex: regexFromString($this.data("validation" + name + "Regex"))};
				},
				validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative)
						|| (validator.regex.test(value) && validator.negative);
				}
			},
			required: {
				name: "required",
				init: function ($this, name) {
					return {};
				},
				validate: function ($this, value, validator) {
					return !!(value.length === 0  && ! validator.negative)
						|| !!(value.length > 0 && validator.negative);
				},
        blockSubmit: true
			},
			match: {
				name: "match",
				init: function ($this, name) {
					var element = $this.parents("form").first().find("[name=\"" + $this.data("validation" + name + "Match") + "\"]").first();
					element.bind("validation.validation", function () {
						$this.trigger("change.validation", {submitting: true});
					});
					return {"element": element};
				},
				validate: function ($this, value, validator) {
					return (value !== validator.element.val() && ! validator.negative)
						|| (value === validator.element.val() && validator.negative);
				},
        blockSubmit: true
			},
			max: {
				name: "max",
				init: function ($this, name) {
					return {max: $this.data("validation" + name + "Max")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value, 10) > parseFloat(validator.max, 10) && ! validator.negative)
						|| (parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative);
				}
			},
			min: {
				name: "min",
				init: function ($this, name) {
					return {min: $this.data("validation" + name + "Min")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value) < parseFloat(validator.min) && ! validator.negative)
						|| (parseFloat(value) >= parseFloat(validator.min) && validator.negative);
				}
			},
			maxlength: {
				name: "maxlength",
				init: function ($this, name) {
					return {maxlength: $this.data("validation" + name + "Maxlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length > validator.maxlength) && ! validator.negative)
						|| ((value.length <= validator.maxlength) && validator.negative);
				}
			},
			minlength: {
				name: "minlength",
				init: function ($this, name) {
					return {minlength: $this.data("validation" + name + "Minlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length < validator.minlength) && ! validator.negative)
						|| ((value.length >= validator.minlength) && validator.negative);
				}
			},
			maxchecked: {
				name: "maxchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {maxchecked: $this.data("validation" + name + "Maxchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length > validator.maxchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative);
				},
        blockSubmit: true
			},
			minchecked: {
				name: "minchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {minchecked: $this.data("validation" + name + "Minchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length < validator.minchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length >= validator.minchecked && validator.negative);
				},
        blockSubmit: true
			}
		},
		builtInValidators: {
			email: {
				name: "Email",
				type: "shortcut",
				shortcut: "validemail"
			},
			validemail: {
				name: "Validemail",
				type: "regex",
				regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\.[A-Za-z]{2,4}",
				message: "Not a valid email address<!-- data-validator-validemail-message to override -->"
			},
			passwordagain: {
				name: "Passwordagain",
				type: "match",
				match: "password",
				message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
			},
			positive: {
				name: "Positive",
				type: "shortcut",
				shortcut: "number,positivenumber"
			},
			negative: {
				name: "Negative",
				type: "shortcut",
				shortcut: "number,negativenumber"
			},
			number: {
				name: "Number",
				type: "regex",
				regex: "([+-]?\\\d+(\\\.\\\d*)?([eE][+-]?[0-9]+)?)?",
				message: "Must be a number<!-- data-validator-number-message to override -->"
			},
			integer: {
				name: "Integer",
				type: "regex",
				regex: "[+-]?\\\d+",
				message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
			},
			positivenumber: {
				name: "Positivenumber",
				type: "min",
				min: 0,
				message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
			},
			negativenumber: {
				name: "Negativenumber",
				type: "max",
				max: 0,
				message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
			},
			required: {
				name: "Required",
				type: "required",
				message: "This is required<!-- data-validator-required-message to override -->"
			},
			checkone: {
				name: "Checkone",
				type: "minchecked",
				minchecked: 1,
				message: "Check at least one option<!-- data-validation-checkone-message to override -->"
			}
		}
	};

	var formatValidatorName = function (name) {
		return name
			.toLowerCase()
			.replace(
				/(^|\s)([a-z])/g ,
				function(m,p1,p2) {
					return p1+p2.toUpperCase();
				}
			)
		;
	};

	var getValue = function ($this) {
		// Extract the value we're talking about
		var value = $this.val();
		var type = $this.attr("type");
		if (type === "checkbox") {
			value = ($this.is(":checked") ? value : "");
		}
		if (type === "radio") {
			value = ($('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? value : "");
		}
		return value;
	};

  function regexFromString(inputstring) {
		return new RegExp("^" + inputstring + "$");
	}

  /**
   * Thanks to Jason Bunting via StackOverflow.com
   *
   * http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string#answer-359910
   * Short link: http://tinyurl.com/executeFunctionByName
  **/
  function executeFunctionByName(functionName, context /*, args*/) {
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
  }

	$.fn.jqBootstrapValidation = function( method ) {

		if ( defaults.methods[method] ) {
			return defaults.methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return defaults.methods.init.apply( this, arguments );
		} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.jqBootstrapValidation' );
			return null;
		}

	};

  $.jqBootstrapValidation = function (options) {
    $(":input").not("[type=image],[type=submit]").jqBootstrapValidation.apply(this,arguments);
  };

})( jQuery );

$(function() {

    $("#contact input,#contact textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "././mail/contact_me.php",
                type: "POST",
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});

/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});