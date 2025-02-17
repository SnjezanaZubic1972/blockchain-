import hashlib
import datetime as date
import random
import matplotlib.pyplot as plt
import json

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
from flask import  jsonify
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)           
api = Api(app)

# Replace <db_password> with actual MongoDB password
client = MongoClient("mongodb+srv://snjezanazubic1972:c3Z2BYDj@cluster0.y1gxd.mongodb.net/?retryWrites=true&w=majority")

# Connect to the database
db = client["snjezanazubic1972"]

# Connect to the collection
collection = db["snjezanazubic1972"]

# Fetch a document from the collection
#document = collection.find_one()

genesis_data = collection.find_one({'nameCustomer': 'John Doe', 'id': '12345', 'productName': 'Widget', 'count': 10})
if not genesis_data: raise ValueError("Genesis data not found in MongoDB")
genesis_data['_id'] = str(genesis_data['_id'])
genesis_data['nameCustomer'] = str(genesis_data['nameCustomer'])


# Ensure genesis document exists and fetch dynamically 
genesis_data = collection.find_one() 
if not genesis_data:
    raise ValueError("No data found in MongoDB to use as genesis block") 
genesis_data['_id'] = str(genesis_data['_id'])


@app.route('/api/data/<int:id>', methods=['GET'])
def get_data_by_id(id):
    document = collection.find({"index": id}, {'_id': False})
    if not collection.find({"index": id}, {'_id': False}):
        return jsonify({"error": "Data not found"}), 404
        
    return jsonify(list(document))


@app.route('/api/genesis/<int:id>', methods=['GET']) 
def get_genesis_data(id): 
    return jsonify(genesis_data)


@app.route('/api/inventory', methods=['POST'])
def add_inventory_item():

    try:
         # Parse the JSON data from the request
          data = request.get_json()
           # Extract necessary fields 
          product_name = data.get('productName') 
          name_customer = data.get('nameCustomer') 
          count = data.get('count') 
          price = data.get('price') 
          description = data.get('description') 
          # Check for missing fields 
          if not product_name or not name_customer or count is None or price is None: 
              return jsonify({"error": "Missing fields"}), 400 
          # Create an inventory item dictionary 
          inventory_item = { "productName": product_name,
                             "nameCustomer": name_customer, 
                             "count": count, 
                             "price": price, 
                             "description": description } 
          # Insert the item into the MongoDB collection 
          collection.insert_one(inventory_item) 
          # Return the inserted item as the response 
          return jsonify(inventory_item), 201 
    except Exception as e: print(f"An error occurred: {e}") 
    return jsonify({"error": "An error occurred while adding the item"}), 500


@app.route('/api/inventory', methods=['GET'])
def get_inventory_items():
    items = list(collection.find({}, {'_id': False}))
    return jsonify(items)

@app.route('/api/inventory/<string:product_name>', methods=['PUT'])
def update_inventory_item(product_name):
    item_data = json_data.json
    result = collection.update_one({'productName': product_name}, {'$set': item_data})
    if result.matched_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Item updated successfully"}), 200

@app.route('/api/inventory/<string:product_name>', methods=['DELETE'])
def delete_inventory_item(product_name):
    result = collection.delete_one({'productName': product_name})
    if result.deleted_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Item deleted successfully"}), 200


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
        return Block(0, date.datetime.now(), genesis_data, "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, data):
        new_index = len(self.chain)
        new_timestamp = date.datetime.now()
        new_block = Block(new_index, new_timestamp, data, self.get_latest_block().hash)
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


remaining_data_from_db = list(collection.find({'_id': {'$ne': genesis_data['_id']}}, {'_id': False})) 
for data in remaining_data_from_db: blockchain.add_block(data)

# Function to generate random transaction data
def generate_random_transaction():
    return f"Transaction Data {random.randint(1, 100)}"

# Lists to hold block indices and hash values for plotting
block_indices = []
hash_values = []

# Dynamically add blocks to the blockchain and collect data for plotting
for _ in range(25):  # Add 25 blocks
    transaction_data = generate_random_transaction()
    blockchain.add_block(transaction_data)
    
    # Collect data for plotting
    block_indices.append(blockchain.get_latest_block().index)
    hash_values.append(int(blockchain.get_latest_block().hash, 16) % 1000000)  # Truncate hash for visualization

# Create a figure and axis for the plot
plt.figure(figsize=(10, 5))
plt.bar(block_indices, hash_values, color='skyblue')

# Adding titles and labels
plt.title('Dynamic Blockchain Hash Values')
plt.xlabel('Block Index')
plt.ylabel('Hash Value (Truncated)')

# Customizing x-axis ticks
plt.xticks(block_indices)

# Adding a grid
plt.grid(axis='y')

# Show the plot
plt.tight_layout()
plt.show()

# Print the contents of the blockchain
for block in blockchain.chain:
    print("Block #" + str(block.index))
    print("Timestamp: " + str(block.timestamp))
    print("Data: " + json.dumps(block.data, indent=4))
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
    