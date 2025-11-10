$(document).ready(() => {
    let locationHistory = [];
    let memory = 'default';

    const log = (...args) => {
        console.log(...args);
    }

    function createLink(xr, yr, imgWidth, imgHeight, hashFrom) {
        log('creating link...', xr, yr, imgWidth, imgHeight, hashFrom);
        $.ajax({
            url: "/link/create",
            type: "POST",
            data: {
                title: "Link " + xr + " " + yr + " " + imgWidth + " " + imgHeight + " " + hashFrom,
                hashFrom,
                hashTo : hashFrom,
                xp: xr * 1.0 / imgWidth,
                yp: yr * 1.0 / imgHeight,
            },
            success: function(response) {
                log(response);
                removeContextMenu();
            },
            error: function(xhr, status, error) {
                log(error);
                removeContextMenu();
            }
        });
    }

    function removeLink(link) {
        log('remove link...', link);
        $.ajax({
            url: "/link/delete?id=" + link.id,
            type: "DELETE",
            data: {},
            success: function(response) {
                log(response);
                removeContextMenu();
            },
            error: function(xhr, status, error) {
                log(error);
                removeContextMenu();
            }
        });
    }

    function setLinkTargetFromMemory(link) {
        log('setLinkTargetFromMemory...', link, memory);
        setLinkProperties(link, {hashTo: memory});
    }

    async function setLinkProperties(link, props) {
        log('setLinkProperties...', link, props);
        $.ajax({
            url: "/link/update?id=" + link.id,
            type: 'PATCH',
            data: props,
            success: function(response) {
                log(response);
                removeContextMenu();
            },
            error: function(xhr, status, error) {
                log(error);
                removeContextMenu();
            }
        });
    }

    function changeLinkTitle(x, y, link) {
        log('changeLinkTitle...', x, y, link);
        $("#contextMenu").remove();
        $('body').append('<div id="contextMenu"></div>')
        $('#contextMenu').css({
            'position': 'fixed',
            'left' : x + "px",
            'top' : y + "px"
        })
            .append('<div id="inputTitle" class="contextMenuItem"><input type="text" value="' + link.title + '"></input><button id="changeTitleOk">ok</button></div>')
            .append('<div id="closeContextMenu" class="contextMenuItem">Close Menu</div>');
        $("#changeTitleOk").on('click', () => {
            setLinkProperties(link, {title: $('#inputTitle input').val()});
        });
        $("#closeContextMenu").on('click', () => removeContextMenu());
    }

    function fillSelectWithSearchNodes(queryText, $select) {
        log('fillSelectWithSearchNodes...', queryText, $select);
        $.ajax({
            url: "/node?filter[title][LIKE]=" + queryText,
            type: "GET",
            success: function(response) {
                log(response);
                $select.empty();
                response.forEach(node => {
                    $select.append($('<option value="' + node.hash + '">' + node.title + '</option>'));
                });
                $select.append($('<option value="default">default</option>'));
            },
            error: function(xhr, status, error) {
                log(error);
            }
        });
    }

    function setLinkTargetFromSearch(x, y, link) {
        log('setLinkTargetFromSearch...', x, y, link);
        $("#contextMenu").remove();
        $('body').append('<div id="contextMenu"></div>')
        $('#contextMenu').css({
            'position': 'fixed',
            'left' : x + "px",
            'top' : y + "px"
        })
            .append('<div id="inputNodeTitle" class="contextMenuItem"><input type="text" value="' + link.title + '"></input><select></select><button id="changeNodeOk">ok</button></div>')
            .append('<div id="closeContextMenu" class="contextMenuItem">Close Menu</div>');
        $('#inputNodeTitle input').on('change', (event) => {
            fillSelectWithSearchNodes(event.target.value, $('#contextMenu select'));
        });
        $("#changeNodeOk").on('click', () => {
            setLinkProperties(link, {hashTo: $('#inputNodeTitle select').val()});
            removeContextMenu();
        });
        $("#closeContextMenu").on('click', () => removeContextMenu());
        fillSelectWithSearchNodes(link.title, $('#contextMenu select'));
    }

    function contextMenuOnItem(x, y, link) {
        log('contextMenuOnItem ... ', x, y, link);
        $("#contextMenu").remove();
        $('body').append('<div id="contextMenu"></div>')
        $('#contextMenu').css({
            'position': 'fixed',
            'left' : x + "px",
            'top' : y + "px"
        })
            .append('<div id="removeLink" class="contextMenuItem">Remove Link</div>')
            .append('<div id="setLinkTargetFromMemory" class="contextMenuItem">Set target hash from memory</div>')
            .append('<div id="setLinkTargetFromSearch" class="contextMenuItem">Set target hash from search</div>')
            .append('<div id="changeLinkTitle" class="contextMenuItem">Change Link Title</div>')
            .append('<div id="closeContextMenu" class="contextMenuItem">Close Menu</div>');
        $("#removeLink").on('click', () => {
            removeLink(link);
        });
        $("#setLinkTargetFromMemory").on('click', () => {
            setLinkTargetFromMemory(link);
        });
        $("#changeLinkTitle").on('click', () => {
            changeLinkTitle(x, y, link);
        });
        $("#setLinkTargetFromSearch").on('click', () => {
            setLinkTargetFromSearch(x, y, link);
        });
        $("#closeContextMenu").on('click', () => removeContextMenu());
    }

    function changeLocation(hash) {
        $('#main img').data('hash', hash);
        $.ajax({
            url: '/node?filter[hash]=' + hash,
            method: 'GET',
            success: function (response) {
                if (response.length == 0) {
                    $('#main img')
                        .attr({src :'images/default.png', title: 'default'})
                        .data({hash: 'default', id: null});
                } else {
                    $('#main img')
                        .attr({src: response[0].img, title: response[0].title})
                        .data({hash: response[0].hash, id: response[0].id});
                }
                refreshMain();
            },
            error: function (xhr, status, error) {
                log(error);
            }
        });
    }

    function addLink(link) {
        log('add link... ', link);
        $('#main').append('<div id="link' + link.id + '"class="link"> </div>');
        $('#main #link' + link.id).attr('title', link.title).css({
            left: link.xp * $('#main img').width(),
            top: link.yp * $('#main img').height()
        }).on('click', () => {
            log('Changing location...');
            locationHistory.push($('#main img').data('hash'));
            changeLocation(link.hashTo);
        }).on('contextmenu', (event) => {
            event.preventDefault();
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            contextMenuOnItem(mouseX, mouseY, link);
        })
    }

    function addLinks(links) {
        log('add links...', links);
        $('#main .link').remove();
        setTimeout(() => {
            links.forEach(link => addLink(link));;
        }, 100);
    }

    function refreshMain() {
        log('refresh main...');
        $.ajax({
            url: "/link?filter[hashFrom]=" + $('#main img').data('hash'),
            type: "GET",
            data: {},
            success: function(response) {
                addLinks(response);
            },
            error: function(xhr, status, error) {
                log(error);
            }
        });
    }

    function removeContextMenu() {
        $("#contextMenu").fadeOut(300, function() { $(this).remove(); refreshMain(); });
    }

    function backgroundChooser() {
        const input = document.createElement('input');
        const form = document.createElement('form');
        form.style.position = 'absolute';
        form.style.top = '-1000px';
        form.style.left = '-1000px';
        form.enctype = "multipart/form-data";
        form.appendChild(input);
        document.body.appendChild(form);
        input.type = 'file';
        input.accept = "image/*";
        input.name = 'file';
        input.addEventListener('change', (event) => {
            if (input.files.length === 0) {
                document.body.removeChild(form);
                return;
            }
            const formData = new FormData();
            formData.append('file', input.files[0]);
            $.ajax({
                url: '/node/change-image',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    log(response);
                    if (response.hash) {
                        locationHistory.push($('#main img').data('hash'));
                        $('#main img').data({hash: response.hash, title: response.title, id: response.id}).attr('src', response.img);
                        refreshMain();
                    }
                },
                error: function(xhr, status, error) {
                    log(error);
                }
            });
            document.body.removeChild(form);
        });
        input.click();
    }

    function setImageProperties(props) {
        log('setImageProperties...', props);
        const imageId = $('#main img').data('id');
        if (imageId == null) {
            alert('Default location\'s title can\'t be changed');
            removeContextMenu();
        };
        $.ajax({
            url: "/node/update?id=" + imageId,
            type: 'PATCH',
            data: props,
            success: function(response) {
                log(response);
                $("#contextMenu").remove();
                changeLocation($('#main img').data('hash'));
            },
            error: function(xhr, status, error) {
                log(error);
                removeContextMenu();
            }
        });
    }

    function changeImageTitle(x, y) {
        log('changeImageTitle...', x, y);
        $("#contextMenu").remove();
        $('body').append('<div id="contextMenu"></div>')
        $('#contextMenu').css({
            'position': 'fixed',
            'left' : x + "px",
            'top' : y + "px"
        })
            .append('<div id="inputTitle" class="contextMenuItem"><input type="text" value="' + $('#main img').attr('title') + '"></input><button id="changeTitleOk">ok</button></div>')
            .append('<div id="closeContextMenu" class="contextMenuItem">Close Menu</div>');
        $("#changeTitleOk").on('click', () => {
            setImageProperties({title: $('#inputTitle input').val()});
        });
        $("#closeContextMenu").on('click', () => removeContextMenu());
    }

    function removeImageAndAllItsLinks() {
        log('removeImageAndAllItsLinks...');
        $.ajax({
            url: "/node/delete-it-and-all-links?id=" + $('#main img').data('id'),
            type: "DELETE",
            success: function(response) {
                log(response);
                changeLocation(locationHistory.pop() ?? 'default');
            },
            error: function(xhr, status, error) {
                log(error);
            }
        });
    }

    function contextMenu(x, y, xr, yr, imgWidth, imgHeight, hash) {
        log(x, y, xr, yr, imgWidth, imgHeight, hash);
        $("#contextMenu").remove();
        $('body').append('<div id="contextMenu"></div>')
        $('#contextMenu').css({'position': 'fixed', 'left' : x + "px", 'top' : y + "px"})
                         .append('<div id="createLink" class="contextMenuItem">Create Link</div>')
                         .append('<div id="changeBackGround" class="contextMenuItem">Change Image</div>')
                         .append('<div id="copyHash" class="contextMenuItem">Copy hash and go to previous</div>')
                         .append('<div id="changeImageTitle" class="contextMenuItem">Change image Title</div>')
                         .append('<div id="removeImageAndAllItsLinks" class="contextMenuItem">Remove image and all its links</div>')
                         .append('<div id="closeContextMenu" class="contextMenuItem">Close Menu</div>');
        $("#createLink").on('click', () => {
            createLink(xr, yr, imgWidth, imgHeight, hash);
            removeContextMenu();
        });
        $("#changeBackGround").on('click', () => {
            backgroundChooser();
            $("#contextMenu").remove();
        });
        $("#copyHash").on('click', () => {
            memory = $('#main img').data('hash');
            alert('Hash copied!');
            $("#contextMenu").remove();
            changeLocation(locationHistory.pop() ?? 'default');
        });
        $("#changeImageTitle").on('click', () => {
            changeImageTitle(x, y);
        });
        $("#removeImageAndAllItsLinks").on('click', () => {
            $("#contextMenu").remove();
            if (confirm('Are you sure?')) {
                removeImageAndAllItsLinks();
            }
        });
        $("#closeContextMenu").on('click', () => removeContextMenu());
    }

    $('main-root').html('<div id="main"></div>');
    $('#main').html('<img src="/images/default.png" data-hash="default" title="default" alt="image"></img>');
    $('#main img').on('contextmenu', (event) => {
        event.preventDefault();
        
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        log('Context menu opened at:', mouseX, mouseY);

        const innerRect = event.target.getBoundingClientRect();

        const mouseXr = mouseX - innerRect.left;
        const mouseYr = mouseY - innerRect.top;
        log('Coordinates relative: ', mouseXr, mouseYr);

        contextMenu(mouseX, mouseY, mouseXr, mouseYr, innerRect.width, innerRect.height, $(event.target).data('hash'));
    });
    refreshMain();
});