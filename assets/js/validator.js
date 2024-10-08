function Validator(formSelector) {
    var _this = this;
    var formRules = {};

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này !';
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email hợp lệ !';
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự !`;
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Tối đa ${max} kí tự !`;
            }
        },
        isConfirmed: function (getConfirmValue, message) {
            return function (value) {
                return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác !';
            }
        },
        isGenderSelected: function () {
            return function () {
                var genderInputs = document.querySelectorAll('input[name="gender"]');
                for (var genderInput of genderInputs) {
                    if (genderInput.checked) {
                        return undefined;
                    }
                }
                return 'Vui lòng chọn giới tính !';
            }
        }
    };

    // Lấy ra formElement trong DOM
    var formElement = document.querySelector(formSelector);

    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules) {
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }
            //Event Listener để validate (blur, change, ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // Add gender validation manually since it uses radio buttons
        var genderInputs = formElement.querySelectorAll('input[name="gender"]');
        if (genderInputs.length) {
            for (var genderInput of genderInputs) {
                genderInput.onchange = handleValidate;
            }
            formRules['gender'] = [validatorRules['isGenderSelected']()];
        }

        // Add password confirmation validation manually
        var passwordConfirmationInput = formElement.querySelector('input[name="password_confirmation"]');
        if (passwordConfirmationInput) {
            passwordConfirmationInput.onblur = handleValidate;
            passwordConfirmationInput.oninput = handleClearError;
            formRules['password_confirmation'].push(validatorRules['isConfirmed'](
                function () {
                    return formElement.querySelector('input[name="password"]').value;
                },
                'Mật khẩu nhập lại không đúng !'
            ));
        }

        //Hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            rules.some(function (rule) {
                errorMessage = rule(event.target.value);
                return errorMessage;
            });

            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');

                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            } else {
                var formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.remove('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = '';
                    }
                }
            }

            return !errorMessage;
        }

        // Hàm clear error message khi nhập vào input
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');

                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
    }

    // Xử lí hành vi submit form
    formElement.onsubmit = function (event) {
        event.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;

        for (var input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
            }
        }

        var genderErrorMessage = validatorRules.isGenderSelected()();
        var genderFormGroup = document.querySelector('.gender-options').closest('.form-group');
        if (genderErrorMessage) {
            isValid = false;
            genderFormGroup.classList.add('invalid');
            genderFormGroup.querySelector('.form-message').innerText = genderErrorMessage;
        } else {
            genderFormGroup.classList.remove('invalid');
            genderFormGroup.querySelector('.form-message').innerText = '';
        }

        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(enableInputs).reduce(function (values, input) {

                    switch (input.type) {
                        case 'radio':
                            if (input.checked) {
                                values[input.name] = input.value;
                            }
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';
                                return values;
                            }

                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }

                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                            break;
                    }

                    return values;
                }, {});

                _this.onSubmit(formValues);
            } else {
                formElement.submit();
            }
        }
    }
}
