import settings
# 데이터베이스 Whoisdog_db 로 이동
from src.database import WhoisDog_db
# 아이디 암호화 한것 풀어주는 함수
from werkzeug.security import check_password_hash
from flask import Blueprint, render_template, request, flash, jsonify, url_for, session,redirect


import jwt
import datetime



login_pages = Blueprint('login_pages', __name__, url_prefix="/login")

# 로그인페이지를 들어올때 토큰이 있을때 이미
# 로그인 한 유저로 판단하여 메인 페이지로 redirect//
@login_pages.before_request
def login_check():
    if request.cookies.get('mytoken') is not None:
        return redirect("/")

@login_pages.route("/")
def login():
    title = "로그인"
    return render_template("login.html",
                           title=title)


@login_pages.route('/api/sign_in', methods=["POST"])
def api_sign_in():
    # 사용자가 입력한 이메일과 비밀번호 받기
    email_receive = request.form['email_give']
    password_receive = request.form['password_give']
    # DB에 같은 이메일이 있는지 찾기
    user = WhoisDog_db.users.find_one({'email': email_receive})
    # 이메일이 중복되는게 없을 시 경고 alert
    if user is None:
        return jsonify({'result': 'fail', 'msg': '아이디가 없습니다..'})
    # 입력한 비밀번호와 암호화된 비밀번호가 일치하는지 check하는 함수
    elif not check_password_hash(user['password'], password_receive):
        # 일치하지 않을 시 경고 alet
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

    else:
        # 이메일과 로그인 유지시간을 데이터 그자체로 전송
        # 비밀번호는 넣을 수 는 있지만 안넣는게 좋다
        # 토큰은 가능한 한 필요한 정보만 담는게 좋다
        # 일반적으로 민감한 정보는 피하자!
        payload = {
            'id': email_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        # jwt 장점- 한번 인증된 계정은 access토큰을 계속 발급
        #        - 사용자 인증 정보가 토큰에 모두 포함되기 때문에 다른저장소 필요X
        #        - private key 로 발급된 private은 유출될 시 경우 보안상 문제
        # algorithm 은 토큰이 헤더에 적용
        # payload 는 토큰안에 생성되는 내용물/정보
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        # decode(생성된 토큰을 다시 header, payload, value로 해석 / UTF-8스트링으로)
        # 는 굳이 필요가 없음(발행된 토큰값으로 페이지를 활보)
        return jsonify({'result': 'success', 'token': token})
