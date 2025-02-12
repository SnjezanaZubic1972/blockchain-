import hashlib
import datetime as date
import json

from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api

app = Flask(__name__)
CORS(app)
api = Api(app)


class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        hash_string = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
        return hashlib.sha256(hash_string.encode()).hexdigest()
    
class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, date.datetime.now(), "Genesis Block", "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, new_block):
        new_block.previous_hash = self.get_latest_block().hash
        new_block.hash = new_block.calculate_hash()
        self.chain.append(new_block)

    def is_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            if current_block.hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.hash:
                return False

        return True
# Create the blockchain
blockchain = Blockchain()

# Add blocks to the blockchain
blockchain.add_block(Block(1, date.datetime.now(), "Transaction Data 1", ""))
blockchain.add_block(Block(2, date.datetime.now(), "Transaction Data 2", ""))
blockchain.add_block(Block(3, date.datetime.now(), "Transaction Data 3", ""))

# Print the contents of the blockchain
for block in blockchain.chain:
    print("Block #" + str(block.index))
    print("Timestamp: " + str(block.timestamp))
    print("Data: " + block.data)
    print("Hash: " + block.hash)
    print("Previous Hash: " + block.previous_hash)
    print("\n")

class BlockEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Block):
            return {
                'index': obj.index,
                'timestamp': obj.timestamp if isinstance(obj.timestamp, str) else obj.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'data': obj.data,
                'previous_hash': obj.previous_hash,
                'hash': obj.hash
            }
        return super().default(obj)
for block in blockchain.chain:

        block = Block(index=str(block.index), timestamp=str(block.timestamp), data= block.data, previous_hash=block.previous_hash)
        json_data = json.dumps(block, cls=BlockEncoder)
        print(json_data)

class Blockchains(Resource):
    def get(self):
        json_data = json.dumps(blockchain.chain, cls=BlockEncoder)
        return jsonify(json.loads(json_data))

api.add_resource(Blockchains, '/')

if __name__ == '__main__':
    app.run(debug=True)








