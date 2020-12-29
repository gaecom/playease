(function (playease) {
    var utils = playease.utils,
        css = utils.css,
        events = playease.events,
        EventDispatcher = events.EventDispatcher,
        GlobalEvent = events.GlobalEvent,
        UI = playease.UI,
        components = UI.components,

        CLASS_SELECT = 'pe-select',
        CLASS_SELECT_TEXT = 'pe-select-text',
        CLASS_SELECT_MENU = 'pe-select-menu',
        CLASS_SELECT_MENU_OPTION = 'pe-select-menu-option';

    function Select(name, kind, logger) {
        EventDispatcher.call(this, 'Select', { logger: logger }, [GlobalEvent.CHANGE]);

        var _this = this,
            _name,
            _logger = logger,
            _value,
            _options,
            _container,
            _text,
            _menu;

        function _init() {
            _name = name;
            _value = NaN;
            _options = [];

            _container = utils.createElement('div', CLASS_SELECT + ' ' + _name);
            _text = utils.createElement('span', CLASS_SELECT_TEXT);
            _menu = utils.createElement('div', CLASS_SELECT_MENU);
            _menu.style.visibility = 'hidden';
            _container.appendChild(_text);
            _container.appendChild(_menu);

            _text.addEventListener('click', function (e) {
                _menu.style.visibility = _menu.style.visibility === 'hidden' ? 'visible' : 'hidden';
            });
        }

        _this.append = function (label, value) {
            var option = utils.createElement('span', CLASS_SELECT_MENU_OPTION);
            option.addEventListener('click', _onClick);
            option.setAttribute('value', value || _options.length);
            option.innerHTML = label;
            _options.push(option);
            _menu.appendChild(option);

            if (_options.length === 1) {
                _this.value(option.getAttribute('value'));
            }
        };

        function _onClick(e) {
            var value = e.target.getAttribute('value');
            if (value !== _value) {
                _this.dispatchEvent(GlobalEvent.CHANGE, { name: _name, value: value });
            }
            _menu.style.visibility = 'hidden';
        }

        _this.remove = function (value) {
            for (var i = 0; i < _options.length; i++) {
                var option = _options[i];
                if (option.getAttribute('value') === value) {
                    option.removeEventListener('click', _onClick);
                    _menu.removeChild(option);
                    _options.splice(i, 1);

                    if (_value === value) {
                        _value = _options.length || NaN;
                        _text.innerHTML = _options.length ? _options[0].innerHTML : _placeholder;
                    }
                    break;
                }
            }
        };

        _this.value = function (value) {
            switch (typeof value) {
                case 'number':
                case 'string':
                    for (var i = 0; i < _options.length; i++) {
                        var option = _options[i];
                        if (option.getAttribute('value') == value) {
                            _value = value;
                            _text.innerHTML = option.innerHTML;
                            _container.setAttribute('value', value);
                            _this.resize();
                            break;
                        }
                    }
                    break;
            }

            return _value;
        };

        _this.element = function () {
            return _container;
        };

        _this.resize = function (width, height) {
            css.style(_menu, {
                'left': (_container.clientWidth - _menu.clientWidth) / 2 + 'px',
            });
        };

        _init();
    }

    Select.prototype = Object.create(EventDispatcher.prototype);
    Select.prototype.constructor = Select;
    Select.prototype.kind = 'Select';

    components.Select = Select;
})(playease);

