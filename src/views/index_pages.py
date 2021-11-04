from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import jwt

index_pages = Blueprint('index_pages', __name__)

client = MongoClient('localhost', 27017)
db = client.dbsparta

SECRET_KEY = ''

# r = requests.get('')
# response = r.json()
# pet_board = response['pet_board']

@index_pages.route("/")
def index():
    cards = list(db.pet_board.find({}).sort([('upload_date', -1), ('_id', -1)]))
    return render_template("index.html", cards=cards)

# attach card - GET
@index_pages.route("/api/get_cards", methods=['GET'])
def get_cards():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_name = payload["id"]
        user_name_receive = request.args.get("user_name_give")
        if user_name_receive == "":
            cards = list(db.pet_board.find({}).sort([('upload_date', -1), ('_id', -1)]))
        else:
            cards = list(db.pet_board.find({'user_name': user_name_receive}).sort([('upload_date', -1), ('_id', -1)]))
        for card in cards:
            card["_id"] = str(card["_id"])
            card["like_by_me"] = bool(db.pet_board.find_one({"_id": card["_id"], "type": "like", "user_name": user_name}))
        return jsonify({"result": "success", "msg": "포스팅을 가져왔습니다.", "cards": cards})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("main"))

# like - POST
@index_pages.route('/api/like', methods=['POST'])
class Likes():
    def like_click():
        token_receive = request.cookies.get('')
        try:
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            user_info = db.user.fine_one({'user_name': payload['id']})

            post_id_receive = request.form['post_id_give']
            action_receive = request.form['action_give']

            target_id = db.pet_board.find_one({'_id': post_id_receive})
            curren_like = target_id['like_count']

            if action_receive == 'like':
                new_like = curren_like + 1
                db.pet_board.update_one({'_id': post_id_receive}, {'$set': {'like_count': new_like}})
            else:
                new_like = curren_like - 1
                db.pet_board.update_one({'_id': post_id_receive}, {'$set': {'like_count': new_like}})
            return jsonify({"result": "success", 'msg': 'updated'}, )
        except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
            return redirect(url_for("main"))
    def like(self):
        datas = Likes.get_all()
        return jsonify(datas)

# sort by date - GET
@index_pages.route('/api/sort/date', methods=['GET'])
def sort_by_date():
    cards = list(db.pet_board.fine({}).sort([('upload_date', -1), ('_id', -1)]))
    return jsonify({'cards': cards})

# sort by like - GET
@index_pages.route('/api/sort/like', methods=['GET'])
def sort_by_like():
    cards = list(db.pet_board.fine({}, {'_id': False}).sort([('like_count', -1), ('_id', -1)]))
    return jsonify({'cards': cards})


