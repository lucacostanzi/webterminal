/*
 *  FILE NAME:    jquery.webterminal.js
 *  AUTHOR:       Luca Costanzi (luca.costanzi@gmail.com)
 *  --------------------------
 *  DESCRIPTION:
 *
 *  VERSIONS:
 *  0.4
 */
(function($) {
// custom select class
    function launchIntoFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    function commandLine(item, options) {

        this.options = $.extend({
            tree: {Root: {"readme.txt": "<--------------Welcome on Link WebOS!-----------------></br><br/>You can use the UP and DOWN arrow keys to scroll through previosly executed commands.<br/>Start typing a file or directory name and press TAB to autocomplete it.</br>Executables (EXE) files can be launched just by typing the filename."}},
            brightness: 0,
            baseFolder: "C:",
            title: "<div id=\"title\"><span class='newfont'>LINK WEBOS84</span><br/>now loading<span id='cursor'>..</span></div>",
            pageContent: "Link WebOS84 [Version 1.0.0.2]<br/>Copyright 1983 Luca Costanzi. All rights reserved.<br/><br/>Type HELP and press ENTER to display a list of commands.<br/>To know more check the file readme.txt.<br/><br/>"
        }, options);
        this.tree = this.options.tree;
        this.lineNr = 0;
        this.browseNr = 0;
        this.linesContent = [];
        this.linesContent[this.lineNr] = "";
        this.cursor = "<span id='cursor'>&nbsp;</span>";
        this.cursorPosition = 0;
        this.f = 1;
        this.baseFolder = this.options.baseFolder;
        this.curFolder = this.options.baseFolder;
        this.monitor = $(item);
        this.monitor.html("<div id=\"grid\"></div>");
        this.grid = $("#grid");
        this.windowsArray = [];
        this.loggedIn = false;
        this.password = "";
        this.pageContent = this.options.pageContent;
        this.isMobile = false;
        this.isPaused = false;
        this.continuePrinting = 1;
        this.isWriting = false;
        this.autoStart = this.options.autostart;
        this.boot();
    }

    commandLine.prototype = {
        boot: function() {
            var h= $(window).height() - 60;
            this.grid.css("height",h+"px");
            this.grid.html(this.options.title);
            $(".newfont").css("font-size",$( "#monitor" ).width()*(12/160))
            setTimeout(this.startConsole.bind(this), 6000);
        },
        createWindow: function() {

            t = this;
            nwindows = t.windowsArray.length;
            nextNWindow = nwindows++;
            htmlTags = "<div class=\"window\" id='window" + nextNWindow + "'><div id='topbar" + nextNWindow + "' class=\"topbar\"><div id='exetitle" + nextNWindow + "' class=\"exetitle\"></div><div id='closeBtn" + nextNWindow + "' class=\"closeBtn\">X</div></div><iframe src=\"\" id='exewindow" + nextNWindow + "' class=\"exewindow\" ></iframe></div>";
            t.monitor.append(htmlTags);
            nw = t.windowsArray[nextNWindow] = $("#window" + nextNWindow);
            nw.draggable(
                {
                    handle: "#topbar" + nextNWindow,
                }
            );
            nw.resizable();
            t.windowsArray[nextNWindow].find(".closeBtn").on("click", function() {
                $(this).remove();
                t.monitor.focus();
                t.grid.scrollTop(t.grid[0].scrollHeight + 20);
            }.bind(t.windowsArray[nextNWindow]));
            return nextNWindow;
        },
        startConsole: function() {
            var t = this;
            var isMobile = false; //initiate as false
            // device detection
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
            {
                t.isMobile = true;
            }else{
            }

            setInterval(function() {
                if($("#hiddenInput").is(":focus") || isMobile){
                    $("#cursor").html("");
                }else{
                    if (t.f) {
                        t.f = 0;
                        $('#cursor').css("text-decoration", "underline");
                    } else {
                        t.f = 1;
                        $('#cursor').css("text-decoration", "none");
                    }
                }
            }, 500);
            launch = "";
            if(t.autoStart != undefined && t.autoStart != ""){
                launch = t.autostart;
            }
            t.grid.html(t.pageContent + t.curFolder + "\\\>" + t.linesContent[t.lineNr] + launch + t.cursor +'<input type="text" id="hiddenInput" />');
            t.grid.attr("tabindex", -1).focus();
            if(t.autoStart != undefined && t.autoStart != ""){
                t.executeLine(t.autoStart.toLowerCase());
            }
            $(document).keydown(function(e) {
                keyCode = e.keyCode;
                if (keyCode == 9 || keyCode == 8 || keyCode == 40 || keyCode == 38 || keyCode == 13 || keyCode == 37 || keyCode == 39 || keyCode == 32 || keyCode == 46) {
                    e.preventDefault();
                    t.checkPressedKey(e, 1);
                }


            });
            $(document).keypress(function(e) {
                keyCode = e.keyCode;
                t.checkPressedKey(e, 0);
            });
            if(t.isMobile) {
                $("#hiddenInput").focus();
                $("#hiddenInput").click();
            }
        },
        checkPressedKey: function(e, keydown, callback) {
            var t = this;
            t.linesContent[t.lineNr] = t.linesContent[t.lineNr].replace("<span id='cursor'>", '');
            t.linesContent[t.lineNr] = t.linesContent[t.lineNr].replace("</span>", '');
            var keynum;
            if (window.event) { // IE
                keynum = e.keyCode;
            } else
            if (e.which) { // Netscape/Firefox/Opera
                keynum = e.which;
            }
            value = String.fromCharCode(keynum);
            keyCode = e.keyCode;
            if (keyCode === 13) {//return
                if(t.isPaused){
                    t.continuePrinting++;
                    t.isPaused = false;
                }else{
                    if(!t.isWriting){
                        command = $.trim(t.linesContent[t.lineNr]).toLowerCase();
                        if(command == ""){
                            command = $("#hiddenInput").val();
                        }
                        addslash = "";
                        if(t.curFolder=="C:"){
                            addslash = "\\";
                        }
                        t.pageContent += t.curFolder + addslash +"\>" + command + "<br/>";
                        t.lineNr++;
                        t.linesContent[t.lineNr] = "";
                        t.browseNr = t.lineNr;
                        value = "";
                        t.cursorPosition = 0;
                        t.executeLine(command.toLowerCase());
                    }
                }
            }
            if(t.isWriting) {
                return false;
            }
            if (keyCode === 37) {//arrow left
                value = "";
                if (t.cursorPosition > 0)
                    t.cursorPosition--;
            }
            if (keyCode === 39) {//arrow right
                value = "";
                if (t.cursorPosition < t.linesContent[t.lineNr].length)
                    t.cursorPosition++;
            }
            if (keyCode === 38) {//arrow up
                value = "";
                if (t.browseNr > 0) {
                    t.browseNr--;
                    t.linesContent[t.lineNr] = t.linesContent[t.browseNr];
                    t.cursorPosition = t.linesContent[t.browseNr].length;
                }
            }
            if (keyCode === 40) {//arrow down
                value = "";
                if (t.browseNr < t.lineNr - 1) {
                    t.browseNr++;
                    t.linesContent[t.lineNr] = t.linesContent[t.browseNr];
                    t.cursorPosition = t.linesContent[t.browseNr].length;
                }
                value = "";
            }
            if (keyCode === 8) {//delete
                value = "";
                if (t.cursorPosition - 1 >= 0) {
                    t.linesContent[t.lineNr] = t.linesContent[t.lineNr].slice(0, t.cursorPosition - 1) + t.linesContent[t.lineNr].slice(t.cursorPosition);
                    t.cursorPosition--;
                }

            }
            if (keyCode === 46 && keydown) {//canc
                value = "";
                if (t.cursorPosition + 1 <= t.linesContent[t.lineNr].length) {
                    t.linesContent[t.lineNr] = t.linesContent[t.lineNr].slice(0, t.cursorPosition) + t.linesContent[t.lineNr].slice(t.cursorPosition + 1);
                }

            }
            if (keyCode === 9) {//tab
                value = "";
                next = t.getCurFolder();
                lineElements = t.linesContent[t.lineNr].split(" ");
                if (lineElements !== undefined) {
                    if (typeof lineElements === "string") {
                        last_element = lineElements;
                    } else {
                        var last_element = lineElements[lineElements.length - 1];
                    }
                    if (last_element !== "" && last_element !== undefined) {
                        $.each(next, function(k, v) {
                            if (k.toLowerCase().indexOf(last_element.toLowerCase()) === 0) {
                                lineElements[lineElements.length - 1] = k;
                                t.linesContent[t.lineNr] = lineElements.join(" ");
                                t.cursorPosition = t.linesContent[t.browseNr].length;
                            }
                        });
                    }
                }
            }
            if (keyCode === 32) {
                e.preventDefault();
              }
            var BLIDRegExpression = /^[0-9a-zA-Z `!"?$%\^&*()_\-+={\[}\]:;@~#|<,>.'\/\\]+$/;
            if (keyCode !== 13) {
                if (BLIDRegExpression.test(value)) //
                    t.printContent(value);
                else
                    t.printContent("");
            }
        },
        printContent: function(value,slow,len) {
            if(slow===undefined) {
                slow = 0;
            }
            t = this;
            t.linesContent[t.lineNr] =
                    t.linesContent[t.lineNr].slice(0, t.cursorPosition) +
                    value +
                    "<span id='cursor'>" +
                    t.linesContent[t.lineNr].slice(t.cursorPosition, t.cursorPosition + 1) +
                    "</span>" +
                    t.linesContent[t.lineNr].slice(t.cursorPosition + 1);
            t.cursorPosition += value.length;

            addslash = "";
            if(t.curFolder=="C:"){
                addslash = "\\";
            }
            var nchars = 10000;
            newcontent = t.pageContent + t.curFolder + addslash + "\>" + t.linesContent[t.lineNr];
            if(slow>0 && !t.isMobile){
                var basetext = t.pageContent + t.curFolder + addslash + "\>";
                var base = basetext.length;
                var ind = slow+1;
                t.isPaused = false;
                var writer = setInterval(function() {
                    t.isWriting = true;
                    if(!t.isPaused){
                        t.grid.html(newcontent.substring(0,slow)+"<div id='newcontent'>"+newcontent.substring(slow,ind)+"</div>");
                        if($("#newcontent").height()+50>$("#monitor").height()*t.continuePrinting){
                            t.isPaused = true;
                            ind-=4;
                            t.grid.html(newcontent.substring(0,slow)+"<div id='newcontent'>"+newcontent.substring(slow,ind)+"</div><div id='more'>More...</div>");
                        }
                        t.grid.scrollTop(t.grid[0].scrollHeight + 20);
                        ind+=4;
                        limit = slow + len;
                        if (ind > limit) {
                            if(nchars>newcontent.length) {
                                nchars = newcontent.length;
                            }
                            newcontent = newcontent.substr(newcontent.length - nchars);
                            t.grid.html(newcontent+'<input type="text" id="hiddenInput" />');
                            t.grid.scrollTop(t.grid[0].scrollHeight + 20);
                            t.continuePrinting = 1;
                            if(t.isMobile){
                                $("#hiddenInput").focus();
                                $("#hiddenInput").click();
                            }
                            if ($("#cursor").html() === "")
                                $("#cursor").html("&nbsp;");
                            t.isWriting = false;
                            clearInterval(writer);
                        }
                    }
                }, 1);
            } else {
                if(nchars>newcontent.length) {
                    nchars = newcontent.length;
                }
                newcontent = newcontent.substr(newcontent.length - nchars);
                t.grid.html(newcontent+'<input type="text" id="hiddenInput" />');
                if ($("#cursor").html() === "")
                    $("#cursor").html("&nbsp;");
                t.grid.scrollTop(t.grid[0].scrollHeight + 20);
                if(t.isMobile){
                    $("#hiddenInput").focus();
                    $("#hiddenInput").click();
                }
            }


        },
        executeLine: function(command) {
            t = this;
            command = $.trim(command);
            commandParts = command.split(" ");
            cmd = commandParts[0];
            t.printLn("");
            if (cmd === "") {
                t.printLn("");
                t.printContent("");
                return false;
            }
            if (cmd === "help") {
                t.showHelp();
                t.printLn("");
                t.printContent("");
                return false;
            }
            if (cmd === "dir") {
                t.listFiles();
                t.printLn("");
                t.printContent("");
                return false;
            }
            if (cmd === "cd") {
                t.changeDirectory(command);
//                t.printLn("a");
                t.printContent("");
                return false;
            }
            if (cmd === "cd..") {
                t.changeDirectoryParent();
//                t.printLn("");
                t.printContent("");
                return false;
            }
            if (cmd === "type") {
                t.readFile(command);
                return false;
            }
            if (cmd === "view") {
                t.viewFile(command);
                return false;
            }
            if (cmd === "color") {
                t.changeMonitor();
                return false;
            }
            if (cmd === "login") {
                t.login(command);

                return false;
            }
            if (cmd === "logout") {
                t.logout();
                t.printLn("");
                t.printContent("");
                return false;
            }
            if (cmd === "send") {
                t.sendMessage(command);
                return false;
            }
            if (commandParts[1] === undefined) {
                t.executable(cmd);
                return false;
            }
            t.printLn("Error: unknown command " + commandParts[0]);
            t.printLn("");
            t.printContent("");
        },
        sendMessage: function(cmdToExe) {
            cmdToExe = $.trim(cmdToExe);
            parts = cmdToExe.split(" ");
            t = this;

            if (parts[1] === undefined || parts[1] === "") {
                t.printLn("Error: no message to be sent.");
                t.printLn("");
                t.printContent("");
                return false;
            }
            msg = command.substring(command.indexOf(' ') + 1);
            request = $.ajax({
                url: "../commandline/messages/messages.php",
                type: "POST",
                dataType: "text",
                data: {msg: msg},
                success: function(data, textStatus, jqXHR) {
                    t.printLn(data);
                    t.printLn("");
                    t.printContent("");
                },
                error: function(data, textStatus, jqXHR) {
                    t.printLn(textStatus);
                    t.printLn("");
                    t.printContent("");
                }
            });
        },
        refreshScreen: function() {
            t.grid.html(t.pageContent);
        },
        login: function(cmdToExe) {
            cmdToExe = $.trim(cmdToExe);
            parts = cmdToExe.split(" ");
            t = this;
            if (parts[1] !== undefined)
                password = parts[1];
            else
                return false;
            request = $.ajax({
                url: "../commandline/classes/login/login.php",
                type: "POST",
                data: {password: password},
                success: function(data, textStatus, jqXHR) {
                    if (data === "0") {
                        t.printLn("The password isn't correct.");
                    } else {
                        if (t.loggedIn) {
                            t.printLn("You are already logged in.");
                        } else {
                            t.password = password;
                            t.loggedIn = true;
                            t.printLn("You are now logged in.");

                        }
                    }
                    t.printLn("");
                    t.printContent("");
                },
                error: function(data, textStatus, jqXHR) {
                    t.printLn(textStatus);
                    t.printLn("");
                    t.printContent("");
                }
            });


        },
        logout: function() {
            t = this;
            if (!t.loggedIn) {
                t.printLn("You aren't logged in.");
            } else {
                t.loggedIn = false;
                t.printLn("You are now logged out.");
            }

        },
        printError: function(msg){
            t.printLn(msg);
            t.printLn("");
            t.printContent("");
        },
        getExecutable: function(location) {
            t = this;
            path = location.split("/");
            name = file = path[path.length - 1];
            path.pop();
            isDir = t.isDir(file);
            parts = file.split(".");
            ext = parts[1];
            if (ext === undefined || isDir) {
                t.printError("Error: "+location + " can't be read or executed.");
                return false;
            }
            var next = t.getCurFolder();
            $.each(path, function(k, v) {
                next = next[v];
            });
            if (next === undefined || next[file] === undefined) {
                t.printError("Error: "+location + " doesn't exists.");
                return false;
            }
            if (next[file].pass && !t.loggedIn) {
                t.printError("Error: you must be logged in to access this file.");
                return false;
            }
            if (typeof next[file] !== "object") {
                t.printError("Error: "+location + " is corrupted or unreadable.");
                return false;
            }
            t.executable['file'] = next[file];
            t.executable['ext'] = ext;
            t.executable['filename'] = name;
            return true;
        },
        viewFile: function(cmdToExe) {
            cmdToExe = $.trim(cmdToExe);
            partsr = cmdToExe.split(" ");
            if (partsr[1] === undefined || partsr[1] === "") {
                t.printError("Error: please specify a file to view.");
                return false;
            }
            if(!t.getExecutable(partsr[1]))
                return false;
            exeExt = t.executable.ext;
            exeFile = t.executable.file;
            exeName = t.executable.filename;
            if (exeExt !== "png" && exeExt !== "jpg") {
                t.printError("Error: can't display " + exeName +". Only jpg and pgn files are allowed.");
                return false;
            }
            nwId = t.createWindow();
            t.windowsArray[nwId].css("display", "block");
            $("#exewindow" + nwId).attr("src", "");
            $("#exetitle" + nwId).html(exeName);
            if (exeFile.width !== undefined)
                t.windowsArray[nwId].css("width", exeFile.width);
            if (exeFile.height !== undefined)
                t.windowsArray[nwId].css("height", parseInt(exeFile.height) + 20);
            if (exeExt === "png" || exeExt === "jpg") {
                $("#exewindow" + nwId).hide();
                t.windowsArray[nwId].append("<img class='loadedimg' id='loadedimg" + nwId + "' />");
                img = $("#loadedimg" + nwId);
                img.attr("src", exeFile.src).load(function() {
                    t.windowsArray[nwId].css("width", this.width);
                    t.windowsArray[nwId].css("height", parseInt(this.height) + 20);
                });
            }
            t.printLn("Viewing " + exeName);
            t.printLn("");
            t.printContent("");
            return true;
        },
        readFile: function(cmdToExe) {
            cmdToExe = $.trim(cmdToExe);
            partsr = cmdToExe.split(" ");
            if (partsr[1] === undefined || partsr[1] === "") {
                t.printError("Error: please specify a file to read.");
                return false;
            }
            if(!t.getExecutable(partsr[1]))
                return false;
            exeExt = t.executable.ext;
            exeFile = t.executable.file;
            exeName = t.executable.filename;
            if (exeExt !== "txt" && exeExt !== "mail" && exeExt !== "ascii") {
                t.printError("Error: can't read " + exeName);
                return false;
            }
            t.printLn("Reading " + exeName);
            t.printLn("");
            if (exeFile.content !== undefined) {
                if( exeExt == "ascii") {
                    exeFile.content = "<pre style='font: bold 8px/5px monospace;'>" + exeFile.content + "</pre>";
                }
                pageLen = t.pageContent.length;
                fileLen = exeFile.conten.length;
                t.printLn(exeFile.content);
                t.printLn("");

                t.printContent("",pageLen,fileLen);
            } else {
                t.getExternalContents(exeFile.src,exeExt);
            }
            return true;
        },
        executable: function(cmd) {
            t = this;
            if(!t.getExecutable(cmd))
                return false;
            exeExt = t.executable.ext;
            exeFile = t.executable.file;
            exeName = t.executable.filename;
            if (exeExt !== "exe"){
                t.printError("Error: "+file + " can't be executed.");
                return false;
            }

            nwId = t.createWindow();
            t.windowsArray[nwId].css("display", "block");
            $("#exewindow" + nwId).attr("src", "");
            $("#exetitle" + nwId).html(exeName);
            if(exeFile.fullscreen){
                t.windowsArray[nwId].css("width", $(window).width());
                t.windowsArray[nwId].css("height", $(window).height());
            }else{
                if (exeFile.width !== undefined)
                    t.windowsArray[nwId].css("width", exeFile.width);
                if (exeFile.height !== undefined)
                    t.windowsArray[nwId].css("height", parseInt(exeFile.height) + 20);
            }

            if (exeExt === "exe") {
                $("#exewindow" + nwId).show();
                $("#exewindow" + nwId).attr("src", exeFile.src);
                $("#exewindow" + nwId).focus();
            }
            t.printLn("Executing " + exeName);
            t.printLn("");
            t.printContent("");
            return true;
        },
        changeMonitor: function() {
            t = this;
            parts = command.split(" ");
            if (parts[1] !== undefined)
                com = parts[1];
            else
                return false;
            if(com !== "bright" && com !== "dark"){
                t.printError("Error: unsupported value "+com + ".");
                return false;
            }
            if (com === "bright") {
                t.monitor.css("background-color", "white");
                t.grid.css("color", "black");
            }
            if (com === "dark") {
                t.monitor.css("background-color", "black");
                t.grid.css("color", "#97ff00");
            }
            t.printLn("Brightness changed to "+ com);
            t.printLn("");
            t.printContent("");
        },
        showHelp: function() {
            t = this;
            t.printLn("List of commands");
            t.printLn("");
            t.printLn("<label class='tabbed'>CD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[path]</label>Changes the current directory.");
            t.printLn("<label class='tabbed'>CD..</label>Changes to the parent directory.");
            t.printLn("<label class='tabbed'>COLOR&nbsp;&nbsp;[bright/dark]</label>Changes the color of the console.");
            t.printLn("<label class='tabbed'>DIR</label>Displays the contents of the current directory.");
            t.printLn("<label class='tabbed'>HELP</label>Provides information for commands.");
            t.printLn("<label class='tabbed'>LOGIN&nbsp;&nbsp;[password]</label>Log-in as system administrator.");
            t.printLn("<label class='tabbed'>LOGOUT</label>Log-out from the system.");
            t.printLn("<label class='tabbed'>SEND&nbsp;&nbsp;&nbsp;[message]</label>Sends a message to the sys admin.");
            t.printLn("<label class='tabbed'>TYPE&nbsp;&nbsp;&nbsp;[file]</label>Prints the contents of a text [*.txt or *.mail] file.");
            t.printLn("<label class='tabbed'>VIEW&nbsp;&nbsp;&nbsp;[file]</label>Displays an image [*.jpg or *.png].");
        },
        showTree: function(list) {
            t = this;
            files = 0;
            dirs = 0;
            $.each(list, function(k, v) {
                if (typeof k === "string") {
                    if (!t.isDir(k)) {
                        files++;
                        t.printLn("<label class='tabbed'>&lt;FILE&gt;</label>" + k);
                    }
                    if (t.isDir(k)) {
                        dirs++;
                        t.printLn("<label class='tabbed'>&lt;DIR&gt;</label>" + k);
                    }

                }
            } );
            t.printLn("<label class='tabbed'>&nbsp;</label><label class='tabbed'>&nbsp;</label>"+files+ " File(s)");
            t.printLn("<label class='tabbed'>&nbsp;</label><label class='tabbed'>&nbsp;</label>"+dirs+ " Dir(s)");
        },
        isDir: function(el) {
            parts = el.split(".");
            if (parts[1] === undefined) {
                if (el.src === undefined && el.content === undefined)
                    return true;
            }
            return false;
        },
        printLn: function(line) {
            t = this;
            t.pageContent += line + "<br/>";
        },
        changeDirectory: function(cmdToExe) {
            cmdToExe = $.trim(cmdToExe);
            parts = cmdToExe.split(" ");
            t = this;
            if (parts[1] !== undefined)
                dirs = parts[1];
            else
                return false;
            dirList = dirs.split("/");
            var next1 = t.getCurFolder();
            $.each(dirList, function(k, v) {
                next1 = next1[v];
            });
            if (next1 !== undefined) {
                destKey = dirList[dirList.length - 1];
                if (!t.isDir(destKey)) {
                    t.printLn("Error: " + dirs + " is not a folder.");
                    t.printLn("");
                } else
                    t.curFolder += "\\" + dirList.join("\\");
            } else {
                t.printLn("Error: the system cannot find the specified path.");
                t.printLn("");
            }
        },
        changeDirectoryParent: function() {
            t = this;
            if (t.curFolder === t.baseFolder)
                return false;
            folders = t.curFolder.split("\\");
            folders.pop();
            var next = t.tree;
            $.each(folders, function(k, v) {
                next = next[v];
            });
            if (next != undefined)
                t.curFolder = folders.join("\\");
        },
        listFiles: function() {
            t = this;
            t.printLn("Directory of " + t.curFolder + "");
            t.showTree(t.getCurFolder());
        },
        getCurFolder: function() {
            t = this;
            folders = t.curFolder.split("\\");
            var next = t.tree;
            $.each(folders, function(k, v) {
                next = next[v];
            });
            return next;
        },
        getExternalContents: function(src,exeExt) {
            t = this;
            request = $.ajax({
                url: src,
                type: "GET",
                dataType: "text",
                success: function(data, textStatus, jqXHR) {
                    if( exeExt == "ascii") {
                        data = "<pre style='font: bold 8px/5px monospace;'>" + data + "</pre>";
                    }
                    fileLen = data.length;
                    pageLen = t.pageContent.length;
                    t.printLn(data);
                    t.printLn("");
                    t.printContent("",pageLen,fileLen);
                },
                error: function(data, textStatus, jqXHR) {
                    t.printLn(textStatus);
                    t.printLn("");
                    t.printContent("");
                }
            });
        }
    };
    $.fn.commandLine = function(opt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var item = $(this), instance = item.data('commandLine');
            if (!instance) {
                // create plugin instance if not created
                item.data('commandLine', new commandLine(this, opt));
            } else {
                // otherwise check arguments for method call
                if (typeof opt === 'string') {
                    instance[opt].apply(instance, args);
                }
            }
        });
    };
}(jQuery));
