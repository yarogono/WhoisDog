

// 코드 작성자 => 임전혁

// Input tag
const USER_PW = document.getElementById('pw');
const USER_PW2 = document.getElementById('pw2');
const EMAIL = document.getElementById('email')
const NICKNAME = document.getElementById('nickname')

// 아이디, 비밀번호, 이메일, 닉네임 체크 후 상태를 출력하는 Span 태그
const EMAIL_CHECK = document.getElementById('email_check');
const PW_CHECK = document.getElementById('pw_check');
const PW2_CHECK = document.getElementById('pw2_check');
const NICKNAME_CHECK = document.getElementById('nickname_check');

// Regex
const REGEX_PWD = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/; // 아이디와 패스워드가 적합한지 검사할 정규식
const REGEX_EMAIL = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;



// 설정해 놓은 Regex로 아이디, 패스워드, 이메일 유효성 검사
function check(regex, tag, message) {
    if(regex.test(tag.value)) {
        return true;
    }
    alert(message);
    tag.value = "";
    tag.focus();
}

// 회원가입 form에서 submit을 누르면 chekForm() 함수 실해
// 비밀번호와 비밀번호 확인 input 유효성 검사
// Regex를 활용해 비밀번호 유효성 감사( 8 ~ 15자리 특수문자, 문자, 숫자가 포함된 비밀번호)
// Regex를 활용해 이메일 유효성 검사
function checkForm() {

    if(USER_PW.value != USER_PW2.value) {
        alert("비밀번호가 다릅니다. 다시 입력해주세요.");
        USER_PW.value = "";
        USER_PW2.value = "";
        PW_CHECK.innerHTML = "";
        PW2_CHECK.innerHTML = "";
        USER_PW.focus();
        return false;
    }

    if(!check(REGEX_PWD,USER_PW,"비밀번호는 특수문자, 문자, 숫자 포함 형태의 8~15자리입니다.")) {
        return false;

    }
    if(!check(REGEX_EMAIL, EMAIL, "적합하지 않은 이메일 형식입니다.")) {
        return false;
    }
}

// 패스워드 Regex를 사용해 유효성 검사
function pwdRegexCheck() {

    if(REGEX_PWD.test(USER_PW.value)) {
        PW_CHECK.innerHTML = "사용하셔도 괜찮은 비밀번호입니다.";
        PW_CHECK.style.color = 'blue';
    } else {
        PW_CHECK.innerHTML = "비밀번호는 특수문자, 문자, 숫자 포함 형태의 8~15자리입니다.";
        PW_CHECK.style.color = 'red';
    }
}

// 패스워드, 패스워드 확인 일치여부 span 태그에 출력
function pwdEqualCheck() {


    if (USER_PW.value !== '' && USER_PW2.value !== '') {
        if (USER_PW.value === USER_PW2.value) {
            PW2_CHECK.innerHTML = '비밀번호가 일치합니다.'
            PW2_CHECK.style.color = 'blue';
        } else {
            PW2_CHECK.innerHTML = '비밀번호가 일치하지 않습니다.';
            PW2_CHECK.style.color = 'red';
        }
    }
}

// 이메일 중복 검사
function emailDuplicateCheck() {
    // 유저가 입력한 email input value를 Ajax 콜을 통해 서버로 전송
    $.ajax({
        type: "POST",
        url: "/join/email/check_dup",
        data: {
            email_give: $(this).val()
        },
        success: function (response) {
            // 서버에 전송한 이메일을 통해 중복여부 확인 후 True False형식으로 받음 => response["exists"]
            if (response["exists"]) {
                EMAIL_CHECK.innerHTML = "이미 존재하는 아이디입니다.";
                EMAIL_CHECK.style.color = "red";
                EMAIL.focus();
            } else {
                // 중복되지 않은 아이디값을 Regex를 활용해 이메일 형식 체크
                if (REGEX_EMAIL.test(EMAIL.value)) {
                    EMAIL_CHECK.innerHTML = "사용할 수 있는 아이디입니다.";
                    EMAIL_CHECK.style.color = "blue";
                } else {
                    EMAIL_CHECK.innerHTML = "이메일 형식으로 입력해주세요.";
                    EMAIL_CHECK.style.color = "red";
                }
            }
        }
    });
}

// 닉네임 중복 검사
function nickDuplicateCheck() {
  $.ajax({
        type: "POST",
        url: "/join/nick/check_dup",
        data: {
            nickname_give: $(this).val()
        },
        success: function (response) {
            if (response["exists"]) {
                NICKNAME_CHECK.innerHTML = "이미 존재하는 닉네임입니다.";
                NICKNAME_CHECK.style.color = "red";
                NICKNAME.focus();
            } else {
                NICKNAME_CHECK.innerHTML = "사용할 수 있는 닉네임입니다.";
                NICKNAME_CHECK.style.color = "blue";
            }
        }
    });
}

// 회원기입 페이지 불러오면 init() 함수가 실행되고 init() 함수 안에 있는 이벤트를 실행
function init() {
    $("#pw").on("propertychange change keyup paste input", pwdRegexCheck);
    $("#pw2").on("propertychange change keyup paste input", pwdEqualCheck);

    $("#email").change(emailDuplicateCheck);
    $("#nickname").change(nickDuplicateCheck);
}

init();