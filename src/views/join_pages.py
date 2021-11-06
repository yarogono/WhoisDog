from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash

from src.database.user_db import User
import datetime

join_pages = Blueprint('join_pages', __name__, url_prefix="/join")


# 코드 작성자 => 임전혁

# 회원가입 페이지로 들어올 때 클라이언트가 토큰이 있는지 확인
# 토큰이 있으면 로그인을 이미 한 유저로 판단해서 메인페이지로 redirect
@join_pages.before_request
def login_check():
    if request.cookies.get('mytoken') is not None:
        return redirect("/")

@join_pages.route("/")
def join():
    title = "회원가입"
    return render_template("join.html",
                           title=title)

# 회원가입 폼에서 가입하기 버튼을 클릭해 서버쪽으로 POST 요청 시
# 유효성 검사 후 설계된 DB에 insert 하는 함수 및 route
@join_pages.route("/", methods=["POST"])
def join_post():

    # password => 패스워드 input 태그
    # password2 => 패스워드 확인 input 태그
    password = request.form["userPW"]
    password2 = request.form["userPW2"]

    # request로 받아온 패스워드, 패스워드 확인을 같은지 유효성 검사
    # 같지 않으면 회원가입 페이지로 redirect
    if password != password2:
        return redirect("/join")

    # 패스워드는 sha256을 통해 암호화 => generate_password_hash
    new_user = {
        "email":request.form.get("email"),          # 이메일
        "user_name":request.form.get("user_name"),  # 유저이름
        "nickname":request.form.get("nickname"),    # 닉네임
        "password":generate_password_hash(password),   # 패스워드
        "created_time":datetime.datetime.now()      # 아이디 생성 시간
    }
    
    # User 클래스에서 inser_user 함수를 통해 DB에 insert
    # 성공 시 리턴값으로 True를 success 변수에 할당
    success = User.insert_user(new_user)

    # insert 실패 시 success 변수는 False, 아래 if문을 실행 후 flash(Alert창)로 유저에게 경고
    if success is False:
        flash("중복된 아이디입니다.");

    return redirect(url_for("login_pages.login"))


# 이메일 중복 검사
@join_pages.route('/email/check_dup', methods=['POST'])
def email_check_dup():
    email_receive = request.form['email_give']
    exists = User.find_user(email_receive)
    return jsonify({'result': 'success', 'exists': exists})

# 닉네임 중복 검사
@join_pages.route('/nick/check_dup', methods=['POST'])
def nick_check_dup():
    nick_receive = request.form['nickname_give']
    exists = User.find_nickname(nick_receive)
    return jsonify({'result': 'success', 'exists': exists})