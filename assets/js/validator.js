function Validator(formSelector) {
  var _this = this;

  var formElement = document.querySelector(formSelector);

  var formRules = {};

  // Định nghĩa các rules
  var validatorRules = {
    required: function (value) {
      return value ? undefined : "Vui lòng nhập trường này";
    },
    email: function (value) {
      var regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return regex.test(value) ? undefined : "Vui lòng nhập email hợp lệ";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Vui lòng nhập ít nhất ${min} ký tự`;
      };
    },
    max: function (max) {
      return function (value) {
        return value.length <= max
          ? undefined
          : `Vui lòng nhập không quá ${max} ký tự`;
      };
    },
    isConfirmed: function (value, getConfirmValue) {
      return value === getConfirmValue()
        ? undefined
        : "Giá trị nhập lại không chính xác";
    },
  };

  // Lấy ra các input từ form
  if (formElement) {
    var inputs = formElement.querySelectorAll("[name][rules]");

    for (var input of inputs) {
      var rules = input.getAttribute("rules").split("|");

      for (var rule of rules) {
        var ruleInfo;
        var isRuleHasValue = rule.includes(":");

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
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

      // Lắng nghe sự kiện để validate
      input.onblur = handleValidate;
      input.oninput = handleClearError;
    }

    // Hàm thực hiện validate
    function handleValidate(event) {
      var rules = formRules[event.target.name];
      var errorMessage;

      for (var rule of rules) {
        switch (event.target.name) {
          case "password_confirmation":
            errorMessage = rule(event.target.value, function () {
              return formElement.querySelector("#password").value;
            });
            break;
          default:
            errorMessage = rule(event.target.value);
        }

        if (errorMessage) break;
      }

      // Hiển thị lỗi ra UI
      var formGroup = event.target.closest(".form-group");
      var formMessage = formGroup.querySelector(".form-message");

      if (errorMessage) {
        formGroup.classList.add("invalid");
        formMessage.innerText = errorMessage;
      } else {
        formGroup.classList.remove("invalid");
        formMessage.innerText = "";
      }

      return !errorMessage;
    }

    // Hàm clear error message
    function handleClearError(event) {
      var formGroup = event.target.closest(".form-group");
      var formMessage = formGroup.querySelector(".form-message");

      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
        formMessage.innerText = "";
      }
    }

    // Xử lý hành động submit form
    formElement.onsubmit = function (event) {
      event.preventDefault();

      var isValid = true;

      for (var input of inputs) {
        if (!handleValidate({ target: input })) {
          isValid = false;
        }
      }

      if (isValid) {
        if (typeof _this.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          },
          {});

          _this.onSubmit(formValues);
        }
      }
    };
  }
}
