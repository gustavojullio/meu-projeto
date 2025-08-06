from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["emater"]  # substitua pelo nome do seu banco
