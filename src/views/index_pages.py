from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from src.database import WhoisDog_db
import jwt

index_pages = Blueprint('index_pages', __name__)

SECRET_KEY = ''

# 21조 정주혜

# 업로드 데이터를 최신순으로 정렬하여 index.html로 전달
@index_pages.route("/")
def index():
    title = "누구개(Who Is Dog)"
    cards = list(WhoisDog_db.pet_board.find({}).sort([('upload_time', -1), ('_id', -1)]))
    return render_template("index.html",
                           cards=cards,
                           title=title)


# (구현 못 함) 유저가 좋아요 클릭 시 해당 게시물의 좋아요 갯수 +1, 좋아요 취소 시 -1 - POST
@index_pages.route('/api/like', methods=['POST'])
class Likes():
    def like_click(self):
        # 로그인 상태에서 나타나는 cookie 가져오기
        token_receive = request.cookies.get('')
        try:
            # 로그인 된 토큰을 디코드하여 payload 설정
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            # 로그인 정보를 토대로 유저 정보 설정
            user_info = WhoisDog_db.user.fine_one({'user_email': payload['id']})

            # 좋아요가 클릭된 카드의 고유 식별 id와 좋아요인지, 좋아요 취소인지 받아오기
            post_id_receive = request.form['post_id_give']
            action_receive = request.form['action_give']

            # 업로드 데이터에서 좋아요가 클릭된 카드의 고유 식별 id와 일치하는 데이터를 찾음
            target_id = WhoisDog_db.pet_board.find_one({'_id': post_id_receive})
            # 해당 데이터 테이블 상의 좋아요 갯수 필드를 현재 좋아요 갯수로 설정
            curren_like = target_id['like_count']

            # 유저가 좋아요를 클릭했으면 현재 좋아요 갯수에서 +1을 하고 데이터 업데이트
            if action_receive == 'like':
                new_like = curren_like + 1
                WhoisDog_db.pet_board.update_one({'_id': post_id_receive}, {'$set': {'like_count': new_like}})
            # 유저가 좋아요를 취소했으면 현재 좋아요 갯수에서 -1을 하고 데이터 업데이트
            else:
                new_like = curren_like - 1
                WhoisDog_db.pet_board.update_one({'_id': post_id_receive}, {'$set': {'like_count': new_like}})
            return jsonify({"result": "success", 'msg': 'updated'}, )
        # 에러가 발생하면 메인 페이지로 redirect 되도록 예외처리
        except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
            return redirect(url_for("main"))
    # 상기의 내용을 서버로 전달 전달
    def like(self):
        datas = Likes.get_all()
        return jsonify(datas)

# (구현 못 함) 정렬 - 업로드 데이터를 최신순, 좋아요순으로 가져와서 index.html로 전달
# # sort by date - GET
# @index_pages.route('/api/sort/date', methods=['GET'])
# def sort_by_date():
#     cards = list(WhoisDog_db.pet_board.fine({}).sort([('upload_time', -1), ('_id', -1)]))
#     return jsonify({'cards': cards})
#
# # sort by like - GET
# @index_pages.route('/api/sort/like', methods=['GET'])
# def sort_by_like():
#     cards = list(WhoisDog_db.pet_board.fine({}, {'_id': False}).sort([('like_count', -1), ('_id', -1)]))
#     return jsonify({'cards': cards})


