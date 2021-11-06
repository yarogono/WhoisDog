// id=submit 이 클릭이 되었을때 유효성 검사 및 ajax로 post전송방식 구현 함수
$(function () {
    $('#submit').on("click", function () {
        let email = $("#email").val()
        let password = $("#password").val()
        //이메일 입력 input창에 아이디를 입력하지않을시 경고메시지
        if (email == "") {
            $("#help-id-login").text("* 아이디를 입력해주세요.")
            $("#email").focus()
            return;
        } else {
            $("#help-id-login").text("")
        }
        //password input창에 password를 입력하지않을시 경고메시지
        if (password == "") {
            $("#help-password-login").text("비밀번호를 입력해주세요.")
            $("#password").focus()
            return;
        } else {
            $("#help-password-login").text("")
        }
        // ajax 전송 부분 post방식
        $.ajax({
            type: "POST",
            url: "/login/api/sign_in",
            data: {
                email_give: email,
                password_give: password
            },
            // 서버의 요청이 성공하였을때 서버에서 받은 토큰을
            // 쿠키로 전송 후 메인페이지로 로케이션
            success: function (response) {
                if (response['result'] == 'success') {
                    document.cookie = 'mytoken='+ response['token'] + ';path=/';
                    window.location.href = '/'
                } else { //실패 했을시 오류 메시지 창
                         //(DB에 ID,PW가 있는지 일치하는지 )
                     alert(response['msg'])
                }
            }
        });
    });
})

//회원가입 버튼 클릭시 회원가입페이지로 이동
function join()  {
  window.location.href = '/join'
}

